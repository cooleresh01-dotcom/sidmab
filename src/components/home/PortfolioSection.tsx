'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { useSettings } from '@/hooks/useSettings'

export default function PortfolioSection() {
  const { settings } = useSettings()
  const [items, setItems] = useState<Array<{ id: string; title: string; category: string; image: string }>>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data: Array<{ id: string; title: string; category: string; images?: string[] }>) => {
        if (Array.isArray(data) && data.length) {
          setItems(data.map((g) => ({ id: g.id, title: g.title, category: g.category, image: g.images?.[0] || '' })))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (items.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000)
    return () => clearInterval(timer)
  }, [items.length])

  if (items.length === 0) return null

  const current = items[index]

  return (
    <section className="relative h-[80vh] min-h-[500px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image src={current.image} alt="" fill className="object-cover" sizes="100vw" priority />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.span
          key={`badge-${current.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.2em] font-medium mb-5 border border-white/20 backdrop-blur-sm bg-black/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          {settings?.homePortfolioBadge || 'Our Work'}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
        >
          {settings?.homePortfolioTitle || 'Featured Events'}
        </motion.h2>

        <motion.h3
          key={`title-${current.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="text-white/80 text-xl md:text-2xl font-medium mt-3"
        >
          {current.title}
        </motion.h3>

        <motion.p
          key={`desc-${current.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-white/50 text-base md:text-lg max-w-xl mt-2"
        >
          {settings?.homePortfolioDesc || 'A glimpse into the extraordinary experiences we have created.'}
        </motion.p>

        <motion.div
          key={`cta-${current.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
          >
            View Portfolio <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {items.length > 1 && (
          <div className="absolute bottom-8 flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? '28px' : '6px',
                  height: '6px',
                  background: i === index ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
                aria-label={`Go to portfolio item ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
