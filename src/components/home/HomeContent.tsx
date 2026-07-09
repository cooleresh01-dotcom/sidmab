'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { HiArrowRight, HiArrowUp } from 'react-icons/hi'
import {
  FaQuoteLeft, FaCalendarCheck, FaUsers, FaAward, FaSmile,
  FaLaptopCode, FaUniversity, FaPiggyBank, FaLeaf, FaTruck, FaPlay, FaStar,
} from 'react-icons/fa'
import { services, teamMembers } from '@/lib/data'
import TestimonialsMarquee from './TestimonialsMarquee'
import { HiBadgeCheck, HiSparkles, HiSupport, HiLightBulb } from 'react-icons/hi'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    let raf: number
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          style={{ background: 'var(--site-primary)' }}
        >
          <HiArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920',
    label: 'Premier Event Management',
    heading: ['We Create', 'Unforgettable', 'Moments'],
    text: 'From intimate gatherings to grand celebrations, we bring your vision to life with exceptional planning and flawless execution.',
    font: '',
    gradientFont: '',
  },
  {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920',
    label: 'Corporate & Social Events',
    heading: ['Elevate Your', 'Next', 'Occasion'],
    text: 'Professional event management for corporate functions, galas, and social gatherings that leave a lasting impression.',
    font: '',
    gradientFont: '',
  },
  {
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920',
    label: 'Wedding & Celebrations',
    heading: ['Your Dream', 'Celebration', 'Awaits'],
    text: 'Every love story deserves a beautiful celebration. We turn your wedding vision into a breathtaking reality.',
    font: '',
    gradientFont: '',
  },
  {
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920',
    label: 'Decoration & Design',
    heading: ['Transforming', 'Spaces Into', 'Art'],
    text: 'From concept to execution, our design team creates stunning environments that captivate and inspire.',
    font: '',
    gradientFont: '',
  },
]

function HeroSection() {
  const [slides, setSlides] = useState(defaultSlides)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setSlides(Array.from({ length: 4 }, (_, i) => ({
            image: d[`heroImage_${i}`] || defaultSlides[i].image,
            label: d[`heroLabel_${i}`] || defaultSlides[i].label,
            heading: [
              d[`heroH1_${i}`] || defaultSlides[i].heading[0],
              d[`heroH2_${i}`] || defaultSlides[i].heading[1],
              d[`heroH3_${i}`] || defaultSlides[i].heading[2],
            ],
            text: d[`heroText_${i}`] || defaultSlides[i].text,
            font: d[`heroFont_${i}`] || '',
            gradientFont: d[`heroGradientFont_${i}`] || '',
          })))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [])

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
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs uppercase tracking-[0.15em] font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--site-primary)' }} />
              {slide.label}
            </div>
            <h1 className={`text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.0] tracking-tight ${slide.font}`}>
              {slide.heading[0]}
              <br />
              <span className={`text-transparent bg-clip-text ${slide.gradientFont}`} style={{ backgroundImage: 'linear-gradient(135deg, var(--site-primary), var(--site-secondary))' }}>
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
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-white/80 font-medium rounded-xl transition-all duration-300 text-sm hover:text-white"
                style={{ border: '1.5px solid rgba(255,255,255,0.15)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--site-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent' }}
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === current ? '48px' : '12px',
              background: i === current ? 'var(--site-primary)' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
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

