'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useInView } from 'framer-motion'
import { HiPhone, HiMail, HiLocationMarker, HiClock, HiPaperAirplane } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import PageHero from '@/components/ui/PageHero'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const defaultSettings = {
  email: 'info@sidmab.com',
  email2: 'bookings@sidmab.com',
  phone: '+234 800 000 0000',
  phone2: '+234 800 000 0001',
  address: '123 Victoria Island, Lagos, Nigeria',
  mapAddress: '123 Victoria Island, Lagos, Nigeria',
  mapEmbedUrl: '',
  officeHours: 'Mon-Fri: 8AM - 6PM\nSat: 9AM - 4PM',
  whatsapp: '+2348000000000',
}



function ContactInfoCards({ settings }: { settings: typeof defaultSettings }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const contactInfo = [
    {
      icon: HiPhone,
      title: 'Phone',
      details: [settings.phone, settings.phone2].filter(Boolean),
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
    },
    {
      icon: HiMail,
      title: 'Email',
      details: [settings.email, settings.email2].filter(Boolean),
      href: `mailto:${settings.email}`,
    },
    {
      icon: HiLocationMarker,
      title: 'Address',
      details: settings.address.split('\n').filter(Boolean),
    },
    {
      icon: HiClock,
      title: 'Office Hours',
      details: settings.officeHours.split('\n').filter(Boolean),
    },
  ]

  return (
    <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {contactInfo.map((info, index) => {
        const Icon = info.icon
        return (
          <motion.div
            key={info.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card bg-base-100 shadow-sm border border-base-200 p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{info.title}</h3>
            {info.details.map((d, i) => (
              <p key={`${info.title}-${i}`} className="text-sm text-base-content/70">{d}</p>
            ))}
            {info.href && (
              <a
                href={info.href}
                className="text-primary text-sm font-medium mt-2 inline-block hover:underline"
              >
                {info.title === 'Phone' ? 'Call Now' : 'Send Email'}
              </a>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function ContactForm() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch {}
    reset()
  }

  return (
    <div ref={ref} className="card bg-base-100 shadow-sm border border-base-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

        {isSubmitSuccessful ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <HiPaperAirplane className="w-8 h-8 text-success rotate-45" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
            <p className="text-base-content/70">We will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name *</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <span className="text-error text-xs mt-1">{errors.name.message}</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email *</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="input input-bordered w-full"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <span className="text-error text-xs mt-1">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input input-bordered w-full"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Subject *</span>
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  className="input input-bordered w-full"
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <span className="text-error text-xs mt-1">{errors.subject.message}</span>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Message *</span>
              </label>
              <textarea
                {...register('message')}
                className="textarea textarea-bordered w-full h-32"
                placeholder="Tell us about your event..."
              />
              {errors.message && (
                <span className="text-error text-xs mt-1">{errors.message.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-white w-full"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

function MapPlaceholder({ mapEmbedUrl, address }: { mapEmbedUrl: string; address: string }) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement>(null)
  const isInView = useInView(ref, { once: true })

  if (mapEmbedUrl) {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden h-80"
      >
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </motion.div>
    )
  }

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`
  return (
    <motion.a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="card bg-base-200 shadow-sm border border-base-200 p-8 h-80 flex items-center justify-center hover:shadow-md transition-shadow group"
    >
      <div className="text-center">
        <HiLocationMarker className="w-12 h-12 text-base-content/30 mx-auto mb-3 group-hover:text-primary transition-colors" />
        <p className="text-base-content/50 font-medium group-hover:text-primary transition-colors">Open in Google Maps</p>
        <p className="text-sm text-base-content/40 mt-1">{address}</p>
      </div>
    </motion.a>
  )
}

function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center mt-12"
    >
      <a
        href={`https://wa.me/${whatsapp.replace(/\s/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-lg bg-green-500 hover:bg-green-600 text-white rounded-full gap-3"
      >
        <FaWhatsapp className="w-6 h-6" />
        Chat with Us on WhatsApp
      </a>
      <p className="text-sm text-base-content/50 mt-3">Quick response during business hours</p>
    </motion.div>
  )
}

function FAQLink() {
  return (
    <section className="section-padding bg-base-200/30">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Quick Answers</h2>
          <p className="text-base-content/70 mb-6">
            Many common questions are answered in our FAQ section.
          </p>
          <Link href="/faq" className="btn btn-outline rounded-full">
            View FAQs
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function ContactPage() {
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
      <PageHero
        title="Contact Us"
        subtitle="We would love to hear from you. Reach out and let us help plan your perfect event."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920"
        badge="Get in Touch"
      />
      <section className="section-padding">
        <div className="container mx-auto">
          <ContactInfoCards settings={settings} />
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <MapPlaceholder mapEmbedUrl={settings.mapEmbedUrl} address={settings.mapAddress} />
            </div>
          </div>
          <WhatsAppButton whatsapp={settings.whatsapp} />
        </div>
      </section>
      <FAQLink />
    </>
  )
}
