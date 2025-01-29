import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      // Verify token before accepting logout
      jwt.verify(token, JWT_SECRET);

      // In a real application, you might:
      // 1. Add token to a blacklist
      // 2. Clear any server-side sessions
      // 3. Revoke refresh tokens
      // 4. Clear any application-specific data

      return NextResponse.json({
        message: 'Successfully logged out'
      });
    } catch (err) {
      // Even if token is invalid, consider the user logged out
      return NextResponse.json({
        message: 'Successfully logged out'
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
