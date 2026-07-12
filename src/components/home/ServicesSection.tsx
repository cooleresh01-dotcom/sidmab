'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import FadeIn from './FadeIn'
import { useSettings } from '@/hooks/useSettings'

interface ServiceItem {
  id: string
  title: string
  slug: string
  tagline: string
  description: string
  icon: string
  image: string
  gallery: string[]
  features: string[]
  featured: boolean
  published: boolean
}

export default function ServicesSection() {
  const { settings } = useSettings()
  const [badge, setBadge] = useState('What We Do')
  const [title, setTitle] = useState('Our Services')
  const [desc, setDesc] = useState('Comprehensive event planning and management solutions tailored to your needs.')
  const [serviceList, setServiceList] = useState<ServiceItem[]>([])
  const [activeService, setActiveService] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setServiceList(data.filter((s: ServiceItem) => s.published)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!settings) return
    if (settings.servicesBadge) setBadge(settings.servicesBadge)
    if (settings.servicesTitle) setTitle(settings.servicesTitle)
    if (settings.servicesDesc) setDesc(settings.servicesDesc)
  }, [settings])

  useEffect(() => {
    if (serviceList.length === 0) return
    const timer = setInterval(() => {
      const current = serviceList[activeService]
      const images = (current.gallery && current.gallery.length > 0) ? current.gallery : [current.image]
      if (galleryIndex < images.length - 1) {
        setGalleryIndex((prev) => prev + 1)
      } else {
        setGalleryIndex(0)
        setActiveService((prev) => (prev + 1) % serviceList.length)
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [serviceList, activeService, galleryIndex])

  if (serviceList.length === 0) return null

  const current = serviceList[activeService]
  const currentImages = (current.gallery && current.gallery.length > 0) ? current.gallery : [current.image]
  const currentImage = currentImages[galleryIndex] || current.image

  return (
    <section className="pt-16 pb-12 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 25% 75%, var(--site-primary) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mb-3 shadow-lg backdrop-blur-xl border border-white/30"
              style={{ background: 'rgba(4,44,108,0.4)' }}>
              {badge}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-black tracking-tight">
              {title}
            </h2>
            <p className="text-black/45 mt-3 max-w-xl text-base leading-relaxed">
              {desc}
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-0.5">
            {serviceList.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveService(i); setGalleryIndex(0) }}
                className="w-full text-left group transition-all duration-300"
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    i === activeService
                      ? 'text-white'
                      : 'hover:bg-black/[0.03]'
                  }`}
                  style={{
                    background: i === activeService ? 'var(--site-primary)' : undefined,
                  }}
                >
                  <span className="text-xl shrink-0" style={{ opacity: i === activeService ? 1 : 0.4 }}>
                    {s.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`block font-semibold text-xs sm:text-sm ${i === activeService ? 'text-white' : 'text-black'}`}>
                      {s.title}
                    </span>
                    <span className={`block text-xs sm:text-sm mt-0.5 ${i === activeService ? 'text-white/70' : 'text-black/40'}`}>
                      {s.tagline}
                    </span>
                  </div>
                  <HiArrowRight
                    className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                      i === activeService ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                    style={{ color: i === activeService ? '#fff' : undefined }}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-black min-h-[300px] lg:min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.id}-${galleryIndex}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <Image src={currentImage} alt={current.title} fill className="object-cover" sizes="50vw" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 text-[10px] uppercase tracking-[0.15em] font-medium mb-3">
                {current.title}
              </span>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed max-w-md">
                {current.description || current.tagline}
              </p>
              {current.features && current.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {current.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white/60 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {currentImages.length > 1 && (
                <div className="flex gap-1.5 mt-3">
                  {currentImages.map((_, gi) => (
                    <button
                      key={gi}
                      onClick={() => setGalleryIndex(gi)}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: gi === galleryIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                        transform: gi === galleryIndex ? 'scale(1.3)' : 'scale(1)',
                      }}
                      aria-label={`Image ${gi + 1}`}
                    />
                  ))}
                </div>
              )}
              <Link
                href={`/services/${current.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Learn More <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <FadeIn>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 px-7 py-3 font-semibold rounded-xl transition-all duration-300 text-sm hover:-translate-y-0.5 border-1.5 hover:text-white"
              style={{ borderColor: 'var(--site-primary)', color: 'var(--site-primary)' }}
            >
              View All Services <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
