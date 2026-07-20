'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Briefcase } from 'lucide-react'

interface Job {
  title: string
  location: string
  type: string
  department: string
  description: string
}

interface Benefit {
  title: string
  desc: string
}

const defaultJobs: Job[] = [
  { title: 'Senior Event Planner', location: 'Lagos, Nigeria', type: 'Full-time', department: 'Planning', description: 'We are looking for an experienced event planner to join our team and lead high-profile events from conception to execution.' },
  { title: 'Creative Designer', location: 'Lagos, Nigeria', type: 'Full-time', department: 'Design', description: 'Join our creative team to design stunning event visuals, decorations, and experiences for our clients.' },
  { title: 'Marketing Intern', location: 'Remote', type: 'Internship', department: 'Marketing', description: 'An exciting opportunity for a marketing enthusiast to support our social media, content creation, and brand awareness efforts.' },
]

const defaultBenefits: Benefit[] = [
  { title: 'Competitive Salary', desc: 'Attractive compensation packages' },
  { title: 'Health Insurance', desc: 'Comprehensive medical coverage' },
  { title: 'Team Culture', desc: 'Collaborative and supportive environment' },
  { title: 'Training', desc: 'Continuous learning opportunities' },
  { title: 'Remote Options', desc: 'Flexible work arrangements' },
  { title: 'Paid Time Off', desc: 'Generous leave policies' },
]

const defaultCultureImages = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
]

