'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, Trash2 } from 'lucide-react'

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  service: string
  eventType: string
  date: string
  guests: number
  budget: number
  message: string
  status: BookingStatus
  createdAt: string
}

const statusStyles: Record<BookingStatus, string> = {
  pending: 'badge badge-warning',
  confirmed: 'badge badge-success',
  completed: 'badge badge-info',
  cancelled: 'badge badge-error',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const updateStatus = (id: string, status: BookingStatus) => {
    fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {})
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  const deleteBooking = (id: string) => {
    fetch(`/api/bookings/${id}`, { method: 'DELETE' }).catch(() => {})
    setBookings((prev) => prev.filter((b) => b.id !== id))
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
  }

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Bookings</h1>
          <p className="text-base-content/60 mt-1">View and manage all bookings.</p>
        </div>
        <select
          className="select select-bordered select-sm w-full sm:w-40"
          value={filter}
          onChange={(e) => setFilter(e.target.value as BookingStatus | 'all')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden md:table-cell">Service</th>
                <th className="hidden sm:table-cell">Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/40">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking.id}>
                    <td className="font-medium">{booking.name}</td>
                    <td className="hidden md:table-cell text-base-content/60">{booking.service}</td>
                    <td className="hidden sm:table-cell">{booking.date}</td>
                    <td>
                      <span className={statusStyles[booking.status]}>{booking.status}</span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(booking)}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(booking.id)}
                          className="btn btn-ghost btn-sm btn-square text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card bg-base-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">Booking Details</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Name</p>
                      <p className="font-medium">{selected.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Status</p>
                      <span className={statusStyles[selected.status]}>{selected.status}</span>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Email</p>
                      <p className="text-sm">{selected.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Phone</p>
                      <p className="text-sm">{selected.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Service</p>
                      <p className="text-sm">{selected.service}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Event Type</p>
                      <p className="text-sm">{selected.eventType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Date</p>
                      <p className="text-sm">{selected.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium">Guests</p>
                      <p className="text-sm">{selected.guests}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-base-content/40 uppercase font-medium">Budget</p>
                      <p className="text-lg font-bold">₦{selected.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  {selected.message && (
                    <div>
                      <p className="text-xs text-base-content/40 uppercase font-medium mb-1">Message</p>
                      <p className="text-sm bg-base-200 p-3 rounded-lg">{selected.message}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-base-content/40 uppercase font-medium mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => {
                              updateStatus(selected.id, status)
                              setSelected({ ...selected, status })
                            }}
                            className={`btn btn-sm ${
                              selected.status === status ? 'btn-primary' : 'btn-ghost'
                            }`}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="card bg-base-100 shadow-xl w-full max-w-sm"
            >
              <div className="card-body p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-error" />
                </div>
                <h3 className="font-bold text-lg">Delete Booking?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deleteBooking(deleteConfirm)}
                    className="btn btn-error flex-1 text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
