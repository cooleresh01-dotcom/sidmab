import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    const item = await prisma.gallery.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    await prisma.gallery.delete({ where: { id } })
    return NextResponse.json({ message: 'Gallery item deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
