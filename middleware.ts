// import { NextRequest } from 'next/server';
// import { intlMiddleware } from './middleware/intl';
// import { auth } from './auth';

// export default function middleware(req: NextRequest) {
//   // Middleware next-intl → handle redirect default locale
//   const intlResponse = intlMiddleware(req);
//   if (intlResponse) return intlResponse;

//   // Middleware auth.js → handle proteksi route
//   return (auth as any).middleware(req);
// }

// export const config = {
//   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
// };

import { auth } from './auth';
import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'id'] as const;
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// ✅ guest-only pages
const authPages = ['/auth'];

// ✅ user-protected pages (Access is allowed for all roles after login.)
const protectedPaths = ['/dashboard', '/profile'];

// ✅ admin-only pages
const adminPaths = ['/users', '/settings'];

export default auth((req) => {
  const res = intlMiddleware(req);
  const { pathname } = req.nextUrl;
  const segments = pathname.split('/');
  const locale = locales.includes(segments[1] as any)
    ? segments[1]
    : defaultLocale;

  // -------------------------
  // 1) auth pages → guest only
  // -------------------------
  if (authPages.some((page) => pathname.startsWith(`/${locale}${page}`))) {
    if (req.auth) {
      return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
    return res;
  }

  // -------------------------
  // 2) General access – login required
  // -------------------------
  if (protectedPaths.some((page) => pathname.startsWith(`/${locale}${page}`))) {
    if (!req.auth) {
      return Response.redirect(new URL(`/${locale}/auth/login`, req.url));
    }
  }

  // -------------------------
  // 3) Admin-only route
  // -------------------------
  if (adminPaths.some((page) => pathname.startsWith(`/${locale}${page}`))) {
    const role = req.auth?.user?.role;
    if (!req.auth) {
      // If not logged in → redirect to login
      return Response.redirect(new URL(`/${locale}/auth/login`, req.url));
    }
    if (role !== 'ADMIN') {
      // Authenticated but not admin → redirect to dashboard
      return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
  }

  return res;
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
