'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { HiSearch, HiChevronDown } from 'react-icons/hi'
import { faqs } from '@/lib/data'
import PageHero from '@/components/ui/PageHero'



function FAQSection() {
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const filtered = faqs
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative mb-10"
        >
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-12 py-3"
          />
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-base-content/60 text-lg">No FAQs match your search.</p>
            <button
              onClick={() => setSearch('')}
              className="btn btn-ghost text-primary mt-2"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {filtered.map((group, groupIndex) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary rounded-full" />
                  {group.category}
                </h2>
                <div className="join join-vertical w-full">
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className="collapse collapse-arrow join-item border border-base-300"
                    >
                      <input type="radio" name={`faq-${groupIndex}`} defaultChecked={i === 0 && search === ''} />
                      <div className="collapse-title font-semibold text-base">{item.q}</div>
                      <div className="collapse-content text-sm text-base-content/70 leading-relaxed">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="section-padding bg-base-200/50">
      <div className="container mx-auto text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-base-content/70 mb-6">
            We are here to help. Get in touch with our team for personalised assistance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary text-white rounded-full">
              Contact Us
            </Link>
            <Link href="/book" className="btn btn-outline rounded-full">
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our services and process."
        image="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920"
        badge="FAQ"
      />
      <FAQSection />
      <CTASection />
    </>
  )
}
