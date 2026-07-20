'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { HiSearch, HiPhotograph } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import { useSettings } from '@/hooks/useSettings'


interface PortfolioItem {
  id: string
  title: string
  slug: string
  category: string
  images: string[]
  description: string
  client: string
  date: string
  featured: boolean
}

function PortfolioGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<PortfolioItem[]>([])

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
  }, [])

  const categories = ['All', ...new Set(items.map((i) => i.category))]

  const filtered = items.filter((item) => {
    const matchesCategory = filter === 'All' || item.category === filter
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'btn rounded-full',
                  filter === cat ? 'btn-primary text-white' : 'btn-ghost'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm w-full pl-9 rounded-full"
            />
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                'relative overflow-hidden rounded-xl',
                i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              )}
            >
              <Link href={`/portfolio/${item.id}`} className="block w-full h-full group cursor-pointer">
                <div className="relative h-64 sm:h-full min-h-[200px]">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.category}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-base-content/50"
          >
            <HiPhotograph className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default function PortfolioPage() {
  const { settings } = useSettings()
  return (
    <>
      <PageHero
        title={settings?.portfolioPageTitle || 'Our Portfolio'}
        subtitle={settings?.portfolioPageSubtitle || 'A showcase of our finest events and celebrations.'}
        image={settings?.portfolioPageImage || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920'}
        badge={settings?.portfolioPageBadge || 'Our Work'}
      />
      <PortfolioGrid />
    </>
  )
}
