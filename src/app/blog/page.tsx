'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { HiArrowRight, HiCalendar, HiUser } from 'react-icons/hi'
import { blogPosts } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import BackButton from '@/components/ui/BackButton'

function BlogGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full group">
                <figure className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </figure>
                <div className="card-body p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-base-content/70 line-clamp-2 mt-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
                    <div className="flex items-center gap-3 text-xs text-base-content/50">
                      <span className="flex items-center gap-1">
                        <HiUser className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiCalendar className="w-3.5 h-3.5" />
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn btn-ghost btn-sm text-primary gap-1 hover:gap-2 transition-all"
                    >
                      Read More <HiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BlogPage() {
  return (
    <>
      <BackButton />
      <PageHero
        title="Latest Insights & Stories"
        subtitle="Expert tips, trends, and inspiration for your next event."
        image="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920"
        badge="Our Blog"
        height="tall"
        overlay="dark"
      />
      <BlogGrid />
    </>
  )
}
