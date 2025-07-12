import { NextResponse } from 'next/server';
import { createUser, SignUpSchema } from '@/lib/auth';

// Rate limiter for signup
const signupRateLimitMap = new Map();
const SIGNUP_RATE_LIMIT = 3; // 3 requests per hour per IP
const SIGNUP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isSignupRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = signupRateLimitMap.get(ip) || { count: 0, start: now };
  
  if (now - entry.start > SIGNUP_WINDOW_MS) {
    signupRateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  
  if (entry.count >= SIGNUP_RATE_LIMIT) {
    return true;
  }
  
  entry.count++;
  signupRateLimitMap.set(ip, entry);
  return false;
}

// Clean up old entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of signupRateLimitMap.entries()) {
    if (now - entry.start > SIGNUP_WINDOW_MS) {
      signupRateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Every 10 minutes

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    if (isSignupRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = SignUpSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input provided',
          details: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    
    const { email, password, firstName, lastName } = parsed.data;

    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error.message);
    
    // Handle specific errors
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    );
  }
} 