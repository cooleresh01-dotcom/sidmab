'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Clock, MapPin, Users } from 'lucide-react'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/my-bookings')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBookings(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-success',
    completed: 'badge-info',
    cancelled: 'badge-error',
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold">My Bookings</h1>
        <p className="text-base-content/60 mt-1">View and manage your event bookings.</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-16 text-base-content/40">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-sm border border-base-200"
        >
          <div className="card-body p-12 text-center">
            <CalendarCheck className="w-16 h-16 mx-auto mb-4 text-base-content/20" />
            <h3 className="font-semibold text-lg mb-1">No bookings yet</h3>
            <p className="text-sm text-base-content/50 mb-6">You haven&apos;t made any bookings yet.</p>
            <a href="/#services" className="btn btn-primary text-white">Book a Service</a>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
            >
              <div className="card-body p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <CalendarCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{b.service} — {b.eventType}</h3>
                      <p className="text-sm text-base-content/50 mt-0.5">Booked on {new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusColor[b.status] || 'badge-ghost'} capitalize`}>{b.status}</span>
                </div>
                <div className="divider my-3" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(b.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Users className="w-4 h-4" />
                    <span>{b.guests} guests</span>
                  </div>
                  {b.budget > 0 && (
                    <div className="flex items-center gap-2 text-base-content/60">
                      <span className="font-medium">₦{b.budget?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {b.message && (
                  <p className="text-sm text-base-content/50 mt-3 italic bg-base-200/50 p-3 rounded-lg">
                    &ldquo;{b.message}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
