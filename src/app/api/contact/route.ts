import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const message = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        subject: body.subject,
        message: body.message,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
