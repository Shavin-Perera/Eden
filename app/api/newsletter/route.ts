import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

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

    const { email, firstName = 'Subscriber' } = await request.json();

    // Input validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('eden_newsletter');
    const collection = db.collection('subscribers');

    // Check for existing subscriber
    const existingSubscriber = await collection.findOne({ email });
    if (existingSubscriber) {
      await client.close();
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Insert new subscriber
    const result = await collection.insertOne({
      email,
      firstName,
      subscribedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'ÉDEN <onboarding@resend.dev>', // Using test domain
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
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}