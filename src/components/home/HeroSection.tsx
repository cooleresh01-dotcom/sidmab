'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { useSettings } from '@/hooks/useSettings'

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920',
    label: 'Corporate & Social Events',
    heading: ['Elevate Your', 'Next', 'Occasion'],
    text: 'Professional event management for corporate functions, galas, and social gatherings that leave a lasting impression.',
  },
  {
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920',
    label: 'Wedding & Celebrations',
    heading: ['Your Dream', 'Celebration', 'Awaits'],
    text: 'Every love story deserves a beautiful celebration. We turn your wedding vision into a breathtaking reality.',
  },
  {
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920',
    label: 'Decoration & Design',
    heading: ['Transforming', 'Spaces Into', 'Art'],
    text: 'From concept to execution, our design team creates stunning environments that captivate and inspire.',
  },
]

export default function HeroSection() {
  const { settings } = useSettings()
  const [slides, setSlides] = useState(defaultSlides)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!settings) return
    setSlides(Array.from({ length: 4 }, (_, i) => ({
      image: settings[`heroImage_${i}`] || defaultSlides[i]?.image || defaultSlides[0].image,
      label: settings[`heroLabel_${i}`] || defaultSlides[i]?.label || defaultSlides[0].label,
      heading: [
        settings[`heroH1_${i}`] || defaultSlides[i]?.heading[0] || defaultSlides[0].heading[0],
        settings[`heroH2_${i}`] || defaultSlides[i]?.heading[1] || defaultSlides[0].heading[1],
        settings[`heroH3_${i}`] || defaultSlides[i]?.heading[2] || defaultSlides[0].heading[2],
      ],
      text: settings[`heroText_${i}`] || defaultSlides[i]?.text || defaultSlides[0].text,
    })))
  }, [settings])

  useEffect(() => {
    if (slides.length === 0) return
    timerRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [slides.length])

  const goTo = (i: number) => {
    setCurrent(i)
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
  }

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[680px] flex items-center overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt="" fill className="object-cover" priority sizes="100vw" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mt-4 mb-5 shadow-lg backdrop-blur-xl border border-white/30 bg-white/10">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--site-primary)' }} />
              {slide.label}
            </div>
            <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.0] tracking-tight">
              {slide.heading[0]}
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, var(--site-primary), var(--site-secondary))' }}>
                {slide.heading[1]}
              </span>
              <br />
              {slide.heading[2]}
            </h1>
            <p className="text-white/45 text-lg mt-6 mb-10 max-w-lg leading-relaxed">
              {slide.text}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-xl shadow-black/20 hover:-translate-y-0.5"
                style={{ background: 'var(--site-primary)' }}
              >
                Book a Consultation <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-white/80 font-medium rounded-xl transition-all duration-300 text-sm hover:text-white hover:bg-white/5 border border-white/15 hover:border-[var(--site-primary)]"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === current ? '48px' : '12px',
              background: i === current ? 'var(--site-primary)' : 'rgba(255,255,255,0.2)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 right-10 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }}
        />
      </motion.div>
    </section>
  )
}
