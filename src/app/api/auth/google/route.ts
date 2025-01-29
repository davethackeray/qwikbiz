import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthCookie, createToken } from '@/lib/utils/auth';
import { rateLimit } from '@/middleware/rateLimit';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  email_verified: boolean;
}

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    // Get user information
    const userInfo = await getUserInfo(tokens.access_token);

    // Create and set auth token
    const token = createToken({
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name
    });

    // Set cookie in response
    const response = NextResponse.json({
      user: {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.picture,
        emailVerified: userInfo.email_verified
      },
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set the cookie
    response.cookies.set(createAuthCookie(token));

    return response;
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    grant_type: 'authorization_code'
  });

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  return response.json();
}

async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}
