import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createToken, createAuthCookie, verifyToken, type TokenPayload } from '@/lib/utils/auth';

export async function POST() {
  try {
    // Get the current token from cookies
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth_token');

    if (!tokenCookie) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Verify and decode the current token
    let payload: TokenPayload;
    try {
      payload = verifyToken(tokenCookie.value);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Create new token with refreshed expiry
    const newToken = createToken({
      sub: payload.sub,
      email: payload.email,
      name: payload.name
    });

    // Create response with refreshed session
    const response = NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name
      },
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set the refreshed cookie
    response.cookies.set(createAuthCookie(newToken));

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 401 }
    );
  }
}