function StatsSection() {
  return (
    <section className="py-16 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--site-primary) 0%, transparent 60%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {[
              { icon: FaCalendarCheck, end: 1000, suffix: '+', label: 'Events Delivered' },
              { icon: FaUsers, end: 250, suffix: '+', label: 'Happy Clients' },
              { icon: FaAward, end: 15, suffix: '+', label: 'Years Experience' },
              { icon: FaSmile, end: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map(({ icon: Icon, end, suffix, label }) => (
              <FadeIn key={label}>
                <div className="relative group text-center p-4 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-2xl border border-white/[0.12] shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl transition-all duration-500 group-hover:opacity-30"
                    style={{ background: 'var(--site-primary)' }} />
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-5 shadow-lg bg-white">
                    <Icon className="w-5 h-5 md:w-7 md:h-7" style={{ color: 'var(--site-primary)' }} />
                  </div>
                  <p className="text-white text-2xl md:text-5xl font-bold tracking-tight relative z-10">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </p>
                  <p className="text-white/40 text-[11px] md:text-sm mt-1 md:mt-2 font-medium tracking-wide relative z-10">{label}</p>
                </div>
              </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const [badge, setBadge] = useState('What We Do')
  const [title, setTitle] = useState('Our Services')
  const [desc, setDesc] = useState('Comprehensive event planning and management solutions tailored to your needs.')

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          if (d.servicesBadge) setBadge(d.servicesBadge)
          if (d.servicesTitle) setTitle(d.servicesTitle)
          if (d.servicesDesc) setDesc(d.servicesDesc)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 25% 75%, var(--site-primary) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-4">
              {badge}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tight">
              {title}
            </h2>
            <p className="text-black/45 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
              {desc}
            </p>
          </div>
        </FadeIn>

        {/* Mobile: horizontal snap scroll */}
        <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2 -mx-6 px-6">
          {services.slice(0, 4).map((service, i) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block min-w-[80vw] snap-center shrink-0"
            >
              <div className="h-full rounded-2xl bg-white border border-black/[0.06] transition-all duration-300">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="80vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl drop-shadow-lg">{service.icon}</span>
                      <h3 className="text-white font-bold text-base leading-tight">{service.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-black/60 leading-relaxed line-clamp-2">{service.tagline}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-black/[0.04] text-black/50 font-medium">{f}</span>
                    ))}
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--site-primary)' }}>
                      Learn More <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Scroll dots */}
        <div className="flex sm:hidden justify-center gap-1.5 mt-4">
          {services.slice(0, 4).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-black/20" />
          ))}
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.08}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl bg-white border border-black/[0.06] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-black/10">
                  <div className="relative h-56 overflow-hidden rounded-t-2xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl drop-shadow-lg">{service.icon}</span>
                        <h3 className="text-white font-bold text-base leading-tight">{service.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-black/60 leading-relaxed line-clamp-2">{service.tagline}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.features.slice(0, 3).map((f) => (
                        <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-black/[0.04] text-black/50 font-medium">{f}</span>
                      ))}
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-200"
                        style={{ color: 'var(--site-primary)' }}>
                        Learn More <HiArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 px-7 py-3 font-semibold rounded-xl transition-all duration-300 text-sm hover:-translate-y-0.5"
              style={{ border: '1.5px solid var(--site-primary)', color: 'var(--site-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--site-primary)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--site-primary)' }}
            >
              View All Services <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function WhyChooseUsSection() {
  const [why, setWhy] = useState<Record<string, string>>({})
  const [apiTeam, setApiTeam] = useState<Array<{ name: string; role: string; image: string }>>([])

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => { if (data && !data.error) setWhy(data) })
      .catch(() => {})
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApiTeam(data) })
      .catch(() => {})
  }, [])

  const cards = [
    { icon: HiBadgeCheck, key: '0' },
    { icon: HiSparkles, key: '1' },
    { icon: HiSupport, key: '2' },
    { icon: HiLightBulb, key: '3' },
  ]

  const displayTeam = apiTeam.length >= 3 ? apiTeam.slice(0, 3) : teamMembers.slice(0, 3)

  return (
    <section className="py-16 bg-black/[0.02] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 75% 25%, var(--site-primary) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-4">
              {why.whyBadge || 'Why SIDMAB'}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tight">
              {why.whyTitle || 'Why Choose Us'}
            </h2>
            <p className="text-black/45 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
              {why.whySubtitle || 'We bring passion, precision, and creativity to every event we touch.'}
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ icon: Icon, key }, i) => (
            <FadeIn key={key} delay={i * 0.08}>
              <div className="p-8 rounded-2xl bg-white border border-black/[0.06] hover:border-black/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, white)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--site-primary)' }} />
                </div>
                <h3 className="text-lg font-bold text-black mb-3">{why[`whyCard${key}_title`] || ['Proven Expertise', 'Creative Excellence', 'End-to-End Service', 'Tailored Solutions'][i]}</h3>
                <p className="text-sm text-black/50 leading-relaxed mb-4">{why[`whyCard${key}_desc`] || ['1000+ events delivered with excellence across Nigeria over 15 years.', 'Award-winning design team transforming ordinary spaces into extraordinary experiences.', 'From concept to cleanup, we handle every detail so you can enjoy your event.', 'Every event is unique. We craft custom packages that fit your vision and budget.'][i]}</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--site-primary)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--site-primary)' }}>{why[`whyCard${key}_stat`] || ['15+ Years', '50+ Awards', '100% Dedicated', 'Fully Custom'][i]}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {displayTeam.map((member, i) => (
            <FadeIn key={member.name} delay={i * 0.1}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-black/[0.06] hover:border-black/10 transition-all duration-300 hover:shadow-md">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <p className="font-semibold text-black text-sm">{member.name}</p>
                  <p className="text-xs text-black/40">{member.role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PortfolioSection() {
  const [items, setItems] = useState<Array<{ id: string; title: string; slug: string; category: string; images: string[] }>>([])

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data.slice(0, 4)) })
      .catch(() => {})
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-4">
              Our Work
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tight">
              Featured Events
            </h2>
            <p className="text-black/45 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
              A glimpse into the extraordinary experiences we have created.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.08}>
              <Link href={`/portfolio/${item.id}`} className="group block">
                <div
                  className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-80">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-white/50 text-[10px] uppercase tracking-[0.15em] font-medium">{item.category}</span>
                      <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="text-center mt-8">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 px-7 py-3 font-semibold rounded-xl transition-all duration-300 text-sm hover:-translate-y-0.5"
              style={{ border: '1.5px solid var(--site-primary)', color: 'var(--site-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--site-primary)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--site-primary)' }}
            >
              View All Projects <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}



