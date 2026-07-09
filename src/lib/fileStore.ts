import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'portfolio.json')

interface PortfolioRecord {
  id: string
  title: string
  slug: string
  category: string
  images: string[]
  video?: string
  description: string
  client: string
  date: string
  featured: boolean
  published: boolean
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function seedIfEmpty() {
  ensureDir()
  if (!fs.existsSync(FILE)) {
    const initial: PortfolioRecord[] = [
      { id: '1', title: 'Luxury Wedding', slug: 'luxury-wedding', category: 'Wedding', images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=600', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600'], description: 'A grand wedding celebration with 500 guests, featuring exquisite floral arrangements and live entertainment.', client: 'Chioma & Ade', date: '2025-12-15T00:00:00.000Z', featured: true, published: true },
      { id: '2', title: 'Tech Conference 2025', slug: 'tech-conference-2025', category: 'Corporate', images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'], description: 'Annual tech conference for 1000+ attendees with keynote speeches, workshops, and networking sessions.', client: 'TechBridge Nigeria', date: '2025-11-20T00:00:00.000Z', featured: true, published: true },
      { id: '3', title: 'Garden Birthday', slug: 'garden-birthday', category: 'Birthday', images: ['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600'], description: '50th birthday celebration in a beautiful garden setting with outdoor dining and live music.', client: 'Amara E.', date: '2026-01-10T00:00:00.000Z', featured: false, published: true },
      { id: '4', title: 'Corporate Gala Dinner', slug: 'corporate-gala-dinner', category: 'Corporate', images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600'], description: 'Annual corporate gala dinner with awards ceremony and entertainment.', client: 'First Bank PLC', date: '2025-09-30T00:00:00.000Z', featured: true, published: true },
      { id: '5', title: 'Outdoor Wedding', slug: 'outdoor-wedding', category: 'Wedding', images: ['https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600'], description: 'Beautiful outdoor wedding ceremony by the beach with sunset reception.', client: 'Tunde & Bisola', date: '2026-02-14T00:00:00.000Z', featured: true, published: true },
      { id: '6', title: 'Decoration Showcase', slug: 'decoration-showcase', category: 'Decoration', images: ['https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600'], description: 'Luxury event decoration showcase featuring our award-winning design portfolio.', client: 'SIDMAB Events', date: '2026-03-01T00:00:00.000Z', featured: false, published: true },
      { id: '7', title: 'Birthday Pool Party', slug: 'birthday-pool-party', category: 'Birthday', images: ['https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600'], description: 'Poolside birthday celebration with DJ, catering, and themed decorations.', client: 'David O.', date: '2026-04-05T00:00:00.000Z', featured: false, published: true },
      { id: '8', title: 'Product Launch Event', slug: 'product-launch-event', category: 'Corporate', images: ['https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600'], description: 'Major product launch event with media coverage and VIP guest experience.', client: 'Gloo Technologies', date: '2026-05-20T00:00:00.000Z', featured: true, published: true },
    ]
    fs.writeFileSync(FILE, JSON.stringify(initial, null, 2))
  }
}

export function getItems(category?: string, includeAll?: boolean): PortfolioRecord[] {
  seedIfEmpty()
  const raw = fs.readFileSync(FILE, 'utf-8')
  let items: PortfolioRecord[] = JSON.parse(raw)

  if (category && category !== 'All') {
    items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase())
  }
  if (!includeAll) {
    items = items.filter((i) => i.published)
  }

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getItem(idOrSlug: string): PortfolioRecord | null {
  seedIfEmpty()
  const raw = fs.readFileSync(FILE, 'utf-8')
  const items: PortfolioRecord[] = JSON.parse(raw)
  return items.find((i) => i.id === idOrSlug || i.slug === idOrSlug) || null
}

export function createItem(data: Omit<PortfolioRecord, 'id'>): PortfolioRecord {
  seedIfEmpty()
  const raw = fs.readFileSync(FILE, 'utf-8')
  const items: PortfolioRecord[] = JSON.parse(raw)

  const newItem: PortfolioRecord = {
    id: String(Date.now()),
    ...data,
  }

  items.unshift(newItem)
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2))
  return newItem
}

export function updateItem(id: string, data: Partial<PortfolioRecord>): PortfolioRecord | null {
  seedIfEmpty()
  const raw = fs.readFileSync(FILE, 'utf-8')
  const items: PortfolioRecord[] = JSON.parse(raw)
  const idx = items.findIndex((i) => i.id === id)

  if (idx === -1) return null

  items[idx] = { ...items[idx], ...data }
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2))
  return items[idx]
}

export function deleteItem(id: string): boolean {
  seedIfEmpty()
  const raw = fs.readFileSync(FILE, 'utf-8')
  const items: PortfolioRecord[] = JSON.parse(raw)
  const filtered = items.filter((i) => i.id !== id)

  if (filtered.length === items.length) return false

  fs.writeFileSync(FILE, JSON.stringify(filtered, null, 2))
  return true
}
