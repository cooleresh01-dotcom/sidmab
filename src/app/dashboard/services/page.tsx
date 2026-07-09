'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, GripVertical, Check } from 'lucide-react'
import { slugify } from '@/lib/utils'
import Image from 'next/image'

interface Package {
  id?: string
  name: string
  price: number
  description: string
  features: string[]
}

interface ServiceFAQ {
  id?: string
  question: string
  answer: string
}

interface Service {
  id: string
  title: string
  slug: string
  tagline: string
  description: string
  icon: string
  image: string
  features: string[]
  gallery: string[]
  packages: Package[]
  faqs: ServiceFAQ[]
  featured: boolean
  published: boolean
  order: number
  createdAt: string
}

interface FormData {
  title: string
  slug: string
  tagline: string
  description: string
  icon: string
  image: string
  features: string[]
  gallery: string[]
  packages: Package[]
  faqs: ServiceFAQ[]
  featured: boolean
  published: boolean
  order: number
}

const emptyForm: FormData = {
  title: '',
  slug: '',
  tagline: '',
  description: '',
  icon: '',
  image: '',
  features: [''],
  gallery: [''],
  packages: [{ name: '', price: 0, description: '', features: [''] }],
  faqs: [{ question: '', answer: '' }],
  featured: false,
  published: true,
  order: 0,
}

