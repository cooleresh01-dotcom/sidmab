'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { HiArrowLeft, HiArrowRight, HiStar, HiCalendar, HiUserGroup, HiLocationMarker } from 'react-icons/hi'
import PageHero from '@/components/ui/PageHero'
import { useSettings } from '@/hooks/useSettings'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  category: string
  images: string[]
  description: string
  client: string
  date: string
  featured: boolean
  video?: string
}

function getYoutubeEmbed(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url
}

const sampleGallery = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600',
  'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
]

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

export default function PortfolioDetailPage() {
  const params = useParams()
  const [item, setItem] = useState<PortfolioItem | null>(null)
  const [related, setRelated] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(true)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const { settings } = useSettings()
  const id = params.id as string

  useEffect(() => {
    fetch(`/api/portfolio/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => {
        setItem(data)
        return fetch('/api/portfolio')
      })
      .then((r) => r.json())
      .then((all) => {
        if (Array.isArray(all)) {
          setRelated(all.filter((p: PortfolioItem) => p.id !== id).slice(0, 4))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data)
      })
      .catch(() => {})
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!item) {
    notFound()
  }

  const categoryTestimonialMap: Record<string, string> = {
    Wedding: 'Chioma & Ade',
    Corporate: 'James O.',
    Birthday: 'Amara E.',
    Conference: 'James O.',
    Decoration: 'Chioma & Ade',
  }
  const testimonialName = categoryTestimonialMap[item.category] || testimonials.find((t) => t.rating === 5)?.name
  const testimonial = testimonials.find((t) => t.name === testimonialName)

  return (
    <>
      <PageHero
        title={item.title}
        subtitle={item.category}
        image={item.images[0]}
      />

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: 'var(--site-primary)' }}
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative">
                {item.video ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video">
                    <iframe
                      src={getYoutubeEmbed(item.video)}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className={`relative rounded-2xl overflow-hidden cursor-pointer ${isLandscape ? 'aspect-video' : 'aspect-[3/4]'}`}
                      onClick={() => setFullscreen(true)}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        onLoad={(e) => {
                          const img = e.currentTarget
                          setIsLandscape(img.naturalWidth > img.naturalHeight)
                        }}
                      />
                    </div>

                    {fullscreen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setFullscreen(false)}
                      >
                        <div className="relative w-full h-full max-w-6xl max-h-[90vh] pointer-events-none">
                          <Image src={item.images[0]} alt={item.title} fill className="object-contain" />
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-4">
                  {settings?.portfolioDetailOverviewBadge || 'Project Overview'}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.05] mb-6">
                  {item.title}
                </h1>
                <p className="text-black/60 leading-relaxed text-lg mb-8">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 text-sm hover:-translate-y-0.5 shadow-lg shadow-black/10"
                    style={{ background: 'var(--site-primary)' }}
                  >
                    Book a Similar Event <HiArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 text-sm hover:-translate-y-0.5"
                    style={{ border: '1.5px solid var(--site-primary)', color: 'var(--site-primary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--site-primary)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--site-primary)' }}
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-12 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-3">
                {settings?.portfolioDetailHighlightsBadge || 'Event Highlights'}
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-black tracking-tight">
                {settings?.portfolioDetailHighlightsTitle || 'Key Details'}
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: HiCalendar, label: 'Event Date', value: new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
              { icon: HiUserGroup, label: 'Client', value: item.client },
              { icon: HiLocationMarker, label: 'Category', value: item.category },
              { icon: HiStar, label: 'Rating', value: '5.0 / 5.0' },
            ].map((h, i) => (
              <FadeIn key={h.label} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-black/10 transition-all duration-300 hover:shadow-md text-center">
                  <h.icon className="w-6 h-6 mx-auto mb-3" style={{ color: 'var(--site-primary)' }} />
                  <p className="text-2xl font-bold text-black">{h.value}</p>
                  <p className="text-xs text-black/40 mt-1 font-medium uppercase tracking-wider">{h.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-3">
                {settings?.portfolioDetailGalleryBadge || 'Gallery'}
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-black tracking-tight">
                {settings?.portfolioDetailGalleryTitle || 'Event Moments'}
              </h2>
              <p className="text-black/45 mt-3 max-w-lg mx-auto">
                {settings?.portfolioDetailGalleryDesc || 'A visual journey through the event experience.'}
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {sampleGallery.map((src, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                  <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {testimonial && (
        <section className="py-12 bg-black/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-white border border-black/[0.06] shadow-sm">
                <span className="text-5xl opacity-10" style={{ color: 'var(--site-primary)' }}>&ldquo;</span>
                <p className="text-lg md:text-xl text-black/70 leading-relaxed mt-2 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                    <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black text-sm">{testimonial.name}</p>
                    <p className="text-xs text-black/40">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/5 text-black/40 text-xs uppercase tracking-[0.15em] font-medium mb-3">
                {settings?.portfolioDetailRelatedBadge || 'Explore More'}
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-black tracking-tight">
                {settings?.portfolioDetailRelatedTitle || 'Related Events'}
              </h2>
              <p className="text-black/45 mt-3 max-w-lg mx-auto">
                {settings?.portfolioDetailRelatedDesc || 'Discover more of our featured work.'}
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.08}>
                <Link href={`/portfolio/${p.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-white border border-black/[0.06] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="relative h-48">
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-white/70 text-[10px] uppercase tracking-[0.15em] font-medium">{p.category}</span>
                        <h3 className="text-white font-bold text-sm mt-0.5">{p.title}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={settings?.portfolioDetailCtaImage || 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920'}
            alt=""
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
              {settings?.portfolioDetailCtaTitle || 'Let Us Create Your Dream Event'}
            </h2>
            <p className="text-white/50 mt-4 text-lg max-w-xl mx-auto">
              {settings?.portfolioDetailCtaDesc || 'Tell us your vision and we will bring it to life with the same passion and precision.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-xl shadow-black/30 hover:-translate-y-0.5"
                style={{ background: 'var(--site-primary)' }}
              >
                Book a Consultation <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white/70 font-medium rounded-xl transition-all duration-300 text-sm hover:text-white border border-white/15 hover:border-white/30 hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
