import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(request: Request) {
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
      // Use shared verifyToken function
      const decoded = await verifyToken(token);
      
      return NextResponse.json({
        valid: true,
        userId: decoded.sub,
        email: decoded.email,
        name: decoded.name
      });
    } catch (err) {
      console.error('Token verification failed:', err);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
