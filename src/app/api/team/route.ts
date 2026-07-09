import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const members = await prisma.team.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(members)
  } catch {
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

    if (!body.name || !body.role || !body.image || !body.bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const member = await prisma.team.create({ data: body })
    return NextResponse.json(member, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
