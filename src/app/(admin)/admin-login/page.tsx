'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { adminSignIn } from '@/lib/admin-auth-client'
import { useSettings } from '@/hooks/useSettings'
import CompanyLogo from '@/components/ui/CompanyLogo'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const { settings } = useSettings()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const companyLogo = settings?.companyLogo || ''
  const companyName = settings?.siteName || 'SIDMAB'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')

    try {
      const result = await adminSignIn(data.email, data.password)

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Dark Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-950">
        <div className="relative z-10 flex flex-col p-12 text-white w-full">
          <Link href="/" className="mb-auto">
            <CompanyLogo className="h-16 w-auto" width={80} height={80} />
          </Link>

          <div className="flex-1 flex items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold leading-tight mb-4"
              >
                Admin
                <br />
                Dashboard
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-lg max-w-md"
              >
                Sign in to manage events, bookings, and settings.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 text-sm text-white/50"
          >
            <span>{companyName}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Management Portal</span>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-base-200">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <CompanyLogo className="h-16 w-auto" width={80} height={80} />
          </div>

          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-base-content/50 mb-8">
            Sign in to the management dashboard
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-base-content">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@sidmab.com"
                style={{ outline: 'none' }}
                className={`w-full px-4 py-3 text-sm rounded-xl border-0 bg-base-200 text-base-content placeholder:text-base-content/40 transition-all duration-200 ${
                  errors.email ? 'ring-1 ring-red-400' : ''
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-base-content">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  style={{ outline: 'none' }}
                  className={`w-full px-4 py-3 pr-10 text-sm rounded-xl border-0 bg-base-200 text-base-content placeholder:text-base-content/40 transition-all duration-200 ${
                    errors.password ? 'ring-1 ring-red-400' : ''
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: 'var(--site-primary)' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-base-300 text-center">
            <Link href="/login" className="text-sm text-base-content/50 hover:text-base-content transition-colors">
              &larr; Back to client login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
