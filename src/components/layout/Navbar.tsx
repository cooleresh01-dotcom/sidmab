'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiPhone, HiMail, HiLocationMarker, HiClock, HiArrowRight } from 'react-icons/hi'
import { FaFacebook, FaXTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa6'
import { cn } from '@/lib/utils'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const navItems = [
  { name: 'Home', href: '/', preview: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=500&fit=crop' },
  { name: 'About', href: '/about', preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=500&fit=crop' },
  { name: 'Services', href: '/services', preview: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=500&fit=crop' },
  { name: 'Portfolio', href: '/portfolio', preview: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=500&fit=crop' },
  { name: 'Gallery', href: '/gallery', preview: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=500&fit=crop' },
  { name: 'Blog', href: '/blog', preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=500&fit=crop' },
  { name: 'Contact', href: '/contact', preview: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=500&fit=crop' },
]

const socialLinks = [
  { icon: FaFacebook, href: '#', label: 'Facebook', color: '#1877F2', id: '@sidmabevents' },
  { icon: InstagramIcon, href: '#', label: 'Instagram', color: '#E4405F', id: '@sidmab_events' },
  { icon: FaXTwitter, href: '#', label: 'X', color: '#000000', id: '@sidmab_ng' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn', color: '#0A66C2', id: 'SIDMAB Events' },
  { icon: FaYoutube, href: '#', label: 'YouTube', color: '#FF0000', id: 'SIDMAB TV' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSocial, setShowSocial] = useState(true)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const { data: session } = useSession()
  const pathname = usePathname()
  const socialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (socialRef.current && !socialRef.current.contains(e.target as Node)) {
        setShowSocial(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-6 right-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500',
          isOpen
            ? 'bg-white text-black rotate-90'
            : 'text-white'
        )}
        style={!isOpen ? { background: 'var(--site-primary)' } : {}}
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
        </motion.div>
      </button>

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
            {/* Decorative dots pattern */}
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative h-full flex flex-col lg:flex-row">

              {/* Left - Navigation */}
              <div className="flex-1 flex flex-col px-8 md:px-20 lg:px-28">
                <div className="flex-1" />

                <div className="flex gap-12 items-start">
                  {/* Follow Us - left side */}
                  <div ref={socialRef} className="flex flex-col items-start">
                    {/* Invisible spacers to align with Services */}
                    <div className="invisible">
                      <div className="text-xs uppercase tracking-[0.3em] mb-6">—</div>
                      <div className="py-2.5">
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold">Home</span>
                      </div>
                      <div className="h-px bg-transparent" />
                      <div className="py-2.5">
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold">About</span>
                      </div>
                      <div className="h-px bg-transparent" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <button onClick={() => setShowSocial(!showSocial)} className="hover:opacity-80 transition-opacity shrink-0">
                        <motion.div
                          animate={{ rotate: showSocial ? 90 : 180 }}
                          transition={{ type: 'spring', stiffness: 180, damping: 13 }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-white to-gray-100 shadow-[0_4px_0_0_#cbd5e1,0_6px_12px_-4px_rgba(0,0,0,0.15)] active:shadow-[0_1px_0_0_#cbd5e1] active:translate-y-[3px]"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700" fill="currentColor">
                            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                          </svg>
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {showSocial && (
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
                      {showSocial && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-2 overflow-hidden"
                        >
                          {socialLinks.map((s) => (
                            <a
                              key={s.label}
                              href={s.href}
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

                  <div>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-6"
                    >
                      — Navigation
                    </motion.p>

                    <nav className="space-y-0">
                      {navItems.map((item, i) => {
                        const active = pathname === item.href
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              onMouseEnter={() => setHoveredNav(item.name)}
                              onMouseLeave={() => setHoveredNav(null)}
                              className={cn(
                                'group relative flex items-center gap-5 py-2.5 px-3 -mx-3 rounded-xl transition-all duration-300',
                                active
                                  ? 'text-white'
                                  : 'text-gray-700 hover:text-white'
                              )}
                              style={active ? { background: 'var(--site-primary)' } : {}}
                            >
                              <span className={cn(
                                'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight transition-all duration-300',
                                active ? 'text-black' : 'text-inherit'
                              )}>
                                {item.name}
                              </span>
                              {active && (
                                <motion.span
                                  layoutId="menu-active"
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: 'var(--site-primary)' }}
                                />
                              )}
                              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity mr-4">
                                <HiArrowRight className="w-4 h-4 text-gray-300" />
                              </span>
                            </Link>
                            <div className="ml-0 h-px bg-gray-100 last:hidden" />
                          </motion.div>
                        )
                      })}
                    </nav>

                    {session && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-4">— Account</p>
                        <Link
                          href="/account"
                          onClick={() => setIsOpen(false)}
                          className="group relative flex items-center gap-5 py-2.5 px-3 -mx-3 rounded-xl transition-all duration-300 text-gray-700 hover:text-white"
                        >
                          <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">My Account</span>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex-1" />

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="mb-8 flex items-center justify-center gap-6"
                >
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-3 px-6 py-3.5 text-white text-sm font-medium rounded-xl transition-all shadow-lg"
                    style={{ background: 'var(--site-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    <span>Book a Consultation</span>
                    <HiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>

              {/* Right - Info panel */}
              <div className="lg:w-96 bg-black lg:bg-gray-950 relative overflow-hidden">
                {/* Preview image */}
                <AnimatePresence>
                  {hoveredNav && (
                    <motion.div
                      key={hoveredNav}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 z-0"
                    >
                      <img
                        src={navItems.find(i => i.name === hoveredNav)?.preview}
                        alt={hoveredNav}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/70" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10 p-10 md:p-14 flex flex-col justify-center min-h-full">
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                  >
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white font-bold text-base">
                      S
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">SIDMAB</p>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Events & Management</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">Contact</p>
                      <a href="tel:+2348000000000" className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group">
                        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <HiPhone className="w-4 h-4" />
                        </span>
                        +234 800 000 0000
                      </a>
                      <a href="mailto:info@sidmab.com" className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group mt-3">
                        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <HiMail className="w-4 h-4" />
                        </span>
                        info@sidmab.com
                      </a>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">Location</p>
                      <p className="flex items-center gap-4 text-sm text-white/70">
                        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                          <HiLocationMarker className="w-4 h-4" />
                        </span>
                        123 Event Street, Lagos, Nigeria
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">Working Hours</p>
                      <p className="flex items-center gap-4 text-sm text-white/70">
                        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                          <HiClock className="w-4 h-4" />
                        </span>
                        Mon - Sat: 8AM - 6PM
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-xs text-white/40 leading-relaxed">
                      Premier event planning and management services crafting unforgettable experiences across Nigeria.
                    </p>
                  </div>
                </motion.div>
                </div>

                {/* Decorative gradient */}
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
        <a href="tel:+2348000000000" className="relative group">
          <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform" style={{ background: 'color-mix(in srgb, var(--site-primary) 15%, transparent)' }} />
          <div className="relative w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 group-hover:text-white transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--site-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <HiPhone className="w-4 h-4" />
          </div>
        </a>
        <a href="mailto:info@sidmab.com" className="relative group">
          <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform" style={{ background: 'color-mix(in srgb, var(--site-primary) 15%, transparent)' }} />
          <div className="relative w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 group-hover:text-white transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--site-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <HiMail className="w-4 h-4" />
          </div>
        </a>
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
      </div>
      )}
    </>
  )
}
