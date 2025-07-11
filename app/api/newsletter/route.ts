import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import { z } from 'zod';

// Simple in-memory rate limiter (per IP, per minute)
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // max 5 requests per minute per IP

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) {
    return true;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

// Zod schema for input validation
const NewsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50).optional(),
});

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API);

  try {
    // Validate environment variables
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection URI is not defined');
    }
    if (!process.env.RESEND_API) {
      throw new Error('Resend API key is not defined');
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = NewsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, firstName = 'Subscriber' } = parsed.data;

    // Connect to MongoDB (best practice: use a connection pool in production)
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('eden_newsletter');
    const collection = db.collection('subscribers');

    // Check for existing subscriber (safe query)
    const existingSubscriber = await collection.findOne({ email });
    if (existingSubscriber) {
      await client.close();
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Insert new subscriber (sanitized input)
    const result = await collection.insertOne({
      email,
      firstName,
      subscribedAt: new Date(),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'ÉDEN <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to ÉDEN Newsletter',
      react: await Promise.resolve(EmailTemplate({ firstName })),
    });

    if (error) {
      console.error('Resend error:', error);
      // Rollback MongoDB insertion if email fails
      await collection.deleteOne({ _id: result.insertedId });
      await client.close();
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    await client.close();
    return NextResponse.json(
      { success: true, message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}