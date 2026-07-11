import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

const defaultSettings = {
  siteName: 'SIDMAB Events & Management',
  tagline: 'Premier Event Planning & Management Services',
  email: 'info@sidmab.com',
  email2: 'bookings@sidmab.com',
  phone: '+234 800 000 0000',
  phone2: '+234 800 000 0001',
  address: '123 Victoria Island, Lagos, Nigeria',
  mapAddress: '123 Victoria Island, Lagos, Nigeria',
  mapEmbedUrl: '',
  primaryColor: '#BA4583',
  secondaryColor: '#C8963E',
  mobileColor: '#BA4583',
  ceoName: 'Sarah Johnson',
  ceoTitle: 'CEO & Founder',
  ceoImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  ceoBio: 'With over 15 years of experience in event management, Sarah founded SIDMAB with a vision to transform the Nigerian events industry.',
  ceoMessage: 'Welcome to SIDMAB Events & Management. Our journey began with a simple belief: every event should be extraordinary. Today, that belief drives our team of dedicated professionals who pour their passion into creating unforgettable experiences. We don\'t just plan events — we craft moments that last a lifetime. Thank you for considering us to be part of your special story.',
  ceoSignature: 'Sarah Johnson',
  companyLogo: '',
  officeHours: 'Mon-Fri: 8AM - 6PM\nSat: 9AM - 4PM',
  whatsapp: '+2348000000000',
  facebook: 'https://facebook.com/sidmab',
  twitter: 'https://twitter.com/sidmab',
  instagram: 'https://instagram.com/sidmab',
  linkedin: 'https://linkedin.com/company/sidmab',
  youtube: '',
  servicesBadge: 'What We Do',
  servicesTitle: 'Our Services',
  servicesDesc: 'Comprehensive event planning and management solutions tailored to your needs.',
  whyBadge: 'Why SIDMAB',
  whyTitle: 'Why Choose Us',
  whySubtitle: 'We bring passion, precision, and creativity to every event we touch.',
  whyCard0_title: 'Proven Expertise',
  whyCard0_desc: '1000+ events delivered with excellence across Nigeria over 15 years.',
  whyCard0_stat: '15+ Years',
  whyCard1_title: 'Creative Excellence',
  whyCard1_desc: 'Award-winning design team transforming ordinary spaces into extraordinary experiences.',
  whyCard1_stat: '50+ Awards',
  whyCard2_title: 'End-to-End Service',
  whyCard2_desc: 'From concept to cleanup, we handle every detail so you can enjoy your event.',
  whyCard2_stat: '100% Dedicated',
  whyCard3_title: 'Tailored Solutions',
  whyCard3_desc: 'Every event is unique. We craft custom packages that fit your vision and budget.',
  whyCard3_stat: 'Fully Custom',
  partnersBadge: 'Our Partners',
  partnersTitle: 'Trusted Partners',
  partnersSubtitle: 'Proud to collaborate with leading organizations across Nigeria.',
  partner0_name: 'TechBridge', partner0_logo: '',
  partner1_name: 'Lagos Business School', partner1_logo: '',
  partner2_name: 'AfriBank Plc', partner2_logo: '',
  partner3_name: 'Greenfield Energy', partner3_logo: '',
  partner4_name: 'Nexus Logistics', partner4_logo: '',
  partner5_name: 'Prime Media', partner5_logo: '',
  heroImage_0: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920',
  heroLabel_0: 'Premier Event Management',
  heroH1_0: 'We Create',
  heroH2_0: 'Unforgettable',
  heroH3_0: 'Moments',
  heroText_0: 'From intimate gatherings to grand celebrations, we bring your vision to life with exceptional planning and flawless execution.',
  heroFont_0: '',
  heroGradientFont_0: '',
  heroImage_1: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920',
  heroLabel_1: 'Corporate & Social Events',
  heroH1_1: 'Elevate Your',
  heroH2_1: 'Next',
  heroH3_1: 'Occasion',
  heroText_1: 'Professional event management for corporate functions, galas, and social gatherings that leave a lasting impression.',
  heroFont_1: '',
  heroGradientFont_1: '',
  heroImage_2: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920',
  heroLabel_2: 'Wedding & Celebrations',
  heroH1_2: 'Your Dream',
  heroH2_2: 'Celebration',
  heroH3_2: 'Awaits',
  heroText_2: 'Every love story deserves a beautiful celebration. We turn your wedding vision into a breathtaking reality.',
  heroFont_2: '',
  heroGradientFont_2: '',
  heroImage_3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920',
  heroLabel_3: 'Decoration & Design',
  heroH1_3: 'Transforming',
  heroH2_3: 'Spaces Into',
  heroH3_3: 'Art',
  heroText_3: 'From concept to execution, our design team creates stunning environments that captivate and inspire.',
  heroFont_3: '',
  heroGradientFont_3: '',
  aboutBadge: 'Our Story',
  aboutTitle: 'About SIDMAB',
  aboutSubtitle: "Nigeria's premier event planning company — crafting extraordinary experiences since 2010.",
  aboutImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920',
  aboutMission: 'To create unforgettable experiences that exceed expectations, delivering exceptional event planning and management services with creativity, precision, and passion.',
  aboutVision: "To be Africa's most sought-after event management company, setting the standard for excellence and innovation in the events industry.",
  aboutValues: 'Excellence, creativity, integrity, and client satisfaction are at the heart of everything we do. We believe in building lasting relationships through exceptional service.',
  aboutTimelineBadge: 'Our Journey',
  aboutTimelineTitle: 'Company History',
  aboutTimelineSubtitle: 'From humble beginnings to industry leadership — our story.',
  aboutMissionBadge: 'Our Foundation',
  aboutMissionTitle: 'Mission, Vision & Values',
  aboutMissionSubtitle: 'The principles that guide everything we do.',
  aboutTeamBadge: 'Our Team',
  aboutTeamTitle: 'Meet the People Behind SIDMAB',
  aboutTeamSubtitle: 'Dedicated professionals committed to making your event extraordinary.',
  footerDescription: 'Premier event planning & management — crafting unforgettable weddings, corporate events, and celebrations across Nigeria.',
}

export async function GET() {
  try {
    const rows = await prisma.setting.findMany()
    const settings: Record<string, string> = { ...defaultSettings }
    for (const row of rows) {
      settings[row.key] = row.value
    }
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const entries = Object.entries(body)

    for (const [key, value] of entries) {
      await prisma.setting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      })
    }

    const saved: Record<string, string> = { ...defaultSettings }
    for (const [key, value] of entries) {
      saved[key] = String(value)
    }

    return NextResponse.json(saved)
  } catch (e: any) {
    console.error('Settings PUT error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
