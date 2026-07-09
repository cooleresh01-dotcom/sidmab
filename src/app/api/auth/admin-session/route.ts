import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin) {
      return NextResponse.json({ user: null }, { status: 200 })
    }
    return NextResponse.json({
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
