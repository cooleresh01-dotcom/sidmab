'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  HiShieldCheck,
  HiCollection,
  HiAcademicCap,
  HiLockClosed,
  HiGlobe,
  HiScale,
  HiInformationCircle,
  HiRefresh,
  HiMail,
} from 'react-icons/hi'

const sections = [
  { id: 'introduction', label: 'Introduction', icon: HiShieldCheck },
  { id: 'information', label: 'Information We Collect', icon: HiCollection },
  { id: 'usage', label: 'How We Use Your Info', icon: HiAcademicCap },
  { id: 'protection', label: 'Data Protection', icon: HiLockClosed },
  { id: 'disclosure', label: 'Third-Party Disclosure', icon: HiGlobe },
  { id: 'rights', label: 'Your Rights', icon: HiScale },
  { id: 'cookies', label: 'Cookies', icon: HiInformationCircle },
  { id: 'changes', label: 'Changes to Policy', icon: HiRefresh },
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

export default function PrivacyPolicy() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1920"
            alt="Privacy Policy"
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              How we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
              <HiShieldCheck className="w-4 h-4" />
              <span>Last updated: July 5, 2026</span>
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
                  Have questions about our policy?
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
            <SectionCard id="introduction" title="1. Introduction" icon={HiShieldCheck}>
              <p className="text-base-content/70 leading-relaxed">
                SIDMAB Events & Management (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
                is committed to protecting your privacy. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you visit our website or use our
                services. By accessing our platform, you consent to the practices described in this
                policy.
              </p>
            </SectionCard>

            <SectionCard id="information" title="2. Information We Collect" icon={HiCollection}>
              <p className="text-base-content/70 leading-relaxed mb-5">
                We may collect the following types of information when you interact with our website
                or services:
              </p>
              <div className="grid gap-3">
                {[
                  {
                    title: 'Personal Data',
                    desc: 'Name, email address, phone number, and other contact details you provide through our contact forms or booking system.',
                  },
                  {
                    title: 'Event Details',
                    desc: 'Information about your event preferences, dates, locations, and requirements.',
                  },
                  {
                    title: 'Usage Data',
                    desc: 'Information about how you interact with our website, including pages visited and time spent.',
                  },
                  {
                    title: 'Cookies',
                    desc: 'We use cookies to enhance your browsing experience and analyze site traffic.',
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

            <SectionCard id="usage" title="3. How We Use Your Information" icon={HiAcademicCap}>
              <p className="text-base-content/70 leading-relaxed mb-5">
                We use the collected information for the following purposes:
              </p>
              <ul className="space-y-3">
                {[
                  'To provide and manage our event planning and management services',
                  'To communicate with you regarding inquiries, bookings, and updates',
                  'To improve our website and services',
                  'To send promotional materials (with your consent)',
                  'To comply with legal obligations',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-base-content/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard id="protection" title="4. Data Protection" icon={HiLockClosed}>
              <p className="text-base-content/70 leading-relaxed">
                We implement appropriate security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction. These include encryption,
                secure servers, and strict access controls. However, no method of transmission over
                the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </SectionCard>

            <SectionCard id="disclosure" title="5. Third-Party Disclosure" icon={HiGlobe}>
              <p className="text-base-content/70 leading-relaxed">
                We do not sell, trade, or transfer your personal information to third parties without
                your consent, except as necessary to provide our services or as required by law.
                We may share data with trusted service providers who assist us in operating our website
                and conducting our business, provided they agree to keep your information confidential.
              </p>
            </SectionCard>

            <SectionCard id="rights" title="6. Your Rights" icon={HiScale}>
              <p className="text-base-content/70 leading-relaxed mb-5">
                Depending on your location, you may have the following rights regarding your personal
                data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'The right to access your personal data',
                  'The right to rectify inaccurate data',
                  'The right to delete your data',
                  'The right to restrict processing',
                  'The right to data portability',
                  'The right to withdraw consent',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 rounded-xl bg-base-200/30"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-sm text-base-content/70">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-base-content/70 leading-relaxed mt-5">
                To exercise any of these rights, please contact us using the information below.
              </p>
            </SectionCard>

            <SectionCard id="cookies" title="7. Cookies" icon={HiInformationCircle}>
              <p className="text-base-content/70 leading-relaxed">
                Our website uses cookies to improve your experience. You can choose to disable cookies
                in your browser settings. However, disabling cookies may affect the functionality of
                certain features on our website. We use both session cookies and persistent cookies
                to enhance your browsing experience.
              </p>
            </SectionCard>

            <SectionCard id="changes" title="8. Changes to This Policy" icon={HiRefresh}>
              <p className="text-base-content/70 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the &ldquo;Last updated&rdquo;
                date. We encourage you to review this policy periodically for any changes.
              </p>
            </SectionCard>

            <SectionCard id="contact" title="9. Contact Us" icon={HiMail}>
              <p className="text-base-content/70 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy, please reach out to us:
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
