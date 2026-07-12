'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  trendUp?: boolean
  index?: number
}

export default function StatsCard({ title, value, icon, trend, trendUp, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-base-100 rounded-2xl border border-base-300 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-base-content/50">{title}</p>
          <p className="text-2xl font-bold text-base-content mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, transparent)', color: 'var(--site-primary)' }}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
