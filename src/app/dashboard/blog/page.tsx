'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, FileText, Eye, EyeOff, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generateId, slugify } from '@/lib/utils'
import type { BlogPost } from '@/types'

const blogSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  image: z.string().url('Must be a valid image URL'),
  author: z.string().min(2, 'Author name is required'),
  tags: z.string().min(1, 'At least one tag is required'),
  published: z.boolean(),
  featured: z.boolean(),
})

type BlogFormData = z.infer<typeof blogSchema>

const initialPosts: BlogPost[] = [
  { id: '1', title: '10 Tips for Planning the Perfect Wedding', slug: 'tips-for-perfect-wedding', excerpt: 'Planning a wedding can be overwhelming. Here are our top tips to make the process smooth and enjoyable.', content: 'Start Early. The key to a stress-free wedding is starting your planning well in advance.\n\nSet a Budget. Determine your budget early and stick to it.\n\nChoose the Right Venue. Your venue sets the tone for your entire wedding.\n\nHire Professionals. Professional planners, photographers, and caterers bring expertise that makes a significant difference.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', author: 'Sarah Johnson', tags: ['Wedding', 'Planning'], featured: true, published: true, createdAt: new Date('2026-03-15'), updatedAt: new Date('2026-03-15') },
  { id: '2', title: 'Corporate Event Trends to Watch in 2026', slug: 'corporate-event-trends-2026', excerpt: 'Stay ahead of the curve with the latest trends shaping corporate events this year.', content: 'Hybrid Events. The future of corporate events is hybrid.\n\nSustainability. Eco-friendly events are no longer optional.\n\nImmersive Experiences. Technology is enabling more immersive event experiences.', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600', author: 'Michael Obi', tags: ['Corporate', 'Trends'], featured: true, published: true, createdAt: new Date('2026-02-20'), updatedAt: new Date('2026-02-20') },
  { id: '3', title: 'How to Choose the Right Event Venue', slug: 'choose-right-event-venue', excerpt: 'The venue sets the tone for your entire event. Learn how to make the perfect choice.', content: 'Consider Your Guest List. The size of your guest list is the most important factor.\n\nLocation Matters. Choose a venue that is accessible for your guests.\n\nCheck the Amenities. What does the venue provide?', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', author: 'Emily Okonkwo', tags: ['Venue', 'Tips'], featured: false, published: true, createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-01-10') },
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '', excerpt: '', content: '', image: '',
      author: '', tags: '', published: true, featured: false,
    },
  })

  const openCreate = () => {
    setEditing(null)
    reset({
      title: '', excerpt: '', content: '', image: '',
      author: '', tags: '', published: true, featured: false,
    })
    setShowModal(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      tags: post.tags.join(', '),
      published: post.published,
      featured: post.featured,
    })
    setShowModal(true)
  }

  const onSubmit = (data: BlogFormData) => {
    const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)

    if (editing) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: data.title,
                slug: slugify(data.title),
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                author: data.author,
                tags,
                published: data.published,
                featured: data.featured,
                updatedAt: new Date(),
              }
            : p
        )
      )
    } else {
      const newPost: BlogPost = {
        id: generateId(),
        title: data.title,
        slug: slugify(data.title),
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        author: data.author,
        tags,
        published: data.published,
        featured: data.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setPosts((prev) => [newPost, ...prev])
    }
    setShowModal(false)
    setEditing(null)
  }

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
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
          <h1 className="text-2xl lg:text-3xl font-bold">Blog</h1>
          <p className="text-base-content/60 mt-1">Manage your blog posts.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-white">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-base-content/40">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No blog posts yet. Click &quot;New Post&quot; to get started.</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body p-5">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-20 rounded-lg overflow-hidden bg-base-200 flex-shrink-0 hidden sm:block">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-xs text-base-content/50 mt-0.5">
                          By {post.author} &middot; {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEdit(post)}
                          className="btn btn-ghost btn-xs btn-square"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="btn btn-ghost btn-xs btn-square text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-base-content/60 mt-1 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="badge badge-ghost badge-xs">{tag}</span>
                      ))}
                      {post.featured && (
                        <span className="badge badge-warning badge-xs gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      {post.published ? (
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
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

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
              className="card bg-base-100 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
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
                      placeholder="Post title"
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
                        <span className="label-text font-medium">Author</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Author name"
                        className={`input input-bordered ${errors.author ? 'input-error' : ''}`}
                        {...register('author')}
                      />
                      {errors.author && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.author.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Tags</span>
                        <span className="label-text-alt text-base-content/40">Comma separated</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Wedding, Planning, Tips"
                        className={`input input-bordered ${errors.tags ? 'input-error' : ''}`}
                        {...register('tags')}
                      />
                      {errors.tags && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.tags.message}</span>
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
                      <span className="label-text font-medium">Excerpt</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of the post..."
                      className={`textarea textarea-bordered ${errors.excerpt ? 'textarea-error' : ''}`}
                      {...register('excerpt')}
                    />
                    {errors.excerpt && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.excerpt.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Content</span>
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Write your post content here..."
                      className={`textarea textarea-bordered font-mono text-sm ${errors.content ? 'textarea-error' : ''}`}
                      {...register('content')}
                    />
                    {errors.content && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.content.message}</span>
                      </label>
                    )}
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
                      {editing ? 'Update Post' : 'Publish Post'}
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
                <h3 className="font-bold text-lg">Delete Post?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => deleteConfirm && deletePost(deleteConfirm)}
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
