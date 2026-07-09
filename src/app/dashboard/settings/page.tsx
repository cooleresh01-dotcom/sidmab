'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, Sun, Moon, Globe, Phone, Share2, User, Palette, AlertCircle, Mail } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

const settingsSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  tagline: z.string().min(2, 'Tagline must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  email2: z.string().email('Please enter a valid email').or(z.literal('')),
  phone: z.string().min(5, 'Please enter a valid phone number'),
  phone2: z.string().or(z.literal('')),
  address: z.string().min(5, 'Please enter a valid address'),
  mapAddress: z.string().or(z.literal('')),
  mapEmbedUrl: z.string().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  mobileColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  ceoName: z.string().min(1, 'Name is required'),
  ceoTitle: z.string().min(1, 'Title is required'),
  ceoImage: z.string().url('Must be a valid URL').or(z.literal('')),
  ceoBio: z.string().min(10, 'Bio must be at least 10 characters'),
  ceoMessage: z.string().min(20, 'Message must be at least 20 characters'),
  ceoSignature: z.string().min(1, 'Signature is required'),
  emailSignature: z.string().or(z.literal('')),
  officeHours: z.string().or(z.literal('')),
  whatsapp: z.string().or(z.literal('')),
  facebook: z.string().url('Must be a valid URL').or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').or(z.literal('')),
  instagram: z.string().url('Must be a valid URL').or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').or(z.literal('')),
  youtube: z.string().url('Must be a valid URL').or(z.literal('')),
  servicesBadge: z.string(),
  servicesTitle: z.string(),
  servicesDesc: z.string(),
  whyBadge: z.string(),
  whyTitle: z.string(),
  whySubtitle: z.string(),
  whyCard0_title: z.string(), whyCard0_desc: z.string(), whyCard0_stat: z.string(),
  whyCard1_title: z.string(), whyCard1_desc: z.string(), whyCard1_stat: z.string(),
  whyCard2_title: z.string(), whyCard2_desc: z.string(), whyCard2_stat: z.string(),
  whyCard3_title: z.string(), whyCard3_desc: z.string(),   whyCard3_stat: z.string(),
  partnersBadge: z.string(),
  partnersTitle: z.string(),
  partnersSubtitle: z.string(),
  partner0_name: z.string(), partner0_logo: z.string(),
  partner1_name: z.string(), partner1_logo: z.string(),
  partner2_name: z.string(), partner2_logo: z.string(),
  partner3_name: z.string(), partner3_logo: z.string(),
  partner4_name: z.string(), partner4_logo: z.string(),
  partner5_name: z.string(), partner5_logo: z.string(),
  heroImage_0: z.string(), heroLabel_0: z.string(), heroH1_0: z.string(), heroH2_0: z.string(), heroH3_0: z.string(), heroText_0: z.string(), heroFont_0: z.string(), heroGradientFont_0: z.string(),
  heroImage_1: z.string(), heroLabel_1: z.string(), heroH1_1: z.string(), heroH2_1: z.string(), heroH3_1: z.string(), heroText_1: z.string(), heroFont_1: z.string(), heroGradientFont_1: z.string(),
  heroImage_2: z.string(), heroLabel_2: z.string(), heroH1_2: z.string(), heroH2_2: z.string(), heroH3_2: z.string(), heroText_2: z.string(), heroFont_2: z.string(), heroGradientFont_2: z.string(),
  heroImage_3: z.string(), heroLabel_3: z.string(), heroH1_3: z.string(), heroH2_3: z.string(), heroH3_3: z.string(), heroText_3: z.string(), heroFont_3: z.string(), heroGradientFont_3: z.string(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

const defaultSettings: SettingsFormData = {
  siteName: 'SIDMAB Events & Management',
  tagline: 'Premier Event Planning & Management Services',
  email: 'info@sidmab.com',
  email2: 'bookings@sidmab.com',
  phone: '+234 800 000 0000',
  phone2: '+234 800 000 0001',
  address: '123 Victoria Island, Lagos, Nigeria',
  mapAddress: '123 Victoria Island, Lagos, Nigeria',
  mapEmbedUrl: '',
  primaryColor: '#BA4583',
  secondaryColor: '#C8963E',
  mobileColor: '#BA4583',
  ceoName: 'Sarah Johnson',
  ceoTitle: 'CEO & Founder',
  ceoImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  ceoBio: 'With over 15 years of experience in event management, Sarah founded SIDMAB with a vision to transform the Nigerian events industry.',
  ceoMessage: "Welcome to SIDMAB Events & Management. Our journey began with a simple belief: every event should be extraordinary. Today, that belief drives our team of dedicated professionals who pour their passion into creating unforgettable experiences. We don't just plan events — we craft moments that last a lifetime. Thank you for considering us to be part of your special story.",
  ceoSignature: 'Sarah Johnson',
  emailSignature: '',
  officeHours: 'Mon-Fri: 8AM - 6PM\nSat: 9AM - 4PM',
  whatsapp: '+2348000000000',
  facebook: 'https://facebook.com/sidmab',
  twitter: 'https://twitter.com/sidmab',
  instagram: 'https://instagram.com/sidmab',
  linkedin: 'https://linkedin.com/company/sidmab',
  youtube: '',
  servicesBadge: 'What We Do',
  servicesTitle: 'Our Services',
  servicesDesc: 'Comprehensive event planning and management solutions tailored to your needs.',
  whyBadge: 'Why SIDMAB',
  whyTitle: 'Why Choose Us',
  whySubtitle: 'We bring passion, precision, and creativity to every event we touch.',
  whyCard0_title: 'Proven Expertise', whyCard0_desc: '1000+ events delivered with excellence across Nigeria over 15 years.', whyCard0_stat: '15+ Years',
  whyCard1_title: 'Creative Excellence', whyCard1_desc: 'Award-winning design team transforming ordinary spaces into extraordinary experiences.', whyCard1_stat: '50+ Awards',
  whyCard2_title: 'End-to-End Service', whyCard2_desc: 'From concept to cleanup, we handle every detail so you can enjoy your event.', whyCard2_stat: '100% Dedicated',
  whyCard3_title: 'Tailored Solutions', whyCard3_desc: 'Every event is unique. We craft custom packages that fit your vision and budget.',   whyCard3_stat: 'Fully Custom',
  partnersBadge: 'Our Partners',
  partnersTitle: 'Trusted Partners',
  partnersSubtitle: 'Proud to collaborate with leading organizations across Nigeria.',
  partner0_name: 'TechBridge', partner0_logo: '',
  partner1_name: 'Lagos Business School', partner1_logo: '',
  partner2_name: 'AfriBank Plc', partner2_logo: '',
  partner3_name: 'Greenfield Energy', partner3_logo: '',
  partner4_name: 'Nexus Logistics', partner4_logo: '',
  partner5_name: 'Prime Media', partner5_logo: '',
  heroImage_0: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920',
  heroLabel_0: 'Premier Event Management',
  heroH1_0: 'We Create', heroH2_0: 'Unforgettable', heroH3_0: 'Moments',
  heroText_0: 'From intimate gatherings to grand celebrations, we bring your vision to life with exceptional planning and flawless execution.',
  heroFont_0: '', heroGradientFont_0: '',
  heroImage_1: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920',
  heroLabel_1: 'Corporate & Social Events',
  heroH1_1: 'Elevate Your', heroH2_1: 'Next', heroH3_1: 'Occasion',
  heroText_1: 'Professional event management for corporate functions, galas, and social gatherings that leave a lasting impression.',
  heroFont_1: '', heroGradientFont_1: '',
  heroImage_2: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920',
  heroLabel_2: 'Wedding & Celebrations',
  heroH1_2: 'Your Dream', heroH2_2: 'Celebration', heroH3_2: 'Awaits',
  heroText_2: 'Every love story deserves a beautiful celebration. We turn your wedding vision into a breathtaking reality.',
  heroFont_2: '', heroGradientFont_2: '',
  heroImage_3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920',
  heroLabel_3: 'Decoration & Design',
  heroH1_3: 'Transforming', heroH2_3: 'Spaces Into', heroH3_3: 'Art',
  heroText_3: 'From concept to execution, our design team creates stunning environments that captivate and inspire.',
  heroFont_3: '', heroGradientFont_3: '',
}

function ColorField({ label, name, control, setValue, register }: { label: string; name: 'primaryColor' | 'secondaryColor' | 'mobileColor'; control: any; setValue: any; register: any }) {
  const formValue = useWatch({ control, name }) ?? '#000000'
  const [local, setLocal] = useState(formValue)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    setLocal(formValue)
  }, [formValue])

  useEffect(() => {
    return () => { if (timer.current !== null) clearTimeout(timer.current) }
  }, [])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(e.target.value)
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setValue(name, e.target.value), 120)
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={local}
          onChange={handleColorChange}
          className="w-10 h-10 rounded-lg cursor-pointer border border-base-300"
        />
        <input
          type="text"
          className="input input-bordered flex-1 font-mono"
          {...register(name)}
        />
      </div>
    </div>
  )
}

