import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  // Auth sayfalarına erişim kontrolü
  if (pathname.startsWith('/auth/')) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Korumalı sayfalara erişim kontrolü
  if (!token && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/explore/:path*',
    '/bookmarks/:path*',
    '/auth/:path*'
  ]
} 