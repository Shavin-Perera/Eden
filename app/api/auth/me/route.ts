import { NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Get access token from cookies
    const cookieHeader = request.headers.get('cookie');
    const accessToken = cookieHeader
      ?.split(';')
      .find(cookie => cookie.trim().startsWith('accessToken='))
      ?.split('=')[1];

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 401 }
      );
    }

    // Verify access token
    const tokenData = verifyToken(accessToken);
    
    if (!tokenData.valid || tokenData.type !== 'access') {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    if (!tokenData.userId) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Get user data
    const user = await getUserById(tokenData.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user profile error:', error.message);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching user profile' },
      { status: 500 }
    );
  }
} 