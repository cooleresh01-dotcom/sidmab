import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(subscribers)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const existing = await prisma.newsletter.findUnique({
      where: { email: body.email },
    })

    if (existing) {
      if (!existing.active) {
        await prisma.newsletter.update({
          where: { email: body.email },
          data: { active: true },
        })
        return NextResponse.json({ message: 'Subscription reactivated' })
      }
      return NextResponse.json({ message: 'Already subscribed' })
    }

    const subscription = await prisma.newsletter.create({
      data: { email: body.email },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
