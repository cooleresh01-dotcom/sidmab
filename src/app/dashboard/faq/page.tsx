'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, HelpCircle } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

interface FaqData {
  categories: FaqCategory[]
  hero: { badge: string; title: string; subtitle: string; image: string }
  cta: { title: string; desc: string }
}

const defaultData: FaqData = {
  categories: [
    {
      category: 'General',
      items: [
        { q: 'What services does SIDMAB offer?', a: 'SIDMAB offers comprehensive event planning and management services including wedding planning, corporate events, birthday celebrations, decoration, event coordination, rentals, catering, and ushering services.' },
        { q: 'How far in advance should I book?', a: 'We recommend booking at least 3-6 months in advance for major events like weddings, and 2-4 weeks for smaller events. However, we can accommodate last-minute requests depending on availability.' },
        { q: 'Do you offer custom packages?', a: 'Yes! We understand every event is unique. We work with you to create a custom package that fits your specific needs, preferences, and budget.' },
      ],
    },
    {
      category: 'Booking & Payments',
      items: [
        { q: 'How does the booking process work?', a: 'You can book through our website by filling out the consultation form, calling us directly, or visiting our office. We will schedule a consultation to discuss your vision and provide a customized quote.' },
        { q: 'What payment methods do you accept?', a: 'We accept bank transfers, mobile payments, and credit/debit cards. A deposit is required to secure your date, with the balance due before the event.' },
        { q: 'Can I get a refund if I cancel?', a: 'Our cancellation policy varies depending on how far in advance you cancel. Please refer to our terms and conditions or contact us for details.' },
      ],
    },
    {
      category: 'Events',
      items: [
        { q: 'Do you handle both small and large events?', a: 'Absolutely! We handle events of all sizes, from intimate gatherings of 20 guests to large-scale celebrations with 1000+ attendees.' },
        { q: 'Can you work with my existing vendors?', a: 'Yes, we are happy to collaborate with your preferred vendors. We also have a network of trusted vendors we can recommend.' },
        { q: 'Do you provide event insurance?', a: 'We strongly recommend event insurance and can guide you on the best options for your specific event type and size.' },
      ],
    },
  ],
  hero: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our services and process.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920',
  },
  cta: {
    title: 'Still Have Questions?',
    desc: 'We are here to help. Get in touch with our team for personalised assistance.',
  },
}

export default function DashboardFaq() {
  const [data, setData] = useState<FaqData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.faqContent) {
          try {
            const parsed = JSON.parse(data.faqContent)
            if (parsed.categories) setData((prev) => ({ ...prev, categories: parsed.categories }))
            if (parsed.hero) setData((prev) => ({ ...prev, hero: parsed.hero }))
            if (parsed.cta) setData((prev) => ({ ...prev, cta: parsed.cta }))
          } catch {}
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const updateHero = (field: keyof FaqData['hero'], value: string) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }))
  }

  const updateCta = (field: keyof FaqData['cta'], value: string) => {
    setData((prev) => ({ ...prev, cta: { ...prev.cta, [field]: value } }))
  }

  const updateCategory = (catIndex: number, value: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c, i) => (i === catIndex ? { ...c, category: value } : c)),
    }))
  }

  const addItem = (catIndex: number) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c, i) =>
        i === catIndex ? { ...c, items: [...c.items, { q: '', a: '' }] } : c
      ),
    }))
  }

  const updateItem = (catIndex: number, itemIndex: number, field: keyof FaqItem, value: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c, i) =>
        i === catIndex
          ? { ...c, items: c.items.map((item, j) => (j === itemIndex ? { ...item, [field]: value } : item)) }
          : c
      ),
    }))
  }

  const removeItem = (catIndex: number, itemIndex: number) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c, i) =>
        i === catIndex ? { ...c, items: c.items.filter((_, j) => j !== itemIndex) } : c
      ),
    }))
  }

  const addCategory = () => {
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, { category: 'New Category', items: [{ q: '', a: '' }] }],
    }))
  }

  const removeCategory = (catIndex: number) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== catIndex),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = JSON.stringify(data)
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqContent: payload }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-primary" />
            FAQ Content
          </h1>
          <p className="text-base-content/50 text-sm mt-1">Manage the frequently asked questions page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-200/50 rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-semibold text-sm">Hero Section</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={data.hero.badge}
            onChange={(e) => updateHero('badge', e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Badge text"
          />
          <input
            type="text"
            value={data.hero.title}
            onChange={(e) => updateHero('title', e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Title"
          />
          <input
            type="text"
            value={data.hero.subtitle}
            onChange={(e) => updateHero('subtitle', e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Subtitle"
          />
          <input
            type="text"
            value={data.hero.image}
            onChange={(e) => updateHero('image', e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Image URL"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className="bg-base-200/50 rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-semibold text-sm">CTA Section</h2>
        <input
          type="text"
          value={data.cta.title}
          onChange={(e) => updateCta('title', e.target.value)}
          className="input input-bordered input-sm w-full"
          placeholder="CTA title"
        />
        <textarea
          value={data.cta.desc}
          onChange={(e) => updateCta('desc', e.target.value)}
          className="textarea textarea-bordered w-full text-sm"
          placeholder="CTA description..."
        />
      </motion.div>

      <div className="space-y-4">
        {data.categories.map((cat, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.03 }}
            className="bg-base-200/50 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={cat.category}
                onChange={(e) => updateCategory(catIndex, e.target.value)}
                className="input input-bordered input-sm flex-1 font-semibold"
                placeholder="Category name"
              />
              <button
                onClick={() => removeCategory(catIndex)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-2">
              {cat.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-base-100/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.q}
                      onChange={(e) => updateItem(catIndex, itemIndex, 'q', e.target.value)}
                      className="input input-bordered input-sm flex-1"
                      placeholder="Question"
                    />
                    <button
                      onClick={() => removeItem(catIndex, itemIndex)}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={item.a}
                    onChange={(e) => updateItem(catIndex, itemIndex, 'a', e.target.value)}
                    className="textarea textarea-bordered w-full text-sm"
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>

            <button onClick={() => addItem(catIndex)} className="btn btn-outline btn-sm gap-2 mt-2">
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </motion.div>
        ))}
      </div>

      <button onClick={addCategory} className="btn btn-outline btn-sm gap-2">
        <Plus className="w-4 h-4" />
        Add Category
      </button>
    </div>
  )
}
