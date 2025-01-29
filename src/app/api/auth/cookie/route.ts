import { NextResponse } from 'next/server';
import { createAuthCookie, TOKEN_NAME } from '@/lib/utils/auth';

export async function POST(request: Request) {
  try {
    const { name, value } = await request.json();
    
    // Validate input and ensure only auth token can be set
    if (!name || !value || name !== TOKEN_NAME) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid cookie parameters' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create response with cookie
    const response = new NextResponse(
      JSON.stringify({ message: 'Cookie set successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Set cookie using the auth utility function
    const cookieConfig = createAuthCookie(value);
    response.cookies.set(cookieConfig);

    return response;
  } catch (error) {
    console.error('Cookie error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to set cookie' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
