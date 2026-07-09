import { NextRequest, NextResponse } from 'next/server'
import * as fileStore from '@/lib/fileStore'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const includeAll = searchParams.get('includeAll') === 'true'

    const items = fileStore.getItems(category, includeAll)
    return NextResponse.json(items)
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
    const item = fileStore.createItem(body)
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
