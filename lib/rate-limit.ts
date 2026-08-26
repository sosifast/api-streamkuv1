export class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60 * 1000 // 1 minute default
  ) {}

  check(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    let record = this.cache.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + this.windowMs };
      this.cache.set(ip, record);
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1, reset: record.resetTime };
    }

    if (record.count >= this.maxRequests) {
      return { success: false, limit: this.maxRequests, remaining: 0, reset: record.resetTime };
    }

    record.count += 1;
    this.cache.set(ip, record);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  // Optional: cleanup interval to prevent memory leaks in long-running processes
  cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.cache.entries()) {
      if (now > record.resetTime) {
        this.cache.delete(ip);
      }
    }
  }
}

// Global instance for API routes (Warning: state is lost on serverless function cold starts)
export const globalRateLimiter = new RateLimiter(50, 60 * 1000); // 50 requests per minute
