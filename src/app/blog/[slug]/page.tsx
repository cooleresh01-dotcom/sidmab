'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { HiCalendar, HiUser, HiArrowLeft } from 'react-icons/hi'
import { formatDate } from '@/lib/utils'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  tags: string[]
  published: boolean
  featured: boolean
  createdAt: string
}

function HeroSection({ post }: { post: BlogPost }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
      </div>
      <div className="relative z-10 container mx-auto text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors mb-6 text-sm"
          >
            <HiArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <HiUser className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <HiCalendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ArticleContent({ post }: { post: BlogPost }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-base-200">
          <span className="text-sm font-medium text-base-content/60">Tags:</span>
          {post.tags.map((tag) => (
            <span key={tag} className="badge badge-ghost">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [related, setRelated] = useState<BlogPost[]>([])

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRelated(data.filter((p: BlogPost) => p.slug !== currentSlug).slice(0, 2))
        }
      })
      .catch(() => {})
  }, [currentSlug])

  if (related.length === 0) return null

  return (
    <section ref={ref} className="section-padding bg-base-200/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold">Related Articles</h2>
          <p className="text-base-content/70 mt-2">Continue reading more insights from our team.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {related.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 h-full group"
              >
                <figure className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </figure>
                <div className="card-body p-5">
                  <h3 className="font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-base-content/70 line-clamp-2 mt-1">{post.excerpt}</p>
                  <div className="text-xs text-base-content/50 mt-3">{post.author} · {formatDate(post.createdAt)}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p: BlogPost) => p.slug === slug)
          setPost(found || null)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary" />
      </section>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <>
      <HeroSection post={post} />
      <ArticleContent post={post} />
      <RelatedPosts currentSlug={slug} />
    </>
  )
}
