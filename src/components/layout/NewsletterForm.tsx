'use client'

import { useState, FormEvent, useEffect } from 'react'

export default function NewsletterForm({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 4000)
    return () => clearTimeout(timer)
  }, [status])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

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
  }

  const inputClasses = dark
    ? 'bg-white/10 text-white placeholder:text-white/40 border border-white/10'
    : 'bg-white text-black placeholder:text-black/30'

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5 md:space-y-3">
      <div className={`flex rounded-full overflow-hidden shadow-sm ${dark ? '' : 'border border-white/20'}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className={`flex-1 min-w-0 px-4 py-2.5 md:px-5 md:py-[14px] text-xs md:text-sm outline-none ${inputClasses}`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 md:px-7 md:py-[14px] text-xs md:text-sm font-medium text-white transition-all disabled:opacity-50 whitespace-nowrap hover:brightness-110"
          style={{ background: 'var(--site-primary)' }}
        >
          {status === 'loading' ? '...' : 'Subscribe'}
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