function ColorPreview({ control }: { control: any }) {
  const primaryColor = useWatch({ control, name: 'primaryColor' })
  const secondaryColor = useWatch({ control, name: 'secondaryColor' })

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="card-title text-lg">Color Preview</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-base-content/50 mb-2">Primary</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-base-300" style={{ background: primaryColor }} />
              <div className="h-8 rounded-lg px-4 flex items-center text-xs font-medium text-white" style={{ background: primaryColor }}>
                Button
              </div>
              <div className="h-8 rounded-lg px-4 flex items-center text-xs font-medium" style={{ border: `1.5px solid ${primaryColor}`, color: primaryColor }}>
                Outline
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-base-content/50 mb-2">Secondary</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-base-300" style={{ background: secondaryColor }} />
              <span className="text-xs font-medium" style={{ color: secondaryColor }}>Accent Text</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${secondaryColor}40, transparent)` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )
  const [heroTab, setHeroTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SettingsFormData>({
    defaultValues: defaultSettings,
  })

  useEffect(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          reset({ ...defaultSettings, ...data })
        }
      })
      .finally(() => setLoading(false))
  }, [reset])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const save = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/settings?_=' + Date.now(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getValues()),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        const err = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveError(err.error || 'Save failed')
      }
    } catch (e) {
      setSaveError('Network error')
      console.error(e)
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-base-content/60 mt-1">Manage your site settings and configuration.</p>
      </motion.div>

      <form onSubmit={(e) => { e.preventDefault(); save() }}>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-lg">Brand Identity</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Site Name</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.siteName ? 'input-error' : ''}`}
                        {...register('siteName')}
                      />
                      {errors.siteName && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.siteName.message}</span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Tagline</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.tagline ? 'input-error' : ''}`}
                        {...register('tagline')}
                      />
                      {errors.tagline && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.tagline.message}</span>
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="divider" />
                  <div>
                    <p className="text-sm font-bold text-base-content mb-3">Site Colors</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ColorField label="Primary Color" name="primaryColor" control={control} setValue={setValue} register={register} />
                      <ColorField label="Secondary Color" name="secondaryColor" control={control} setValue={setValue} register={register} />
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <ColorField label="Mobile Browser Color" name="mobileColor" control={control} setValue={setValue} register={register} />
                      <p className="text-xs text-base-content/50 mt-1 leading-relaxed">Controls the browser chrome color on mobile devices</p>
                    </div>
                  </div>
                  <div className="divider" />
                  <div>
                    <p className="text-sm font-bold text-base-content mb-3">Services Section</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Badge Text</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('servicesBadge')} />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Title</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('servicesTitle')} />
                      </div>
                    </div>
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text font-medium">Description</span>
                      </label>
                      <textarea rows={2} className="textarea textarea-bordered" {...register('servicesDesc')} />
                    </div>
                  </div>
                  <div className="divider" />
                  <div>
                    <p className="text-sm font-bold text-base-content mb-3">Why SIDMAB Section</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Badge Text</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('whyBadge')} />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Title</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('whyTitle')} />
                      </div>
                    </div>
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text font-medium">Subtitle</span>
                      </label>
                      <textarea rows={2} className="textarea textarea-bordered" {...register('whySubtitle')} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-6">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-base-200 space-y-3">
                          <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">Card {i + 1}</p>
                          <div className="form-control">
                            <label className="label"><span className="label-text text-xs">Title</span></label>
                            <input type="text" className="input input-bordered input-sm" {...register(`whyCard${i}_title` as any)} />
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text text-xs">Description</span></label>
                            <textarea rows={3} className="textarea textarea-bordered textarea-sm" {...register(`whyCard${i}_desc` as any)} />
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text text-xs">Stat Label</span></label>
                            <input type="text" className="input input-bordered input-sm" {...register(`whyCard${i}_stat` as any)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="divider" />
                  <div>
                    <p className="text-sm font-bold text-base-content mb-3">Partners Section</p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Badge Text</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('partnersBadge')} />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Title</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('partnersTitle')} />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Subtitle</span>
                        </label>
                        <input type="text" className="input input-bordered" {...register('partnersSubtitle')} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-6">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-base-200 space-y-3">
                          <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">Partner {i + 1}</p>
                          <div className="form-control">
                            <label className="label"><span className="label-text text-xs">Name</span></label>
                            <input type="text" className="input input-bordered input-sm" {...register(`partner${i}_name` as any)} />
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text text-xs">Logo URL</span></label>
                            <input type="url" className="input input-bordered input-sm" placeholder="https://example.com/logo.png" {...register(`partner${i}_logo` as any)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="divider" />
                  <div>
                    <p className="text-sm font-bold text-base-content mb-3">Hero Slides</p>
                    <div className="tabs tabs-box mb-4">
                      {[0, 1, 2, 3].map((i) => (
                        <button key={i} type="button"
                          className={`tab tab-sm ${heroTab === i ? 'tab-active' : ''}`}
                          onClick={() => setHeroTab(i)}
                        >
                          Slide {i + 1}
                        </button>
                      ))}
                    </div>
                    {[0, 1, 2, 3].map((i) => heroTab === i && (
                      <div key={i} className="space-y-3">
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Image URL</span></label>
                          <input type="text" className="input input-bordered" {...register(`heroImage_${i}` as any)} />
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Badge Label</span></label>
                          <input type="text" className="input input-bordered" {...register(`heroLabel_${i}` as any)} />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Heading Line 1</span></label>
                            <input type="text" className="input input-bordered" {...register(`heroH1_${i}` as any)} />
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Heading Line 2 (Gradient)</span></label>
                            <input type="text" className="input input-bordered" {...register(`heroH2_${i}` as any)} />
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Heading Line 3</span></label>
                            <input type="text" className="input input-bordered" {...register(`heroH3_${i}` as any)} />
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Description Text</span></label>
                          <textarea className="textarea textarea-bordered" rows={3} {...register(`heroText_${i}` as any)} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Heading Font</span></label>
                            <select className="select select-bordered" {...register(`heroFont_${i}` as any)}>
                              <option value="">Default (Geist Sans)</option>
                              <option value="font-serif">Serif</option>
                              <option value="font-mono">Monospace</option>
                               <option value="font-['Cormorant_Garamond',_serif]">Cormorant Garamond</option>
                               <option value="font-['Brush_Script_MT',_cursive]">Brush Script MT</option>
                               <option value="font-['Impact',_fantasy]">Impact</option>
                               <option value="font-fantasy">Fantasy</option>
                               <option value="font-cursive">Cursive</option>
                            </select>
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Gradient Font</span></label>
                            <select className="select select-bordered" {...register(`heroGradientFont_${i}` as any)}>
                              <option value="">Default (Geist Sans)</option>
                              <option value="font-serif">Serif</option>
                              <option value="font-mono">Monospace</option>
                               <option value="font-['Cormorant_Garamond',_serif]">Cormorant Garamond</option>
                               <option value="font-['Brush_Script_MT',_cursive]">Brush Script MT</option>
                               <option value="font-['Impact',_fantasy]">Impact</option>
                               <option value="font-fantasy">Fantasy</option>
                               <option value="font-cursive">Cursive</option>
                            </select>
                            <p className="text-xs text-base-content/50 mt-1">Applied to the gradient text line</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Phone className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-lg">Contact Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Phone (Primary)</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.phone.message}</span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Phone (Secondary)</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.phone2 ? 'input-error' : ''}`}
                        {...register('phone2')}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Email (Primary)</span>
                      </label>
                      <input
                        type="email"
                        className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                        {...register('email')}
                      />
                      {errors.email && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.email.message}</span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Email (Secondary)</span>
                      </label>
                      <input
                        type="email"
                        className={`input input-bordered ${errors.email2 ? 'input-error' : ''}`}
                        {...register('email2')}
                      />
                      {errors.email2 && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.email2.message}</span>
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Address</span>
                    </label>
                    <textarea
                      rows={2}
                      className={`textarea textarea-bordered ${errors.address ? 'textarea-error' : ''}`}
                      {...register('address')}
                    />
                    {errors.address && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.address.message}</span>
                      </label>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Map Address</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.mapAddress ? 'input-error' : ''}`}
                        {...register('mapAddress')}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Map Embed URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className={`input input-bordered ${errors.mapEmbedUrl ? 'input-error' : ''}`}
                        {...register('mapEmbedUrl')}
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">Paste a Google Maps embed iframe src URL</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">WhatsApp Number</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.whatsapp ? 'input-error' : ''}`}
                        {...register('whatsapp')}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Office Hours</span>
                      </label>
                      <textarea
                        rows={2}
                        className={`textarea textarea-bordered ${errors.officeHours ? 'textarea-error' : ''}`}
                        {...register('officeHours')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-lg">Social Media</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'] as const).map(
                      (platform) => (
                        <div key={platform} className="form-control">
                          <label className="label">
                            <span className="label-text font-medium capitalize">{platform}</span>
                          </label>
                          <input
                            type="url"
                            placeholder={`https://${platform}.com/...`}
                            className={`input input-bordered ${errors[platform] ? 'input-error' : ''}`}
                            {...register(platform)}
                          />
                          {errors[platform] && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errors[platform].message}</span>
                            </label>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-lg">CEO & Founder</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Name</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.ceoName ? 'input-error' : ''}`}
                        {...register('ceoName')}
                      />
                      {errors.ceoName && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.ceoName.message}</span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Title</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.ceoTitle ? 'input-error' : ''}`}
                        {...register('ceoTitle')}
                      />
                      {errors.ceoTitle && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.ceoTitle.message}</span>
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Photo URL</span>
                    </label>
                    <input
                      type="url"
                      className={`input input-bordered ${errors.ceoImage ? 'input-error' : ''}`}
                      {...register('ceoImage')}
                    />
                    {errors.ceoImage && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.ceoImage.message}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <textarea
                      rows={3}
                      className={`textarea textarea-bordered ${errors.ceoBio ? 'textarea-error' : ''}`}
                      {...register('ceoBio')}
                    />
                    {errors.ceoBio && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.ceoBio.message}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Message</span>
                    </label>
                    <textarea
                      rows={5}
                      className={`textarea textarea-bordered ${errors.ceoMessage ? 'textarea-error' : ''}`}
                      {...register('ceoMessage')}
                    />
                    {errors.ceoMessage && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.ceoMessage.message}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Signature</span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered ${errors.ceoSignature ? 'input-error' : ''}`}
                      {...register('ceoSignature')}
                    />
                    {errors.ceoSignature && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.ceoSignature.message}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Mail className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-lg">Newsletter Email</h2>
                </div>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email Signature (HTML)</span>
                    </label>
                    <textarea
                      rows={4}
                      className="textarea textarea-bordered font-mono text-xs"
                      placeholder='<br/>--<br/><strong>SIDMAB Events &amp; Management</strong><br/>info@sidmab.com'
                      {...register('emailSignature')}
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/50">Appended to all newsletter emails. HTML allowed.</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-4 bg-base-200/50 rounded-xl border border-base-200">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-base-content/60">Don't forget to save your changes.</p>
                {saveError && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {saveError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary text-white min-w-[130px]"
              >
                {saving ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 lg:sticky lg:top-6 lg:self-start"
        >
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <h2 className="card-title text-lg mb-4">Theme</h2>
              <p className="text-sm text-base-content/60 mb-4">
                Choose between light and dark mode for your dashboard.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-base-300 hover:border-base-content/20'
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-base-300 hover:border-base-content/20'
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </div>
          </div>

          <ColorPreview control={control} />

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <h2 className="card-title text-lg mb-4">Quick Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Framework</span>
                  <span className="font-medium">Next.js 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Theme</span>
                  <span className="font-medium capitalize">{theme}</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
      </form>
    </div>
  )
}
