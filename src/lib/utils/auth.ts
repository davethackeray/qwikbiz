import { type RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import * as jose from 'jose';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  exp?: number;
}

export const TOKEN_NAME = 'auth_token';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret');

export function createAuthCookie(token: string): ResponseCookie {
  return {
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  };
}

export async function createToken(payload: Omit<TokenPayload, 'exp'>): Promise<string> {
  return await new jose.SignJWT({
    ...payload,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    console.log('Verifying token...');
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    console.log('Token verified successfully:', payload);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

export async function isValidToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    // Just verify we have required fields
    if (!payload.sub || !payload.email || !payload.name) {
      console.log('Token missing required fields');
      return false;
    }
    console.log('Token is valid');
    return true;
  } catch (error) {
    console.log('Token validation failed:', error);
    return false;
  }
}
