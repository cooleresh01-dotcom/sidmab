'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Globe, FileJson, Share2, Smartphone, Eye, Save } from 'lucide-react'

interface SeoPage {
  route: string
  title: string
  description: string
  ogImage: string
  ogTitle: string
  ogDescription: string
  keywords: string
  noindex: boolean
}

const initialPages: SeoPage[] = [
  { route: '/', title: 'SIDMAB Events & Management | Premier Event Planning', description: 'SIDMAB Events & Management - Nigeria\'s premier event planning company. Transforming moments into memories with professional wedding planning, corporate events, and more.', ogImage: '', ogTitle: '', ogDescription: '', keywords: 'event planning, wedding planning, corporate events, Nigeria events, SIDMAB', noindex: false },
  { route: '/about', title: 'About SIDMAB | Our Story & Team', description: 'Learn about SIDMAB Events & Management. With 15+ years of experience, we are Nigeria\'s trusted event planning company.', ogImage: '', ogTitle: '', ogDescription: '', keywords: 'about SIDMAB, event planning company, Nigeria event planners', noindex: false },
  { route: '/services', title: 'Our Services | SIDMAB Events', description: 'Explore our comprehensive event planning services including weddings, corporate events, birthdays, decoration, catering, and more.', ogImage: '', ogTitle: '', ogDescription: '', keywords: 'event services, wedding planning, corporate events, decoration, catering', noindex: false },
  { route: '/portfolio', title: 'Portfolio | SIDMAB Events', description: 'Browse our portfolio of successful events. See how we\'ve transformed moments into memories for our clients.', ogImage: '', ogTitle: '', ogDescription: '', keywords: 'event portfolio, wedding gallery, corporate events gallery', noindex: false },
  { route: '/blog', title: 'Blog | SIDMAB Events & Management', description: 'Read the latest event planning tips, trends, and insights from the SIDMAB team.', ogImage: '', ogTitle: '', ogDescription: '', keywords: 'event blog, planning tips, wedding advice, corporate event trends', noindex: false },
  { route: '/contact', title: 'Contact Us | SIDMAB Events', description: 'Get in touch with SIDMAB Events & Management. Book a consultation or send us a message.', ogImage: '', ogTitle: '', ogDescription: '', keywords: 'contact SIDMAB, event consultation, book event planner', noindex: false },
]

const groups = [
  { label: 'Homepage', icon: Globe, pages: ['/'] },
  { label: 'Content Pages', icon: FileJson, pages: ['/about', '/services', '/portfolio'] },
  { label: 'Blog & Contact', icon: Share2, pages: ['/blog', '/contact'] },
]

export default function SeoPage() {
  const [pages, setPages] = useState<SeoPage[]>(initialPages)
  const [activePage, setActivePage] = useState<string>('/')
  const [saved, setSaved] = useState(false)

  const current = pages.find((p) => p.route === activePage) || pages[0]

  const updateField = (field: keyof SeoPage, value: string | boolean) => {
    setPages((prev) =>
      prev.map((p) => (p.route === activePage ? { ...p, [field]: value } : p))
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const previewTitle = current.ogTitle || current.title
  const previewDesc = current.ogDescription || current.description

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">SEO</h1>
          <p className="text-base-content/60 mt-1">Manage search engine optimization for your pages.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary text-white">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-1">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider px-3 py-2">
                {group.label}
              </p>
              {group.pages.map((route) => {
                const page = pages.find((p) => p.route === route)
                if (!page) return null
                return (
                  <button
                    key={route}
                    onClick={() => setActivePage(route)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activePage === route
                        ? 'bg-primary text-primary-content font-medium'
                        : 'text-base-content/70 hover:bg-base-300/50'
                    }`}
                  >
                    {page.title.length > 35 ? page.title.slice(0, 35) + '...' : page.title}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" />
                Meta Tags
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Meta Title</span>
                  <span className="label-text-alt text-base-content/40">{current.title.length} / 60</span>
                </label>
                <input
                  type="text"
                  value={current.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className={`input input-bordered ${current.title.length > 60 ? 'input-error' : ''}`}
                />
                {current.title.length > 60 && (
                  <label className="label">
                    <span className="label-text-alt text-error">Title is too long. Aim for 50-60 characters.</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Meta Description</span>
                  <span className="label-text-alt text-base-content/40">{current.description.length} / 160</span>
                </label>
                <textarea
                  rows={3}
                  value={current.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={`textarea textarea-bordered ${current.description.length > 160 ? 'textarea-error' : ''}`}
                />
                {current.description.length > 160 && (
                  <label className="label">
                    <span className="label-text-alt text-error">Description is too long. Aim for 150-160 characters.</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Keywords</span>
                  <span className="label-text-alt text-base-content/40">Comma separated</span>
                </label>
                <input
                  type="text"
                  value={current.keywords}
                  onChange={(e) => updateField('keywords', e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={current.noindex}
                  onChange={(e) => updateField('noindex', e.target.checked)}
                />
                <span className="text-sm font-medium">No Index (hide from search engines)</span>
              </label>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Social Share (Open Graph)
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">OG Title</span>
                  <span className="label-text-alt text-base-content/40">Overrides meta title on social media</span>
                </label>
                <input
                  type="text"
                  value={current.ogTitle}
                  onChange={(e) => updateField('ogTitle', e.target.value)}
                  className="input input-bordered"
                  placeholder={current.title}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">OG Description</span>
                  <span className="label-text-alt text-base-content/40">Overrides meta description on social media</span>
                </label>
                <textarea
                  rows={2}
                  value={current.ogDescription}
                  onChange={(e) => updateField('ogDescription', e.target.value)}
                  className="textarea textarea-bordered"
                  placeholder={current.description}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">OG Image URL</span>
                </label>
                <input
                  type="url"
                  value={current.ogImage}
                  onChange={(e) => updateField('ogImage', e.target.value)}
                  className="input input-bordered"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Smartphone className="w-4 h-4" />
                Google Search Preview
              </h2>

              <div className="bg-white rounded-lg border p-3 max-w-md">
                <p className="text-xs text-green-700 font-medium truncate">
                  {current.route} › sidmab.com
                </p>
                <p className="text-sm text-blue-700 font-medium truncate mt-0.5 hover:underline cursor-pointer">
                  {previewTitle}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                  {previewDesc}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm mb-3">
                  <Eye className="w-4 h-4" />
                  Social Share Preview
                </h3>

                <div className="bg-white rounded-lg border overflow-hidden max-w-sm">
                  <div className="h-36 bg-base-200 flex items-center justify-center text-base-content/20">
                    {current.ogImage ? (
                      <img src={current.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Globe className="w-10 h-10" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 uppercase truncate">sidmab.com{current.route}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{previewTitle}</p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{previewDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Sitemap
              </h2>
              <p className="text-xs text-base-content/60 mt-1">
                {pages.filter((p) => !p.noindex).length} of {pages.length} pages are indexed and visible to search engines.
              </p>
              <div className="mt-3">
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(pages.filter((p) => !p.noindex).length / pages.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