export default function DashboardCareers() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [heroBadge, setHeroBadge] = useState('Join Our Team')
  const [heroTitle, setHeroTitle] = useState('Careers at SIDMAB')
  const [heroSubtitle, setHeroSubtitle] = useState('Come grow with us. Explore opportunities to be part of something extraordinary.')
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920')

  const [cultureBadge, setCultureBadge] = useState('Our Culture')
  const [cultureTitle, setCultureTitle] = useState('Life at SIDMAB')
  const [cultureDesc, setCultureDesc] = useState('We believe in fostering creativity, collaboration, and growth. Our team is our greatest asset.')
  const [cultureImages, setCultureImages] = useState<string[]>(defaultCultureImages)

  const [benefitsBadge, setBenefitsBadge] = useState('Benefits')
  const [benefitsTitle, setBenefitsTitle] = useState('Why Join Us')
  const [benefitsDesc, setBenefitsDesc] = useState('We take care of our team with great benefits and a positive work environment.')
  const [benefits, setBenefits] = useState<Benefit[]>(defaultBenefits)

  const [positionsBadge, setPositionsBadge] = useState('Open Positions')
  const [positionsTitle, setPositionsTitle] = useState('Join Our Team')
  const [positionsDesc, setPositionsDesc] = useState('Explore current opportunities and find your dream role.')
  const [jobs, setJobs] = useState<Job[]>(defaultJobs)

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.careersPageBadge) setHeroBadge(data.careersPageBadge)
        if (data.careersPageTitle) setHeroTitle(data.careersPageTitle)
        if (data.careersPageSubtitle) setHeroSubtitle(data.careersPageSubtitle)
        if (data.careersPageImage) setHeroImage(data.careersPageImage)
        if (data.careersCultureBadge) setCultureBadge(data.careersCultureBadge)
        if (data.careersCultureTitle) setCultureTitle(data.careersCultureTitle)
        if (data.careersCultureDesc) setCultureDesc(data.careersCultureDesc)
        if (data.careersBenefitsBadge) setBenefitsBadge(data.careersBenefitsBadge)
        if (data.careersBenefitsTitle) setBenefitsTitle(data.careersBenefitsTitle)
        if (data.careersBenefitsDesc) setBenefitsDesc(data.careersBenefitsDesc)
        if (data.careersPositionsBadge) setPositionsBadge(data.careersPositionsBadge)
        if (data.careersPositionsTitle) setPositionsTitle(data.careersPositionsTitle)
        if (data.careersPositionsDesc) setPositionsDesc(data.careersPositionsDesc)
        if (data.careerContent) {
          try {
            const parsed = JSON.parse(data.careerContent)
            if (parsed.jobs) setJobs(parsed.jobs)
            if (parsed.cultureImages) setCultureImages(parsed.cultureImages)
          } catch {}
        }
        if (data.careerBenefits) {
          try {
            const parsed = JSON.parse(data.careerBenefits)
            if (parsed.items) setBenefits(parsed.items)
          } catch {}
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const addJob = () => setJobs([...jobs, { title: '', location: '', type: 'Full-time', department: '', description: '' }])
  const removeJob = (i: number) => setJobs(jobs.filter((_, idx) => idx !== i))
  const updateJob = (i: number, field: keyof Job, val: string) => setJobs(jobs.map((j, idx) => idx === i ? { ...j, [field]: val } : j))

  const addBenefit = () => setBenefits([...benefits, { title: '', desc: '' }])
  const removeBenefit = (i: number) => setBenefits(benefits.filter((_, idx) => idx !== i))
  const updateBenefit = (i: number, field: keyof Benefit, val: string) => setBenefits(benefits.map((b, idx) => idx === i ? { ...b, [field]: val } : b))

  const addCultureImage = () => setCultureImages([...cultureImages, ''])
  const removeCultureImage = (i: number) => setCultureImages(cultureImages.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careersPageBadge: heroBadge,
          careersPageTitle: heroTitle,
          careersPageSubtitle: heroSubtitle,
          careersPageImage: heroImage,
          careersCultureBadge: cultureBadge,
          careersCultureTitle: cultureTitle,
          careersCultureDesc: cultureDesc,
          careersBenefitsBadge: benefitsBadge,
          careersBenefitsTitle: benefitsTitle,
          careersBenefitsDesc: benefitsDesc,
          careersPositionsBadge: positionsBadge,
          careersPositionsTitle: positionsTitle,
          careersPositionsDesc: positionsDesc,
          careerContent: JSON.stringify({ jobs, cultureImages }),
          careerBenefits: JSON.stringify({ items: benefits }),
        }),
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-primary" />
            Careers Page
          </h1>
          <p className="text-base-content/50 text-sm mt-1">Manage the careers page content</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </motion.div>

      {/* Hero Section */}
      <div className="bg-base-200/50 rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-base-content/50">Hero Section</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} className="input input-bordered input-sm" placeholder="Badge text" />
          <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="input input-bordered input-sm" placeholder="Title" />
        </div>
        <input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="input input-bordered input-sm w-full" placeholder="Subtitle" />
        <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="input input-bordered input-sm w-full" placeholder="Background image URL" />
      </div>

      {/* Culture Section */}
      <div className="bg-base-200/50 rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-base-content/50">Culture Section</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input value={cultureBadge} onChange={(e) => setCultureBadge(e.target.value)} className="input input-bordered input-sm" placeholder="Badge" />
          <input value={cultureTitle} onChange={(e) => setCultureTitle(e.target.value)} className="input input-bordered input-sm" placeholder="Title" />
          <input value={cultureDesc} onChange={(e) => setCultureDesc(e.target.value)} className="input input-bordered input-sm" placeholder="Description" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-base-content/50">Culture Images</p>
          {cultureImages.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={img} onChange={(e) => { const n = [...cultureImages]; n[i] = e.target.value; setCultureImages(n) }} className="input input-bordered input-sm flex-1" placeholder="Image URL" />
              <button onClick={() => removeCultureImage(i)} className="btn btn-ghost btn-sm text-error"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={addCultureImage} className="btn btn-outline btn-sm gap-1"><Plus className="w-3 h-3" /> Add Image</button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-base-200/50 rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-base-content/50">Benefits Section</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input value={benefitsBadge} onChange={(e) => setBenefitsBadge(e.target.value)} className="input input-bordered input-sm" placeholder="Badge" />
          <input value={benefitsTitle} onChange={(e) => setBenefitsTitle(e.target.value)} className="input input-bordered input-sm" placeholder="Title" />
          <input value={benefitsDesc} onChange={(e) => setBenefitsDesc(e.target.value)} className="input input-bordered input-sm" placeholder="Description" />
        </div>
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={b.title} onChange={(e) => updateBenefit(i, 'title', e.target.value)} className="input input-bordered input-sm flex-1" placeholder="Benefit title" />
              <input value={b.desc} onChange={(e) => updateBenefit(i, 'desc', e.target.value)} className="input input-bordered input-sm flex-1" placeholder="Description" />
              <button onClick={() => removeBenefit(i)} className="btn btn-ghost btn-sm text-error"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={addBenefit} className="btn btn-outline btn-sm gap-1"><Plus className="w-3 h-3" /> Add Benefit</button>
        </div>
      </div>

      {/* Positions Section */}
      <div className="bg-base-200/50 rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-base-content/50">Open Positions Section</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input value={positionsBadge} onChange={(e) => setPositionsBadge(e.target.value)} className="input input-bordered input-sm" placeholder="Badge" />
          <input value={positionsTitle} onChange={(e) => setPositionsTitle(e.target.value)} className="input input-bordered input-sm" placeholder="Title" />
          <input value={positionsDesc} onChange={(e) => setPositionsDesc(e.target.value)} className="input input-bordered input-sm" placeholder="Description" />
        </div>
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <div key={i} className="bg-base-100 rounded-xl p-4 space-y-2 border border-base-300">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-base-content/40">Job {i + 1}</p>
                <button onClick={() => removeJob(i)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <input value={job.title} onChange={(e) => updateJob(i, 'title', e.target.value)} className="input input-bordered input-sm" placeholder="Job title" />
                <input value={job.location} onChange={(e) => updateJob(i, 'location', e.target.value)} className="input input-bordered input-sm" placeholder="Location" />
                <input value={job.type} onChange={(e) => updateJob(i, 'type', e.target.value)} className="input input-bordered input-sm" placeholder="Type (Full-time, Part-time, Internship)" />
                <input value={job.department} onChange={(e) => updateJob(i, 'department', e.target.value)} className="input input-bordered input-sm" placeholder="Department" />
              </div>
              <textarea value={job.description} onChange={(e) => updateJob(i, 'description', e.target.value)} className="textarea textarea-bordered w-full text-sm min-h-[60px]" placeholder="Job description" />
            </div>
          ))}
          <button onClick={addJob} className="btn btn-outline btn-sm gap-1"><Plus className="w-3 h-3" /> Add Job</button>
        </div>
      </div>
    </div>
  )
}
