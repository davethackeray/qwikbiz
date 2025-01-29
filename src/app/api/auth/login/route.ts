import { NextResponse } from 'next/server';
import { createToken, createAuthCookie, TOKEN_NAME } from '@/lib/utils/auth';

// Demo users for development (replace with actual database in production)
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@qwikbiz.com',
    password: 'admin123', // In production, use hashed passwords
    name: 'Admin User'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'Email and password are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Find user (replace with actual database query)
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      console.log('Login failed: Invalid credentials');
      return new NextResponse(
        JSON.stringify({ message: 'Invalid email or password' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('User found, generating token...');

    // Generate token
    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    // Create session object
    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };

    console.log('Creating response with auth cookie...');

    // Create response with session data
    const response = NextResponse.json(session);

    // Set auth cookie
    response.cookies.set(createAuthCookie(token));

    console.log('Auth cookie set, sending response...');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
