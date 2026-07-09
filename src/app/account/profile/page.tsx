'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Mail } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold">Profile</h1>
        <p className="text-base-content/60 mt-1">Your account information.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="card-body p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-content text-2xl font-bold flex items-center justify-center">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{session?.user?.name}</h2>
              <p className="text-sm text-base-content/50">Client</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/50">
              <User className="w-5 h-5 text-base-content/40" />
              <div>
                <p className="text-xs text-base-content/40">Name</p>
                <p className="font-medium">{session?.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/50">
              <Mail className="w-5 h-5 text-base-content/40" />
              <div>
                <p className="text-xs text-base-content/40">Email</p>
                <p className="font-medium">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-warning/5 border border-warning/10">
            <p className="text-sm text-warning/80">
              To update your profile details, please contact our support team.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
