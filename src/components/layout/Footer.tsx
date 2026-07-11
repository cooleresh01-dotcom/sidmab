'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiChevronDown } from 'react-icons/hi'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import NewsletterForm from './NewsletterForm'

const services = [
  { name: 'Wedding Planning', href: '/services/wedding' },
  { name: 'Corporate Events', href: '/services/corporate' },
  { name: 'Birthday Events', href: '/services/birthday' },
  { name: 'Decoration', href: '/services/decoration' },
  { name: 'Rentals', href: '/services/rentals' },
  { name: 'Catering', href: '/services/catering' },
]

const defaultSettings = {
  siteName: 'SIDMAB',
  tagline: 'Events & Management',
  companyLogo: '',
  footerDescription: '',
  email: 'info@sidmab.com',
  phone: '+234 800 000 0000',
  address: '123 Event Street, Lagos, Nigeria',
  whatsapp: '+2348000000000',
  facebook: '#',
  twitter: '#',
  instagram: '#',
  linkedin: '#',
  youtube: '',
}

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings)
  const pathname = usePathname()
  const [openSection, setOpenSection] = useState<string | null>(null)

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

  const socialLinks = [
    { icon: FaFacebook, href: settings.facebook, color: '#1877F2' },
    { icon: FaInstagram, href: settings.instagram, color: '#E4405F' },
    { icon: FaLinkedin, href: settings.linkedin, color: '#0A66C2' },
    { icon: FaTwitter, href: settings.twitter, color: '#1DA1F2' },
  ].filter((s) => s.href && s.href !== '#')

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'CEO & Founder', href: '/ceo' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ]

  const sections = [
    { id: 'links', label: 'Quick Links', content: (
      <ul className="space-y-2">
        {quickLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">{link.name}</Link>
          </li>
        ))}
      </ul>
    )},
    { id: 'services', label: 'Services', content: (
      <ul className="space-y-2">
        {services.map((service) => (
          <li key={service.name}>
            <Link href={service.href} className="text-sm text-white/50 hover:text-white transition-colors">{service.name}</Link>
          </li>
        ))}
      </ul>
    )},
    { id: 'contact', label: 'Contact', content: (
      <>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <HiLocationMarker className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-sm text-white/50 leading-relaxed">{settings.address}</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
              <HiPhone className="w-2.5 h-2.5 text-white" />
            </div>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-sm text-white/50 hover:text-white transition-colors">{settings.phone}</a>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
              <HiMail className="w-2.5 h-2.5 text-white" />
            </div>
            <a href={`mailto:${settings.email}`} className="text-sm text-white/50 hover:text-white transition-colors">{settings.email}</a>
          </li>
        </ul>
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\s/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-[11px] font-medium text-white transition-all hover:brightness-110"
          style={{ background: '#25D366' }}
        >
          <FaWhatsapp className="w-2.5 h-2.5" />
          Chat on WhatsApp
        </a>
      </>
    )},
  ]

  return (
    <footer className="bg-black">
      <div className="container mx-auto">
        <div className="py-8 md:py-12 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-white">Stay Updated</h3>
              <p className="text-xs md:text-sm text-white/40">Subscribe for event tips, inspiration & exclusive offers.</p>
            </div>
            <div className="w-full max-w-md">
              <NewsletterForm dark />
            </div>
          </div>
        </div>
        <div className="py-8 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-5">
                {settings.companyLogo ? (
                  <img src={settings.companyLogo} alt={settings.siteName} className="h-10 w-auto" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                    {settings.siteName.charAt(0)}
                  </div>
                )}
              </div>
                <p className="text-sm leading-relaxed max-w-sm text-white/40">
                  {settings.footerDescription || 'Premier event planning & management — crafting unforgettable weddings, corporate events, and celebrations across Nigeria.'}
                </p>
              {socialLinks.length > 0 && (
                <div className="flex gap-3 mt-6 md:mt-8">
                  {socialLinks.map(({ icon: Icon, href, color }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 transition-all duration-300 hover:text-white"
                      style={{ '--hover-bg': color } as React.CSSProperties}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile accordion */}
            <div className="md:hidden">
              <div className="flex gap-4">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
                    className="flex items-center gap-1 text-xs uppercase tracking-widest text-white font-semibold transition-colors hover:text-white/70"
                  >
                    {s.label}
                    <HiChevronDown className={`w-3 h-3 transition-transform duration-200 ${openSection === s.id ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {openSection && (
                  <motion.div
                    key={openSection}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-3"
                  >
                    {sections.find((s) => s.id === openSection)?.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop columns */}
            {sections.map((s) => (
              <div key={s.id} className="hidden md:block lg:col-span-2">
                <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-white">{s.label}</h4>
                {s.content}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} {settings.siteName} {settings.tagline}. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="text-sm text-white/30 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/30 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