const iconOptions = ['💍', '🏢', '🎂', '🎨', '📋', '🪑', '🍽️', '👔', '🎵', '🎪', '✨', '🎊']

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?all=true')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (service: Service) => {
    setEditing(service)
    setForm({
      title: service.title,
      slug: service.slug,
      tagline: service.tagline,
      description: service.description,
      icon: service.icon,
      image: service.image,
      features: service.features?.length > 0 ? service.features : [''],
      gallery: service.gallery.length > 0 ? service.gallery : [''],
      packages: service.packages.length > 0 ? service.packages : [{ name: '', price: 0, description: '', features: [''] }],
      faqs: service.faqs.length > 0 ? service.faqs : [{ question: '', answer: '' }],
      featured: service.featured,
      published: service.published,
      order: service.order,
    })
    setShowModal(true)
  }

  const updateForm = (key: keyof FormData, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'title') next.slug = slugify(value as string)
      return next
    })
  }

  const updateArrayItem = (parent: 'gallery' | 'packages' | 'faqs', index: number, key: string, value: any) => {
    setForm((prev) => {
      const arr = [...prev[parent]]
      if (parent === 'gallery') {
        (arr as string[])[index] = value
      } else {
        (arr as any[])[index] = { ...(arr as any[])[index], [key]: value }
      }
      return { ...prev, [parent]: arr }
    })
  }

  const addArrayItem = (parent: 'gallery' | 'packages' | 'faqs') => {
    setForm((prev) => {
      if (parent === 'gallery') return { ...prev, gallery: [...prev.gallery, ''] }
      if (parent === 'packages') return { ...prev, packages: [...prev.packages, { name: '', price: 0, description: '', features: [''] }] }
      return { ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }
    })
  }

  const removeArrayItem = (parent: 'gallery' | 'packages' | 'faqs', index: number) => {
    setForm((prev) => {
      const arr = [...prev[parent]]
      arr.splice(index, 1)
      if (arr.length === 0) {
        if (parent === 'gallery') arr.push('')
        else if (parent === 'packages') arr.push({ name: '', price: 0, description: '', features: [''] })
        else arr.push({ question: '', answer: '' })
      }
      return { ...prev, [parent]: arr }
    })
  }

  const updatePackageFeature = (pkgIndex: number, featIndex: number, value: string) => {
    setForm((prev) => {
      const packages = [...prev.packages]
      const pkg = { ...packages[pkgIndex] }
      const features = [...pkg.features]
      features[featIndex] = value
      pkg.features = features
      packages[pkgIndex] = pkg
      return { ...prev, packages }
    })
  }

  const addPackageFeature = (pkgIndex: number) => {
    setForm((prev) => {
      const packages = [...prev.packages]
      packages[pkgIndex] = { ...packages[pkgIndex], features: [...packages[pkgIndex].features, ''] }
      return { ...prev, packages }
    })
  }

  const removePackageFeature = (pkgIndex: number, featIndex: number) => {
    setForm((prev) => {
      const packages = [...prev.packages]
      const pkg = { ...packages[pkgIndex] }
      pkg.features = pkg.features.filter((_, i) => i !== featIndex)
      packages[pkgIndex] = pkg
      return { ...prev, packages }
    })
  }

  const onSubmit = async () => {
    setSaving(true)
    try {
      const body = {
        ...form,
        features: form.features.filter(Boolean),
        gallery: form.gallery.filter(Boolean),
        packages: form.packages.map((p) => ({
          name: p.name,
          price: Number(p.price),
          description: p.description ?? null,
          features: p.features.filter(Boolean),
        })).filter((p) => p.name),
        faqs: form.faqs.filter((f) => f.question).map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      }

      const url = editing ? `/api/services/${editing.id}` : '/api/services'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to save' }))
        throw new Error(err.error || 'Failed to save')
      }
      await fetchServices()
      setShowModal(false)
      setEditing(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const deleteService = async (id: string) => {
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' })
      await fetchServices()
    } catch {}
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
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
          <h1 className="text-2xl lg:text-3xl font-bold">Event Pages</h1>
          <p className="text-base-content/60 mt-1">Manage all event service pages content.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-white">
          <Plus className="w-4 h-4" />
          Add New Event Page
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
                <th></th>
                <th>Title</th>
                <th>Slug</th>
                <th>Published</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-base-content/40">
                    No event pages yet. Click &quot;Add New Event Page&quot; to create one.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="w-10">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="font-medium">
                      <span className="mr-2">{service.icon}</span>
                      {service.title}
                    </td>
                    <td className="text-base-content/60 text-sm">/{service.slug}</td>
                    <td>
                      {service.published ? (
                        <span className="badge badge-success">Published</span>
                      ) : (
                        <span className="badge badge-ghost">Draft</span>
                      )}
                    </td>
                    <td>{service.order}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(service)}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(service.id)}
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
              className="card bg-base-100 shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">{editing ? 'Edit Event Page' : 'New Event Page'}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Title *</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding Planning"
                        className="input input-bordered"
                        value={form.title}
                        onChange={(e) => updateForm('title', e.target.value)}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Slug</span></label>
                      <input
                        type="text"
                        className="input input-bordered text-sm text-base-content/60"
                        value={form.slug}
                        onChange={(e) => updateForm('slug', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Tagline *</span></label>
                    <input
                      type="text"
                      placeholder="Short tagline for the service"
                      className="input input-bordered"
                      value={form.tagline}
                      onChange={(e) => updateForm('tagline', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Description *</span></label>
                    <textarea
                      rows={3}
                      placeholder="Full description of the service"
                      className="textarea textarea-bordered"
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                    />
                  </div>

                  {/* Overview Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label-text font-medium">Overview Features</label>
                      <button type="button" onClick={() => updateForm('features', [...form.features, ''])} className="btn btn-ghost btn-xs">
                        + Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-primary"><Check className="w-4 h-4" /></span>
                          <input
                            type="text"
                            placeholder="e.g. Full planning & coordination"
                            className="input input-bordered input-sm flex-1"
                            value={feat}
                            onChange={(e) => {
                              const next = [...form.features]
                              next[i] = e.target.value
                              updateForm('features', next)
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = form.features.filter((_, j) => j !== i)
                              updateForm('features', next.length > 0 ? next : [''])
                            }}
                            className="btn btn-ghost btn-xs btn-square text-error"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Icon & Image */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Icon</span></label>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map((ic) => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => updateForm('icon', ic)}
                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all ${
                              form.icon === ic ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-primary/30'
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                        <input
                          type="text"
                          placeholder="Or type emoji"
                          className="input input-bordered w-24 text-center"
                          value={!iconOptions.includes(form.icon) ? form.icon : ''}
                          onChange={(e) => updateForm('icon', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Image URL *</span></label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        className="input input-bordered"
                        value={form.image}
                        onChange={(e) => updateForm('image', e.target.value)}
                      />
                      {form.image && (
                        <div className="relative h-24 mt-2 rounded-lg overflow-hidden">
                          <Image src={form.image} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label-text font-medium">Gallery Images</label>
                      <button type="button" onClick={() => addArrayItem('gallery')} className="btn btn-ghost btn-xs">
                        + Add Image
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.gallery.map((url, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-base-content/30 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Image URL"
                            className="input input-bordered input-sm flex-1"
                            value={url}
                            onChange={(e) => updateArrayItem('gallery', i, '', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('gallery', i)}
                            className="btn btn-ghost btn-xs btn-square text-error"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Packages */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label-text font-medium">Packages / Pricing</label>
                      <button type="button" onClick={() => addArrayItem('packages')} className="btn btn-ghost btn-xs">
                        + Add Package
                      </button>
                    </div>
                    <div className="space-y-4">
                      {form.packages.map((pkg, i) => (
                        <div key={i} className="p-4 border border-base-200 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-base-content/60">Package {i + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeArrayItem('packages', i)}
                              className="btn btn-ghost btn-xs btn-square text-error"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Package name"
                              className="input input-bordered input-sm"
                              value={pkg.name}
                              onChange={(e) => updateArrayItem('packages', i, 'name', e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="Price (NGN)"
                              className="input input-bordered input-sm"
                              value={pkg.price || ''}
                              onChange={(e) => updateArrayItem('packages', i, 'price', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Short description"
                              className="input input-bordered input-sm"
                              value={pkg.description}
                              onChange={(e) => updateArrayItem('packages', i, 'description', e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-base-content/50">Features</span>
                              <button type="button" onClick={() => addPackageFeature(i)} className="btn btn-ghost btn-xs">
                                + Add Feature
                              </button>
                            </div>
                            <div className="space-y-1">
                              {pkg.features.map((feat, fi) => (
                                <div key={fi} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Feature"
                                    className="input input-bordered input-xs flex-1"
                                    value={feat}
                                    onChange={(e) => updatePackageFeature(i, fi, e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePackageFeature(i, fi)}
                                    className="btn btn-ghost btn-xs btn-square text-error"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label-text font-medium">FAQs</label>
                      <button type="button" onClick={() => addArrayItem('faqs')} className="btn btn-ghost btn-xs">
                        + Add FAQ
                      </button>
                    </div>
                    <div className="space-y-3">
                      {form.faqs.map((faq, i) => (
                        <div key={i} className="p-4 border border-base-200 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-base-content/60">FAQ {i + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeArrayItem('faqs', i)}
                              className="btn btn-ghost btn-xs btn-square text-error"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question"
                            className="input input-bordered input-sm w-full"
                            value={faq.question}
                            onChange={(e) => updateArrayItem('faqs', i, 'question', e.target.value)}
                          />
                          <textarea
                            placeholder="Answer"
                            rows={2}
                            className="textarea textarea-bordered textarea-sm w-full"
                            value={faq.answer}
                            onChange={(e) => updateArrayItem('faqs', i, 'answer', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Order</span></label>
                      <input
                        type="number"
                        className="input input-bordered"
                        value={form.order}
                        onChange={(e) => updateForm('order', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={form.published}
                          onChange={(e) => updateForm('published', e.target.checked)}
                        />
                        <span className="label-text font-medium">Published</span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={form.featured}
                          onChange={(e) => updateForm('featured', e.target.checked)}
                        />
                        <span className="label-text font-medium">Featured</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-base-200">
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={saving || !form.title || !form.description}
                      className="btn btn-primary flex-1 text-white"
                    >
                      {saving ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : editing ? (
                        'Update Event Page'
                      ) : (
                        'Create Event Page'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
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
                <h3 className="font-bold text-lg">Delete Event Page?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deleteService(deleteConfirm)}
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
