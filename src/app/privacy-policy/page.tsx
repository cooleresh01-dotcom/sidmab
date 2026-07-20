'use client'

import { useRef, useState, useEffect } from 'react'
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  introduction: HiShieldCheck,
  information: HiCollection,
  usage: HiAcademicCap,
  protection: HiLockClosed,
  disclosure: HiGlobe,
  rights: HiScale,
  cookies: HiInformationCircle,
  changes: HiRefresh,
  contact: HiMail,
}

interface Section {
  id: string
  title: string
  content: string
}

const defaultSections: Section[] = [
  { id: 'introduction', title: '1. Introduction', content: 'SIDMAB Events & Management ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By accessing our platform, you consent to the practices described in this policy.' },
  { id: 'information', title: '2. Information We Collect', content: 'We may collect the following types of information when you interact with our website or services:\n\n- Personal Data: Name, email address, phone number, and other contact details you provide through our contact forms or booking system.\n- Event Details: Information about your event preferences, dates, locations, and requirements.\n- Usage Data: Information about how you interact with our website, including pages visited and time spent.\n- Cookies: We use cookies to enhance your browsing experience and analyze site traffic.' },
  { id: 'usage', title: '3. How We Use Your Information', content: 'We use the collected information for the following purposes:\n\n- To provide and manage our event planning and management services\n- To communicate with you regarding inquiries, bookings, and updates\n- To improve our website and services\n- To send promotional materials (with your consent)\n- To comply with legal obligations' },
  { id: 'protection', title: '4. Data Protection', content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These include encryption, secure servers, and strict access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.' },
  { id: 'disclosure', title: '5. Third-Party Disclosure', content: 'We do not sell, trade, or transfer your personal information to third parties without your consent, except as necessary to provide our services or as required by law. We may share data with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.' },
  { id: 'rights', title: '6. Your Rights', content: 'Depending on your location, you may have the following rights regarding your personal data:\n\n- The right to access your personal data\n- The right to rectify inaccurate data\n- The right to delete your data\n- The right to restrict processing\n- The right to data portability\n- The right to withdraw consent\n\nTo exercise any of these rights, please contact us using the information below.' },
  { id: 'cookies', title: '7. Cookies', content: 'Our website uses cookies to improve your experience. You can choose to disable cookies in your browser settings. However, disabling cookies may affect the functionality of certain features on our website. We use both session cookies and persistent cookies to enhance your browsing experience.' },
  { id: 'changes', title: '8. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.' },
  { id: 'contact', title: '9. Contact Us', content: 'If you have any questions about this Privacy Policy, please reach out to us at info@sidmab.com or call +234 800 000 0000.' },
]

function ContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n').filter(Boolean)
  const isBulletList = lines.every((l) => l.trimStart().startsWith('- '))

  if (isBulletList) {
    return (
      <ul className="space-y-3">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-base-content/70">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
            {line.trimStart().replace(/^- /, '')}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          return null
        }
        return (
          <p key={i} className="text-base-content/70 leading-relaxed">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

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
  const [sections, setSections] = useState<Section[]>(defaultSections)
  const [lastUpdated, setLastUpdated] = useState('July 5, 2026')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.privacyContent) {
          try {
            const parsed = JSON.parse(data.privacyContent)
            if (parsed.sections) setSections(parsed.sections)
            if (parsed.lastUpdated) setLastUpdated(parsed.lastUpdated)
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setMounted(true))
  }, [])

  const tocSections = mounted ? sections.map((s) => ({
    id: s.id,
    label: s.title.replace(/^\d+\.\s*/, ''),
    icon: iconMap[s.id] || HiShieldCheck,
  })) : defaultSections.map((s) => ({
    id: s.id,
    label: s.title.replace(/^\d+\.\s*/, ''),
    icon: iconMap[s.id] || HiShieldCheck,
  }))

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
              <span suppressHydrationWarning>Last updated: {mounted ? lastUpdated : 'July 5, 2026'}</span>
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
              <h3 className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-6" suppressHydrationWarning>
                On This Page
              </h3>
              <nav className="flex flex-col gap-1" suppressHydrationWarning>
                {tocSections.map(({ id, label, icon: Icon }) => (
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
            {(mounted ? sections : defaultSections).map((section) => (
              <SectionCard
                key={section.id}
                id={section.id}
                title={section.title}
                icon={iconMap[section.id] || HiShieldCheck}
              >
                <ContentRenderer content={section.content} />
              </SectionCard>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
