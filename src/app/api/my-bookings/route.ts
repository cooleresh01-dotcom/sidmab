import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { clientAuth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await clientAuth()
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
