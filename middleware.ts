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

// ✅ daftar route protected (butuh login)
const protectedPaths = ['/dashboard', '/profile', '/users', '/blog', '/assets'];

// ✅ daftar route auth (hanya untuk guest, kalau login redirect)
const authPages = ['/auth/login', '/auth/register'];

export default auth((req) => {
  const res = intlMiddleware(req);
  const { pathname } = req.nextUrl;

  // Ambil locale dari URL
  const segments = pathname.split('/');
  const locale = locales.includes(segments[1] as any)
    ? segments[1]
    : defaultLocale;

  // 🔒 jika user sudah login & akses halaman auth -> redirect ke dashboard
  if (authPages.some((page) => pathname.startsWith(`/${locale}${page}`))) {
    if (req.auth) {
      return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
    return res;
  }

  // 🔒 jika akses halaman protected & belum login -> redirect ke login
  if (protectedPaths.some((page) => pathname.startsWith(`/${locale}${page}`))) {
    if (!req.auth) {
      return Response.redirect(new URL(`/${locale}/auth/login`, req.url));
    }
  }

  return res;
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
