'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { HiCalendar, HiUser, HiArrowLeft } from 'react-icons/hi'
import { blogPosts } from '@/lib/data'
import { formatDate } from '@/lib/utils'

const fullContent: Record<string, string> = {
  'tips-for-perfect-wedding': `
    <p>Planning a wedding is one of the most exciting yet challenging experiences you will ever undertake. From choosing the perfect venue to selecting the right flowers, every detail matters when it comes to creating your dream day.</p>
    <p>At SIDMAB, we have helped hundreds of couples navigate the wedding planning journey. Here are our top tips to ensure your special day goes off without a hitch.</p>
    <h3>1. Start Early</h3>
    <p>The earlier you start planning, the more choices you will have. Popular venues and vendors book up quickly, especially during peak wedding season. We recommend beginning the planning process at least 6-12 months before your desired date.</p>
    <h3>2. Set a Realistic Budget</h3>
    <p>Your budget will guide every decision you make. Be realistic about what you can afford and allocate funds accordingly. Remember to set aside 10-15% of your budget for unexpected expenses.</p>
    <h3>3. Choose the Right Venue</h3>
    <p>Your venue sets the tone for your entire wedding. Consider factors like capacity, location, ambiance, and available amenities. Visit multiple venues before making your decision.</p>
    <h3>4. Hire Professionals</h3>
    <p>A professional wedding planner can save you time, money, and stress. They have the experience and connections to bring your vision to life while handling all the logistics behind the scenes.</p>
    <h3>5. Communicate Clearly</h3>
    <p>Keep open lines of communication with your partner, families, and vendors. Clear communication ensures everyone is on the same page and reduces the likelihood of misunderstandings.</p>
  `,
  'corporate-event-trends-2026': `
    <p>The corporate events landscape continues to evolve rapidly. As we move through 2026, several key trends are shaping how businesses connect, celebrate, and communicate through events.</p>
    <p>Staying ahead of these trends will help your corporate events stand out and deliver maximum impact for your brand.</p>
    <h3>1. Hybrid Experiences</h3>
    <p>The hybrid event model is here to stay. Combining in-person attendance with virtual participation allows you to reach a wider audience while maintaining the energy of live events.</p>
    <h3>2. Sustainability Focus</h3>
    <p>Eco-conscious practices are becoming standard in corporate events. From digital invitations to sustainable catering and zero-waste decorations, attendees expect environmentally responsible practices.</p>
    <h3>3. Immersive Technology</h3>
    <p>Augmented reality (AR), virtual reality (VR), and interactive installations are transforming corporate events into unforgettable experiences that engage attendees on multiple levels.</p>
    <h3>4. Personalization at Scale</h3>
    <p>Using data and AI, event planners can create personalized experiences for each attendee, from customized schedules to tailored networking opportunities.</p>
    <h3>5. Wellness and Wellbeing</h3>
    <p>Events are increasingly incorporating wellness elements such as mindfulness sessions, healthy catering options, and comfortable spaces for relaxation and networking.</p>
  `,
  'choose-right-event-venue': `
    <p>Choosing the right venue is one of the most important decisions you will make when planning an event. The venue sets the atmosphere, determines the logistics, and significantly impacts your budget.</p>
    <p>Whether you are planning a wedding, corporate conference, or birthday celebration, here is how to find the perfect venue for your event.</p>
    <h3>Consider Your Event Type</h3>
    <p>Different events require different types of venues. A corporate conference needs professional facilities with AV equipment, while a wedding might call for a romantic outdoor setting or elegant ballroom.</p>
    <h3>Location and Accessibility</h3>
    <p>Choose a venue that is convenient for your guests. Consider proximity to airports, hotels, and parking facilities. Accessibility for guests with disabilities is also crucial.</p>
    <h3>Capacity and Layout</h3>
    <p>Ensure the venue can comfortably accommodate your guest list. Consider the layout options and how the space can be configured to suit your event activities.</p>
    <h3>Amenities and Services</h3>
    <p>Check what amenities are included in the rental fee. Some venues offer in-house catering, AV equipment, furniture, and event coordination services that can simplify your planning process.</p>
    <h3>Budget Considerations</h3>
    <p>Venue costs can vary widely. Be clear about your budget and ask about hidden fees such as service charges, taxes, and overtime costs. Negotiate when possible.</p>
  `,
}

const sampleImages = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
]

function HeroSection({ post }: { post: typeof blogPosts[0] }) {
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
              {formatDate(post.date)}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ArticleContent({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const content = fullContent[slug] || '<p>Content coming soon.</p>'

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          {sampleImages.map((src, i) => (
            <div key={i} className="relative h-48 rounded-xl overflow-hidden">
              <Image src={src} alt={`Article image ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-base-200">
          <span className="text-sm font-medium text-base-content/60">Tags:</span>
          {blogPosts.find((p) => p.slug === slug)?.tags.map((tag) => (
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
  const related = blogPosts.filter((p) => p.slug !== currentSlug)

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
                  <div className="text-xs text-base-content/50 mt-3">{post.author} · {formatDate(post.date)}</div>
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
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <HeroSection post={post} />
      <ArticleContent slug={slug} />
      <RelatedPosts currentSlug={slug} />
    </>
  )
}
