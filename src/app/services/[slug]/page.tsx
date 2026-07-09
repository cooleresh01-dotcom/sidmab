'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { HiCheck, HiArrowRight } from 'react-icons/hi'
import { formatPrice } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import { services as fallbackServices } from '@/lib/data'

interface Package {
  id: string
  name: string
  price: number
  description: string
  features: string[]
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface ServiceData {
  id: string
  title: string
  slug: string
  tagline: string
  description: string
  icon: string
  image: string
  features: string[]
  gallery: string[]
  packages: Package[]
  faqs: FAQ[]
}

function ServiceHero({ service }: { service: ServiceData }) {
  return (
    <div className="relative">
      <PageHero
        title={service.title}
        subtitle={service.tagline}
        image={service.image}
        badge={service.icon}
        height="tall"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Link href="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg">
            Book Now <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </PageHero>
    </div>
  )
}

function OverviewSection({ service }: { service: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const features = service.features?.length > 0
    ? service.features
    : ['Full planning & coordination', 'Vendor management', 'Timeline planning', 'Guest management', 'On-day coordination', 'Post-event support']

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Overview</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">About This Service</h2>
            <p className="text-base-content/70 leading-relaxed mb-8">{service.description}</p>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <HiCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-96 rounded-2xl overflow-hidden"
          >
            <Image src={service.image} alt={service.title} fill className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function GallerySection({ images }: { images: string[] }) {
  const gallery = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
  ]

  return (
    <section className="section-padding bg-base-200/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Gallery</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Our Work</h2>
          <p className="text-base-content/70">A glimpse of what we have delivered for our clients.</p>
        </motion.div>

        {gallery.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative h-64 rounded-xl overflow-hidden"
              >
                <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function PackagesSection({ packages }: { packages: Package[] }) {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Packages</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Our Packages</h2>
          <p className="text-base-content/70">Choose the package that best fits your needs.</p>
        </motion.div>

        {packages.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, index) => {
              const popular = index === 1
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`card border-2 relative ${
                    popular ? 'border-primary shadow-xl scale-105' : 'border-base-200 shadow-sm'
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="card-body p-6">
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-sm text-base-content/70 mt-1">{pkg.description}</p>
                    <p className="text-3xl font-bold mt-4">{formatPrice(pkg.price)}</p>
                    <ul className="space-y-2 mt-6">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <HiCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/book"
                      className={`btn mt-6 w-full ${popular ? 'btn-primary text-white' : 'btn-outline'}`}
                    >
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function FAQsSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="section-padding bg-base-200/30">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQs</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Frequently Asked Questions</h2>
        </motion.div>

        {faqs.length > 0 && (
          <div className="join join-vertical w-full">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="collapse collapse-arrow join-item border border-base-300"
              >
                <input type="radio" name="service-faq" defaultChecked={i === 0} />
                <div className="collapse-title font-semibold">{faq.question}</div>
                <div className="collapse-content text-sm text-base-content/70">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BookingCTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920"
          alt="Book"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/70" />
      </div>
      <div className="relative z-10 container mx-auto text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
            Let us bring your vision to life. Book a free consultation with our team today.
          </p>
          <Link href="/book" className="btn btn-primary btn-lg text-white rounded-full">
            Book a Consultation <HiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [related, setRelated] = useState<ServiceData[]>([])

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRelated(data.filter((s: any) => s.slug !== currentSlug).slice(0, 4))
        }
      })
      .catch(() => {})
  }, [currentSlug])

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Related</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Other Services</h2>
          <p className="text-base-content/70">Explore more of what we offer.</p>
        </motion.div>

        {related.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 group h-full block"
                >
                  <figure className="relative h-44 overflow-hidden bg-base-200">
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </figure>
                  <div className="card-body p-4">
                    <div className="text-2xl mb-1">{service.icon}</div>
                    <h3 className="font-semibold">{service.title}</h3>
                    {service.tagline && (
                      <p className="text-sm text-base-content/70 line-clamp-1">{service.tagline}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [service, setService] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((s: any) => s.slug === slug)
          if (found) {
            setService(found)
          } else {
            const fallback = fallbackServices.find((s) => s.slug === slug)
            if (fallback) {
              setService({
                id: fallback.id,
                title: fallback.title,
                slug: fallback.slug,
                tagline: fallback.tagline,
                description: fallback.description,
                icon: fallback.icon,
                image: fallback.image,
                features: [],
                gallery: [],
                packages: [],
                faqs: [],
              })
            }
          }
        } else {
          const fallback = fallbackServices.find((s) => s.slug === slug)
          if (fallback) {
            setService({
              id: fallback.id,
              title: fallback.title,
              slug: fallback.slug,
              tagline: fallback.tagline,
              description: fallback.description,
              icon: fallback.icon,
              image: fallback.image,
              features: [],
              gallery: [],
              packages: [],
              faqs: [],
            })
          }
        }
      })
      .catch(() => {
        const fallback = fallbackServices.find((s) => s.slug === slug)
        if (fallback) {
          setService({
            id: fallback.id,
            title: fallback.title,
            slug: fallback.slug,
            tagline: fallback.tagline,
            description: fallback.description,
            icon: fallback.icon,
            image: fallback.image,
            features: [],
            gallery: [],
            packages: [],
            faqs: [],
          })
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!service) {
    notFound()
  }

  return (
    <>
      <ServiceHero service={service} />
      <OverviewSection service={service} />
      <GallerySection images={service.gallery} />
      <PackagesSection packages={service.packages} />
      <FAQsSection faqs={service.faqs} />
      <BookingCTA />
      <RelatedServices currentSlug={slug} />
    </>
  )
}
