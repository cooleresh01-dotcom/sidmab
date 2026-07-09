import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'If that email is registered, a reset link has been sent.' }, { status: 200 })
    }

    // Invalidate old tokens
    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    // In production, send email here
    console.log('Password reset URL:', resetUrl)

    return NextResponse.json({
      message: 'If that email is registered, a reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
