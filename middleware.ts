import { NextRequest } from 'next/server';
import { intlMiddleware } from './middleware/intl';
import { auth } from './auth';

export default function middleware(req: NextRequest) {
  // Middleware next-intl → handle redirect default locale
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Middleware auth.js → handle proteksi route
  return (auth as any).middleware(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
