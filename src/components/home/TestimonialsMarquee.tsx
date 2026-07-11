'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'

function TestimonialCard({ name, role, company, image, content, rating }: {
  name: string; role: string; company: string; image: string; content: string; rating: number
}) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-black/[0.06] hover:border-black/10 transition-all duration-500 hover:shadow-xl flex flex-col group h-[260px]">
      <FaQuoteLeft className="text-2xl mb-4" style={{ color: 'color-mix(in srgb, var(--site-primary) 15%, transparent)' }} />
      <p className="text-black/60 text-sm leading-relaxed flex-1 line-clamp-4">
        &ldquo;{content}&rdquo;
      </p>
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/[0.06]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
            <Image src={image} alt={name} fill className="object-cover" sizes="40px" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black truncate">{name}</p>
            <p className="text-xs text-black/40 truncate">{company ? `${role}, ${company}` : role}</p>
          </div>
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, j) => (
            <FaStar key={j} className={`w-3 h-3 ${j < rating ? '' : 'text-black/10'}`}
              style={j < rating ? { color: 'var(--site-primary)' } : {}} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsMarquee() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [items, setItems] = useState<{ name: string; role: string; company: string; image: string; content: string; rating: number }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [mobileIndex, setMobileIndex] = useState(0)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data)
      })
      .catch(() => {})
  }, [])

  // Desktop auto-slide
  const itemsPerPage = 3
  const totalSlides = Math.ceil(items.length / itemsPerPage) || 1
  const slides = Array.from({ length: totalSlides }, (_, i) =>
    items.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
  )

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused, totalSlides])

  // Mobile auto-scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el || items.length === 0) return
    const interval = setInterval(() => {
      const next = (mobileIndex + 1) % items.length
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
      setMobileIndex(next)
    }, 4000)
    return () => clearInterval(interval)
  }, [mobileIndex, items.length])

  return (
    <section className="py-16 bg-black/[0.02] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mb-4 shadow-lg backdrop-blur-xl border border-white/30 bg-white/10"
            style={{ background: 'rgba(4,44,108,0.4)' }}>
            Testimonials
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-black/45 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            Don&apos;t take our word for it &mdash; hear from those we&apos;ve served.
          </p>
        </div>
      </div>

      {/* Mobile: auto-scroll carousel */}
      <div className="sm:hidden max-w-7xl mx-auto px-6">
        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
          {items.map((t, i) => (
            <div key={i} className="w-full shrink-0 snap-center px-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current
                if (el) { el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' }); setMobileIndex(i) }
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === mobileIndex ? '24px' : '6px',
                height: '6px',
                background: i === mobileIndex ? 'var(--site-primary)' : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop: slide pages */}
      <div
        className="hidden sm:block max-w-6xl mx-auto px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {slides[current].map((t, i) => (
                <TestimonialCard key={`${current}-${i}`} {...t} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? '32px' : '8px',
                background: i === current ? 'var(--site-primary)' : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
