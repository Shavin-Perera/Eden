import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from './auth';

// Middleware to protect API routes
export async function authMiddleware(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

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

    // Add user to request headers for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user._id);
    requestHeaders.set('x-user-email', user.email);

    // Return modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error: any) {
    console.error('Auth middleware error:', error.message);
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Helper function to get user from request headers
export function getUserFromHeaders(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  
  if (!userId || !userEmail) {
    return null;
  }
  
  return {
    id: userId,
    email: userEmail
  };
}

// Middleware to refresh token if needed
export async function refreshTokenMiddleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify access token
    const tokenData = verifyToken(accessToken);
    
    // If access token is valid, proceed
    if (tokenData.valid && tokenData.type === 'access') {
      return NextResponse.next();
    }

    // If access token is invalid but refresh token exists, try to refresh
    if (refreshToken) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Cookie': `refreshToken=${refreshToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Get the new access token from the response
          const responseData = await response.json();
          
          // Create a new response with the updated cookies
          const newResponse = NextResponse.next();
          
          // Copy the new access token cookie
          const newAccessToken = response.headers.get('set-cookie');
          if (newAccessToken) {
            newResponse.headers.set('set-cookie', newAccessToken);
          }
          
          return newResponse;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }

    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Refresh token middleware error:', error.message);
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 