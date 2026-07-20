'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  HiArrowRight,
  HiStar,
  HiShieldCheck,
  HiEye,
  HiHeart,
} from 'react-icons/hi'
import { FaQuoteLeft } from 'react-icons/fa'
import { teamMembers } from '@/lib/data'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'


function AnimatedCounter({
  end,
  suffix,
  duration = 2000,
}: {
  end: number
  suffix: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary">
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}



function TimelineSection({ settings }: { settings: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const defaultMilestones = [
    {
      year: '2010',
      title: 'The Beginning',
      desc: 'SIDMAB was founded with a vision to transform Nigeria\'s events industry with world-class planning and execution.',
    },
    {
      year: '2013',
      title: 'First Major Milestone',
      desc: 'Successfully executed our first 500-guest wedding, establishing our reputation for excellence.',
    },
    {
      year: '2016',
      title: 'Expansion',
      desc: 'Expanded our team to 20+ full-time professionals and opened our flagship office in Lagos.',
    },
    {
      year: '2019',
      title: 'Industry Recognition',
      desc: 'Received multiple industry awards for outstanding event design and management.',
    },
    {
      year: '2022',
      title: '1000 Events',
      desc: 'Celebrated the successful execution of our 1000th event across Nigeria.',
    },
    {
      year: '2025',
      title: 'Continuing Excellence',
      desc: 'Expanding our services with innovative event technology and sustainable practices.',
    },
  ]

  let milestones = defaultMilestones
  if (settings.aboutTimeline) {
    try {
      const parsed = JSON.parse(settings.aboutTimeline)
      if (parsed.milestones && Array.isArray(parsed.milestones)) {
        milestones = parsed.milestones
      }
    } catch {}
  }

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            {settings.aboutTimelineBadge || 'Our Journey'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {settings.aboutTimelineTitle || 'Company History'}
          </h2>
          <p className="text-base-content/70">
            {settings.aboutTimelineSubtitle || 'From humble beginnings to industry leadership — our story.'}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 md:-translate-x-px" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={cn(
                'relative mb-12 md:w-1/2',
                index % 2 === 0
                  ? 'md:pr-12 md:ml-0'
                  : 'md:pl-12 md:ml-auto'
              )}
            >
              <div className="hidden md:flex absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-base-100 z-10" />

              <div className="md:flex md:items-start md:gap-6">
                <div className="md:hidden absolute left-0 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold z-10 ring-4 ring-base-100">
                  {index + 1}
                </div>

                <div className="pl-12 md:pl-0 flex-1">
                  <div className="card bg-base-100 shadow-md p-6 border-l-4 border-primary md:border-l-0 hover:shadow-xl transition-shadow duration-300">
                    <span className="text-sm font-bold text-primary">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-semibold mt-1">
                      {milestone.title}
                    </h3>
                    <p className="text-base-content/70 mt-2">{milestone.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MissionVisionValues({ settings }: { settings: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const items = [
    {
      icon: <HiStar className="w-8 h-8" />,
      title: 'Our Mission',
      desc: settings.aboutMission || 'To create unforgettable experiences that exceed expectations, delivering exceptional event planning and management services with creativity, precision, and passion.',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: <HiEye className="w-8 h-8" />,
      title: 'Our Vision',
      desc: settings.aboutVision || "To be Africa's most sought-after event management company, setting the standard for excellence and innovation in the events industry.",
      color: 'bg-secondary/10 text-secondary',
    },
    {
      icon: <HiHeart className="w-8 h-8" />,
      title: 'Core Values',
      desc: settings.aboutValues || 'Excellence, creativity, integrity, and client satisfaction are at the heart of everything we do. We believe in building lasting relationships through exceptional service.',
      color: 'bg-accent/10 text-accent',
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-base-200/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            {settings.aboutMissionBadge || 'Our Foundation'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {settings.aboutMissionTitle || 'Mission, Vision & Values'}
          </h2>
          <p className="text-base-content/70">
            {settings.aboutMissionSubtitle || 'The principles that guide everything we do.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="card bg-base-100 shadow-md p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6',
                  item.color
                  )}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-base-content/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AchievementsSection({ settings }: { settings: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { value: parseInt(settings?.aboutAchievement0_value || '1000'), suffix: settings?.aboutAchievement0_suffix || '+', label: settings?.aboutAchievement0_label || 'Events Managed' },
    { value: parseInt(settings?.aboutAchievement1_value || '15'), suffix: settings?.aboutAchievement1_suffix || '+', label: settings?.aboutAchievement1_label || 'Years Experience' },
    { value: parseInt(settings?.aboutAchievement2_value || '250'), suffix: settings?.aboutAchievement2_suffix || '+', label: settings?.aboutAchievement2_label || 'Corporate Clients' },
    { value: parseInt(settings?.aboutAchievement3_value || '98'), suffix: settings?.aboutAchievement3_suffix || '%', label: settings?.aboutAchievement3_label || 'Client Satisfaction' },
    { value: parseInt(settings?.aboutAchievement4_value || '50'), suffix: settings?.aboutAchievement4_suffix || '+', label: settings?.aboutAchievement4_label || 'Awards Won' },
    { value: parseInt(settings?.aboutAchievement5_value || '500'), suffix: settings?.aboutAchievement5_suffix || '+', label: settings?.aboutAchievement5_label || 'Happy Couples' },
  ]

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={settings?.aboutAchievementImage || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920'}
          alt="Achievements"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>

      <div className="relative z-10 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="font-semibold text-sm uppercase tracking-wider text-black/40">
            {settings?.aboutAchievementBadge || 'Our Achievements'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-black">
            {settings?.aboutAchievementTitle || 'By the Numbers'}
          </h2>
          <p className="text-black/50">
            {settings?.aboutAchievementSubtitle || 'Our track record speaks for itself.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-black/50 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnersSection({ settings }: { settings: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const partners = [
    { name: settings.partner0_name || 'TechBridge', logo: settings.partner0_logo || '' },
    { name: settings.partner1_name || 'Lagos Business School', logo: settings.partner1_logo || '' },
    { name: settings.partner2_name || 'AfriBank Plc', logo: settings.partner2_logo || '' },
    { name: settings.partner3_name || 'Greenfield Energy', logo: settings.partner3_logo || '' },
    { name: settings.partner4_name || 'Nexus Logistics', logo: settings.partner4_logo || '' },
    { name: settings.partner5_name || 'Prime Media', logo: settings.partner5_logo || '' },
  ]

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
            {settings.partnersBadge || 'Our Partners'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {settings.partnersTitle || 'Trusted Partners'}
          </h2>
          <p className="text-base-content/70">
            {settings.partnersSubtitle || 'We are proud to be recognized by leading industry organizations.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8 flex items-center justify-center"
            >
              {partner.logo ? (
                <Image src={partner.logo} alt={partner.name} width={120} height={60} className="object-contain" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center text-base-content/60 font-bold text-sm text-center">
                  {partner.name}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamPreviewSection({ settings }: { settings: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [apiTeam, setApiTeam] = useState<Array<{ name: string; role: string; image: string; bio: string }>>([])

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApiTeam(data) })
      .catch(() => {})
  }, [])

  const displayTeam = apiTeam.length >= 4 ? apiTeam.slice(0, 4) : teamMembers.slice(0, 4)

  return (
    <section ref={ref} className="section-padding bg-base-200/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            {settings.aboutTeamBadge || 'Our Team'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {settings.aboutTeamTitle || 'Meet the People Behind SIDMAB'}
          </h2>
          <p className="text-base-content/70">
            {settings.aboutTeamSubtitle || 'Dedicated professionals committed to making your event extraordinary.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTeam.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <figure className="relative h-64 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </figure>
              <div className="card-body p-5">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/team"
            className="btn btn-primary text-white rounded-full"
          >
            Meet the Full Team
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setSettings(d) })
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHero
        title={settings.aboutTitle || 'About SIDMAB'}
        subtitle={settings.aboutSubtitle || "Nigeria's premier event planning company — crafting extraordinary experiences since 2010."}
        image={settings.aboutImage || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920'}
        badge={settings.aboutBadge || 'Our Story'}
        height="full"
      />
      <TimelineSection settings={settings} />
      <MissionVisionValues settings={settings} />
      <AchievementsSection settings={settings} />
      <PartnersSection settings={settings} />
      <TeamPreviewSection settings={settings} />
    </>
  )
}
