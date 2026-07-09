'use client'

import { useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const defaultColors = {
  primaryColor: '#BA4583',
  secondaryColor: '#C8963E',
  mobileColor: '#BA4583',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          const p = data.primaryColor || defaultColors.primaryColor
          const s = data.secondaryColor || defaultColors.secondaryColor
          const m = data.mobileColor || defaultColors.mobileColor
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
        }
      })
      .catch(() => {})
  }, [pathname])

  return <>{children}</>
}
