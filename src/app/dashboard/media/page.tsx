'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, X, Image, Film, File, Copy, Check, Search } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface MediaItem {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: Date
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const initialMedia: MediaItem[] = [
  { id: '1', name: 'wedding-ceremony.jpg', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', type: 'image/jpeg', size: 245000, createdAt: new Date('2026-06-15') },
  { id: '2', name: 'conference-hall.jpg', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', type: 'image/jpeg', size: 182000, createdAt: new Date('2026-06-14') },
  { id: '3', name: 'birthday-decor.jpg', url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600', type: 'image/jpeg', size: 198000, createdAt: new Date('2026-06-12') },
  { id: '4', name: 'garden-reception.jpg', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', type: 'image/jpeg', size: 312000, createdAt: new Date('2026-06-10') },
  { id: '5', name: 'stage-design.jpg', url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600', type: 'image/jpeg', size: 167000, createdAt: new Date('2026-06-08') },
  { id: '6', name: 'catering-platter.jpg', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600', type: 'image/jpeg', size: 223000, createdAt: new Date('2026-06-05') },
  { id: '7', name: 'decor-showcase.jpg', url: 'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600', type: 'image/jpeg', size: 289000, createdAt: new Date('2026-06-03') },
  { id: '8', name: 'pool-party.jpg', url: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600', type: 'image/jpeg', size: 156000, createdAt: new Date('2026-06-01') },
  { id: '9', name: 'corporate-gala.jpg', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', type: 'image/jpeg', size: 234000, createdAt: new Date('2026-05-28') },
  { id: '10', name: 'product-launch.jpg', url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600', type: 'image/jpeg', size: 198000, createdAt: new Date('2026-05-25') },
  { id: '11', name: 'promo-video.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video/mp4', size: 5200000, createdAt: new Date('2026-05-20') },
  { id: '12', name: 'brand-logo.png', url: 'https://images.unsplash.com/photo-1494888428122-1e1c8f5c6f82?w=200', type: 'image/png', size: 45000, createdAt: new Date('2026-05-15') },
]

const fileTypeIcons: Record<string, React.ElementType> = {
  image: Image,
  video: Film,
  default: File,
}

function getFileTypeGroup(type: string): string {
  if (type.startsWith('image')) return 'image'
  if (type.startsWith('video')) return 'video'
  return 'default'
}

const tabs = ['All', 'Images', 'Videos', 'Documents']

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [preview, setPreview] = useState<MediaItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const filtered = media.filter((item) => {
    const matchesTab = activeTab === 'All' || getFileTypeGroup(item.type) === activeTab.toLowerCase()
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const deleteItem = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id))
    setDeleteConfirm(null)
  }

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {}
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const newItem: MediaItem = {
        id: generateId(),
        name: file.name,
        url,
        type: file.type,
        size: file.size,
        createdAt: new Date(),
      }
      setMedia((prev) => [newItem, ...prev])
    })
  }

  const gridClass = activeTab === 'All'
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Media Library</h1>
          <p className="text-base-content/60 mt-1">Upload and manage your media files.</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-base-content/40">
            {media.length} file{media.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary text-white"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="tabs tabs-box">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab tab-sm ${activeTab === tab ? 'tab-active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <label className="input input-bordered input-sm flex items-center gap-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search files..."
            className="grow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-base-300 hover:border-base-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileUpload(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto text-base-content/30" />
        <p className="text-sm text-base-content/50 mt-2">
          Drag & drop files here, or click to browse
        </p>
        <p className="text-xs text-base-content/30 mt-1">
          Supports images and videos
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{search ? 'No files match your search.' : 'No files yet. Upload your first file above.'}</p>
        </div>
      ) : (
        <div className={`grid ${gridClass} gap-3`}>
          {filtered.map((item) => {
            const Icon = fileTypeIcons[getFileTypeGroup(item.type)] || fileTypeIcons.default
            const isImage = item.type.startsWith('image')

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden group"
              >
                <figure className="aspect-square bg-base-200 relative overflow-hidden">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => setPreview(item)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-10 h-10 text-base-content/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    {isImage && (
                      <button
                        onClick={() => setPreview(item)}
                        className="btn btn-xs btn-ghost text-white hover:bg-white/20"
                      >
                        <Image className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      className="btn btn-xs btn-ghost text-white hover:bg-white/20"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="btn btn-xs btn-ghost text-error hover:bg-error/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </figure>
                <div className="p-2.5">
                  <p className="text-xs font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-base-content/40 mt-0.5">
                    {formatSize(item.size)} &middot; {formatDate(item.createdAt)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="card bg-base-100 shadow-xl w-full max-w-sm"
            >
              <div className="card-body p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-error" />
                </div>
                <h3 className="font-bold text-lg">Delete File?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deleteItem(deleteConfirm)}
                    className="btn btn-error flex-1 text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute -top-10 right-0 text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={preview.url} alt={preview.name} className="w-full rounded-lg max-h-[80vh] object-contain" />
              <div className="flex items-center justify-between mt-3">
                <p className="text-white/80 text-sm">{preview.name}</p>
                <button
                  onClick={() => copyUrl(preview.url, preview.id)}
                  className="btn btn-xs btn-ghost text-white/60 hover:text-white"
                >
                  {copiedId === preview.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy URL
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
