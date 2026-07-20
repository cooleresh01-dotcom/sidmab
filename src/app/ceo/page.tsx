import { prisma } from '@/lib/db'
import CeoClient from './CeoClient'

export const dynamic = 'force-dynamic'

const defaultSettings: Record<string, string> = {
  ceoName: 'Sarah Johnson',
  ceoTitle: 'CEO & Founder',
  ceoImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  ceoBio: 'With over 15 years of experience in event management, Sarah founded SIDMAB with a vision to transform the Nigerian events industry.',
  ceoMessage: "Welcome to SIDMAB Events & Management. Our journey began with a simple belief: every event should be extraordinary.",
  ceoSignature: 'Sarah Johnson',
  ceoCtaTitle: 'Want to Work With Us?',
  ceoCtaDesc: "Let's create something extraordinary together. Reach out and tell us about your vision.",
  ceoHeroImage: '',
  ceoHeroBadge: 'Leadership',
  ceoHeroTitle: 'Meet Our',
  ceoHeroDesc: '',
  ceoProfileLabel: 'Our Leader',
}

async function getCeoSettings() {
  try {
    const rows = await prisma.setting.findMany()
    const settings: Record<string, string> = { ...defaultSettings }
    for (const row of rows) {
      if (row.key in defaultSettings || row.key.startsWith('ceo')) {
        settings[row.key] = row.value
      }
    }
    return settings
  } catch {
    return defaultSettings
  }
}

export default async function CeoPage() {
  const settings = await getCeoSettings()

  return (
    <CeoClient
      ceoName={settings.ceoName}
      ceoTitle={settings.ceoTitle}
      ceoImage={settings.ceoImage}
      ceoBio={settings.ceoBio}
      ceoMessage={settings.ceoMessage}
      ceoSignature={settings.ceoSignature}
      ceoCtaTitle={settings.ceoCtaTitle}
      ceoCtaDesc={settings.ceoCtaDesc}
      ceoHeroImage={settings.ceoHeroImage}
      ceoHeroBadge={settings.ceoHeroBadge}
      ceoHeroTitle={settings.ceoHeroTitle}
      ceoHeroDesc={settings.ceoHeroDesc}
      ceoProfileLabel={settings.ceoProfileLabel}
    />
  )
}
