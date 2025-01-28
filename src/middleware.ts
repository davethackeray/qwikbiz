import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_NAME, isValidToken } from '@/lib/utils/auth';

// Public paths that don't require authentication
const publicPaths = new Set([
  '/login',
  '/auth/callback',
  '/api/auth/google',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
  '/google-logo.svg'
]);

export async function middleware(request: NextRequest) {
  // Check if path is public
  const isPublicPath = Array.from(publicPaths).some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const tokenCookie = request.cookies.get(TOKEN_NAME);
  
  // If no token or invalid token, redirect to login
  if (!tokenCookie?.value || !isValidToken(tokenCookie.value)) {
    const redirectUrl = new URL('/login', request.url);
    
    // Store the attempted URL to redirect back after login
    if (request.nextUrl.pathname !== '/') {
      redirectUrl.searchParams.set('from', request.nextUrl.pathname);
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
