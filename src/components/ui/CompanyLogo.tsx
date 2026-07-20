'use client'

import Image from 'next/image'
import { useSettings } from '@/hooks/useSettings'

interface CompanyLogoProps {
  className?: string
  width?: number
  height?: number
}

export default function CompanyLogo({ className = '', width = 40, height = 40 }: CompanyLogoProps) {
  const { settings } = useSettings()
  const logo = settings?.companyLogo

  if (!logo) return null

  return (
    <Image
      src={logo}
      alt="Company Logo"
      width={width}
      height={height}
      quality={100}
      unoptimized
      className={className}
      style={{ imageRendering: 'auto' }}
    />
  )
}
