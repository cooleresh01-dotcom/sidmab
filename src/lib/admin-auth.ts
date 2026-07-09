import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-change-in-production')
const COOKIE_NAME = 'next-auth.admin.session-token'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

async function getCookieStore() {
  return await cookies()
}

export async function createAdminSession(user: AdminUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret)

  const store = await getCookieStore()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  })

  return token
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const store = await getCookieStore()
    const token = store.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as AdminUser
  } catch {
    return null
  }
}

export async function clearAdminSession() {
  const store = await getCookieStore()
  store.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })
}
