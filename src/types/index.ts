export interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  image: string
  gallery: string[]
  packages: ServicePackage[]
  faqs: FAQItem[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServicePackage {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  serviceId: string
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  category: PortfolioCategory
  images: string[]
  video?: string
  description: string
  client: string
  date: Date
  published: boolean
  featured: boolean
}

export type PortfolioCategory = 'wedding' | 'corporate' | 'birthday' | 'outdoor' | 'decoration' | 'conference'

export interface GalleryItem {
  id: string
  title: string
  type: 'image' | 'video' | 'drone' | 'before-after'
  url: string
  thumbnail: string
  category: string
  before?: string
  after?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
  socials: SocialLinks
  experience: number
  published: boolean
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  image: string
  content: string
  rating: number
  video?: string
  featured: boolean
  published: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  tags: string[]
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface Booking {
  id: string
  service: string
  eventType: string
  date: Date
  guests: number
  budget: number
  name: string
  email: string
  phone: string
  message?: string
  status: BookingStatus
  createdAt: Date
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
}

export type UserRole = 'admin' | 'editor' | 'viewer' | 'client'

export interface SiteSettings {
  id: string
  name: string
  tagline: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  email: string
  phone: string
  address: string
  socials: SocialLinks
  stats: {
    events: number
    years: number
    clients: number
    satisfaction: number
  }
}
