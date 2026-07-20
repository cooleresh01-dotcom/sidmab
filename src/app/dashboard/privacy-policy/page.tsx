'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, ShieldCheck } from 'lucide-react'

interface Section {
  id: string
  title: string
  content: string
}

const defaultSections: Section[] = [
  { id: 'introduction', title: '1. Introduction', content: 'SIDMAB Events & Management ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By accessing our platform, you consent to the practices described in this policy.' },
  { id: 'information', title: '2. Information We Collect', content: 'We may collect the following types of information when you interact with our website or services:\n\n- Personal Data: Name, email address, phone number, and other contact details you provide through our contact forms or booking system.\n- Event Details: Information about your event preferences, dates, locations, and requirements.\n- Usage Data: Information about how you interact with our website, including pages visited and time spent.\n- Cookies: We use cookies to enhance your browsing experience and analyze site traffic.' },
  { id: 'usage', title: '3. How We Use Your Information', content: 'We use the collected information for the following purposes:\n\n- To provide and manage our event planning and management services\n- To communicate with you regarding inquiries, bookings, and updates\n- To improve our website and services\n- To send promotional materials (with your consent)\n- To comply with legal obligations' },
  { id: 'protection', title: '4. Data Protection', content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These include encryption, secure servers, and strict access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.' },
  { id: 'disclosure', title: '5. Third-Party Disclosure', content: 'We do not sell, trade, or transfer your personal information to third parties without your consent, except as necessary to provide our services or as required by law. We may share data with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.' },
  { id: 'rights', title: '6. Your Rights', content: 'Depending on your location, you may have the following rights regarding your personal data:\n\n- The right to access your personal data\n- The right to rectify inaccurate data\n- The right to delete your data\n- The right to restrict processing\n- The right to data portability\n- The right to withdraw consent\n\nTo exercise any of these rights, please contact us using the information below.' },
  { id: 'cookies', title: '7. Cookies', content: 'Our website uses cookies to improve your experience. You can choose to disable cookies in your browser settings. However, disabling cookies may affect the functionality of certain features on our website. We use both session cookies and persistent cookies to enhance your browsing experience.' },
  { id: 'changes', title: '8. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.' },
  { id: 'contact', title: '9. Contact Us', content: 'If you have any questions about this Privacy Policy, please reach out to us at info@sidmab.com or call +234 800 000 0000.' },
]

export default function DashboardPrivacyPolicy() {
  const [sections, setSections] = useState<Section[]>(defaultSections)
  const [lastUpdated, setLastUpdated] = useState('July 5, 2026')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.privacyContent) {
          try {
            const parsed = JSON.parse(data.privacyContent)
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
        body: JSON.stringify({ privacyContent: payload }),
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
            <ShieldCheck className="w-7 h-7 text-primary" />
            Privacy Policy
          </h1>
          <p className="text-base-content/50 text-sm mt-1">Manage the content of your privacy policy page</p>
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
