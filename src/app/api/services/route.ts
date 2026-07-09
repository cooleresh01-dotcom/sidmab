import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true'

    const services = await prisma.service.findMany({
      where: all ? {} : { published: true },
      include: { packages: true, faqs: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { packages, faqs, ...data } = body

    const service = await prisma.service.create({
      data: {
        ...data,
        packages: packages ? { create: packages } : undefined,
        faqs: faqs ? { create: faqs } : undefined,
      },
      include: { packages: true, faqs: true },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
