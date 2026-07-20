'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { FaCalendarCheck } from 'react-icons/fa'
import FadeIn from './FadeIn'
import { useSettings } from '@/hooks/useSettings'

export default function CTASection() {
  const { settings } = useSettings()
  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={settings?.homeCtaImage || "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920"}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-[0.15em] font-medium mb-3 md:mb-4">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--site-primary)' }} />
            {settings?.homeCtaBadge || "Let's Create Something Amazing"}
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-[1.05]">
            {settings?.homeCtaTitle || 'Ready to Plan Your Event?'}
          </h2>
          <p className="text-white/45 mt-3 md:mt-4 mx-auto text-sm md:text-lg leading-relaxed">
            {settings?.homeCtaDesc || 'Get in touch today for a free consultation. No obligation, just inspiration.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-5 md:mt-8">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 text-white font-semibold rounded-xl transition-all duration-300 text-xs md:text-sm shadow-xl shadow-black/30 hover:-translate-y-0.5"
              style={{ background: 'var(--site-primary)' }}
            >
              {settings?.homeCtaBtn1 || 'Book a Consultation'} <HiArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 text-white/70 font-medium rounded-xl transition-all duration-300 text-xs md:text-sm hover:text-white hover:-translate-y-0.5 border border-white/15 hover:border-[var(--site-primary)] hover:bg-white/5"
            >
              {settings?.homeCtaBtn2 || 'Contact Us'}
            </Link>
          </div>
          <p className="text-white text-[11px] md:text-xs mt-4 md:mt-6 tracking-wide flex items-center justify-center gap-1.5">
            <FaCalendarCheck className="w-3 h-3" />
            {settings?.homeCtaNote || 'Typically responds within 24 hours'}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
