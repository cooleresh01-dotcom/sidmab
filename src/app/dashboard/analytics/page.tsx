'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, CalendarCheck, Users } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  totalBookings: number
  totalRevenue: number
  activeClients: number
  monthlyBookings: { month: string; bookings: number }[]
  revenueByService: { service: string; revenue: number }[]
  eventsByCategory: { category: string; value: number }[]
  avgBookingValue: number
  mostPopular: { category: string; value: number } | null
  busiestMonth: { month: string; bookings: number } | null
}

const COLORS = ['oklch(0.55 0.18 25)', 'oklch(0.6 0.12 180)', 'oklch(0.65 0.2 40)', 'oklch(0.5 0.15 280)', 'oklch(0.6 0.15 160)']

type DateRange = 'this-month' | 'this-year' | 'all'

const ranges = [
  { value: 'this-month', label: 'This Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>('this-year')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [chartColors, setChartColors] = useState({
    grid: 'oklch(0.9 0.01 240)',
    axis: 'oklch(0.6 0.01 240)',
    tooltipBg: 'oklch(0.99 0 0)',
    line: 'oklch(0.55 0.18 25)',
  })
  const [pieColors, setPieColors] = useState(COLORS)

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
    const p = getComputedStyle(root).getPropertyValue('--chart-pie-colors').trim()
    if (p) setPieColors(p.split(','))
  }, [])

  useEffect(() => {
    fetch('/api/dashboard/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setData(d)
      })
      .catch(() => {})
  }, [])

  const growthRate = data && data.totalBookings > 0
    ? ((data.totalBookings / 12) * 100 / data.totalBookings).toFixed(1)
    : '0'

  const statsCards = [
    {
      label: 'Total Bookings',
      value: String(data?.totalBookings || 0),
      change: '',
      icon: CalendarCheck,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Total Revenue',
      value: `₦${((data?.totalRevenue || 0) / 1000000).toFixed(2)}M`,
      change: '',
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Active Clients',
      value: String(data?.activeClients || 0),
      change: '',
      icon: Users,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Avg Booking Value',
      value: `₦${(data?.avgBookingValue || 0).toLocaleString()}`,
      change: '',
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
          <p className="text-base-content/60 mt-1">
            Track your event performance and metrics.
          </p>
        </div>
        <div className="join">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value as DateRange)}
              className={`join-item btn btn-sm ${
                range === r.value ? 'btn-primary text-white' : 'btn-ghost'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body p-5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {stat.change && (
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm text-base-content/60">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-100 shadow-sm border border-base-200"
        >
          <div className="card-body p-5">
            <h2 className="card-title text-lg mb-4">Monthly Bookings</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.monthlyBookings || []}>
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
                    dataKey="bookings"
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
            <h2 className="card-title text-lg mb-4">Revenue by Service</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.revenueByService || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="service" tick={{ fontSize: 12 }} stroke={chartColors.axis} />
                  <YAxis tick={{ fontSize: 12 }} stroke={chartColors.axis} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.grid}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" fill={chartColors.line} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-base-100 shadow-sm border border-base-200"
        >
          <div className="card-body p-5">
            <h2 className="card-title text-lg mb-4">Events by Category</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.eventsByCategory || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="category"
                    label={(entry: any) =>
                      `${entry.category} ${(entry.percent * 100).toFixed(0)}%`
                    }
                  >
                    {(data?.eventsByCategory || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.grid}`,
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-200"
        >
          <div className="card-body p-5">
            <h2 className="card-title text-lg mb-4">Key Insights</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Most Popular Service</p>
                <p className="text-xl font-bold mt-1">{data?.mostPopular?.category || 'N/A'}</p>
                <p className="text-xs text-base-content/40 mt-1">{data?.mostPopular ? `${data.mostPopular.value} bookings` : 'No data yet'}</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Busiest Month</p>
                <p className="text-xl font-bold mt-1">{data?.busiestMonth?.month || 'N/A'}</p>
                <p className="text-xs text-base-content/40 mt-1">{data?.busiestMonth ? `${data.busiestMonth.bookings} bookings recorded` : 'No data yet'}</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Average Booking Value</p>
                <p className="text-xl font-bold mt-1">₦{(data?.avgBookingValue || 0).toLocaleString()}</p>
                <p className="text-xs text-base-content/40 mt-1">Across all services</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Total Revenue</p>
                <p className="text-xl font-bold mt-1">₦{((data?.totalRevenue || 0) / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-base-content/40 mt-1">All time</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
