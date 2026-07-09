'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
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
    if (!token) {
      setError('Invalid reset link')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong')
      } else {
        setDone(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-error" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
        <p className="text-base-content/60 text-sm mb-6">This reset link is invalid or missing.</p>
        <Link href="/forgot-password" className="btn btn-primary text-white">Request New Link</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-success flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success-content" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Password Reset</h1>
        <p className="text-base-content/60 text-sm mb-6">Your password has been updated successfully.</p>
        <Link href="/login" className="btn btn-primary text-white">Sign In</Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary-content" />
        </div>
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-base-content/60 mt-1 text-sm">Enter your new password below.</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert alert-error mb-4 text-sm">
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">New Password</span></label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <label className="label"><span className="label-text-alt text-error">{errors.password.message}</span></label>}
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Confirm Password</span></label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword')}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <label className="label"><span className="label-text-alt text-error">{errors.confirmPassword.message}</span></label>}
        </div>

        <button type="submit" className={`btn btn-primary w-full text-white ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
          {loading ? <><span className="loading loading-spinner loading-sm" /> Resetting...</> : 'Reset Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            <Suspense fallback={
              <div className="text-center py-8"><span className="loading loading-spinner loading-sm" /></div>
            }>
              <ResetForm />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
