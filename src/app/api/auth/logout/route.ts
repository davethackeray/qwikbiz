import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_NAME } from '@/lib/utils/auth';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the auth cookie by setting it to expire immediately
    response.cookies.set({
      name: TOKEN_NAME,
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
