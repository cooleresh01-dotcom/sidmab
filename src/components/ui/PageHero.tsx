'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface PageHeroProps {
  title: string
  subtitle?: string
  image: string
  badge?: string
  height?: 'full' | 'half' | 'tall'
  overlay?: 'dark' | 'primary' | 'gradient'
  children?: ReactNode
}

const overlayMap = {
  dark: 'from-black/80 via-black/60 to-black/70',
  primary: 'from-black/80 via-primary/60 to-primary/70',
  gradient: 'from-black/80 via-black/50 to-black/70',
}

const heightMap = {
  full: 'h-[60vh] min-h-[450px]',
  half: 'h-[50vh] min-h-[350px]',
  tall: 'h-[70vh] min-h-[500px]',
}

export default function PageHero({
  title,
  subtitle,
  image,
  badge,
  height = 'half',
  overlay = 'dark',
  children,
}: PageHeroProps) {
  return (
    <section className={`relative ${heightMap[height]} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill className="object-cover" priority />
        <div className={`absolute inset-0 bg-gradient-to-r ${overlayMap[overlay]}`} />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-5 border border-white/20">
              {badge}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
