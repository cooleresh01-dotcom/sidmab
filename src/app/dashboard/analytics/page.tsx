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
  Legend,
} from 'recharts'

type DateRange = 'this-month' | 'this-year' | 'all'

const monthlyBookings = [
  { month: 'Jan', bookings: 12 },
  { month: 'Feb', bookings: 18 },
  { month: 'Mar', bookings: 15 },
  { month: 'Apr', bookings: 22 },
  { month: 'May', bookings: 28 },
  { month: 'Jun', bookings: 24 },
  { month: 'Jul', bookings: 30 },
  { month: 'Aug', bookings: 26 },
  { month: 'Sep', bookings: 32 },
  { month: 'Oct', bookings: 38 },
  { month: 'Nov', bookings: 35 },
  { month: 'Dec', bookings: 42 },
]

const revenueByService = [
  { service: 'Wedding', revenue: 1250000 },
  { service: 'Corporate', revenue: 980000 },
  { service: 'Birthday', revenue: 450000 },
  { service: 'Decoration', revenue: 620000 },
  { service: 'Catering', revenue: 380000 },
  { service: 'Rentals', revenue: 280000 },
]

const eventsByCategory = [
  { category: 'Wedding', value: 35 },
  { category: 'Corporate', value: 25 },
  { category: 'Birthday', value: 20 },
  { category: 'Decoration', value: 12 },
  { category: 'Other', value: 8 },
]

const COLORS = ['oklch(0.55 0.18 25)', 'oklch(0.6 0.12 180)', 'oklch(0.65 0.2 40)', 'oklch(0.5 0.15 280)', 'oklch(0.6 0.15 160)']

const ranges = [
  { value: 'this-month', label: 'This Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>('this-year')
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

  const statsCards = [
    {
      label: 'Total Bookings',
      value: '245',
      change: '+18%',
      icon: CalendarCheck,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Total Revenue',
      value: '₦3.96M',
      change: '+24%',
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Active Clients',
      value: '89',
      change: '+12%',
      icon: Users,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Growth Rate',
      value: '22.5%',
      change: '+5.2%',
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
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
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
                <LineChart data={monthlyBookings}>
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
                <BarChart data={revenueByService}>
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
                    data={eventsByCategory}
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
                    {eventsByCategory.map((_, index) => (
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
                <p className="text-xl font-bold mt-1">Wedding Planning</p>
                <p className="text-xs text-base-content/40 mt-1">35% of total bookings</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Busiest Month</p>
                <p className="text-xl font-bold mt-1">December</p>
                <p className="text-xs text-base-content/40 mt-1">42 bookings recorded</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Average Booking Value</p>
                <p className="text-xl font-bold mt-1">₦385,000</p>
                <p className="text-xs text-base-content/40 mt-1">Across all services</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-sm text-base-content/60">Conversion Rate</p>
                <p className="text-xl font-bold mt-1">68%</p>
                <p className="text-xs text-base-content/40 mt-1">Inquiry to booking</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
