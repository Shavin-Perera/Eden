import { NextResponse } from 'next/server';
import { authenticateUser, SignInSchema } from '@/lib/auth';

// Rate limiter for signin
const signinRateLimitMap = new Map();
const SIGNIN_RATE_LIMIT = 5; // 5 requests per 15 minutes per IP
const SIGNIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isSigninRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = signinRateLimitMap.get(ip) || { count: 0, start: now };
  
  if (now - entry.start > SIGNIN_WINDOW_MS) {
    signinRateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  
  if (entry.count >= SIGNIN_RATE_LIMIT) {
    return true;
  }
  
  entry.count++;
  signinRateLimitMap.set(ip, entry);
  return false;
}

// Clean up old entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of signinRateLimitMap.entries()) {
    if (now - entry.start > SIGNIN_WINDOW_MS) {
      signinRateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    if (isSigninRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many signin attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = SignInSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input provided',
          details: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    
    const { email, password } = parsed.data;
    const userAgent = request.headers.get('user-agent') || undefined;
    
    // Authenticate user
    const { user, accessToken, refreshToken } = await authenticateUser(
      email, 
      password, 
      userAgent, 
      ip
    );

    // Create response with secure cookies
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Signed in successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified
        }
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Signin error:', error.message);
    
    // Handle specific errors
    if (error.message === 'Invalid email or password') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Account is locked')) {
      return NextResponse.json(
        { error: error.message },
        { status: 423 } // Locked
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during signin' },
      { status: 500 }
    );
  }
} 