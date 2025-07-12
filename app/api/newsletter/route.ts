import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import { z } from 'zod';

// Improved rate limiter with Redis-like structure (for production, use Redis)
const rateLimitMap = new Map();
const RATE_LIMIT = 3; // Reduced to 3 requests per minute per IP
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  
  // Reset window if expired
  if (now - entry.start > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  
  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT) {
    return true;
  }
  
  // Increment counter
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Enhanced Zod schema with stricter validation
const NewsletterSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  firstName: z.string().min(1).max(50).trim().optional(),
});

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
}

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API);

  try {
    // Validate environment variables
    if (!process.env.MONGO_URI) {
      console.error('MongoDB connection URI is not defined');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
    if (!process.env.RESEND_API) {
      console.error('Resend API key is not defined');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Rate limiting with proper IP detection
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
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
        { error: 'Invalid input provided' },
        { status: 400 }
      );
    }
    
    const { email, firstName = 'Subscriber' } = parsed.data;
    const sanitizedFirstName = sanitizeInput(firstName);

    // Connect to MongoDB with connection pooling
    const client = new MongoClient(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    const db = client.db('eden_newsletter');
    const collection = db.collection('subscribers');

    // Check for existing subscriber with case-insensitive email
    const existingSubscriber = await collection.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (existingSubscriber) {
      await client.close();
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Insert new subscriber with sanitized data
    const result = await collection.insertOne({
      email: email.toLowerCase(),
      firstName: sanitizedFirstName,
      subscribedAt: new Date(),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent')?.substring(0, 500) || 'unknown', // Limit length
      source: 'website',
    });

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'ÉDEN <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to ÉDEN Newsletter',
      react: await Promise.resolve(EmailTemplate({ firstName: sanitizedFirstName })),
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
    console.error('Newsletter subscription error:', error.message);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}