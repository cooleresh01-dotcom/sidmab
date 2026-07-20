'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaLaptopCode, FaUniversity, FaPiggyBank, FaLeaf, FaTruck, FaPlay } from 'react-icons/fa'
import FadeIn from './FadeIn'
import { useSettings } from '@/hooks/useSettings'

export default function PartnersSection() {
  const { settings } = useSettings()

  const partnerIcons = [FaLaptopCode, FaUniversity, FaPiggyBank, FaLeaf, FaTruck, FaPlay]
  const fallbackNames = ['TechBridge', 'Lagos Business School', 'AfriBank Plc', 'Greenfield Energy', 'Nexus Logistics', 'Prime Media']

  return (
    <section className="py-8 md:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs uppercase tracking-[0.15em] font-medium mb-4 shadow-lg backdrop-blur-xl border border-white/30"
              style={{ background: 'rgba(4,44,108,0.4)' }}>
              {settings?.partnersBadge || 'Our Partners'}
            </div>
            <h2 className="text-2xl md:text-6xl font-bold text-black tracking-tight">
              {settings?.partnersTitle || 'Trusted Partners'}
            </h2>
          </div>
        </FadeIn>

        <div className="hidden md:grid grid-cols-6 gap-12 max-w-4xl mx-auto items-center">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const Icon = partnerIcons[i]
            const name = settings?.[`partner${i}_name`] || fallbackNames[i]
            const logo = settings?.[`partner${i}_logo`]
            return (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                  {logo ? (
                    <Image src={logo} alt={name} width={60} height={60} unoptimized className="object-contain" />
                  ) : (
                    <Icon className="w-10 h-10 text-black/40" />
                  )}
                </div>
                {name && (
                  <span className="text-xs font-semibold text-black/30 text-center leading-tight">
                    {name}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="md:hidden overflow-hidden">
          <div className="flex animate-marquee">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const Icon = partnerIcons[i]
              const name = settings?.[`partner${i}_name`] || fallbackNames[i]
              const logo = settings?.[`partner${i}_logo`]
              return (
                <div key={i} className="flex-shrink-0 w-32 flex flex-col items-center gap-2 mx-4">
                  <div className="w-14 h-14 flex items-center justify-center opacity-60">
                    {logo ? (
                      <Image src={logo} alt={name} width={60} height={60} unoptimized className="object-contain" />
                    ) : (
                      <Icon className="w-8 h-8 text-black/40" />
                    )}
                  </div>
                  {name && (
                    <span className="text-[11px] font-semibold text-black/30 text-center leading-tight">
                      {name}
                    </span>
                  )}
                </div>
              )
            })}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const Icon = partnerIcons[i]
              const name = settings?.[`partner${i}_name`] || fallbackNames[i]
              const logo = settings?.[`partner${i}_logo`]
              return (
                <div key={`dup-${i}`} className="flex-shrink-0 w-32 flex flex-col items-center gap-2 mx-4">
                  <div className="w-14 h-14 flex items-center justify-center opacity-60">
                    {logo ? (
                      <Image src={logo} alt={name} width={60} height={60} unoptimized className="object-contain" />
                    ) : (
                      <Icon className="w-8 h-8 text-black/40" />
                    )}
                  </div>
                  {name && (
                    <span className="text-[11px] font-semibold text-black/30 text-center leading-tight">
                      {name}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <FadeIn>
          <div className="text-center mt-10">
            <Link
              href="/about"
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: 'var(--site-primary)' }}
            >
              Become a Partner &rarr;
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
