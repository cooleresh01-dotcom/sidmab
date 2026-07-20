import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany()

    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.budget || 0), 0)
    const uniqueEmails = new Set(bookings.map((b) => b.email))
    const activeClients = uniqueEmails.size

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()

    const monthlyBookings = monthNames.map((month, i) => {
      const count = bookings.filter((b) => {
        const d = new Date(b.createdAt)
        return d.getFullYear() === now.getFullYear() && d.getMonth() === i
      }).length
      return { month, bookings: count }
    })

    const serviceRevenue: Record<string, number> = {}
    bookings.forEach((b) => {
      const service = b.service || 'Other'
      serviceRevenue[service] = (serviceRevenue[service] || 0) + (b.budget || 0)
    })
    const revenueByService = Object.entries(serviceRevenue)
      .map(([service, revenue]) => ({ service, revenue }))
      .sort((a, b) => b.revenue - a.revenue)

    const categoryCount: Record<string, number> = {}
    bookings.forEach((b) => {
      const cat = b.eventType || 'Other'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })
    const eventsByCategory = Object.entries(categoryCount)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)

    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    const mostPopular = eventsByCategory.length > 0 ? eventsByCategory[0] : null
    const busiestMonth = monthlyBookings.reduce(
      (max, m) => (m.bookings > max.bookings ? m : max),
      monthlyBookings[0]
    )

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      activeClients,
      monthlyBookings,
      revenueByService,
      eventsByCategory,
      avgBookingValue,
      mostPopular,
      busiestMonth,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
