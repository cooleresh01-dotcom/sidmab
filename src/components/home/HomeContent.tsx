'use client'

import BackToTop from './BackToTop'
import HeroSection from './HeroSection'
import StatsSection from './StatsSection'
import ServicesSection from './ServicesSection'
import WhyChooseUsSection from './WhyChooseUsSection'
import PortfolioSection from './PortfolioSection'
import TestimonialsMarquee from './TestimonialsMarquee'
import PartnersSection from './PartnersSection'
import CTASection from './CTASection'

export default function HomeContent() {
  return (
    <>
      <BackToTop />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <PortfolioSection />
      <TestimonialsMarquee />
      <PartnersSection />
      <CTASection />
    </>
  )
}
