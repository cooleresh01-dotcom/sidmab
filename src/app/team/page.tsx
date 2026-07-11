'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { HiArrowRight, HiMail } from 'react-icons/hi'
import { FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa'
import { teamMembers } from '@/lib/data'
import PageHero from '@/components/ui/PageHero'
import BackButton from '@/components/ui/BackButton'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function TeamGrid() {
  const [apiTeam, setApiTeam] = useState<Array<typeof teamMembers[0] & { id: number }>>([])

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApiTeam(data) })
      .catch(() => {})
  }, [])

  const displayTeam = apiTeam.length > 0 ? apiTeam : teamMembers

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mb-4 shadow-lg backdrop-blur-xl border border-white/30 bg-white/10"
              style={{ background: 'rgba(4,44,108,0.4)' }}>
              Who We Are
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              Dedicated to Excellence
            </h2>
            <p className="text-black/50 mt-4 text-lg leading-relaxed">
              Every member of our team brings unique expertise and passion to
              create extraordinary events.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-16 md:space-y-24">
          {displayTeam.map((member, index) => {
            const isReversed = index % 2 === 1
            return (
              <div key={member.name} className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 80 : -80, rotate: isReversed ? 3 : -3 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ scale: 1.02 }}
                  className={`${isReversed ? 'md:order-2' : 'md:order-1'}`}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-black aspect-square w-72 h-72 md:w-96 md:h-96 mx-auto md:mx-0 group">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`${isReversed ? 'md:order-1 md:text-right' : 'md:order-2'}`}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-[10px] uppercase tracking-[0.2em] font-medium text-black/30 mb-2"
                  >
                    {member.experience} Years Experience
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-3xl md:text-4xl font-bold text-black tracking-tight"
                  >
                    {member.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-sm font-semibold mt-1" style={{ color: 'var(--site-primary)' }}
                  >
                    {member.role}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-black/50 text-base leading-relaxed mt-4 max-w-md"
                  >
                    {member.bio}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className={`flex gap-3 mt-6 ${isReversed ? 'md:justify-end' : ''}`}
                  >
                    {[FaLinkedinIn, FaTwitter, FaInstagram].map((Icon, si) => {
                      const colors = ['#0A66C2', '#1DA1F2', '#E4405F']
                      const names = ['LinkedIn', 'Twitter', 'Instagram']
                      return (
                        <motion.a
                          key={si}
                          href="#"
                          title={names[si]}
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{ background: 'rgba(0,0,0,0.04)', color: colors[si] }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = colors[si]; e.currentTarget.style.color = '#fff' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = colors[si] }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      )
                    })}
                  </motion.div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function JoinTeamSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-black/[0.02]">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--site-primary) 0%, transparent 50%)' }} />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <FadeIn>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mb-4 shadow-lg backdrop-blur-xl border border-white/30 bg-white/10"
            style={{ background: 'rgba(4,44,108,0.4)' }}>
            Join The Team
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight mb-4">
            Join Our Team
          </h2>
          <p className="text-black/50 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Passionate about events? We&apos;re always looking for talented
            individuals to join the SIDMAB family.
          </p>
          <a
            href="mailto:careers@sidmab.com"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{ border: '1.5px solid var(--site-primary)', color: 'var(--site-primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--site-primary)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--site-primary)' }}
          >
            <HiMail className="w-4 h-4" />
            Send Your Resume
            <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

export default function TeamPage() {
  return (
    <>
      <BackButton />
      <PageHero
        title="Our Team"
        subtitle="Meet the passionate professionals behind SIDMAB Events & Management."
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920"
        badge="Who We Are"
        height="tall"
      />
      <TeamGrid />
      <JoinTeamSection />
    </>
  )
}
