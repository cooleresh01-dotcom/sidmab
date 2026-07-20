'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HiSearch, HiX } from 'react-icons/hi'
import { Layers, Image as ImageIcon, Video, Camera } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import { useSettings } from '@/hooks/useSettings'
import type { GalleryItem } from '@/types'

const typeIcons = {
  image: ImageIcon,
  video: Video,
  drone: Camera,
  'before-after': Layers,
}

const typeLabels = {
  image: 'Image',
  video: 'Video',
  drone: 'Drone',
  'before-after': 'Before & After',
}

function GalleryGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [filter, setFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<GalleryItem[]>([])
  const [preview, setPreview] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
  }, [])

  const categories = ['All', ...new Set(items.map((i) => i.category))]
  const types = ['all', 'image', 'video', 'drone', 'before-after']

  const filtered = items.filter((item) => {
    const matchesCategory = filter === 'All' || item.category === filter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
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
                className={`btn btn-sm rounded-full transition-colors ${
                  filter === cat
                    ? 'text-white'
                    : 'btn-ghost'
                }`}
                style={filter === cat ? { background: 'var(--site-primary)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-base-200 rounded-full p-1">
              {types.map((t) => {
                const Icon = t === 'all' ? ImageIcon : typeIcons[t as keyof typeof typeIcons]
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`p-2 rounded-full transition-colors ${
                      typeFilter === t
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-base-content/40 hover:text-base-content'
                    }`}
                    title={t === 'all' ? 'All types' : typeLabels[t as keyof typeof typeLabels]}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                )
              })}
            </div>

            <div className="relative w-full md:w-56">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered input-sm w-full pl-9 rounded-full"
              />
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => {
            const Icon = typeIcons[item.type] || ImageIcon
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative overflow-hidden rounded-xl group cursor-pointer"
                onClick={() => setPreview(item)}
              >
                <div className="relative aspect-video bg-base-200 overflow-hidden">
                  {item.type === 'before-after' && item.before && item.after ? (
                    <div className="grid grid-cols-2 w-full h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={item.before}
                          alt={`${item.title} - Before`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Before</span>
                      </div>
                      <div className="relative overflow-hidden">
                        <img
                          src={item.after}
                          alt={`${item.title} - After`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">After</span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="badge badge-sm bg-black/50 text-white border-0 gap-1">
                      <Icon className="w-3 h-3" />
                      {typeLabels[item.type as keyof typeof typeLabels]}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-white/70">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-base-content/50"
          >
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No gallery items found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full"
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white"
              >
                <HiX className="w-8 h-8" />
              </button>
              {preview.type === 'before-after' && preview.before && preview.after ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-white/60 text-sm mb-2 text-center font-medium">Before</p>
                    <img src={preview.before} alt="Before" className="w-full rounded-lg" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-2 text-center font-medium">After</p>
                    <img src={preview.after} alt="After" className="w-full rounded-lg" />
                  </div>
                </div>
              ) : preview.type === 'video' ? (
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video src={preview.url} controls className="w-full rounded-lg" />
                </div>
              ) : (
                <img src={preview.url} alt={preview.title} className="w-full rounded-lg" />
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-white/80 text-sm font-medium">{preview.title}</p>
                <span className="text-white/40 text-xs">{preview.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function GalleryPage() {
  const { settings } = useSettings()
  return (
    <>
      <PageHero
        title={settings?.galleryPageTitle || 'Our Gallery'}
        subtitle={settings?.galleryPageSubtitle || 'A visual showcase of our events, decorations, and memorable moments.'}
        image={settings?.galleryPageImage || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920'}
        badge={settings?.galleryPageBadge || 'Gallery'}
      />
      <GalleryGrid />
    </>
  )
}
