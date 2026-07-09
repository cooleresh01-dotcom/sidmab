'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [resetUrl, setResetUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong')
      } else {
        setSent(true)
        if (json.resetUrl) setResetUrl(json.resetUrl)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            {sent ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-2xl bg-success flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-success-content" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                <p className="text-base-content/60 text-sm mb-6">
                  If that email is registered, we&apos;ve sent a password reset link.
                </p>
                {resetUrl && (
                  <div className="mb-4 p-3 rounded-xl bg-base-200 text-left">
                    <p className="text-xs text-base-content/40 mb-1">Dev mode — reset link:</p>
                    <a href={resetUrl} className="text-primary text-sm break-all hover:underline font-medium">
                      {resetUrl}
                    </a>
                  </div>
                )}
                <Link href="/login" className="btn btn-primary text-white">
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-content" />
                  </div>
                  <h1 className="text-2xl font-bold">Forgot Password</h1>
                  <p className="text-base-content/60 mt-1 text-sm">
                    Enter your email and we&apos;ll send a reset link.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-error mb-4 text-sm"
                  >
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                      {...register('email')}
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.email.message}</span>
                      </label>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary w-full text-white ${loading ? 'btn-disabled' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <Link href="/login" className="text-sm text-base-content/60 hover:text-primary inline-flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
