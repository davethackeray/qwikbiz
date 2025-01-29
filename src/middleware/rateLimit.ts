import { authMonitor } from '@/lib/services/monitoring';

interface RateLimitInfo {
  count: number;
  lastRequest: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Rate limiter implementation that works in Edge Runtime
 * Supports different rate limits for different endpoint types
 */
export class RateLimiter {
  private rateLimitMap: Map<string, RateLimitInfo>;
  public readonly authConfig: RateLimitConfig;
  public readonly defaultConfig: RateLimitConfig;

  constructor(
    authConfig: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 5 },
    defaultConfig: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 30 }
  ) {
    this.rateLimitMap = new Map();
    this.authConfig = authConfig;
    this.defaultConfig = defaultConfig;
  }

  public getConfig(path: string): RateLimitConfig {
    return path.startsWith('/api/auth/') ? this.authConfig : this.defaultConfig;
  }

  allowRequest(identifier: string, path: string): boolean {
    const now = Date.now();
    const config = this.getConfig(path);
    const key = `${identifier}:${path}`; // Separate limits for auth vs non-auth
    const rateLimitInfo = this.rateLimitMap.get(key);

    // Reset limit if outside window
    if (!rateLimitInfo || (now - rateLimitInfo.lastRequest > config.windowMs)) {
      this.rateLimitMap.set(key, { count: 1, lastRequest: now });
      return true;
    }

    // Check if over limit
    if (rateLimitInfo.count >= config.maxRequests) {
      // Track rate limit hit
      authMonitor.trackRateLimit(identifier, path);
      return false;
    }

    // Increment counter
    rateLimitInfo.count += 1;
    rateLimitInfo.lastRequest = now;
    return true;
  }

  reset(identifier?: string, path?: string) {
    if (identifier && path) {
      this.rateLimitMap.delete(`${identifier}:${path}`);
    } else {
      this.rateLimitMap.clear();
    }
  }
}

// Singleton instance to maintain rate limit state
const globalLimiter = new RateLimiter();

/**
 * Rate limiting middleware for Next.js Edge Runtime
 */
export function rateLimit(req: Request): Response | null {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const path = new URL(req.url).pathname;
  
  // Check rate limit
  const isAllowed = globalLimiter.allowRequest(ip, path);

  if (!isAllowed) {
    const config = path.startsWith('/api/auth/') ? globalLimiter.authConfig : globalLimiter.defaultConfig;
    const retryAfter = Math.ceil(config.windowMs / 1000);

    // Return JSON response with retry information
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: `${retryAfter} seconds`
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString()
        }
      }
    );
  }

  return null;
}
