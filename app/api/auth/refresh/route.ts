import { NextResponse } from 'next/server';
import { refreshAccessToken, RefreshTokenSchema } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get refresh token from cookies
    const cookieHeader = request.headers.get('cookie');
    const refreshToken = cookieHeader
      ?.split(';')
      .find(cookie => cookie.trim().startsWith('refreshToken='))
      ?.split('=')[1];

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Validate refresh token
    const parsed = RefreshTokenSchema.safeParse({ refreshToken });
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 400 }
      );
    }

    // Refresh access token
    const { accessToken, user } = await refreshAccessToken(refreshToken);

    // Create response with new access token
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Token refreshed successfully',
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

    // Set new access token cookie
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Token refresh error:', error.message);
    
    // Handle specific errors
    if (error.message === 'Invalid or expired refresh token') {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }
    
    if (error.message === 'User not found') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during token refresh' },
      { status: 500 }
    );
  }
} 