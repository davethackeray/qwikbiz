import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  ACCESS_TOKEN_NAME, 
  REFRESH_TOKEN_NAME,
  createAuthCookie, 
  createToken, 
  verifyToken,
  revokeJwtId,
  type TokenPayload
} from '@/lib/utils/auth';
import { authMonitor } from '@/lib/services/monitoring';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const currentRefreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;
    
    if (!currentRefreshToken) {
      return new NextResponse(
        JSON.stringify({ error: 'Refresh token required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify refresh token and get payload
    const payload = await verifyToken(currentRefreshToken, true) as TokenPayload;
    
    // Track old token being revoked
    if (payload.jti) {
      revokeJwtId(payload.jti);
      authMonitor.trackTokenLifecycle(payload, 'revoked');
    }

    // Create new tokens
    const tokenInfo = { sub: payload.sub, email: payload.email, name: payload.name };
    const [newAccessToken, newRefreshToken] = await Promise.all([
      createToken(tokenInfo),
      createToken(tokenInfo, true)
    ]);

    // Track new tokens
    const tokenData: TokenPayload = { ...tokenInfo, type: 'access' };
    const refreshData: TokenPayload = { ...tokenInfo, type: 'refresh' };
    authMonitor.trackTokenLifecycle(tokenData, 'created');
    authMonitor.trackTokenLifecycle(refreshData, 'created');

    // Create response with new cookies
    const response = new NextResponse(
      JSON.stringify({ message: 'Token refreshed successfully' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Set new cookies
    response.cookies.set(createAuthCookie(newAccessToken));
    response.cookies.set(createAuthCookie(newRefreshToken, true));

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid refresh token';
    
    // Track refresh error
    authMonitor.handleError({
      code: 'REFRESH_ERROR',
      message: errorMessage,
      timestamp: Date.now(),
      metadata: {
        error: error instanceof Error ? error.stack : undefined
      }
    });

    console.error('[Refresh] Token refresh failed:', error);
    return new NextResponse(
      JSON.stringify({ error: errorMessage }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
