'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useInView } from 'framer-motion'
import { HiBriefcase, HiLocationMarker, HiClock, HiUserGroup, HiAcademicCap, HiHeart, HiGlobe, HiCurrencyDollar, HiPaperAirplane } from 'react-icons/hi'
import { careerOpenings } from '@/lib/data'
import PageHero from '@/components/ui/PageHero'

const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  position: z.string().min(1, 'Please select a position'),
  message: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

const benefits = [
  { icon: HiCurrencyDollar, title: 'Competitive Salary', desc: 'Attractive compensation packages' },
  { icon: HiHeart, title: 'Health Insurance', desc: 'Comprehensive medical coverage' },
  { icon: HiUserGroup, title: 'Team Culture', desc: 'Collaborative and supportive environment' },
  { icon: HiAcademicCap, title: 'Training', desc: 'Continuous learning opportunities' },
  { icon: HiGlobe, title: 'Remote Options', desc: 'Flexible work arrangements' },
  { icon: HiClock, title: 'Paid Time Off', desc: 'Generous leave policies' },
]

const cultureImages = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
]



function CultureSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Culture</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Life at SIDMAB</h2>
          <p className="text-base-content/70">
            We believe in fostering creativity, collaboration, and growth. Our team is our greatest asset.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {cultureImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative h-64 rounded-xl overflow-hidden"
            >
              <Image src={src} alt={`Culture ${i + 1}`} fill className="object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-base-200/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Benefits</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Why Join Us</h2>
          <p className="text-base-content/70">We take care of our team with great benefits and a positive work environment.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card bg-base-100 shadow-sm border border-base-200 p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-base-content/70">{benefit.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function OpenPositions() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Open Positions</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Join Our Team</h2>
          <p className="text-base-content/70">Explore current opportunities and find your dream role.</p>
        </motion.div>

        <div className="space-y-6">
          {careerOpenings.map((job, index) => (
            <motion.div
              key={`${job.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
            >
              <div className="card-body p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-sm text-base-content/60">
                        <HiLocationMarker className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-base-content/60">
                        <HiBriefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-base-content/60">
                        <HiUserGroup className="w-4 h-4" />
                        {job.department}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/70 mt-3">{job.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      const form = document.getElementById('application-form')
                      if (form) {
                        const posInput = form.querySelector<HTMLSelectElement>('[name="position"]')
                        if (posInput) posInput.value = job.title
                        form.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="btn btn-primary text-white flex-shrink-0"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ApplicationForm() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    await new Promise((r) => setTimeout(r, 1500))
    console.log('Application:', data)
    reset()
  }

  return (
    <section ref={ref} id="application-form" className="section-padding bg-base-200/30">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Submit Your Application</h2>

          {isSubmitSuccessful ? (
            <div className="card bg-base-100 shadow-sm border border-base-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <HiPaperAirplane className="w-8 h-8 text-success rotate-45" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Received!</h3>
              <p className="text-base-content/70">We will review your application and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-sm border border-base-200 p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Name *</span></label>
                  <input type="text" {...register('name')} className="input input-bordered w-full" placeholder="Your full name" />
                  {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Email *</span></label>
                  <input type="email" {...register('email')} className="input input-bordered w-full" placeholder="your@email.com" />
                  {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Phone *</span></label>
                  <input type="tel" {...register('phone')} className="input input-bordered w-full" placeholder="+234 800 000 0000" />
                  {errors.phone && <span className="text-error text-xs mt-1">{errors.phone.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Position *</span></label>
                  <select {...register('position')} className="select select-bordered w-full">
                    <option value="">Select a position</option>
                    {careerOpenings.map((job) => (
                      <option key={job.title} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                  {errors.position && <span className="text-error text-xs mt-1">{errors.position.message}</span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Cover Letter / Message</span></label>
                <textarea {...register('message')} className="textarea textarea-bordered w-full h-32" placeholder="Tell us why you would be a great fit..." />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary text-white w-full">
                {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Submit Application'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Careers at SIDMAB"
        subtitle="Come grow with us. Explore opportunities to be part of something extraordinary."
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920"
        badge="Join Our Team"
      />
      <CultureSection />
      <BenefitsSection />
      <OpenPositions />
      <ApplicationForm />
    </>
  )
}
