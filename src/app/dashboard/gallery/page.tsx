'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Video, Camera, Layers, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { GalleryItem } from '@/types'

const gallerySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  type: z.enum(['image', 'video', 'drone', 'before-after']),
  url: z.string().url('Must be a valid URL'),
  thumbnail: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  before: z.string().optional(),
  after: z.string().optional(),
})

type GalleryFormData = z.infer<typeof gallerySchema>

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

const typeColors = {
  image: 'badge-info',
  video: 'badge-warning',
  drone: 'badge-secondary',
  'before-after': 'badge-accent',
}

const categories = ['Wedding', 'Corporate', 'Birthday', 'Decoration', 'Catering', 'Outdoor', 'Conference']

function toGalleryItem(data: any): GalleryItem {
  return {
    id: data.id,
    title: data.title,
    type: data.type as GalleryItem['type'],
    url: data.url,
    thumbnail: data.thumbnail ?? '',
    category: data.category,
    before: data.before ?? undefined,
    after: data.after ?? undefined,
  }
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [preview, setPreview] = useState<GalleryItem | null>(null)

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      setItems(Array.isArray(data) ? data.map(toGalleryItem) : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { title: '', type: 'image', url: '', thumbnail: '', category: '', before: '', after: '' },
  })

  const watchType = watch('type')

  const openCreate = () => {
    setEditing(null)
    reset({ title: '', type: 'image', url: '', thumbnail: '', category: 'Wedding', before: '', after: '' })
    setShowModal(true)
  }

  const openEdit = (item: GalleryItem) => {
    setEditing(item)
    reset({
      title: item.title,
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail || '',
      category: item.category,
      before: item.before || '',
      after: item.after || '',
    })
    setShowModal(true)
  }

  const onSubmit = async (formData: GalleryFormData) => {
    setSaving(true)
    try {
      const body = {
        title: formData.title,
        type: formData.type,
        url: formData.url,
        thumbnail: formData.thumbnail || null,
        category: formData.category,
        before: formData.before || null,
        after: formData.after || null,
      }

      if (editing) {
        const res = await fetch(`/api/gallery/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Failed to update' }))
          throw new Error(err.error || 'Failed to update')
        }
        const updated = toGalleryItem(await res.json())
        setItems((prev) => prev.map((item) => (item.id === editing.id ? updated : item)))
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Failed to create' }))
          throw new Error(err.error || 'Failed to create')
        }
        const created = toGalleryItem(await res.json())
        setItems((prev) => [created, ...prev])
      }
      setShowModal(false)
      setEditing(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save gallery item')
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to delete' }))
        throw new Error(err.error || 'Failed to delete')
      }
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete gallery item')
    }
    setDeleteConfirm(null)
  }

  const TypeBadge = ({ type }: { type: string }) => {
    const Icon = typeIcons[type as keyof typeof typeIcons] || ImageIcon
    const color = typeColors[type as keyof typeof typeColors] || 'badge-ghost'
    return (
      <span className={`badge ${color} gap-1`}>
        <Icon className="w-3 h-3" />
        {typeLabels[type as keyof typeof typeLabels] || type}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gallery</h1>
          <p className="text-base-content/60 mt-1">Manage your media gallery.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-white">
          <Plus className="w-4 h-4" />
          Add New Item
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-16 text-base-content/40">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No gallery items yet. Click &quot;Add New Item&quot; to get started.</p>
            </div>
          ) : (
            items.map((item) => {
              const Icon = typeIcons[item.type] || ImageIcon
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden group"
                >
                  <figure className="relative aspect-video bg-base-200 overflow-hidden">
                    {item.type === 'before-after' && item.before && item.after ? (
                      <div
                        className="grid grid-cols-2 w-full h-full cursor-pointer"
                        onClick={() => setPreview(item)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={item.before}
                            alt={`${item.title} - Before`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Before</span>
                        </div>
                        <div className="relative overflow-hidden">
                          <img
                            src={item.after}
                            alt={`${item.title} - After`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">After</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setPreview(item)}
                      />
                    )}
                    <div className="absolute top-2 left-2">
                      <TypeBadge type={item.type} />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(item)}
                        className="btn btn-sm btn-ghost text-white hover:bg-white/20"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="btn btn-sm btn-ghost text-error hover:bg-error/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </figure>
                  <div className="card-body p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-base-content/50 mt-0.5">{item.category}</p>
                      </div>
                      <Icon className="w-4 h-4 text-base-content/30 flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card bg-base-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">{editing ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {saving && (
                    <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  )}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Gallery item title"
                      className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                      {...register('title')}
                    />
                    {errors.title && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.title.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Type</span>
                    </label>
                    <select className="select select-bordered" {...register('type')}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="drone">Drone Footage</option>
                      <option value="before-after">Before & After</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className={`input input-bordered ${errors.url ? 'input-error' : ''}`}
                      {...register('url')}
                    />
                    {errors.url && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.url.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Thumbnail URL</span>
                      <span className="label-text-alt text-base-content/40">Optional</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/thumb.jpg"
                      className="input input-bordered"
                      {...register('thumbnail')}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category</span>
                    </label>
                    <select className="select select-bordered" {...register('category')}>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {watchType === 'before-after' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Before Image</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          className="input input-bordered"
                          {...register('before')}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">After Image</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          className="input input-bordered"
                          {...register('after')}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary flex-1 text-white" disabled={saving}>
                      {saving ? 'Saving...' : editing ? 'Update Item' : 'Create Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="font-bold text-lg">Delete Gallery Item?</h3>
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
              {preview.type === 'before-after' && preview.before && preview.after ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-white/60 text-sm mb-1 text-center">Before</p>
                    <img src={preview.before} alt="Before" className="w-full rounded-lg" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1 text-center">After</p>
                    <img src={preview.after} alt="After" className="w-full rounded-lg" />
                  </div>
                </div>
              ) : (
                <img src={preview.url} alt={preview.title} className="w-full rounded-lg" />
              )}
              <p className="text-white/80 text-center mt-3 text-sm">{preview.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
