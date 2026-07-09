'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import PageHero from '@/components/ui/PageHero'
import { services as fallbackServices } from '@/lib/data'

interface ServiceItem {
  id: string
  title: string
  slug: string
  tagline: string
  description: string
  icon: string
  image: string
  features: string[]
}

function ServicesGrid() {
  const [services, setServices] = useState<ServiceItem[]>([])

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data.map((s: any) => ({
            id: s.id,
            title: s.title,
            slug: s.slug,
            tagline: s.tagline,
            description: s.description,
            icon: s.icon,
            image: s.image,
            features: [],
          })))
        } else {
          setServices(fallbackServices)
        }
      })
      .catch(() => setServices(fallbackServices))
  }, [])

  if (services.length === 0) {
    return (
      <section className="section-padding">
        <div className="container mx-auto text-center py-12">
          <div className="loading loading-spinner loading-lg text-primary" />
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            End-to-End Event Solutions
          </h2>
          <p className="text-base-content/70">
            From intimate gatherings to grand celebrations, we handle every
            detail with precision and creativity.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <figure className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 text-3xl">
                  {service.icon}
                </div>
              </figure>
              <div className="card-body p-5">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {service.tagline}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="btn btn-ghost btn-sm text-primary gap-1 mt-3 px-0 hover:gap-2 transition-all"
                >
                  Learn More <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920"
          alt="Contact"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80" />
      </div>
      <div className="relative z-10 container mx-auto text-center text-primary-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            Let&apos;s discuss your event and create a custom package that fits
            your vision and budget.
          </p>
          <Link
            href="/book"
            className="btn btn-lg bg-white text-primary hover:bg-white/90 rounded-full px-8 border-none"
          >
            Book a Free Consultation
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive event solutions tailored to bring your vision to life."
        image="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920"
        badge="What We Offer"
      />
      <ServicesGrid />
      <CTASection />
    </>
  )
}
