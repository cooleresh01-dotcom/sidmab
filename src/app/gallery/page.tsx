'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HiPhotograph, HiPlay, HiX } from 'react-icons/hi'
import { FaYoutube } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'

const galleryTabs = [
  { id: 'photos', label: 'Photos' },
  { id: 'videos', label: 'Videos' },
  { id: 'drone', label: 'Drone Footage' },
  { id: 'before-after', label: 'Before & After' },
]

const galleryCategories = ['All', 'Wedding', 'Corporate', 'Birthday', 'Decoration']

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', category: 'Wedding', title: 'Elegant Wedding Reception' },
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', category: 'Corporate', title: 'Corporate Gala Dinner' },
  { src: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600', category: 'Decoration', title: 'Luxury Event Setup' },
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600', category: 'Decoration', title: 'Floral Decoration' },
  { src: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600', category: 'Birthday', title: 'Birthday Celebration' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', category: 'Wedding', title: 'Outdoor Wedding' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', category: 'Corporate', title: 'Tech Conference' },
  { src: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600', category: 'Birthday', title: 'Pool Party' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', category: 'Wedding', title: 'Wedding Decor' },
  { src: 'https://images.unsplash.com/photo-1475721027785-74f2ea81e8e9?w=600', category: 'Corporate', title: 'Product Launch' },
  { src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600', category: 'Birthday', title: 'Kids Birthday Party' },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600', category: 'Wedding', title: 'Wedding Ceremony' },
]

const videos = [
  { id: 1, title: 'Wedding Highlights', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
  { id: 2, title: 'Corporate Event Recap', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
  { id: 3, title: 'Birthday Moments', thumbnail: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600' },
  { id: 4, title: 'Decoration Timelapse', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600' },
]

function PhotosTab() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [catFilter, setCatFilter] = useState('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filtered = catFilter === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === catFilter)

  return (
    <div ref={ref}>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {galleryCategories.map((cat) => (
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
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl group break-inside-avoid cursor-pointer"
            onClick={() => setSelectedImage(img.src)}
          >
            <div className="relative" style={{ height: `${200 + (i % 4) * 80}px` }}>
              <Image
                src={img.src}
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

function VideosTab() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref}>
      <div className="grid sm:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <figure className="relative h-56 overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/80 transition-colors duration-300">
                  <FaYoutube className="w-7 h-7 text-white ml-0.5" />
                </div>
              </div>
            </figure>
            <div className="card-body p-4">
              <h3 className="font-semibold">{video.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DroneTab() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const droneImages = [
    { src: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800', title: 'Venue Aerial View' },
    { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Event Grounds' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', title: 'Outdoor Setup' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', title: 'Grand Venue' },
  ]

  return (
    <div ref={ref}>
      <div className="grid sm:grid-cols-2 gap-6">
        {droneImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl group h-72"
          >
            <Image
              src={img.src}
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
    </div>
  )
}

function BeforeAfterTab() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const transformations = [
    {
      before: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
      after: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      title: 'Hall Transformation',
    },
    {
      before: 'https://images.unsplash.com/photo-1475721027785-74f2ea81e8e9?w=600',
      after: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
      title: 'Garden Setup',
    },
    {
      before: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      after: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600',
      title: 'Birthday Venue',
    },
  ]

  return (
    <div ref={ref}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformations.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card bg-base-100 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-0">
              <div className="relative h-48">
                <Image
                  src={item.before}
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
                  src={item.after}
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
    </div>
  )
}

function GalleryContent() {
  const [activeTab, setActiveTab] = useState('photos')

  const tabComponents: Record<string, React.ReactNode> = {
    photos: <PhotosTab />,
    videos: <VideosTab />,
    drone: <DroneTab />,
    'before-after': <BeforeAfterTab />,
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
            {tabComponents[activeTab]}
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
