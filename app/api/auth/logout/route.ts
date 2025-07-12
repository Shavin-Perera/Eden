import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get refresh token from cookies
    const cookieHeader = request.headers.get('cookie');
    const refreshToken = cookieHeader
      ?.split(';')
      .find(cookie => cookie.trim().startsWith('refreshToken='))
      ?.split('=')[1];
    
    if (refreshToken) {
      // Invalidate the refresh token
      await logout(refreshToken);
    }

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully'
      },
      { status: 200 }
    );

    // Clear cookies
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error.message);
    
    // Even if there's an error, clear the cookies
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully'
      },
      { status: 200 }
    );

    // Clear cookies
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  }
} 