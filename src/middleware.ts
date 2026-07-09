import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, limits } from '@/lib/rate-limit'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl
  const method = request.method

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  if (method !== 'POST' && method !== 'PUT' && method !== 'PATCH' && method !== 'DELETE') {
    return response
  }

  const ip = getClientIp(request)

  let config: { windowMs: number; max: number; message: string } | null = null

  if (pathname === '/api/auth/admin-login' || pathname.match(/^\/api\/auth\/(callback|signin|signout|csrf|session)/)) {
    config = limits.login
  } else if (pathname === '/api/auth/register') {
    config = limits.register
  } else if (pathname === '/api/contact') {
    config = limits.contact
  } else if (pathname === '/api/newsletter') {
    config = limits.newsletter
  } else if (pathname === '/api/auth/forgot-password' || pathname === '/api/forgot-password') {
    config = limits.forgotPassword
  } else if (pathname.startsWith('/api/')) {
    config = limits.api
  }

  if (config) {
    const result = rateLimit(`${ip}:${pathname}`, config)
    response.headers.set('X-RateLimit-Remaining', String(result.remaining))
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetInMs / 1000)))

    if (!result.success) {
      response.headers.set('Retry-After', String(Math.ceil(result.resetInMs / 1000)))
      return NextResponse.json(
        { error: config.message },
        { status: 429, headers: response.headers }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
