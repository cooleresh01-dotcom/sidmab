'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Subscriber {
  id: string
  email: string
  active: boolean
  createdAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/newsletter')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const deleteSubscriber = (id: string) => {
    fetch(`/api/newsletter/${id}`, { method: 'DELETE' }).catch(() => {})
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
    setDeleteConfirm(null)
  }

  const toggleActive = (id: string, current: boolean) => {
    fetch(`/api/newsletter/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !current }),
    }).catch(() => {})
    setSubscribers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !current } : s))
    )
  }

  const activeCount = subscribers.filter((s) => s.active).length

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
          <h1 className="text-2xl lg:text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-base-content/60 mt-1">
            {activeCount} active subscriber{activeCount !== 1 ? 's' : ''}
            {subscribers.length - activeCount > 0 && ` (${subscribers.length - activeCount} inactive)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = 'email,date,status\n' +
                subscribers.map((s) =>
                  `"${s.email}","${formatDate(s.createdAt)}",${s.active ? 'active' : 'inactive'}`
                ).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'subscribers.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="btn btn-outline btn-sm"
          >
            Export CSV
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        {subscribers.length === 0 ? (
          <div className="p-8 text-center text-base-content/40">No subscribers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-base-content/50 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Subscribed</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-base-content/40 flex-shrink-0" />
                        <a href={`mailto:${sub.email}`} className="text-sm font-medium text-primary hover:underline">
                          {sub.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm text-base-content/60">
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(sub.id, sub.active)}
                        className={`badge badge-sm cursor-pointer transition-colors ${
                          sub.active
                            ? 'badge-success text-white'
                            : 'badge-ghost text-base-content/40'
                        }`}
                      >
                        {sub.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteConfirm(sub.id)}
                        className="btn btn-ghost btn-xs btn-square text-error"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

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
              <h3 className="font-bold text-lg">Delete Subscriber?</h3>
              <p className="text-sm text-base-content/60 mt-1">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => deleteConfirm && deleteSubscriber(deleteConfirm)}
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
    </div>
  )
}
