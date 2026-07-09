'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { FaQuoteLeft, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'

const defaultSettings = {
  ceoName: 'Sarah Johnson',
  ceoTitle: 'CEO & Founder',
  ceoImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  ceoBio: 'With over 15 years of experience in event management, Sarah founded SIDMAB with a vision to transform the Nigerian events industry.',
  ceoMessage: "Welcome to SIDMAB Events & Management. Our journey began with a simple belief: every event should be extraordinary.",
  ceoSignature: 'Sarah Johnson',
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${200 + i * 150}px`,
            height: `${200 + i * 150}px`,
            background: `radial-gradient(circle, var(--site-primary) 0%, transparent 70%)`,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 25}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 12 + i * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute border border-white/10 rounded-none"
          style={{
            width: `${40 + i * 30}px`,
            height: `${40 + i * 30}px`,
            transform: `rotate(${45 * i}deg)`,
            left: `${60 + i * 15}%`,
            top: `${50 + i * 10}%`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40 + i * 20, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

function HeroSection({ ceoName, ceoTitle }: { ceoName: string; ceoTitle: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920"
          alt="CEO"
          fill
          className="object-cover scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/85" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--site-primary) 20%, transparent) 0%, transparent 60%)',
        }} />
      </motion.div>

      <FloatingOrbs />

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ perspective: '1000px' }}
        >
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-white/50 mb-6 border border-white/10 rounded-full px-5 py-2 backdrop-blur-sm">
            Leadership
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 60, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ perspective: '1200px' }}
        >
          Meet Our{' '}
          <span className="text-transparent bg-clip-text" style={{
            backgroundImage: 'linear-gradient(135deg, #fff 30%, var(--site-primary) 100%)',
          }}>
            {ceoTitle}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          The vision behind {ceoName} &mdash; leading SIDMAB with passion and purpose.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex justify-center gap-3"
        >
          <div className="w-16 h-1 rounded-full" style={{ background: 'var(--site-primary)' }} />
          <div className="w-8 h-1 rounded-full bg-white/20" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function TiltImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -20, y: x * 20 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
        {/* Watermark */}
        <div className="absolute bottom-3 right-3 pointer-events-none select-none">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 shadow-lg">
            <span className="text-white/70 text-sm font-bold tracking-[0.15em] uppercase">
              SIDMAB
            </span>
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--site-primary) 30%, transparent) 0%, transparent 50%)',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute -inset-1 rounded-3xl -z-10"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          background: 'var(--site-primary)',
          filter: 'blur(24px)',
        }}
      />
    </div>
  )
}

function CeoProfile({
  ceoName, ceoTitle, ceoImage, ceoBio, ceoMessage, ceoSignature,
}: {
  ceoName: string; ceoTitle: string; ceoImage: string; ceoBio: string; ceoMessage: string; ceoSignature: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 opacity-[0.03] rounded-full" style={{
          background: 'radial-gradient(circle, var(--site-primary) 0%, transparent 70%)',
        }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.03] rounded-full" style={{
          background: 'radial-gradient(circle, var(--site-secondary) 0%, transparent 70%)',
        }} />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 5 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-3"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block text-xs tracking-[0.2em] uppercase mb-3 font-medium" style={{ color: 'var(--site-primary)' }}>
                Our Leader
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">{ceoName}</h2>
              <p className="text-xl font-medium mt-2" style={{ color: 'var(--site-primary)' }}>
                {ceoTitle}
              </p>
            </motion.div>

            <motion.div
              className="h-px w-full my-6"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                transformOrigin: 'left',
                background: `linear-gradient(90deg, color-mix(in srgb, var(--site-primary) 40%, transparent), transparent)`,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base-content/70 leading-relaxed text-lg mb-8"
            >
              {ceoBio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative rounded-2xl p-8 mb-8 overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #FCFCFC, #F0F2F5)',
                border: '1px solid #E0E4EA',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.04)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] rounded-bl-full" style={{
                background: 'radial-gradient(circle at center, var(--site-primary), transparent)',
              }} />
              <FaQuoteLeft className="w-8 h-8 mb-4" style={{ color: 'var(--site-primary)', opacity: 0.25 }} />
              <p className="text-lg leading-relaxed italic text-base-content/80 relative z-10">
                &ldquo;{ceoMessage}&rdquo;
              </p>
              <motion.div
                className="absolute bottom-0 left-0 h-1 rounded-full"
                initial={{ width: '0%' }}
                animate={isInView ? { width: '100%' } : {}}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
                style={{
                  background: `linear-gradient(90deg, var(--site-primary), color-mix(in srgb, var(--site-primary) 20%, transparent))`,
                }}
              />
              <div className="mt-6 pt-4 border-t border-base-200 relative z-10">
                <p className="font-semibold text-lg">{ceoSignature}</p>
                <p className="text-sm text-base-content/50">{ceoTitle}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex gap-3"
            >
              {[
                { icon: FaLinkedinIn, href: '#' },
                { icon: FaTwitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-11 h-11 rounded-xl flex items-center justify-center border border-base-300 text-base-content/40 hover:text-white transition-all duration-300 group"
                  style={{ borderColor: '#E0E4EA' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--site-primary)'
                    e.currentTarget.style.borderColor = 'var(--site-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = '#E0E4EA'
                  }}
                >
                  <Icon className="w-4 h-4 group-hover:text-white transition-colors" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -5 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-2"
            style={{ perspective: '1200px' }}
          >
            <TiltImage src={ceoImage} alt={ceoName} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #F0F2F5 0%, #FCFCFC 100%)',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, var(--site-primary) 0%, transparent 70%)',
      }} />

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Work With Us?
          </h2>
          <p className="text-base-content/60 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
            Let&apos;s create something extraordinary together. Reach out and tell us about your vision.
          </p>
          <Link
            href="/contact"
            className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium overflow-hidden group"
            style={{ background: 'var(--site-primary)' }}
          >
            <span className="relative z-10">Get in Touch</span>
            <HiArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <motion.span
              className="absolute inset-0"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'var(--site-secondary)' }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function CeoPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings((prev) => ({ ...prev, ...data }))
        }
      })
      .catch(() => {})
  }, [pathname])

  return (
    <>
      <HeroSection ceoName={settings.ceoName} ceoTitle={settings.ceoTitle} />
      <CeoProfile
        ceoName={settings.ceoName}
        ceoTitle={settings.ceoTitle}
        ceoImage={settings.ceoImage}
        ceoBio={settings.ceoBio}
        ceoMessage={settings.ceoMessage}
        ceoSignature={settings.ceoSignature}
      />
      <CTASection />
    </>
  )
}
