export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/funds/:path*',
    '/cards/:path*',
    '/subscriptions/:path*',
    '/reports/:path*',
    '/settings/:path*'
  ]
};
