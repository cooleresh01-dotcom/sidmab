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

    const [signatureSetting, smtpHostSetting, smtpPortSetting, smtpUserSetting, smtpPassSetting, smtpFromSetting, smtpSecureSetting] =
      await Promise.all([
        prisma.setting.findUnique({ where: { key: 'emailSignature' } }),
        prisma.setting.findUnique({ where: { key: 'smtpHost' } }),
        prisma.setting.findUnique({ where: { key: 'smtpPort' } }),
        prisma.setting.findUnique({ where: { key: 'smtpUser' } }),
        prisma.setting.findUnique({ where: { key: 'smtpPass' } }),
        prisma.setting.findUnique({ where: { key: 'smtpFrom' } }),
        prisma.setting.findUnique({ where: { key: 'smtpSecure' } }),
      ])

    const signature = signatureSetting?.value || ''
    const htmlBody = body + (signature ? `<br/><br/>${signature}` : '')

    const smtpHost = smtpHostSetting?.value || process.env.SMTP_HOST || ''
    if (!smtpHost) {
      return NextResponse.json({
        error: 'SMTP not configured',
        mailto: `mailto:?bcc=${(await prisma.newsletter.findMany({ where: { active: true }, select: { email: true } })).map((s) => s.email).join(',')}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/<[^>]+>/g, '') + '\n\n' + signature.replace(/<[^>]+>/g, ''))}`,
      }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPortSetting?.value || process.env.SMTP_PORT || '587'),
      secure: (smtpSecureSetting?.value || process.env.SMTP_SECURE || 'false') === 'true',
      auth: {
        user: smtpUserSetting?.value || process.env.SMTP_USER || '',
        pass: smtpPassSetting?.value || process.env.SMTP_PASS || '',
      },
    })

    const from = smtpFromSetting?.value || process.env.SMTP_FROM || admin.email

    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
    }

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
