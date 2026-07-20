'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiArrowLeft, HiBriefcase, HiMail, HiArrowRight, HiHeart, HiStar, HiCheckCircle } from 'react-icons/hi'
import { FaLinkedinIn, FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6'
import { useSettings } from '@/hooks/useSettings'

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
  experience: number
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = target
    const duration = 2000
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState('')
  const [otherMembers, setOtherMembers] = useState<TeamMember[]>([])
  const { settings } = useSettings()

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((m: TeamMember) => m.id === id)
          if (found) setMember(found)
          setOtherMembers(data.filter((m: TeamMember) => m.id !== id).slice(0, 3))
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-base-content/60">Team member not found</p>
        <Link href="/team" className="btn btn-primary">Back to Team</Link>
      </div>
    )
  }

  const firstName = member.name.split(' ')[0]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={member.image} alt={member.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 container mx-auto px-6">
          <Link href="/team" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-10 transition-colors">
            <HiArrowLeft className="w-4 h-4" />
            Back to Team
          </Link>
          <div className="flex flex-col md:flex-row items-start gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-2xl flex-shrink-0"
            >
              <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/60 text-xs uppercase tracking-[0.2em] font-medium mb-4 border border-white/10 w-fit">
                {settings?.teamDetailBadge || 'Meet Our Team'}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight">{member.name}</h1>
              <p className="text-xl md:text-2xl mb-5" style={{ color: 'var(--site-primary)' }}>{member.role}</p>
              {member.experience > 0 && (
                <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                  <HiBriefcase className="w-4 h-4" />
                  <span>{member.experience}+ years of professional experience</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#0A66C2] transition-all">
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black transition-all">
                    <FaXTwitter className="w-4 h-4" />
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#E4405F] transition-all">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                )}
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#1877F2] transition-all">
                    <FaFacebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-100 to-transparent" />
      </section>

      {/* Stats Bar */}
      {member.experience > 0 && (
        <section className="relative -mt-6 z-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-black/[0.04]">
                <p className="text-3xl font-bold" style={{ color: 'var(--site-primary)' }}>
                  <AnimatedCounter target={member.experience} suffix="+" />
                </p>
                <p className="text-xs text-black/40 mt-1 uppercase tracking-wider font-medium">{settings?.teamDetailStatsYearsLabel || 'Years Experience'}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-black/[0.04]">
                <p className="text-3xl font-bold" style={{ color: 'var(--site-primary)' }}>
                  <AnimatedCounter target={member.experience * 20} suffix="+" />
                </p>
                <p className="text-xs text-black/40 mt-1 uppercase tracking-wider font-medium">{settings?.teamDetailStatsProjectsLabel || 'Projects Done'}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-black/[0.04]">
                <p className="text-3xl font-bold" style={{ color: 'var(--site-primary)' }}>
                  <AnimatedCounter target={100} suffix="%" />
                </p>
                <p className="text-xs text-black/40 mt-1 uppercase tracking-wider font-medium">{settings?.teamDetailStatsSatisfactionLabel || 'Client Satisfaction'}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto section-padding">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="luxury-card p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HiStar className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">About {firstName}</h2>
            </div>
            <p className="text-base-content/70 leading-relaxed text-lg whitespace-pre-line">
              {member.bio}
            </p>
          </motion.div>

          {/* What I Bring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="luxury-card p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <HiHeart className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">{settings?.teamDetailWhatIBringTitle || 'What I Bring'}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Passion for Excellence', desc: 'Committed to delivering outstanding results on every project' },
                { label: 'Team Leadership', desc: 'Inspiring and guiding teams to achieve their full potential' },
                { label: 'Creative Vision', desc: 'Bringing fresh ideas and innovative solutions to every challenge' },
                { label: 'Client Focus', desc: 'Building lasting relationships through trust and dedication' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-base-200/30">
                  <HiCheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-base-content/50 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="luxury-card p-8 md:p-10 text-center"
          >
            <h3 className="text-xl font-bold mb-2">Want to work with {firstName}?</h3>
            <p className="text-base-content/50 text-sm mb-6">{settings?.teamDetailContactDesc || 'Get in touch to discuss your next event.'}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium text-sm transition-all hover:brightness-110 shadow-lg"
              style={{ background: 'var(--site-primary)' }}
            >
              <HiMail className="w-4 h-4" />
              Contact {firstName}
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Other Team Members */}
          {otherMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6">Other Team Members</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {otherMembers.map((m) => (
                  <Link key={m.id} href={`/team/${m.id}`} className="group">
                    <div className="luxury-card p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={m.image} alt={m.name} fill className="object-cover object-top" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{m.name}</p>
                        <p className="text-xs text-base-content/40">{m.role}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
