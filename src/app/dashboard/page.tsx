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
    pending: 'badge badge-warning',
    confirmed: 'badge badge-success',
    completed: 'badge badge-info',
    cancelled: 'badge badge-error',
  }
  return <span className={styles[status] || 'badge'}>{status}</span>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })
  const [chartColors, setChartColors] = useState({
    grid: 'oklch(0.9 0.01 240)',
    axis: 'oklch(0.6 0.01 240)',
    tooltipBg: 'oklch(0.99 0 0)',
    line: 'oklch(0.55 0.18 25)',
  })

  useEffect(() => {
    const root = document.documentElement
    const g = getComputedStyle(root).getPropertyValue('--chart-grid').trim()
    const a = getComputedStyle(root).getPropertyValue('--chart-axis').trim()
    const t = getComputedStyle(root).getPropertyValue('--chart-tooltip-bg').trim()
    const l = getComputedStyle(root).getPropertyValue('--chart-line').trim()
    if (g || a || t || l) {
      setChartColors({
        grid: g || 'oklch(0.9 0.01 240)',
        axis: a || 'oklch(0.6 0.01 240)',
        tooltipBg: t || 'oklch(0.99 0 0)',
        line: l || 'oklch(0.55 0.18 25)',
      })
    }
  }, [])

  const stats = [
    { label: 'Total Events', value: '1,247', change: '+12%', icon: CalendarCheck, color: 'text-primary' },
    { label: 'Revenue', value: '₦4.2M', change: '+23%', icon: DollarSign, color: 'text-success' },
    { label: 'Active Bookings', value: '48', change: '+8%', icon: TrendingUp, color: 'text-info' },
    { label: 'New Messages', value: '12', change: '+5', icon: MessageSquare, color: 'text-warning' },
  ]

  const quickActions = [
    { label: 'New Booking', href: '/dashboard/bookings', icon: Plus, color: 'btn-primary' },
    { label: 'Add Service', href: '/dashboard/services', icon: ClipboardList, color: 'btn-secondary' },
    { label: 'View Reports', href: '/dashboard/analytics', icon: BarChart3, color: 'btn-accent' },
    { label: 'Messages', href: '/dashboard/messages', icon: Eye, color: 'btn-neutral' },
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
        <Link href="/dashboard/bookings" className="btn btn-primary text-white">
          <Plus className="w-4 h-4" />
          New Booking
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all duration-300"
            >
              <div className="card-body p-5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm text-base-content/60">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-200"
        >
          <div className="card-body p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title text-lg">Revenue Overview</h2>
              <select className="select select-bordered select-xs">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-base-100 shadow-sm border border-base-200"
        >
          <div className="card-body p-5">
            <h2 className="card-title text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`btn ${action.color} w-full text-white justify-start gap-3`}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
      >
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-lg">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="btn btn-primary btn-sm text-white">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto -mx-5">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">Client</th>
                  <th className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">Service</th>
                  <th className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">Date</th>
                  <th className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">Amount</th>
                  <th className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200 last:border-0">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {booking.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{booking.name}</span>
                      </div>
                    </td>
                    <td className="text-sm">{booking.service}</td>
                    <td className="text-sm text-base-content/70">{booking.date}</td>
                    <td className="font-medium">₦{booking.amount.toLocaleString()}</td>
                    <td>{statusBadge(booking.status)}</td>
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
