'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, FileText } from 'lucide-react'

interface Section {
  id: string
  title: string
  content: string
}

const defaultSections: Section[] = [
  { id: 'acceptance', title: '1. Acceptance of Terms', content: 'By accessing or using the services provided by SIDMAB Events & Management ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use our services. These terms apply to all visitors, clients, and users of our website and services.' },
  { id: 'services', title: '2. Our Services', content: 'We provide event planning and management services including but not limited to:\n\n- Event Planning: Full-service event planning for weddings, corporate events, birthdays, and special celebrations.\n- Decoration & Design: Creative event decoration, staging, and environmental design.\n- Catering Coordination: Coordination of catering services and menu planning.\n- Equipment Rentals: Rental of event equipment, furniture, and decor items.' },
  { id: 'bookings', title: '3. Bookings & Payments', content: 'When you book our services, the following terms apply:\n\n- A deposit is required to confirm your booking. The deposit amount will be communicated during the booking process.\n- Full payment terms and schedules will be outlined in your service agreement.\n- Prices are subject to change without notice until a booking is confirmed with a deposit.\n- Additional services or changes to the agreed scope may incur extra charges.\n- All payments should be made using the agreed payment methods within the specified timeframes.' },
  { id: 'cancellation', title: '4. Cancellation & Refunds', content: 'Our cancellation policy is as follows:\n\n- 30+ days before event: Full refund minus administrative fees.\n- 15-29 days before event: 50% refund of the deposit.\n- Less than 15 days before event: No refund. The deposit is non-refundable.\n\nCancellations must be made in writing via email. Refunds, if applicable, will be processed within 14 business days.' },
  { id: 'liability', title: '5. Limitation of Liability', content: 'SIDMAB Events & Management shall not be held liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific service in question. We are not responsible for events beyond our reasonable control, including but not limited to natural disasters, pandemics, government restrictions, or force majeure events.' },
  { id: 'ip', title: '6. Intellectual Property', content: 'All content on this website, including text, images, logos, graphics, and designs, is the property of SIDMAB Events & Management and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from our content without written permission. Event photos taken by our team may be used for marketing purposes unless you opt out in writing.' },
  { id: 'privacy', title: '7. Privacy', content: 'Your use of our services is also governed by our Privacy Policy. By using our services, you consent to the collection and use of your information as described in the Privacy Policy. We are committed to protecting your personal data and handling it with care.' },
  { id: 'changes', title: '8. Changes to Terms', content: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after any changes constitutes your acceptance of the new terms. We encourage you to review this page periodically.' },
  { id: 'contact', title: '9. Contact Us', content: 'If you have any questions about these Terms of Service, please reach out to us at info@sidmab.com or call +234 800 000 0000.' },
]

export default function DashboardTerms() {
  const [sections, setSections] = useState<Section[]>(defaultSections)
  const [lastUpdated, setLastUpdated] = useState('July 10, 2026')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.termsContent) {
          try {
            const parsed = JSON.parse(data.termsContent)
            if (parsed.sections) setSections(parsed.sections)
            if (parsed.lastUpdated) setLastUpdated(parsed.lastUpdated)
          } catch {}
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const updateSection = (index: number, field: keyof Section, value: string) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const addSection = () => {
    setSections((prev) => [...prev, { id: `section_${Date.now()}`, title: 'New Section', content: '' }])
  }

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = JSON.stringify({ sections, lastUpdated })
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termsContent: payload }),
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
            <FileText className="w-7 h-7 text-primary" />
            Terms of Service
          </h1>
          <p className="text-base-content/50 text-sm mt-1">Manage the content of your terms of service page</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={lastUpdated}
            onChange={(e) => setLastUpdated(e.target.value)}
            className="input input-bordered input-sm w-48"
            placeholder="Last updated date"
          />
          <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-base-200/50 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(i, 'title', e.target.value)}
                className="input input-bordered input-sm flex-1 font-semibold"
                placeholder="Section title"
              />
              <button onClick={() => removeSection(i)} className="btn btn-ghost btn-sm text-error hover:bg-error/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={section.content}
              onChange={(e) => updateSection(i, 'content', e.target.value)}
              className="textarea textarea-bordered w-full min-h-[120px] text-sm"
              placeholder="Section content..."
            />
          </motion.div>
        ))}
      </div>

      <button onClick={addSection} className="btn btn-outline btn-sm gap-2">
        <Plus className="w-4 h-4" />
        Add Section
      </button>
    </div>
  )
}
