'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterForm({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Subscribed successfully!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 4000)
  }

  const borderCls = dark ? 'border-white/20' : 'border-black/20'
  const textCls = 'text-black'
  const bgCls = 'bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className={`flex-1 min-w-0 px-5 py-[14px] text-sm ${bgCls} ${textCls} outline-none transition-colors placeholder:text-black/30`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 text-sm font-medium text-white transition-all disabled:opacity-50 whitespace-nowrap border-2"
          style={{ background: 'var(--site-primary)', borderColor: 'var(--site-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
        >
          {status === 'loading' ? '…' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
