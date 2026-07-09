'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MailOpen, Mail, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const markAsRead = (id: string) => {
    fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    }).catch(() => {})
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  const deleteMessage = (id: string) => {
    fetch(`/api/messages/${id}`, { method: 'DELETE' }).catch(() => {})
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setDeleteConfirm(null)
    if (expanded === id) setExpanded(null)
  }

  const unreadCount = messages.filter((m) => !m.read).length

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
          <h1 className="text-2xl lg:text-3xl font-bold">Messages</h1>
          <p className="text-base-content/60 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}.`
              : 'All messages are read.'}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        {sorted.length === 0 ? (
          <div className="p-8 text-center text-base-content/40">No messages yet.</div>
        ) : (
          <div className="divide-y divide-base-200">
            {sorted.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-base-200/50 transition-colors ${
                    !msg.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    setExpanded(expanded === msg.id ? null : msg.id)
                    if (!msg.read) markAsRead(msg.id)
                  }}
                >
                  <div className="flex-shrink-0">
                    {msg.read ? (
                      <MailOpen className="w-5 h-5 text-base-content/40" />
                    ) : (
                      <Mail className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium truncate ${!msg.read ? 'text-base-content' : 'text-base-content/60'}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-base-content/40 hidden sm:inline">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${!msg.read ? 'font-medium' : ''}`}>
                      {msg.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!msg.read) markAsRead(msg.id)
                      }}
                      className={`btn btn-ghost btn-xs btn-square ${
                        msg.read ? 'opacity-30' : ''
                      }`}
                      title={msg.read ? 'Already read' : 'Mark as read'}
                    >
                      <MailOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(msg.id)
                      }}
                      className="btn btn-ghost btn-xs btn-square text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpanded(expanded === msg.id ? null : msg.id)
                      }}
                      className="btn btn-ghost btn-xs btn-square"
                    >
                      {expanded === msg.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === msg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-base-200">
                        <div className="grid sm:grid-cols-2 gap-2 mb-4 text-sm">
                          <div>
                            <span className="text-base-content/40">From: </span>
                            {msg.name}
                          </div>
                          <div>
                            <span className="text-base-content/40">Email: </span>
                            <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                              {msg.email}
                            </a>
                          </div>
                          {msg.phone && (
                            <div>
                              <span className="text-base-content/40">Phone: </span>
                              {msg.phone}
                            </div>
                          )}
                          <div>
                            <span className="text-base-content/40">Date: </span>
                            {formatDate(msg.createdAt)}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap bg-base-200 p-4 rounded-lg">
                          {msg.message}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                            className="btn btn-primary btn-sm text-white"
                          >
                            Reply via Email
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </motion.div>

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
                <h3 className="font-bold text-lg">Delete Message?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deleteMessage(deleteConfirm)}
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
