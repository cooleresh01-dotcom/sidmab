import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getToken } from 'next-auth/jwt'

export async function GET() {
  try {
    const posts = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (token?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    if (!body.title || !body.slug || !body.content || !body.excerpt || !body.image || !body.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const post = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        image: body.image,
        author: body.author,
        tags: body.tags || [],
        published: body.published ?? true,
        featured: body.featured ?? false,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
