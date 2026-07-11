'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Users } from 'lucide-react'
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { TeamMember } from '@/types'

const teamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  image: z.string().url('Must be a valid image URL'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  experience: z.number().min(0, 'Experience must be a positive number'),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  published: z.boolean(),
  order: z.number().min(0),
})

type TeamFormData = z.infer<typeof teamSchema>

function toMember(data: any): TeamMember {
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    image: data.image,
    bio: data.bio,
    experience: data.experience,
    published: data.published,
    socials: {
      linkedin: data.linkedin || undefined,
      twitter: data.twitter || undefined,
      instagram: data.instagram || undefined,
      facebook: data.facebook || undefined,
    },
  }
}

const socialIcons: Record<string, React.ElementType> = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
}

const socialColors: Record<string, string> = {
  linkedin: 'text-[#0A66C2]',
  twitter: 'text-[#1DA1F2]',
  instagram: 'text-[#E4405F]',
  facebook: 'text-[#1877F2]',
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchMembers = () => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        setMembers((data || []).map(toMember))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchMembers() }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '', role: '', image: '', bio: '',
      experience: 0, linkedin: '', twitter: '', instagram: '',
      facebook: '', published: true, order: 0,
    },
  })

  const openCreate = () => {
    setEditing(null)
    reset({
      name: '', role: '', image: '', bio: '',
      experience: 0, linkedin: '', twitter: '', instagram: '',
      facebook: '', published: true, order: members.length,
    })
    setShowModal(true)
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    reset({
      name: member.name,
      role: member.role,
      image: member.image,
      bio: member.bio,
      experience: member.experience,
      linkedin: member.socials.linkedin || '',
      twitter: member.socials.twitter || '',
      instagram: member.socials.instagram || '',
      facebook: member.socials.facebook || '',
      published: member.published,
      order: members.findIndex((m) => m.id === member.id),
    })
    setShowModal(true)
  }

  const onSubmit = async (data: TeamFormData) => {
    setSaving(true)
    const payload = {
      name: data.name,
      role: data.role,
      image: data.image,
      bio: data.bio,
      experience: data.experience,
      published: data.published,
      order: data.order,
      linkedin: data.linkedin || null,
      twitter: data.twitter || null,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
    }

    try {
      if (editing) {
        const res = await fetch(`/api/team/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to update') }
      } else {
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to create') }
      }
      setShowModal(false)
      setEditing(null)
      fetchMembers()
      setError('')
    } catch (e: any) {
      setError(e.message)
    }
    setSaving(false)
  }

  const deleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to delete') }
      fetchMembers()
      setError('')
    } catch (e: any) {
      setError(e.message)
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Team</h1>
          <p className="text-base-content/60 mt-1">Manage your team members.</p>
        </div>
          <button onClick={openCreate} className="btn btn-primary text-white">
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
      </motion.div>

      {error && (
        <div className="alert alert-error text-sm">
          {error}
          <button onClick={() => setError('')} className="btn btn-ghost btn-xs">X</button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {loading ? (
          <div className="col-span-full text-center py-16 text-base-content/40">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-16 text-base-content/40">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No team members yet. Click &quot;Add Team Member&quot; to get started.</p>
          </div>
        ) : (
          members.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 shadow-sm border border-base-200 rounded-2xl overflow-hidden group"
            >
              <div className="relative w-full aspect-square bg-base-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <button
                    onClick={() => openEdit(member)}
                    className="btn btn-sm btn-circle btn-ghost text-white bg-black/30 hover:bg-black/50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(member.id)}
                    className="btn btn-sm btn-circle btn-ghost text-error bg-black/30 hover:bg-black/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {!member.published && (
                  <span className="absolute top-2 left-2 badge badge-ghost text-xs z-10">Draft</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-xs text-base-content/60 mt-1 line-clamp-2">{member.bio}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-base-content/40">{member.experience} years exp.</span>
                </div>
                {Object.entries(member.socials).filter(([, url]) => url).length > 0 && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-base-200">
                    {Object.entries(member.socials).map(([platform, url]) => {
                      if (!url) return null
                      const Icon = socialIcons[platform as keyof typeof socialIcons]
                      const color = socialColors[platform] || 'text-base-content/40'
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${color} hover:opacity-80 transition-opacity`}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
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
                  <h2 className="card-title">{editing ? 'Edit Team Member' : 'Add Team Member'}</h2>
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
                        placeholder="Full name"
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
                        placeholder="e.g. Creative Director"
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
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief biography..."
                      className={`textarea textarea-bordered ${errors.bio ? 'textarea-error' : ''}`}
                      {...register('bio')}
                    />
                    {errors.bio && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.bio.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Experience (years)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        className={`input input-bordered ${errors.experience ? 'input-error' : ''}`}
                        {...register('experience', { valueAsNumber: true })}
                      />
                      {errors.experience && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.experience.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Display Order</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="input input-bordered"
                        {...register('order', { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="divider text-xs text-base-content/40">Social Links</div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />
                        <span className="label-text font-medium ml-2">LinkedIn</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        className="input input-bordered"
                        {...register('linkedin')}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <FaTwitter className="w-4 h-4 text-[#1DA1F2]" />
                        <span className="label-text font-medium ml-2">Twitter</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/..."
                        className="input input-bordered"
                        {...register('twitter')}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <FaInstagram className="w-4 h-4 text-[#E4405F]" />
                        <span className="label-text font-medium ml-2">Instagram</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/..."
                        className="input input-bordered"
                        {...register('instagram')}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <FaFacebook className="w-4 h-4 text-[#1877F2]" />
                        <span className="label-text font-medium ml-2">Facebook</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/..."
                        className="input input-bordered"
                        {...register('facebook')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        {...register('published')}
                      />
                      <span className="text-sm font-medium">Published</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary flex-1 text-white" disabled={saving}>
                      {saving ? 'Saving...' : editing ? 'Update Member' : 'Add Member'}
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
                <h3 className="font-bold text-lg">Delete Team Member?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deleteMember(deleteConfirm)}
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
