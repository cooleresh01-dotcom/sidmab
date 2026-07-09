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

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5 md:space-y-3">
      <div className="flex rounded-full overflow-hidden bg-white shadow-sm border border-white/20">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 min-w-0 px-4 py-2.5 md:px-5 md:py-[14px] text-xs md:text-sm text-black outline-none placeholder:text-black/30"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 md:px-7 md:py-[14px] text-xs md:text-sm font-medium text-white transition-all disabled:opacity-50 whitespace-nowrap"
          style={{ background: 'var(--site-primary)' }}
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