function PartnersSection() {
  const [partnerData, setPartnerData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => { if (data && !data.error) setPartnerData(data) })
      .catch(() => {})
  }, [])

  const partnerIcons = [FaLaptopCode, FaUniversity, FaPiggyBank, FaLeaf, FaTruck, FaPlay]
  const fallbackNames = ['TechBridge', 'Lagos Business School', 'AfriBank Plc', 'Greenfield Energy', 'Nexus Logistics', 'Prime Media']
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 75% 25%, var(--site-primary) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-4">
              {partnerData.partnersBadge || 'Our Partners'}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tight">
              {partnerData.partnersTitle || 'Trusted Partners'}
            </h2>
            <p className="text-black/45 mt-4 max-w-lg mx-auto text-lg leading-relaxed">
              {partnerData.partnersSubtitle || 'Proud to collaborate with leading organizations across Nigeria.'}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-5 max-w-4xl mx-auto">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const Icon = partnerIcons[i]
            const name = partnerData[`partner${i}_name`] || fallbackNames[i]
            const logo = partnerData[`partner${i}_logo`]
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-black/[0.02] border border-black/[0.06] hover:border-black/10 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-110 duration-300">
                    {logo ? (
                      <Image src={logo} alt={name} width={40} height={40} className="object-contain" />
                    ) : (
                      <Icon className="w-7 h-7 text-black/30" />
                    )}
                  </div>
                  {name && (
                    <span className="text-xs font-semibold text-black/50 text-center leading-tight group-hover:text-black/70 transition-colors">
                      {name}
                    </span>
                  )}
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-20 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920"
          alt=""
          fill
          className="object-cover opacity-70"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--site-primary) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs uppercase tracking-[0.15em] font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--site-primary)' }} />
            Let&apos;s Create Something Amazing
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
            Ready to Plan Your Event?
          </h2>
          <p className="text-white/45 mt-4 mx-auto text-lg leading-relaxed whitespace-nowrap">
            Get in touch today for a free consultation. No obligation, just inspiration.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-xl shadow-black/30 hover:-translate-y-0.5"
              style={{ background: 'var(--site-primary)' }}
            >
              Book a Consultation <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white/70 font-medium rounded-xl transition-all duration-300 text-sm hover:text-white hover:-translate-y-0.5"
              style={{ border: '1.5px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--site-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >
              Contact Us
            </Link>
          </div>
          <p className="text-white/25 text-xs mt-6 tracking-wide flex items-center justify-center gap-1.5">
            <FaCalendarCheck className="w-3 h-3" />
            Typically responds within 24 hours
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

export default function HomeContent() {
  return (
    <>
      <BackToTop />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <PortfolioSection />
      <TestimonialsMarquee />
      <PartnersSection />
      <CTASection />
    </>
  )
}
