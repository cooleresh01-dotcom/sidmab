import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, body } = await req.json()
    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
    }

    const signatureSetting = await prisma.setting.findUnique({ where: { key: 'emailSignature' } })
    const signature = signatureSetting?.value || ''

    const htmlBody = body.replace(/\n/g, '<br/>') + (signature ? `<br/><br/>${signature}` : '')

    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST
    if (!smtpHost) {
      return NextResponse.json({
        error: 'SMTP not configured',
        mailto: `mailto:?bcc=${subscribers.map((s) => s.email).join(',')}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n' + signature.replace(/<[^>]+>/g, ''))}`,
      }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const from = process.env.SMTP_FROM || admin.email

    let sent = 0
    let failed = 0

    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from,
          to: sub.email,
          subject,
          html: htmlBody,
        })
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({ sent, failed, total: subscribers.length })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
