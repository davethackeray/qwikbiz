import { type RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  exp?: number;
}

export const TOKEN_NAME = 'auth_token';
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

/**
 * Create a cookie configuration for the auth token
 */
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

/**
 * Create a new JWT token with the given payload
 */
export function createToken(payload: Omit<TokenPayload, 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function isValidToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return !!decoded.exp && decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
