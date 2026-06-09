import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'it', 'fr'],
  defaultLocale: 'it',
  localeDetection: true,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|favicon\\.ico|.*\\..*).*)'],
};
