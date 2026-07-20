'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiBadgeCheck, HiSparkles, HiSupport, HiLightBulb } from 'react-icons/hi'
import FadeIn from './FadeIn'
import { teamMembers } from '@/lib/data'
import { useSettings } from '@/hooks/useSettings'

export default function WhyChooseUsSection() {
  const { settings } = useSettings()
  const [apiTeam, setApiTeam] = useState<Array<{ id: string; name: string; role: string; image: string }>>([])

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApiTeam(data) })
      .catch(() => {})
  }, [])

  const cards = [
    { icon: HiBadgeCheck, key: '0' },
    { icon: HiSparkles, key: '1' },
    { icon: HiSupport, key: '2' },
    { icon: HiLightBulb, key: '3' },
  ]

  const displayTeam = apiTeam.length >= 3 ? apiTeam.slice(0, 3) : teamMembers.slice(0, 3).map((m, i) => ({ ...m, id: '' }))

  return (
    <section className="py-16 bg-black/[0.02] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 75% 25%, var(--site-primary) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mb-4 shadow-lg backdrop-blur-xl border border-white/30"
              style={{ background: 'rgba(4,44,108,0.4)' }}>
              {settings?.whyBadge || 'Why SIDMAB'}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tight">
              {settings?.whyTitle || 'Why Choose Us'}
            </h2>
            <p className="text-black/45 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
              {settings?.whySubtitle || 'We bring passion, precision, and creativity to every event we touch.'}
            </p>
          </div>
        </FadeIn>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {cards.map(({ icon: Icon, key }, i) => (
            <FadeIn key={key} delay={i * 0.08}>
              <div className="p-8 rounded-2xl bg-white border border-black/[0.06] hover:border-black/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, white)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--site-primary)' }} />
                </div>
                <h3 className="text-lg font-bold text-black mb-3">
                  {settings?.[`whyCard${key}_title`] || ['Proven Expertise', 'Creative Excellence', 'End-to-End Service', 'Tailored Solutions'][i]}
                </h3>
                <p className="text-sm text-black/50 leading-relaxed mb-4">
                  {settings?.[`whyCard${key}_desc`] || ['1000+ events delivered with excellence across Nigeria over 15 years.', 'Award-winning design team transforming ordinary spaces into extraordinary experiences.', 'From concept to cleanup, we handle every detail so you can enjoy your event.', 'Every event is unique. We craft custom packages that fit your vision and budget.'][i]}
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--site-primary)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--site-primary)' }}>
                    {settings?.[`whyCard${key}_stat`] || ['15+ Years', '50+ Awards', '100% Dedicated', 'Fully Custom'][i]}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="sm:hidden overflow-hidden mb-14 -mx-6">
          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {[...cards, ...cards].map(({ icon: Icon, key }, i) => (
              <div key={`${key}-${i}`} className="flex-shrink-0 w-72 p-6 mx-3 rounded-2xl bg-white border border-black/[0.06]">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'color-mix(in srgb, var(--site-primary) 10%, white)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--site-primary)' }} />
                </div>
                <h3 className="text-base font-bold text-black mb-2">
                  {settings?.[`whyCard${key}_title`] || ['Proven Expertise', 'Creative Excellence', 'End-to-End Service', 'Tailored Solutions'][parseInt(key)]}
                </h3>
                <p className="text-xs text-black/50 leading-relaxed mb-3">
                  {settings?.[`whyCard${key}_desc`] || ['1000+ events delivered with excellence across Nigeria over 15 years.', 'Award-winning design team transforming ordinary spaces into extraordinary experiences.', 'From concept to cleanup, we handle every detail so you can enjoy your event.', 'Every event is unique. We craft custom packages that fit your vision and budget.'][parseInt(key)]}
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--site-primary)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--site-primary)' }}>
                    {settings?.[`whyCard${key}_stat`] || ['15+ Years', '50+ Awards', '100% Dedicated', 'Fully Custom'][parseInt(key)]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {displayTeam.map((member, i) => (
            <FadeIn key={member.name} delay={i * 0.1}>
              <Link href={`/team/${member.id || ''}`} className="block">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-black/[0.06] hover:border-black/10 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                    <Image src={member.image} alt={member.name} fill className="object-cover object-top" sizes="48px" />
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm">{member.name}</p>
                    <p className="text-xs text-black/40">{member.role}</p>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
