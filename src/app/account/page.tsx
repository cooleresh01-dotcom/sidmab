'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { CalendarCheck, User, Clock } from 'lucide-react'

export default function AccountOverviewPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/my-bookings')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBookings(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'text-primary' },
    { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, icon: Clock, color: 'text-warning' },
    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, icon: CalendarCheck, color: 'text-success' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, icon: User, color: 'text-info' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}</h1>
        <p className="text-base-content/60 mt-1">Here&apos;s an overview of your account.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body p-5">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-xs text-base-content/50 mt-2">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="card-body p-6">
          <h2 className="card-title text-lg mb-4">Recent Bookings</h2>
          {loading ? (
            <div className="text-center py-8 text-base-content/40">
              <span className="loading loading-spinner loading-sm" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-base-content/40">
              <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra text-sm">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id}>
                      <td className="capitalize">{b.service}</td>
                      <td className="capitalize">{b.eventType}</td>
                      <td>{new Date(b.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-sm ${
                          b.status === 'confirmed' ? 'badge-success' :
                          b.status === 'completed' ? 'badge-info' :
                          b.status === 'cancelled' ? 'badge-error' :
                          'badge-ghost'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
