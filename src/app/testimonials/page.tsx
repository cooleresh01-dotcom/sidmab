'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import { FaQuoteLeft, FaPlay } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import BackButton from '@/components/ui/BackButton'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar
          key={i}
          className={cn(
            'w-4 h-4',
            i < rating ? 'text-amber-400' : 'text-base-300'
          )}
        />
      ))}
    </div>
  )
}

function TestimonialsGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [testimonials, setTestimonials] = useState<typeof import('@/lib/data').testimonials>([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data)
      })
      .catch(() => {})
  }, [])

  const featuredTestimonial = testimonials[0]
  const restTestimonials = testimonials.slice(1)

  if (testimonials.length === 0) {
    return (
      <section ref={ref} className="section-padding">
        <div className="container mx-auto text-center py-16 text-base-content/40">
          Loading testimonials...
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Client Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base-content/70">
            Don&apos;t take our word for it — hear from the people we&apos;ve
            worked with.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 card bg-base-100 shadow-md p-8 md:p-10 relative overflow-hidden"
          >
            <FaQuoteLeft className="absolute top-6 right-6 text-6xl text-primary/5" />
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/10">
                <Image
                  src={featuredTestimonial.image}
                  alt={featuredTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {featuredTestimonial.name}
                </h3>
                <p className="text-sm text-base-content/60">
                  {featuredTestimonial.role}
                  {featuredTestimonial.company
                    ? `, ${featuredTestimonial.company}`
                    : ''}
                </p>
                <StarRating rating={featuredTestimonial.rating} />
              </div>
            </div>
            <p className="text-lg leading-relaxed text-base-content/80">
              &ldquo;{featuredTestimonial.content}&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-md relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaPlay className="w-6 h-6 text-white ml-0.5" />
              </div>
            </div>
            <div className="relative h-full min-h-[250px]">
              <Image
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600"
                alt="Video testimonial"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-medium">Watch Video Testimonial</p>
              <p className="text-white/70 text-sm">Hear from our happy clients</p>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              <FaQuoteLeft className="text-primary/15 text-2xl mb-3" />
              <p className="text-base-content/80 leading-relaxed mb-5">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-base-content/60 truncate">
                    {testimonial.role}
                    {testimonial.company
                      ? `, ${testimonial.company}`
                      : ''}
                  </p>
                </div>
                <StarRating rating={testimonial.rating} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    { value: '98%', label: 'Client Satisfaction' },
    { value: '1000+', label: 'Events Delivered' },
    { value: '250+', label: 'Repeat Clients' },
    { value: '4.9/5', label: 'Average Rating' },
  ]

  return (
    <section ref={ref} className="section-padding bg-base-200/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-base-content/60 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function TestimonialsPage() {
  return (
    <>
      <BackButton />
      <PageHero
        title="Testimonials"
        subtitle="Hear what our clients have to say about their SIDMAB experience."
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920"
        badge="Client Stories"
      />
      <TestimonialsGrid />
    </>
  )
}
