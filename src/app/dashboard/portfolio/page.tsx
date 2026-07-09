'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Briefcase, Star, Eye, EyeOff, Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const portfolioSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  client: z.string().min(2, 'Client name is required'),
  images: z.string().min(1, 'At least one image URL is required'),
  video: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  published: z.boolean(),
  featured: z.boolean(),
})

type PortfolioFormData = z.infer<typeof portfolioSchema>

interface PortfolioItem {
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

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '', category: '', description: '', client: '',
      images: '', video: '', date: '', published: true, featured: false,
    },
  })

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/portfolio?includeAll=true')
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (Array.isArray(data)) setItems(data)
    } catch (err) {
      console.error('Failed to fetch portfolio items', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openCreate = () => {
    setEditing(null)
    reset({
      title: '', category: '', description: '', client: '',
      images: '', video: '', date: new Date().toISOString().split('T')[0],
      published: true, featured: false,
    })
    setShowModal(true)
  }

  const openEdit = (item: PortfolioItem) => {
    setEditing(item)
    reset({
      title: item.title,
      category: item.category,
      description: item.description,
      client: item.client,
      images: item.images.join('\n'),
      video: item.video || '',
      date: new Date(item.date).toISOString().split('T')[0],
      published: item.published,
      featured: item.featured,
    })
    setShowModal(true)
  }

  const onSubmit = async (data: PortfolioFormData) => {
    const images = data.images.split('\n').map((url) => url.trim()).filter(Boolean)
    const body = {
      title: data.title,
      slug: slugify(data.title),
      category: data.category,
      description: data.description,
      client: data.client,
      images,
      video: data.video || undefined,
      date: new Date(data.date).toISOString(),
      published: data.published,
      featured: data.featured,
    }

    try {
      if (editing) {
        const res = await fetch(`/api/portfolio/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to update')
      } else {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to create')
      }
      await fetchItems()
    } catch (err) {
      console.error(err)
    }

    setShowModal(false)
    setEditing(null)
  }

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchItems()
    } catch (err) {
      console.error(err)
    }
    setDeleteConfirm(null)
  }

  const CategoryBadge = ({ category }: { category: string }) => (
    <span className="badge badge-ghost badge-sm">{category}</span>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 animate-spin text-base-content/40" />
      </div>
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
          <h1 className="text-2xl lg:text-3xl font-bold">Portfolio</h1>
          <p className="text-base-content/60 mt-1">Manage your project portfolio.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-white">
          <Plus className="w-4 h-4" />
          Add New Project
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Client</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-base-content/40">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No portfolio items yet. Click &quot;Add New Project&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-200 flex-shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setPreview(item.images[0])}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-base-content/50">/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td><CategoryBadge category={item.category} /></td>
                    <td className="text-sm">{item.client}</td>
                    <td className="text-sm text-base-content/60">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {item.featured && (
                          <span className="badge badge-warning badge-sm gap-1">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        {item.published ? (
                          <span className="badge badge-success badge-sm gap-1">
                            <Eye className="w-3 h-3" />
                            Published
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm gap-1">
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="btn btn-ghost btn-sm btn-square text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

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
                  <h2 className="card-title">{editing ? 'Edit Project' : 'Add New Project'}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Project title"
                      className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                      {...register('title')}
                    />
                    {errors.title && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.title.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Category</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding, Corporate, Birthday"
                        className={`input input-bordered ${errors.category ? 'input-error' : ''}`}
                        {...register('category')}
                      />
                      {errors.category && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.category.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Event Date</span>
                      </label>
                      <input
                        type="date"
                        className={`input input-bordered ${errors.date ? 'input-error' : ''}`}
                        {...register('date')}
                      />
                      {errors.date && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.date.message}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Client</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Client name"
                      className={`input input-bordered ${errors.client ? 'input-error' : ''}`}
                      {...register('client')}
                    />
                    {errors.client && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.client.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the project..."
                      className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
                      {...register('description')}
                    />
                    {errors.description && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.description.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Image URLs</span>
                      <span className="label-text-alt text-base-content/40">One per line</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="https://example.com/image1.jpg"
                      className={`textarea textarea-bordered ${errors.images ? 'textarea-error' : ''}`}
                      {...register('images')}
                    />
                    {errors.images && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.images.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Video URL</span>
                      <span className="label-text-alt text-base-content/40">Optional</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="input input-bordered"
                      {...register('video')}
                    />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        {...register('published')}
                      />
                      <span className="text-sm font-medium">Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-warning checkbox-sm"
                        {...register('featured')}
                      />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary flex-1 text-white">
                      {editing ? 'Update Project' : 'Create Project'}
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
                <h3 className="font-bold text-lg">Delete Project?</h3>
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
              className="relative max-w-4xl max-h-[90vh]"
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute -top-10 right-0 text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={preview} alt="Preview" className="max-h-[85vh] w-auto rounded-lg mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
