'use client'

import { useState, useEffect } from 'react'

interface SiteSettings {
  [key: string]: string
  siteName: string
  siteDescription: string
  primaryColor: string
  secondaryColor: string
  mobileColor: string
  phone: string
  email: string
  address: string
  workingHours: string
  logo: string
  companyLogo: string
  favicon: string
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
  whatsapp: string
  ceoName: string
  ceoTitle: string
  ceoBio: string
  ceoMessage: string
  ceoImage: string
  ceoSignature: string
  heroSlides: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
  smtpFrom: string
}

let cachedSettings: SiteSettings | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000

export function clearSettingsCache() {
  cachedSettings = null
  cacheTimestamp = 0
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cachedSettings)
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const now = Date.now()
    if (cachedSettings && now - cacheTimestamp < CACHE_DURATION) {
      setSettings(cachedSettings)
      setLoading(false)
      return
    }

    const controller = new AbortController()

    fetch('/api/settings', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          cachedSettings = data
          cacheTimestamp = Date.now()
          setSettings(data)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Failed to load settings')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  return { settings, loading, error }
}
