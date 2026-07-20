import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalBookings, bookings, messages, unreadMessages] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where: { read: false } }),
    ])

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.budget || 0), 0)
    const activeBookings = bookings.filter(
      (b) => b.status === 'pending' || b.status === 'confirmed'
    ).length

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const monthlyData = monthNames.map((month, i) => {
      const monthBookings = bookings.filter((b) => {
        const d = new Date(b.createdAt)
        return d.getFullYear() === now.getFullYear() && d.getMonth() === i
      })
      return {
        month,
        revenue: monthBookings.reduce((sum, b) => sum + (b.budget || 0), 0),
        bookings: monthBookings.length,
      }
    })

    const recentBookings = bookings.slice(0, 5).map((b) => ({
      id: b.id,
      name: b.name,
      service: b.service,
      date: b.date?.toISOString?.().split('T')[0] || '',
      status: b.status,
      amount: b.budget || 0,
    }))

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      activeBookings,
      unreadMessages,
      monthlyData,
      recentBookings,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
