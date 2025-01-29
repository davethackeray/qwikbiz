interface RateLimitInfo {
  count: number;
  lastRequest: number;
}

/**
 * Rate limiter implementation that works in both Next.js and non-Next.js contexts
 */
export class RateLimiter {
  private rateLimitMap: Map<string, RateLimitInfo>;
  private readonly window: number;
  private readonly maxRequests: number;

  constructor(windowMs = 60 * 1000, maxRequests = 10) {
    this.rateLimitMap = new Map();
    this.window = windowMs;
    this.maxRequests = maxRequests;
  }

  allowRequest(identifier: string): boolean {
    const now = Date.now();
    const rateLimitInfo = this.rateLimitMap.get(identifier);

    if (!rateLimitInfo) {
      this.rateLimitMap.set(identifier, { count: 1, lastRequest: now });
      return true;
    }

    const timeSinceLastRequest = now - rateLimitInfo.lastRequest;
    if (timeSinceLastRequest > this.window) {
      this.rateLimitMap.set(identifier, { count: 1, lastRequest: now });
      return true;
    }

    if (rateLimitInfo.count >= this.maxRequests) {
      return false;
    }

    rateLimitInfo.count += 1;
    rateLimitInfo.lastRequest = now;
    return true;
  }

  reset(identifier?: string) {
    if (identifier) {
      this.rateLimitMap.delete(identifier);
    } else {
      this.rateLimitMap.clear();
    }
  }
}

// For Next.js middleware
export function rateLimit(req: Request) {
  const limiter = new RateLimiter();
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  
  if (!limiter.allowRequest(ip)) {
    return new Response('Too many requests', { status: 429 });
  }

  return new Response(null, { status: 200 });
}
