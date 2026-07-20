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

let settingsVersion = Date.now()

export function clearSettingsCache() {
  cachedSettings = null
  cacheTimestamp = 0
  settingsVersion = Date.now()
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(() => {
    if (cachedSettings) return addCacheBust(cachedSettings)
    return null
  })
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const now = Date.now()
    if (cachedSettings && now - cacheTimestamp < CACHE_DURATION) {
      setSettings(addCacheBust(cachedSettings))
      setLoading(false)
      return
    }

    const controller = new AbortController()

    fetch('/api/settings?_=' + Date.now(), { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          cachedSettings = data
          cacheTimestamp = Date.now()
          settingsVersion = Date.now()
          setSettings(addCacheBust(data))
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

const imageKeys = new Set([
  'companyLogo', 'logo', 'favicon', 'ceoImage', 'ceoSignature', 'ceoHeroImage',
  'aboutImage', 'aboutAchievementImage',
  'servicesPageImage', 'servicesCtaImage', 'serviceDetailCtaImage',
  'portfolioPageImage', 'portfolioDetailCtaImage',
  'teamPageImage',
  'blogPageImage',
  'testimonialsPageImage', 'testimonialsVideoImage',
  'faqPageImage', 'contactPageImage',
  'careersPageImage', 'careersCultureImages',
  'homeCtaImage',
  'heroImage_0', 'heroImage_1', 'heroImage_2', 'heroImage_3',
  'partner0_logo', 'partner1_logo', 'partner2_logo', 'partner3_logo', 'partner4_logo', 'partner5_logo',
])

function addCacheBust(data: SiteSettings) {
  const result = { ...data }
  for (const key of imageKeys) {
    const val = result[key]
    if (val && !val.includes('?v=')) {
      const separator = val.includes('?') ? '&' : '?'
      result[key] = val + separator + 'v=' + settingsVersion
    }
  }
  return result
}
