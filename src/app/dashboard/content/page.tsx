'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save,
  Home,
  LayoutGrid,
  Image,
  Users,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Calendar,
  Award,
  ChevronRight,
  Briefcase,
  FileText,
  UserCheck,
} from 'lucide-react'

type SettingsData = Record<string, string>

interface TabDef {
  id: string
  label: string
  icon: React.ReactNode
  fields: FieldDef[]
}

type FieldDef =
  | { key: string; label: string; type?: 'input' | 'textarea'; placeholder?: string }
  | { type: 'section'; title: string }
  | { type: 'stats'; prefix: string; count: number; fields: string[] }

const tabs: TabDef[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Stats' },
      {
        type: 'stats',
        prefix: 'homeStat',
        count: 4,
        fields: ['value', 'suffix', 'label'],
      },
      { type: 'section', title: 'Portfolio Section' },
      { key: 'homePortfolioBadge', label: 'Badge' },
      { key: 'homePortfolioTitle', label: 'Title' },
      { key: 'homePortfolioDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Testimonials Section' },
      { key: 'homeTestimonialsBadge', label: 'Badge' },
      { key: 'homeTestimonialsTitle', label: 'Title' },
      { key: 'homeTestimonialsDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Call to Action' },
      { key: 'homeCtaBadge', label: 'Badge' },
      { key: 'homeCtaTitle', label: 'Title' },
      { key: 'homeCtaDesc', label: 'Description', type: 'textarea' },
      { key: 'homeCtaBtn1', label: 'Button 1 Text' },
      { key: 'homeCtaBtn2', label: 'Button 2 Text' },
      { key: 'homeCtaNote', label: 'Note Text' },
      { key: 'homeCtaImage', label: 'Background Image URL' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    icon: <Award className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Achievements Header' },
      { key: 'aboutAchievementBadge', label: 'Badge' },
      { key: 'aboutAchievementTitle', label: 'Title' },
      { key: 'aboutAchievementSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'aboutAchievementImage', label: 'Background Image URL' },
      { type: 'section', title: 'Achievement Stats' },
      {
        type: 'stats',
        prefix: 'aboutAchievement',
        count: 6,
        fields: ['value', 'suffix', 'label'],
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: <LayoutGrid className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'servicesPageBadge', label: 'Badge' },
      { key: 'servicesPageTitle', label: 'Title' },
      { key: 'servicesPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'servicesPageImage', label: 'Image URL' },
      { type: 'section', title: 'Grid Header' },
      { key: 'servicesGridBadge', label: 'Badge' },
      { key: 'servicesGridTitle', label: 'Title' },
      { key: 'servicesGridDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Call to Action' },
      { key: 'servicesCtaTitle', label: 'Title' },
      { key: 'servicesCtaDesc', label: 'Description', type: 'textarea' },
      { key: 'servicesCtaBtn', label: 'Button Text' },
      { key: 'servicesCtaImage', label: 'Background Image URL' },
    ],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: <Image className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'portfolioPageBadge', label: 'Badge' },
      { key: 'portfolioPageTitle', label: 'Title' },
      { key: 'portfolioPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'portfolioPageImage', label: 'Image URL' },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    icon: <Users className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'teamPageBadge', label: 'Badge' },
      { key: 'teamPageTitle', label: 'Title' },
      { key: 'teamPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'teamPageImage', label: 'Image URL' },
      { type: 'section', title: 'Grid Header' },
      { key: 'teamGridBadge', label: 'Badge' },
      { key: 'teamGridTitle', label: 'Title' },
      { key: 'teamGridDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Join Section' },
      { key: 'teamJoinBadge', label: 'Badge' },
      { key: 'teamJoinTitle', label: 'Title' },
      { key: 'teamJoinDesc', label: 'Description', type: 'textarea' },
      { key: 'teamJoinEmail', label: 'Email' },
    ],
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: <BookOpen className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'blogPageBadge', label: 'Badge' },
      { key: 'blogPageTitle', label: 'Title' },
      { key: 'blogPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'blogPageImage', label: 'Image URL' },
      { type: 'section', title: 'Related Posts' },
      { key: 'blogRelatedTitle', label: 'Title' },
      { key: 'blogRelatedDesc', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: <MessageSquare className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'testimonialsPageBadge', label: 'Badge' },
      { key: 'testimonialsPageTitle', label: 'Title' },
      { key: 'testimonialsPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'testimonialsPageImage', label: 'Image URL' },
      { type: 'section', title: 'Grid Header' },
      { key: 'testimonialsGridBadge', label: 'Badge' },
      { key: 'testimonialsGridTitle', label: 'Title' },
      { key: 'testimonialsGridDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Stats' },
      {
        type: 'stats',
        prefix: 'testimonialsStat',
        count: 4,
        fields: ['value', 'label'],
      },
      { type: 'section', title: 'Video Testimonial' },
      { key: 'testimonialsVideoImage', label: 'Video Placeholder Image URL' },
      { key: 'testimonialsVideoTitle', label: 'Title' },
      { key: 'testimonialsVideoDesc', label: 'Description' },
    ],
  },
  {
    id: 'faq-contact',
    label: 'FAQ & Contact',
    icon: <HelpCircle className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'FAQ Hero' },
      { key: 'faqPageBadge', label: 'Badge' },
      { key: 'faqPageTitle', label: 'Title' },
      { key: 'faqPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'faqPageImage', label: 'Image URL' },
      { type: 'section', title: 'FAQ CTA' },
      { key: 'faqCtaTitle', label: 'Title' },
      { key: 'faqCtaDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Contact Hero' },
      { key: 'contactPageBadge', label: 'Badge' },
      { key: 'contactPageTitle', label: 'Title' },
      { key: 'contactPageSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'contactPageImage', label: 'Image URL' },
      { type: 'section', title: 'Contact FAQ Section' },
      { key: 'contactFaqTitle', label: 'Title' },
      { key: 'contactFaqDesc', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'book',
    label: 'Book',
    icon: <Calendar className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Header' },
      { key: 'bookBadge', label: 'Badge' },
      { key: 'bookTitle', label: 'Title' },
      { key: 'bookDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Event Types' },
      { key: 'bookEventTypes', label: 'Event Types (comma-separated)' },
      { type: 'section', title: 'Sign-In' },
      { key: 'bookSigninTitle', label: 'Title' },
      { key: 'bookSigninDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Success' },
      { key: 'bookSuccessTitle', label: 'Title' },
      { key: 'bookSuccessDesc', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'ceo',
    label: 'CEO',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'ceoHeroImage', label: 'Background Image URL' },
      { key: 'ceoHeroBadge', label: 'Badge Text' },
      { key: 'ceoHeroTitle', label: 'Title Prefix (e.g. "Meet Our")' },
      { key: 'ceoHeroDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Profile Section' },
      { key: 'ceoProfileLabel', label: 'Section Label (e.g. "Our Leader")' },
      { type: 'section', title: 'Call to Action' },
      { key: 'ceoCtaTitle', label: 'Title' },
      { key: 'ceoCtaDesc', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'service-detail',
    label: 'Service Detail',
    icon: <Briefcase className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Overview Section' },
      { key: 'serviceDetailOverviewBadge', label: 'Badge' },
      { key: 'serviceDetailOverviewTitle', label: 'Title' },
      { type: 'section', title: 'Gallery Section' },
      { key: 'serviceDetailGalleryBadge', label: 'Badge' },
      { key: 'serviceDetailGalleryTitle', label: 'Title' },
      { key: 'serviceDetailGalleryDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Packages Section' },
      { key: 'serviceDetailPackagesBadge', label: 'Badge' },
      { key: 'serviceDetailPackagesTitle', label: 'Title' },
      { key: 'serviceDetailPackagesDesc', label: 'Description', type: 'textarea' },
      { key: 'serviceDetailPackagesPopularLabel', label: '"Most Popular" Label' },
      { key: 'serviceDetailPackagesBtnText', label: 'Button Text' },
      { type: 'section', title: 'FAQ Section' },
      { key: 'serviceDetailFaqBadge', label: 'Badge' },
      { key: 'serviceDetailFaqTitle', label: 'Title' },
      { type: 'section', title: 'Booking CTA' },
      { key: 'serviceDetailCtaImage', label: 'Background Image URL' },
      { key: 'serviceDetailCtaTitle', label: 'Title' },
      { key: 'serviceDetailCtaDesc', label: 'Description', type: 'textarea' },
      { key: 'serviceDetailCtaBtn', label: 'Button Text' },
      { type: 'section', title: 'Related Services' },
      { key: 'serviceDetailRelatedBadge', label: 'Badge' },
      { key: 'serviceDetailRelatedTitle', label: 'Title' },
      { key: 'serviceDetailRelatedDesc', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'portfolio-detail',
    label: 'Portfolio Detail',
    icon: <FileText className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Overview Section' },
      { key: 'portfolioDetailOverviewBadge', label: 'Badge' },
      { type: 'section', title: 'Event Highlights' },
      { key: 'portfolioDetailHighlightsBadge', label: 'Badge' },
      { key: 'portfolioDetailHighlightsTitle', label: 'Title' },
      { type: 'section', title: 'Gallery Section' },
      { key: 'portfolioDetailGalleryBadge', label: 'Badge' },
      { key: 'portfolioDetailGalleryTitle', label: 'Title' },
      { key: 'portfolioDetailGalleryDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Related Events' },
      { key: 'portfolioDetailRelatedBadge', label: 'Badge' },
      { key: 'portfolioDetailRelatedTitle', label: 'Title' },
      { key: 'portfolioDetailRelatedDesc', label: 'Description', type: 'textarea' },
      { type: 'section', title: 'Call to Action' },
      { key: 'portfolioDetailCtaImage', label: 'Background Image URL' },
      { key: 'portfolioDetailCtaTitle', label: 'Title' },
      { key: 'portfolioDetailCtaDesc', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'team-detail',
    label: 'Team Detail',
    icon: <UserCheck className="w-4 h-4" />,
    fields: [
      { type: 'section', title: 'Hero Section' },
      { key: 'teamDetailBadge', label: 'Badge' },
      { type: 'section', title: 'Stats Labels' },
      { key: 'teamDetailStatsYearsLabel', label: 'Years Label' },
      { key: 'teamDetailStatsProjectsLabel', label: 'Projects Label' },
      { key: 'teamDetailStatsSatisfactionLabel', label: 'Satisfaction Label' },
      { type: 'section', title: 'What I Bring' },
      { key: 'teamDetailWhatIBringTitle', label: 'Section Title' },
      { type: 'section', title: 'Contact' },
      { key: 'teamDetailContactDesc', label: 'Description', type: 'textarea' },
    ],
  },
]

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: Record<string, string>
  onChange: (key: string, val: string) => void
}) {
  if (field.type === 'section') {
    return (
      <div className="divider text-sm font-bold text-base-content/50 before:bg-base-300 after:bg-base-300">
        {field.title}
      </div>
    )
  }

  if (field.type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: field.count }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-base-200 bg-base-200/30 space-y-2">
            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
              Stat {i + 1}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {field.fields.map((f) => {
                const k = `${field.prefix}${i}_${f}`
                return (
                  <div key={k} className="form-control">
                    <label className="label py-0">
                      <span className="label-text text-xs capitalize">{f}</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm text-xs"
                      value={value[k] || ''}
                      onChange={(e) => onChange(k, e.target.value)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const key = field.key!
  const isTextarea = field.type === 'textarea'

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{field.label}</span>
      </label>
      {isTextarea ? (
        <textarea
          rows={3}
          className="textarea textarea-bordered"
          value={value[key] || ''}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          type="text"
          className="input input-bordered"
          value={value[key] || ''}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [settings, setSettings] = useState<SettingsData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setSettings(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/settings?_=' + Date.now(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        const err = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveError(err.error || 'Save failed')
      }
    } catch {
      setSaveError('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Site Content</h1>
          <p className="text-base-content/60 mt-1">
            Manage all public page content from one place.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-white gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save All'}
        </button>
      </motion.div>

      {saveError && (
        <div className="alert alert-error text-sm">
          <span>{saveError}</span>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
        <div className="flex gap-1 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/60 hover:bg-base-300/50 hover:text-base-content'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-primary">{currentTab.icon}</span>
                <h2 className="card-title text-lg">{currentTab.label}</h2>
              </div>
              <div className="space-y-4">
                {currentTab.fields.map((field, idx) => {
                  if (field.type === 'section' || field.type === 'stats') {
                    return <Field key={idx} field={field} value={settings} onChange={handleChange} />
                  }
                  return (
                    <Field
                      key={field.key}
                      field={field}
                      value={settings}
                      onChange={handleChange}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
