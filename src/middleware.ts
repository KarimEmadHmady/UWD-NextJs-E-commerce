import createMiddleware from 'next-intl/middleware';

// Force default locale (ar) instead of detecting from headers
export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localeDetection: false
});
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};