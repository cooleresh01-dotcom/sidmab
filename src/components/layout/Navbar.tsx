'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiPhone, HiMail } from 'react-icons/hi'
import { FaFacebook, FaXTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa6'
import { cn } from '@/lib/utils'
import { useSettings } from '@/hooks/useSettings'
import CompanyLogo from '@/components/ui/CompanyLogo'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

function SocialPanel({ show, onClose, socialUrls }: { show: boolean; onClose: () => void; socialUrls: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    if (show) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [show, onClose])

  const socials = [
    { icon: FaFacebook, key: 'facebook', label: 'Facebook', color: '#1877F2', id: '@sidmabevents' },
    { icon: InstagramIcon, key: 'instagram', label: 'Instagram', color: '#E4405F', id: '@sidmab_events' },
    { icon: FaXTwitter, key: 'twitter', label: 'X', color: '#000000', id: '@sidmab_ng' },
    { icon: FaLinkedinIn, key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', id: 'SIDMAB Events' },
    { icon: FaYoutube, key: 'youtube', label: 'YouTube', color: '#FF0000', id: 'SIDMAB TV' },
  ]

  return (
    <div ref={ref} className="flex flex-col items-start">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onClose} className="hover:opacity-80 transition-opacity shrink-0">
          <motion.div
            animate={{ rotate: show ? 90 : 180 }}
            transition={{ type: 'spring', stiffness: 180, damping: 13 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-white to-gray-100 shadow-[0_4px_0_0_#cbd5e1,0_6px_12px_-4px_rgba(0,0,0,0.15)] active:shadow-[0_1px_0_0_#cbd5e1] active:translate-y-[3px]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700" fill="currentColor">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
            </svg>
          </motion.div>
        </button>
        <AnimatePresence>
          {show && (
            <motion.p
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs uppercase tracking-[0.3em] text-gray-700 overflow-hidden whitespace-nowrap"
            >
              Follow Us
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={socialUrls[s.key] || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors group"
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: s.color, color: '#fff' }}
                >
                  <s.icon className="w-4 h-4" />
                </span>
                <span className="text-sm whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[160px] transition-all duration-300">
                  {s.id}
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSocial, setShowSocial] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const { settings } = useSettings()

  const companyLogo = settings?.companyLogo || ''
  const companyName = settings?.siteName || 'SIDMAB'
  const socialUrls = {
    facebook: settings?.facebook || 'https://facebook.com/sidmab',
    instagram: settings?.instagram || 'https://instagram.com/sidmab',
    twitter: settings?.twitter || 'https://twitter.com/sidmab',
    linkedin: settings?.linkedin || 'https://linkedin.com/company/sidmab',
    youtube: settings?.youtube || '',
  }
  const phone = settings?.phone || '+234 800 000 0000'
  const email = settings?.email || 'info@sidmab.com'

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > (window.innerWidth < 768 ? 150 : 300))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Floating logo + menu (hero area) */}
      <Link href="/" className="fixed top-6 left-6 z-50 flex items-center gap-3">
        <CompanyLogo className="h-14 w-auto" width={56} height={56} />
      </Link>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-6 right-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500',
          isOpen ? 'bg-white text-black rotate-90' : 'text-white'
        )}
        style={!isOpen ? { background: 'var(--site-primary)' } : {}}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {isOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
        </motion.div>
      </button>

      {/* Sticky navbar after scrolling past hero */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md shadow-sm border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <CompanyLogo className="h-14 w-auto" width={56} height={56} />
              </Link>

              <div className="flex items-center gap-4">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <HiPhone className="w-4 h-4" />
                  <span className="text-sm">{phone}</span>
                </a>
                <a href={`mailto:${email}`} className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <HiMail className="w-4 h-4" />
                  <span className="text-sm">{email}</span>
                </a>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <HiMenu className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full page menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative h-full flex flex-col lg:flex-row">
              <div className="flex-1 flex flex-col px-8 md:px-20 lg:px-28">
                <div className="flex-1" />

                <div className="flex gap-12 items-start">
                  <div className="relative mt-[132px]">
                    <SocialPanel show={showSocial} onClose={() => setShowSocial(!showSocial)} socialUrls={socialUrls} />
                  </div>

                  <div>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-6">
                      — Navigation
                    </motion.p>

                    <nav className="space-y-0">
                      {navItems.map((item, i) => {
                        const active = pathname === item.href
                        return (
                          <motion.div key={item.name} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}>
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'block py-2.5 px-3 -mx-3 rounded-xl transition-colors text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
                                active ? 'text-white' : 'text-gray-700 hover:text-gray-900'
                              )}
                              style={active ? { background: 'var(--site-primary)' } : {}}
                            >
                              {item.name}
                            </Link>
                            <div className="ml-0 h-px bg-gray-100 last:hidden" />
                          </motion.div>
                        )
                      })}
                    </nav>

                    {session && (
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-4">— Account</p>
                        <Link href="/account" onClick={() => setIsOpen(false)} className="block py-2.5 px-3 -mx-3 rounded-xl text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-700 hover:text-gray-900">
                          My Account
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex-1" />

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }} className="mb-8 flex items-center justify-center gap-6">
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-3 px-6 py-3.5 text-white text-sm font-medium rounded-xl transition-all shadow-lg hover:brightness-110"
                    style={{ background: 'var(--site-primary)' }}
                  >
                    Book a Consultation
                    <HiMail className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>

              {/* Right - Info panel */}
              <div className="lg:w-96 bg-black lg:bg-gray-950 relative overflow-hidden">
                <div className="relative z-10 p-10 md:p-14 flex flex-col justify-center min-h-full">
                  <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }}>
                    <div className="flex items-center gap-4 mb-12">
                      <CompanyLogo className="h-10 w-auto" width={40} height={40} />
                    </div>

                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">Contact</p>
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group">
                          <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <HiPhone className="w-4 h-4" />
                          </span>
                          {phone}
                        </a>
                        <a href={`mailto:${email}`} className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group mt-3">
                          <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <HiMail className="w-4 h-4" />
                          </span>
                          {email}
                        </a>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                      <p className="text-xs text-white/40 leading-relaxed">
                        Premier event planning and management services crafting unforgettable experiences across Nigeria.
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/[0.02] rounded-full blur-2xl" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side contact info (desktop) */}
      {!pathname.startsWith('/dashboard') && (
        <div className="hidden lg:fixed lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:flex lg:flex-col lg:items-center lg:gap-6 lg:z-30">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="relative group">
            <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform" style={{ background: 'color-mix(in srgb, var(--site-primary) 15%, transparent)' }} />
            <div className="relative w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-[var(--site-primary)] transition-all">
              <HiPhone className="w-4 h-4" />
            </div>
          </a>
          <a href={`mailto:${email}`} className="relative group">
            <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform" style={{ background: 'color-mix(in srgb, var(--site-primary) 15%, transparent)' }} />
            <div className="relative w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-[var(--site-primary)] transition-all">
              <HiMail className="w-4 h-4" />
            </div>
          </a>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
        </div>
      )}
    </>
  )
}
