import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Rate limiter for contact form
const contactRateLimitMap = new Map();
const CONTACT_RATE_LIMIT = 2; // 2 requests per hour per IP
const CONTACT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isContactRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateLimitMap.get(ip) || { count: 0, start: now };
  
  if (now - entry.start > CONTACT_WINDOW_MS) {
    contactRateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  
  if (entry.count >= CONTACT_RATE_LIMIT) {
    return true;
  }
  
  entry.count++;
  contactRateLimitMap.set(ip, entry);
  return false;
}

// Clean up old entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of contactRateLimitMap.entries()) {
    if (now - entry.start > CONTACT_WINDOW_MS) {
      contactRateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Every 10 minutes

// Contact form validation schema
const ContactSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  email: z.string().email().max(254).toLowerCase().trim(),
  phone: z.string().max(20).trim().optional(),
  subject: z.string().min(1).max(100).trim(),
  message: z.string().min(1).max(1000).trim(),
});

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API);

  try {
    // Validate environment variables
    if (!process.env.RESEND_API) {
      console.error('Resend API key is not defined');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    if (isContactRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many contact requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      );
    }
    
    const { firstName, lastName, email, phone, subject, message } = parsed.data;
    
    // Sanitize all inputs
    const sanitizedData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: email.toLowerCase(),
      phone: phone ? sanitizeInput(phone) : undefined,
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // Send email to support team
    const { error } = await resend.emails.send({
      from: 'ÉDEN Contact Form <onboarding@resend.dev>',
      to: ['support@eden-parfums.com'],
      subject: `Contact Form: ${sanitizedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedData.firstName} ${sanitizedData.lastName}</p>
        <p><strong>Email:</strong> ${sanitizedData.email}</p>
        ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted from IP: ${ip}</small></p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: 'ÉDEN <onboarding@resend.dev>',
      to: [sanitizedData.email],
      subject: 'Thank you for contacting ÉDEN',
      html: `
        <h2>Thank you for contacting ÉDEN</h2>
        <p>Dear ${sanitizedData.firstName},</p>
        <p>We have received your message and will respond within 24-48 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>The ÉDEN Team</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error.message);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 