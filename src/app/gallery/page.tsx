'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HiPhotograph, HiPlay, HiX } from 'react-icons/hi'
import { FaYoutube } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'

interface GalleryItem {
  id: string
  title: string
  type: 'image' | 'video' | 'drone' | 'before-after'
  url: string
  thumbnail?: string | null
  category: string
  before?: string | null
  after?: string | null
}

function getYoutubeEmbed(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url
}

const galleryTabs = [
  { id: 'photos', label: 'Photos', type: 'image' },
  { id: 'videos', label: 'Videos', type: 'video' },
  { id: 'drone', label: 'Drone Footage', type: 'drone' },
  { id: 'before-after', label: 'Before & After', type: 'before-after' },
]

const categories = ['All', 'Wedding', 'Corporate', 'Birthday', 'Decoration']

function PhotosTab({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [catFilter, setCatFilter] = useState('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filtered = catFilter === 'All'
    ? items
    : items.filter((img) => img.category === catFilter)

  return (
    <div ref={ref}>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={cn(
              'btn btn-sm rounded-full',
              catFilter === cat ? 'btn-primary text-white' : 'btn-ghost'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl group break-inside-avoid cursor-pointer"
            onClick={() => setSelectedImage(img.url)}
          >
            <div className="relative" style={{ height: `${200 + (i % 4) * 80}px` }}>
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <HiPlay className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">{img.title}</p>
                <p className="text-white/60 text-xs">{img.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <HiX className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full h-[80vh]"
            >
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VideosTab({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return (
    <div ref={ref}>
      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No videos yet. Add some from the dashboard.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <button
                onClick={() => setSelectedVideo(video.url ? getYoutubeEmbed(video.url) : '')}
                className="w-full text-left"
              >
                <figure className="relative h-56 overflow-hidden">
                  <Image
                    src={video.thumbnail || video.url}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/80 transition-colors duration-300">
                      <FaYoutube className="w-7 h-7 text-white ml-0.5" />
                    </div>
                  </div>
                </figure>
                <div className="card-body p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <HiX className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={selectedVideo}
                className="w-full h-full rounded-2xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DroneTab({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref}>
      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No drone footage yet. Add some from the dashboard.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-xl group h-72"
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function BeforeAfterTab({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref}>
      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No before & after sets yet. Add some from the dashboard.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-base-100 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-0">
                <div className="relative h-48">
                  <Image
                    src={item.before || item.url}
                    alt={`${item.title} Before`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                    Before
                  </div>
                </div>
                <div className="relative h-48">
                  <Image
                    src={item.after || item.url}
                    alt={`${item.title} After`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/80 text-white text-xs rounded">
                    After
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <h3 className="font-semibold text-sm">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryContent() {
  const [activeTab, setActiveTab] = useState('photos')
  const [allItems, setAllItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data: GalleryItem[]) => setAllItems(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const photos = allItems.filter((i) => i.type === 'image')
  const videos = allItems.filter((i) => i.type === 'video')
  const drone = allItems.filter((i) => i.type === 'drone')
  const beforeAfter = allItems.filter((i) => i.type === 'before-after')

  const tabComponents: Record<string, React.ReactNode> = {
    photos: <PhotosTab items={photos} />,
    videos: <VideosTab items={videos} />,
    drone: <DroneTab items={drone} />,
    'before-after': <BeforeAfterTab items={beforeAfter} />,
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Event Gallery
          </h2>
          <p className="text-base-content/70">
            Browse through photos, videos, and more from our events.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist">
          {galleryTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'btn rounded-full',
                activeTab === tab.id
                  ? 'btn-primary text-white'
                  : 'btn-ghost'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : (
              tabComponents[activeTab]
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Explore our collection of event memories."
        image="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
        badge="Explore"
      />
      <GalleryContent />
    </>
  )
}
