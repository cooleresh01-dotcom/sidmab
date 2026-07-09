'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, MessageSquareQuote, Star, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Testimonial } from '@/types'

const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().optional(),
  image: z.string().url('Must be a valid image URL'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5),
  video: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/testimonials?published=false')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '', role: '', company: '', image: '',
      content: '', rating: 5, video: '', featured: false, published: true,
    },
  })

  const openCreate = () => {
    setEditing(null)
    reset({
      name: '', role: '', company: '', image: '',
      content: '', rating: 5, video: '', featured: false, published: true,
    })
    setShowModal(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    reset({
      name: item.name,
      role: item.role,
      company: item.company,
      image: item.image,
      content: item.content,
      rating: item.rating,
      video: item.video || '',
      featured: item.featured,
      published: item.published,
    })
    setShowModal(true)
  }

  const onSubmit = async (data: TestimonialFormData) => {
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/testimonials?id=${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            company: data.company || '',
            video: data.video || undefined,
          }),
        })
        if (!res.ok) throw new Error('Failed to update')
        const updated = await res.json()
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editing.id ? updated : t))
        )
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            company: data.company || '',
            video: data.video || undefined,
          }),
        })
        if (!res.ok) throw new Error('Failed to create')
        const created = await res.json()
        setTestimonials((prev) => [created, ...prev])
      }
      setShowModal(false)
      setEditing(null)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      console.error(e)
    }
    setDeleteConfirm(null)
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-warning fill-warning' : 'text-base-content/20'}`}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Testimonials</h1>
            <p className="text-base-content/60 mt-1">Manage client testimonials.</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary text-white">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.length === 0 ? (
            <div className="col-span-full text-center py-16 text-base-content/40">
              <MessageSquareQuote className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No testimonials yet. Click &quot;Add Testimonial&quot; to get started.</p>
            </div>
          ) : (
          testimonials.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-base-content/60">
                        {item.role}{item.company ? `, ${item.company}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="btn btn-ghost btn-xs btn-square"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="btn btn-ghost btn-xs btn-square text-error"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <StarRating rating={item.rating} />
                </div>

                <p className="text-sm text-base-content/80 mt-2 line-clamp-3">&ldquo;{item.content}&rdquo;</p>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-base-200">
                  {item.featured && (
                    <span className="badge badge-warning badge-xs gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {item.published ? (
                    <span className="badge badge-success badge-xs gap-1">
                      <Eye className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-xs gap-1">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
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
                  <h2 className="card-title">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control col-span-2 sm:col-span-1">
                      <label className="label">
                        <span className="label-text font-medium">Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Client name"
                        className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                        {...register('name')}
                      />
                      {errors.name && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.name.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control col-span-2 sm:col-span-1">
                      <label className="label">
                        <span className="label-text font-medium">Role</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Happy Couple"
                        className={`input input-bordered ${errors.role ? 'input-error' : ''}`}
                        {...register('role')}
                      />
                      {errors.role && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.role.message}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Company</span>
                        <span className="label-text-alt text-base-content/40">Optional</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Company name"
                        className="input input-bordered"
                        {...register('company')}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Rating</span>
                      </label>
                       <select className="select select-bordered" {...register('rating', { valueAsNumber: true })}>
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Image URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className={`input input-bordered ${errors.image ? 'input-error' : ''}`}
                      {...register('image')}
                    />
                    {errors.image && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.image.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Testimonial</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="What did the client say?"
                      className={`textarea textarea-bordered ${errors.content ? 'textarea-error' : ''}`}
                      {...register('content')}
                    />
                    {errors.content && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.content.message}</span>
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
                    <button type="submit" className="btn btn-primary flex-1 text-white" disabled={saving}>
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : editing ? 'Update Testimonial' : 'Add Testimonial'}
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
                <h3 className="font-bold text-lg">Delete Testimonial?</h3>
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
    </div>
  )
}
