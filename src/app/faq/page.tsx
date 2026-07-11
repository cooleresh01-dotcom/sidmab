'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { HiSearch, HiChevronDown } from 'react-icons/hi'
import { faqs } from '@/lib/data'
import PageHero from '@/components/ui/PageHero'
import BackButton from '@/components/ui/BackButton'



function FAQSection() {
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<string | null>('0-0')
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

  const toggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key))
  }

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          <div className="relative">
            <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-base-200/50 border border-base-300 text-base placeholder:text-base-content/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-300"
            />
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4">
              <HiSearch className="w-7 h-7 text-base-content/30" />
            </div>
            <p className="text-base-content/50 text-lg font-medium mb-1">No results found</p>
            <p className="text-base-content/30 text-sm mb-4">Try a different search term</p>
            <button
              onClick={() => setSearch('')}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {filtered.map((group, groupIndex) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-3" style={{ color: 'var(--site-primary, #042c6c)' }}>
                  <span className="w-6 h-[2px] rounded-full" style={{ background: 'var(--site-primary, #042c6c)' }} />
                  {group.category}
                </h2>
                <div className="space-y-2">
                  {group.items.map((item, i) => {
                    const key = `${groupIndex}-${i}`
                    const isOpen = openIndex === key
                    return (
                      <div
                        key={i}
                        className={`rounded-xl border transition-all duration-300 ${
                          isOpen
                            ? 'border-primary/20 bg-primary/[0.02] shadow-sm'
                            : 'border-base-200 hover:border-base-300 bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between gap-4 p-5 text-left"
                        >
                          <span className={`font-semibold text-[15px] leading-snug transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-black'}`}>
                            {item.q}
                          </span>
                          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isOpen ? 'bg-primary text-white rotate-180' : 'bg-base-200/60 text-base-content/40'
                          }`}>
                            <HiChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-5 pb-5 text-sm text-base-content/60 leading-relaxed border-t border-base-200/60 pt-4">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
    <section className="section-padding bg-base-200/30">
      <div className="container mx-auto text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <HiSearch className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Still Have Questions?</h2>
          <p className="text-base-content/50 mb-8 max-w-md mx-auto">
            We are here to help. Get in touch with our team for personalised assistance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact" className="px-7 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-primary/20">
              Contact Us
            </Link>
            <Link href="/book" className="px-7 py-3 rounded-xl border border-base-300 font-medium text-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
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
      <BackButton />
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
