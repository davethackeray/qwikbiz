import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_NAME, isValidToken } from '@/lib/utils/auth';

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/auth/callback',
  '/api/auth/google',
  '/api/auth/refresh',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/verify',
  '/_next',
  '/favicon.ico',
  '/google-logo.svg'
];

const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => 
    path.startsWith(publicPath) || path === publicPath
  );
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`[Middleware] Handling request to: ${pathname}`);

  // Allow public paths
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Public path ${pathname}, allowing access`);
    return NextResponse.next();
  }

  // Get auth token from cookie
  const token = request.cookies.get(TOKEN_NAME)?.value;
  console.log(`[Middleware] Token present: ${!!token}`);
  
  try {
    // If no token or invalid token, redirect to login
    if (!token || !(await isValidToken(token))) {
      console.log('[Middleware] No valid token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      // Store the original URL to redirect back after login
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Has valid token, allow access
    console.log('[Middleware] Valid token found, allowing access');
    return NextResponse.next();
  } catch (error) {
    console.log('[Middleware] Token validation error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Exclude Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Exclude API routes
    '/((?!api/).*)' 
  ]
};
