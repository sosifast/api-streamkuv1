import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Removed default export

export const config = {
  matcher: [
    '/',
    '/(en|id|nl|ja|zh|ar|de|af)/:path*',
    '/((?!api|v1|_next|_vercel|.*\\..*).*)'
  ]
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { globalRateLimiter } from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  if (pathname.startsWith('/api')) {
    const rateLimit = globalRateLimiter.check(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
          }
        }
      );
    }
  }

  if (pathname.includes('/admin')) {
    const session = request.cookies.get('dbmovie_session');
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Fallback to intl middleware
  return createMiddleware(routing)(request);
}
