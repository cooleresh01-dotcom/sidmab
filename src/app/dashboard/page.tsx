'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CalendarCheck,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Plus,
  Eye,
  ClipboardList,
  BarChart3,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import StatsCard from '@/components/dashboard/StatsCard'
import { getChartColors } from '@/lib/utils'

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 19000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 28000 },
  { month: 'Jun', revenue: 25000 },
  { month: 'Jul', revenue: 32000 },
  { month: 'Aug', revenue: 29000 },
  { month: 'Sep', revenue: 35000 },
  { month: 'Oct', revenue: 40000 },
  { month: 'Nov', revenue: 38000 },
  { month: 'Dec', revenue: 45000 },
]

const recentBookings = [
  { id: 1, name: 'Chioma & Ade', service: 'Wedding Planning', date: '2026-08-15', status: 'confirmed', amount: 25000 },
  { id: 2, name: 'James O.', service: 'Corporate Event', date: '2026-07-20', status: 'pending', amount: 15000 },
  { id: 3, name: 'Amara E.', service: 'Birthday Party', date: '2026-07-10', status: 'completed', amount: 8000 },
  { id: 4, name: 'Dr. Bello', service: 'Conference', date: '2026-06-28', status: 'pending', amount: 20000 },
  { id: 5, name: 'Fatima S.', service: 'Decoration', date: '2026-06-15', status: 'confirmed', amount: 12000 },
]

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })
  const chartColors = getChartColors()

  const stats = [
    { label: 'Total Events', value: '1,247', change: '+12%', icon: <CalendarCheck className="w-5 h-5" /> },
    { label: 'Revenue', value: '₦4.2M', change: '+23%', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Active Bookings', value: '48', change: '+8%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'New Messages', value: '12', change: '+5', icon: <MessageSquare className="w-5 h-5" /> },
  ]

  const quickActions = [
    { label: 'New Booking', href: '/dashboard/bookings', icon: <Plus className="w-4 h-4" /> },
    { label: 'Add Service', href: '/dashboard/services', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'View Reports', href: '/dashboard/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Messages', href: '/dashboard/messages', icon: <Eye className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {greeting}, {session?.user?.name || 'User'}
          </h1>
          <p className="text-base-content/60 mt-1">Here&apos;s what&apos;s happening with your events today.</p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110"
          style={{ background: 'var(--site-primary)' }}
        >
          <Plus className="w-4 h-4" />
          New Booking
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.change}
            trendUp
            index={i}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-base-100 rounded-2xl border border-base-300 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Revenue Overview</h2>
            <select className="text-xs px-3 py-1.5 rounded-lg border border-base-300 bg-base-100 text-base-content">
              <option>This Year</option>
              <option>This Month</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke={chartColors.axis} />
                <YAxis tick={{ fontSize: 12 }} stroke={chartColors.axis} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.tooltipBg,
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartColors.line}
                  strokeWidth={2}
                  dot={{ r: 4, fill: chartColors.line }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-base-100 rounded-2xl border border-base-300 p-6"
        >
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200 hover:bg-base-300 transition-colors text-sm font-medium text-base-content"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, transparent)', color: 'var(--site-primary)' }}>
                  {action.icon}
                </span>
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <Link
              href="/dashboard/bookings"
              className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:brightness-110 text-white"
              style={{ background: 'var(--site-primary)' }}
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-base-content/50 font-semibold">Client</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-base-content/50 font-semibold">Service</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-base-content/50 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-base-content/50 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-base-content/50 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, transparent)', color: 'var(--site-primary)' }}>
                          {booking.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{booking.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-base-content/70">{booking.service}</td>
                    <td className="py-3 px-4 text-base-content/70">{booking.date}</td>
                    <td className="py-3 px-4 font-medium">₦{booking.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{statusBadge(booking.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
