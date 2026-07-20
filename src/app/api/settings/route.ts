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

  // Home Stats
  homeStat0_value: '1000', homeStat0_suffix: '+', homeStat0_label: 'Events Delivered',
  homeStat1_value: '250', homeStat1_suffix: '+', homeStat1_label: 'Happy Clients',
  homeStat2_value: '15', homeStat2_suffix: '+', homeStat2_label: 'Years Experience',
  homeStat3_value: '98', homeStat3_suffix: '%', homeStat3_label: 'Satisfaction Rate',

  // Home CTA
  homeCtaBadge: "Let's Create Something Amazing",
  homeCtaTitle: 'Ready to Plan Your Event?',
  homeCtaDesc: 'Get in touch today for a free consultation. No obligation, just inspiration.',
  homeCtaBtn1: 'Book a Consultation',
  homeCtaBtn2: 'Contact Us',
  homeCtaNote: 'Typically responds within 24 hours',

  // About Timeline (JSON)
  aboutTimeline: '',

  // About Achievements
  aboutAchievementBadge: 'Our Achievements',
  aboutAchievementTitle: 'By the Numbers',
  aboutAchievementSubtitle: 'Our track record speaks for itself.',
  aboutAchievement0_value: '1000', aboutAchievement0_suffix: '+', aboutAchievement0_label: 'Events Managed',
  aboutAchievement1_value: '15', aboutAchievement1_suffix: '+', aboutAchievement1_label: 'Years Experience',
  aboutAchievement2_value: '250', aboutAchievement2_suffix: '+', aboutAchievement2_label: 'Corporate Clients',
  aboutAchievement3_value: '98', aboutAchievement3_suffix: '%', aboutAchievement3_label: 'Client Satisfaction',
  aboutAchievement4_value: '50', aboutAchievement4_suffix: '+', aboutAchievement4_label: 'Awards Won',
  aboutAchievement5_value: '500', aboutAchievement5_suffix: '+', aboutAchievement5_label: 'Happy Couples',

  // Services Page
  servicesPageBadge: 'What We Offer',
  servicesPageTitle: 'Our Services',
  servicesPageSubtitle: 'Comprehensive event solutions tailored to bring your vision to life.',
  servicesPageImage: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920',
  servicesGridBadge: 'What We Offer',
  servicesGridTitle: 'End-to-End Event Solutions',
  servicesGridDesc: 'From intimate gatherings to grand celebrations, we handle every detail with precision and creativity.',
  servicesCtaTitle: 'Not Sure What You Need?',
  servicesCtaDesc: "Let's discuss your event and create a custom package that fits your vision and budget.",
  servicesCtaBtn: 'Book a Free Consultation',

  // Portfolio Page
  portfolioPageBadge: 'Our Work',
  portfolioPageTitle: 'Our Portfolio',
  portfolioPageSubtitle: 'A showcase of our finest events and celebrations.',
  portfolioPageImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920',

  // Team Page
  teamPageBadge: 'Who We Are',
  teamPageTitle: 'Our Team',
  teamPageSubtitle: 'Meet the passionate professionals behind SIDMAB Events & Management.',
  teamPageImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
  teamGridBadge: 'Who We Are',
  teamGridTitle: 'Dedicated to Excellence',
  teamGridDesc: 'Every member of our team brings unique expertise and passion to create extraordinary events.',
  teamJoinBadge: 'Join The Team',
  teamJoinTitle: 'Join Our Team',
  teamJoinDesc: "Passionate about events? We're always looking for talented individuals to join the SIDMAB family.",
  teamJoinEmail: 'careers@sidmab.com',

  // Blog Page
  blogPageBadge: 'Our Blog',
  blogPageTitle: 'Latest Insights & Stories',
  blogPageSubtitle: 'Expert tips, trends, and inspiration for your next event.',
  blogPageImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920',

  // Testimonials Page
  testimonialsPageBadge: 'Client Stories',
  testimonialsPageTitle: 'Testimonials',
  testimonialsPageSubtitle: 'Hear what our clients have to say about their SIDMAB experience.',
  testimonialsPageImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
  testimonialsGridBadge: 'Client Feedback',
  testimonialsGridTitle: 'What Our Clients Say',
  testimonialsGridDesc: "Don't take our word for it — hear from the people we've worked with.",
  testimonialsStat0_value: '98%', testimonialsStat0_label: 'Client Satisfaction',
  testimonialsStat1_value: '1000+', testimonialsStat1_label: 'Events Delivered',
  testimonialsStat2_value: '250+', testimonialsStat2_label: 'Repeat Clients',
  testimonialsStat3_value: '4.9/5', testimonialsStat3_label: 'Average Rating',

  // FAQ Page
  faqPageBadge: 'FAQ',
  faqPageTitle: 'Frequently Asked Questions',
  faqPageSubtitle: 'Everything you need to know about our services and process.',
  faqPageImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920',
  faqCtaTitle: 'Still Have Questions?',
  faqCtaDesc: 'We are here to help. Get in touch with our team for personalised assistance.',
  faqContent: '',

  // Contact Page
  contactPageBadge: 'Get in Touch',
  contactPageTitle: 'Contact Us',
  contactPageSubtitle: 'We would love to hear from you. Reach out and let us help plan your perfect event.',
  contactPageImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920',
  contactFaqTitle: 'Quick Answers',
  contactFaqDesc: 'Many common questions are answered in our FAQ section.',

  // Book Page
  bookBadge: 'Book Now',
  bookTitle: 'Book a Consultation',
  bookDesc: 'Tell us about your event and we will create something amazing together.',
  bookEventTypes: 'Wedding,Corporate,Birthday,Conference,Outdoor,Decoration,Party,Other',
  bookSigninTitle: 'Sign In Required',
  bookSigninDesc: 'You need to be signed in to book a consultation. Please sign in or create an account to continue.',
  bookSuccessTitle: 'Booking Submitted!',
  bookSuccessDesc: 'Thank you for your booking request. Our team will review your details and get back to you within 24 hours.',

  // Careers Page
  careersPageBadge: 'Join Our Team',
  careersPageTitle: 'Careers at SIDMAB',
  careersPageSubtitle: 'Come grow with us. Explore opportunities to be part of something extraordinary.',
  careersPageImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
  careersCultureBadge: 'Our Culture',
  careersCultureTitle: 'Life at SIDMAB',
  careersCultureDesc: 'We believe in fostering creativity, collaboration, and growth. Our team is our greatest asset.',
  careersBenefitsBadge: 'Benefits',
  careersBenefitsTitle: 'Why Join Us',
  careersBenefitsDesc: 'We take care of our team with great benefits and a positive work environment.',
  careersPositionsBadge: 'Open Positions',
  careersPositionsTitle: 'Join Our Team',
  careersPositionsDesc: 'Explore current opportunities and find your dream role.',
  careerContent: '',
  careerBenefits: '',

  // CEO Page
  ceoCtaTitle: 'Want to Work With Us?',
  ceoCtaDesc: "Let's create something extraordinary together. Reach out and tell us about your vision.",
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
