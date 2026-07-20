'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Search,
  X,
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

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  activeBookings: number
  unreadMessages: number
  monthlyData: { month: string; revenue: number; bookings: number }[]
  recentBookings: {
    id: string
    name: string
    service: string
    date: string
    status: string
    amount: number
  }[]
}

interface SearchResult {
  label: string
  section: string
  href: string
}

const searchableItems: SearchResult[] = [
  { label: 'Site Content', section: 'Content', href: '/dashboard/content' },
  { label: 'Home Page', section: 'Content', href: '/dashboard/content?tab=home' },
  { label: 'About Page', section: 'Content', href: '/dashboard/content?tab=about' },
  { label: 'Services Page', section: 'Content', href: '/dashboard/content?tab=services' },
  { label: 'Portfolio Page', section: 'Content', href: '/dashboard/content?tab=portfolio' },
  { label: 'Team Page', section: 'Content', href: '/dashboard/content?tab=team' },
  { label: 'Blog Page', section: 'Content', href: '/dashboard/content?tab=blog' },
  { label: 'Testimonials Page', section: 'Content', href: '/dashboard/content?tab=testimonials' },
  { label: 'FAQ & Contact Page', section: 'Content', href: '/dashboard/content?tab=faq-contact' },
  { label: 'Book Page', section: 'Content', href: '/dashboard/content?tab=book' },
  { label: 'CEO Page', section: 'Content', href: '/dashboard/content?tab=ceo' },
  { label: 'Service Detail Page', section: 'Content', href: '/dashboard/content?tab=service-detail' },
  { label: 'Portfolio Detail Page', section: 'Content', href: '/dashboard/content?tab=portfolio-detail' },
  { label: 'Team Detail Page', section: 'Content', href: '/dashboard/content?tab=team-detail' },
  { label: 'Hero Slides', section: 'Content', href: '/dashboard/content?tab=home' },
  { label: 'Stats', section: 'Content', href: '/dashboard/content?tab=home' },
  { label: 'Badges', section: 'Content', href: '/dashboard/content' },
  { label: 'Background Images', section: 'Content', href: '/dashboard/content' },
  { label: 'CTA Sections', section: 'Content', href: '/dashboard/content' },
  { label: 'Bookings', section: 'Management', href: '/dashboard/bookings' },
  { label: 'Services', section: 'Management', href: '/dashboard/services' },
  { label: 'Portfolio', section: 'Management', href: '/dashboard/portfolio' },
  { label: 'Team Members', section: 'Management', href: '/dashboard/team' },
  { label: 'Blog Posts', section: 'Management', href: '/dashboard/blog' },
  { label: 'Testimonials', section: 'Management', href: '/dashboard/testimonials' },
  { label: 'FAQ', section: 'Management', href: '/dashboard/faq' },
  { label: 'Gallery', section: 'Management', href: '/dashboard/gallery' },
  { label: 'Media', section: 'Management', href: '/dashboard/media' },
  { label: 'Messages', section: 'Management', href: '/dashboard/messages' },
  { label: 'Newsletter', section: 'Management', href: '/dashboard/newsletter' },
  { label: 'Careers', section: 'Management', href: '/dashboard/careers' },
  { label: 'Users', section: 'Management', href: '/dashboard/users' },
  { label: 'Analytics', section: 'Reports', href: '/dashboard/analytics' },
  { label: 'SEO Settings', section: 'Settings', href: '/dashboard/seo' },
  { label: 'Site Settings', section: 'Settings', href: '/dashboard/settings' },
  { label: 'Terms & Conditions', section: 'Settings', href: '/dashboard/terms' },
  { label: 'Privacy Policy', section: 'Settings', href: '/dashboard/privacy-policy' },
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
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })
  const chartColors = getChartColors()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setStats(data)
      })
      .catch(() => {})
  }, [])

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings?.toLocaleString() || '0', change: '', icon: <CalendarCheck className="w-5 h-5" /> },
    { label: 'Revenue', value: `₦${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M`, change: '', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Active Bookings', value: String(stats?.activeBookings || 0), change: '', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'New Messages', value: String(stats?.unreadMessages || 0), change: '', icon: <MessageSquare className="w-5 h-5" /> },
  ]

  const quickActions = [
    { label: 'New Booking', href: '/dashboard/bookings', icon: <Plus className="w-4 h-4" /> },
    { label: 'Add Service', href: '/dashboard/services', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'View Reports', href: '/dashboard/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Messages', href: '/dashboard/messages', icon: <Eye className="w-4 h-4" /> },
  ]

  const searchResults = searchQuery.trim()
    ? searchableItems.filter((item) => {
        const q = searchQuery.toLowerCase()
        return (
          item.label.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q)
        )
      })
    : []

  const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

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

      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search content to edit..."
            className="input w-full pl-12 pr-10 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:border-primary"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (!searchOpen) setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              setTimeout(() => {
                setSearchOpen(false)
              }, 200)
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchOpen(false) }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-base-content/40 hover:text-base-content" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {searchOpen && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              {searchResults.length > 0 ? (
                Object.entries(groupedResults).map(([section, items]) => (
                  <div key={section}>
                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/40 border-b border-base-200">
                      {section}
                    </div>
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-colors text-sm"
                        onClick={() => { setSearchQuery(''); setSearchOpen(false) }}
                      >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, transparent)', color: 'var(--site-primary)' }}>
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-medium text-base-content">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-base-content/50">No results for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
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
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthlyData || []}>
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
                {(stats?.recentBookings || []).map((booking) => (
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
