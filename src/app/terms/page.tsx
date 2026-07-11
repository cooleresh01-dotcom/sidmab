'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  HiDocumentText,
  HiUserGroup,
  HiCash,
  HiExclamationCircle,
  HiShieldCheck,
  HiRefresh,
  HiMail,
  HiGlobe,
  HiScale,
} from 'react-icons/hi'
import BackButton from '@/components/ui/BackButton'

const sections = [
  { id: 'acceptance', label: 'Acceptance of Terms', icon: HiDocumentText },
  { id: 'services', label: 'Our Services', icon: HiUserGroup },
  { id: 'bookings', label: 'Bookings & Payments', icon: HiCash },
  { id: 'cancellation', label: 'Cancellation & Refunds', icon: HiExclamationCircle },
  { id: 'liability', label: 'Limitation of Liability', icon: HiShieldCheck },
  { id: 'ip', label: 'Intellectual Property', icon: HiGlobe },
  { id: 'privacy', label: 'Privacy', icon: HiScale },
  { id: 'changes', label: 'Changes to Terms', icon: HiRefresh },
  { id: 'contact', label: 'Contact Us', icon: HiMail },
]

function SectionCard({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24 luxury-card p-8 md:p-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

export default function TermsPage() {
  return (
    <>
      <BackButton />
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920"
            alt="Terms of Service"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4 border border-white/20">
              Legal
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
              <HiDocumentText className="w-4 h-4" />
              <span>Last updated: July 10, 2026</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-100 to-transparent" />
      </section>

      <div className="container mx-auto section-padding">
        <div className="flex gap-12">
          {/* Table of Contents — desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-6">
                On This Page
              </h3>
              <nav className="flex flex-col gap-1">
                {sections.map(({ id, label, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-base-content/60 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 gold-divider mb-6" />

              <div className="bg-base-200/50 rounded-2xl p-5">
                <p className="text-sm font-semibold mb-1">Need Help?</p>
                <p className="text-xs text-base-content/50 mb-3">
                  Have questions about our terms?
                </p>
                <a
                  href="mailto:info@sidmab.com"
                  className="btn-primary text-white text-xs px-4 py-2 rounded-full inline-block"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            <SectionCard id="acceptance" title="1. Acceptance of Terms" icon={HiDocumentText}>
              <p className="text-base-content/70 leading-relaxed">
                By accessing or using the services provided by SIDMAB Events & Management
                (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you agree to be
                bound by these Terms of Service. If you do not agree to all of these terms, you
                may not use our services. These terms apply to all visitors, clients, and users
                of our website and services.
              </p>
            </SectionCard>

            <SectionCard id="services" title="2. Our Services" icon={HiUserGroup}>
              <p className="text-base-content/70 leading-relaxed mb-5">
                We provide event planning and management services including but not limited to:
              </p>
              <div className="grid gap-3">
                {[
                  {
                    title: 'Event Planning',
                    desc: 'Full-service event planning for weddings, corporate events, birthdays, and special celebrations.',
                  },
                  {
                    title: 'Decoration & Design',
                    desc: 'Creative event decoration, staging, and environmental design.',
                  },
                  {
                    title: 'Catering Coordination',
                    desc: 'Coordination of catering services and menu planning.',
                  },
                  {
                    title: 'Equipment Rentals',
                    desc: 'Rental of event equipment, furniture, and decor items.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl bg-base-200/30"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-sm">{item.title}:</strong>{' '}
                      <span className="text-sm text-base-content/60">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="bookings" title="3. Bookings & Payments" icon={HiCash}>
              <p className="text-base-content/70 leading-relaxed mb-5">
                When you book our services, the following terms apply:
              </p>
              <ul className="space-y-3">
                {[
                  'A deposit is required to confirm your booking. The deposit amount will be communicated during the booking process.',
                  'Full payment terms and schedules will be outlined in your service agreement.',
                  'Prices are subject to change without notice until a booking is confirmed with a deposit.',
                  'Additional services or changes to the agreed scope may incur extra charges.',
                  'All payments should be made using the agreed payment methods within the specified timeframes.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-base-content/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard id="cancellation" title="4. Cancellation & Refunds" icon={HiExclamationCircle}>
              <p className="text-base-content/70 leading-relaxed mb-5">
                Our cancellation policy is as follows:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-base-content/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <strong>30+ days before event:</strong> Full refund minus administrative fees.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-base-content/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <strong>15-29 days before event:</strong> 50% refund of the deposit.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-base-content/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <strong>Less than 15 days before event:</strong> No refund. The deposit is non-refundable.
                  </div>
                </li>
              </ul>
              <p className="text-base-content/70 leading-relaxed mt-5">
                Cancellations must be made in writing via email. Refunds, if applicable, will be
                processed within 14 business days.
              </p>
            </SectionCard>

            <SectionCard id="liability" title="5. Limitation of Liability" icon={HiShieldCheck}>
              <p className="text-base-content/70 leading-relaxed">
                SIDMAB Events & Management shall not be held liable for any indirect, incidental,
                special, or consequential damages arising from the use of our services. Our total
                liability shall not exceed the amount paid by you for the specific service in
                question. We are not responsible for events beyond our reasonable control, including
                but not limited to natural disasters, pandemics, government restrictions, or force
                majeure events.
              </p>
            </SectionCard>

            <SectionCard id="ip" title="6. Intellectual Property" icon={HiGlobe}>
              <p className="text-base-content/70 leading-relaxed">
                All content on this website, including text, images, logos, graphics, and designs,
                is the property of SIDMAB Events & Management and is protected by copyright laws.
                You may not reproduce, distribute, or create derivative works from our content
                without written permission. Event photos taken by our team may be used for
                marketing purposes unless you opt out in writing.
              </p>
            </SectionCard>

            <SectionCard id="privacy" title="7. Privacy" icon={HiScale}>
              <p className="text-base-content/70 leading-relaxed">
                Your use of our services is also governed by our{' '}
                <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </a>
                . By using our services, you consent to the collection and use of your information
                as described in the Privacy Policy. We are committed to protecting your personal
                data and handling it with care.
              </p>
            </SectionCard>

            <SectionCard id="changes" title="8. Changes to Terms" icon={HiRefresh}>
              <p className="text-base-content/70 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will
                be effective immediately upon posting on this page. Your continued use of our
                services after any changes constitutes your acceptance of the new terms. We
                encourage you to review this page periodically.
              </p>
            </SectionCard>

            <SectionCard id="contact" title="9. Contact Us" icon={HiMail}>
              <p className="text-base-content/70 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please reach out to us:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Email',
                    value: 'info@sidmab.com',
                    href: 'mailto:info@sidmab.com',
                  },
                  {
                    label: 'Phone',
                    value: '+234 800 000 0000',
                    href: 'tel:+2348000000000',
                  },
                  {
                    label: 'Address',
                    value: 'Lagos, Nigeria',
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label} className="p-5 rounded-xl bg-base-200/30 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-primary font-medium hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-base-content/70">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  )
}
