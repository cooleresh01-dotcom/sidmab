'use client'

import { FaCalendarCheck, FaUsers, FaAward, FaSmile } from 'react-icons/fa'
import FadeIn from './FadeIn'
import AnimatedCounter from './AnimatedCounter'
import { useSettings } from '@/hooks/useSettings'

export default function StatsSection() {
  const { settings } = useSettings()
  const stats = [
    { icon: FaCalendarCheck, end: parseInt(settings?.homeStat0_value || '1000'), suffix: settings?.homeStat0_suffix || '+', label: settings?.homeStat0_label || 'Events Delivered' },
    { icon: FaUsers, end: parseInt(settings?.homeStat1_value || '250'), suffix: settings?.homeStat1_suffix || '+', label: settings?.homeStat1_label || 'Happy Clients' },
    { icon: FaAward, end: parseInt(settings?.homeStat2_value || '15'), suffix: settings?.homeStat2_suffix || '+', label: settings?.homeStat2_label || 'Years Experience' },
    { icon: FaSmile, end: parseInt(settings?.homeStat3_value || '98'), suffix: settings?.homeStat3_suffix || '%', label: settings?.homeStat3_label || 'Satisfaction Rate' },
  ]

  return (
    <section className="py-4 md:py-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(80,80,80,0.85), rgba(40,40,40,0.7))' }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex md:hidden justify-between items-center gap-2">
          {stats.map(({ icon: Icon, end, suffix, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-3 h-3 shrink-0" style={{ color: 'var(--site-primary)' }} />
              <div>
                <p className="text-white text-xs font-bold leading-tight">
                  <AnimatedCounter end={end} suffix={suffix} />
                </p>
                <p className="text-white/50 text-[9px] leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center justify-between gap-4">
          {stats.map(({ icon: Icon, end, suffix, label }) => (
            <FadeIn key={label}>
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" style={{ color: 'var(--site-primary)' }} />
                <div>
                  <p className="text-white/90 text-3xl font-bold tracking-tight leading-none">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
