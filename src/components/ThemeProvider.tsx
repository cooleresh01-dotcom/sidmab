'use client'

import { useEffect, ReactNode } from 'react'
import { useSettings } from '@/hooks/useSettings'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()

  useEffect(() => {
    if (!settings) return
    const p = settings.primaryColor || '#BA4583'
    const s = settings.secondaryColor || '#C8963E'
    const m = settings.mobileColor || '#BA4583'
    const root = document.documentElement
    root.style.setProperty('--site-primary', p)
    root.style.setProperty('--site-secondary', s)
    root.style.setProperty('--gradient-brand', `linear-gradient(135deg, ${p}, ${s})`)
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${p}, color-mix(in srgb, ${p} 60%, black))`)
    root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${s}, color-mix(in srgb, ${s} 60%, black))`)
    let meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', m)
  }, [settings])

  return <>{children}</>
}
