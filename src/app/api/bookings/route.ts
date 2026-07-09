import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()

    if (!body.phone || !body.service || !body.eventType || !body.date || !body.guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        service: body.service,
        eventType: body.eventType,
        date: new Date(body.date),
        guests: parseInt(body.guests),
        budget: body.budget ? parseFloat(body.budget) : 0,
        name: session.user.name || body.name,
        email: session.user.email!,
        phone: body.phone,
        message: body.message || '',
        userId: session.user.id,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
