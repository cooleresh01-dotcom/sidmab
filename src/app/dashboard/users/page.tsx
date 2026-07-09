'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, UserCircle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { User, UserRole } from '@/types'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['admin', 'editor', 'viewer', 'client']),
  image: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

const roleIcons: Record<UserRole, React.ElementType> = {
  admin: ShieldAlert,
  editor: ShieldCheck,
  viewer: Shield,
  client: UserCircle,
}

const roleColors: Record<UserRole, string> = {
  admin: 'badge-error',
  editor: 'badge-warning',
  viewer: 'badge-ghost',
  client: 'badge-info',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchUsers = () => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', password: '', role: 'viewer', image: '' },
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', email: '', password: '', role: 'viewer', image: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (user: User) => {
    setEditing(user)
    reset({ name: user.name, email: user.email, password: '', role: user.role, image: user.image || '' })
    setError('')
    setShowModal(true)
  }

  const onSubmit = async (data: UserFormData) => {
    setError('')
    try {
      if (editing) {
        const { password, ...rest } = data
        const res = await fetch(`/api/users/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest),
        })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to update') }
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to create') }
      }
      fetchUsers()
      setShowModal(false)
      setEditing(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to delete') }
      fetchUsers()
    } catch {}
    setDeleteConfirm(null)
  }

  const RoleBadge = ({ role }: { role: UserRole }) => {
    const Icon = roleIcons[role]
    const color = roleColors[role]
    return (
      <span className={`badge ${color} gap-1`}>
        <Icon className="w-3 h-3" />
        {role}
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
          <h1 className="text-2xl lg:text-3xl font-bold">Users</h1>
          <p className="text-base-content/60 mt-1">Manage user accounts and permissions.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-white">
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-sm border border-base-200"
      >
        {loading ? (
          <div className="text-center py-16 text-base-content/40">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base-content/40">
                            <UserCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/60">{user.email}</td>
                  <td><RoleBadge role={user.role} /></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="btn btn-ghost btn-sm btn-square"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="btn btn-ghost btn-sm btn-square text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              className="card bg-base-100 shadow-xl w-full max-w-lg"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">{editing ? 'Edit User' : 'Create User'}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {error && (
                  <div className="alert alert-error text-sm mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="form-control">
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

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                      {...register('email')}
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.email.message}</span>
                      </label>
                    )}
                  </div>

                  {!editing && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Create a password"
                        className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                        {...register('password')}
                      />
                      {errors.password && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.password.message}</span>
                        </label>
                      )}
                    </div>
                  )}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Role</span>
                    </label>
                    <select className="select select-bordered" {...register('role')}>
                      <option value="client">Client</option>
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Image URL</span>
                      <span className="label-text-alt text-base-content/40">Optional</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="input input-bordered"
                      {...register('image')}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary flex-1 text-white">
                      {editing ? 'Update User' : 'Create User'}
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
                <h3 className="font-bold text-lg">Delete User?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deleteUser(deleteConfirm)}
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
