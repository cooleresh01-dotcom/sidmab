'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { HiCheck, HiMinus, HiPlus, HiArrowRight, HiArrowLeft } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { services } from '@/lib/data'

const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Conference', 'Outdoor', 'Decoration', 'Party', 'Other']

const bookingSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  eventType: z.string().min(1, 'Please select an event type'),
  date: z.string().min(1, 'Please select a date'),
  guests: z.number().min(1, 'Minimum 1 guest').max(10000, 'Maximum 10000 guests'),
  budget: z.number().min(0),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  message: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const steps = [
  { id: 1, title: 'Service', description: 'Choose a service' },
  { id: 2, title: 'Event Type', description: 'Type of event' },
  { id: 3, title: 'Date', description: 'Event date' },
  { id: 4, title: 'Guests', description: 'Number of guests' },
  { id: 5, title: 'Budget', description: 'Budget range' },
  { id: 6, title: 'Info', description: 'Your details' },
  { id: 7, title: 'Review', description: 'Confirm details' },
]

const defaultValues: BookingFormData = {
  service: '',
  eventType: '',
  date: '',
  guests: 50,
  budget: 500000,
  name: '',
  email: '',
  phone: '',
  message: '',
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step.id <= currentStep
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-200 text-base-content/40'
                }`}
              >
                {step.id < currentStep ? (
                  <HiCheck className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${step.id <= currentStep ? 'text-primary font-medium' : 'text-base-content/40'}`}>
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-base-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function StepService({ register, errors, value }: { register: any; errors: any; value: string }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <label
          key={service.id}
          className={`card border-2 cursor-pointer transition-all p-4 ${
            value === service.id
              ? 'border-primary bg-primary/5'
              : 'border-base-200 hover:border-primary/30'
          }`}
        >
          <input
            type="radio"
            {...register('service')}
            value={service.id}
            className="hidden"
          />
          <div className="text-3xl mb-2">{service.icon}</div>
          <h3 className="font-semibold">{service.title}</h3>
          <p className="text-sm text-base-content/70 line-clamp-2">{service.tagline}</p>
        </label>
      ))}
      {errors.service && (
        <p className="text-error text-sm col-span-full">{errors.service.message}</p>
      )}
    </div>
  )
}

function StepEventType({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="form-control">
      <label className="label"><span className="label-text font-medium">Event Type *</span></label>
      <select {...register('eventType')} className="select select-bordered w-full">
        <option value="">Select event type</option>
        {eventTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      {errors.eventType && <span className="text-error text-xs mt-1">{errors.eventType.message}</span>}
    </div>
  )
}

function StepDate({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="form-control">
      <label className="label"><span className="label-text font-medium">Event Date *</span></label>
      <input type="date" {...register('date')} className="input input-bordered w-full" />
      {errors.date && <span className="text-error text-xs mt-1">{errors.date.message}</span>}
    </div>
  )
}

function StepGuests({ register, errors, value, setValue }: { register: any; errors: any; value: number; setValue: any }) {
  return (
    <div className="form-control">
      <label className="label"><span className="label-text font-medium">Number of Guests *</span></label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setValue('guests', Math.max(1, value - 10), { shouldValidate: true })}
          className="btn btn-outline btn-square"
        >
          <HiMinus className="w-5 h-5" />
        </button>
        <input
          type="number"
          {...register('guests', { valueAsNumber: true })}
          className="input input-bordered w-32 text-center text-lg font-bold"
          min={1}
        />
        <button
          type="button"
          onClick={() => setValue('guests', Math.min(10000, value + 10), { shouldValidate: true })}
          className="btn btn-outline btn-square"
        >
          <HiPlus className="w-5 h-5" />
        </button>
      </div>
      {errors.guests && <span className="text-error text-xs mt-1">{errors.guests.message}</span>}
    </div>
  )
}

function StepBudget({ register, value }: { register: any; value: number }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Budget Range</span>
        <span className="label-text font-bold text-primary">
          ₦{value.toLocaleString()}
        </span>
      </label>
      <input
        type="range"
        {...register('budget', { valueAsNumber: true })}
        className="range range-primary"
        min={50000}
        max={5000000}
        step={50000}
      />
      <div className="flex justify-between text-xs text-base-content/50 mt-2">
        <span>₦50,000</span>
        <span>₦5,000,000</span>
      </div>
    </div>
  )
}

function StepPersonalInfo({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Name</span></label>
          <input type="text" {...register('name')} className="input input-bordered w-full" readOnly tabIndex={-1} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Email</span></label>
          <input type="email" {...register('email')} className="input input-bordered w-full" readOnly tabIndex={-1} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Phone *</span></label>
          <input type="tel" {...register('phone')} className="input input-bordered w-full" placeholder="+234 800 000 0000" />
          {errors.phone && <span className="text-error text-xs mt-1">{errors.phone.message}</span>}
        </div>
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text font-medium">Additional Message</span></label>
        <textarea {...register('message')} className="textarea textarea-bordered w-full h-24" placeholder="Any special requests or details..." />
      </div>
    </div>
  )
}

function StepReview({ data, onEdit }: { data: BookingFormData; onEdit: (step: number) => void }) {
  const selectedService = services.find((s) => s.id === data.service)
  const rows = [
    { label: 'Service', value: selectedService?.title || data.service, step: 1 },
    { label: 'Event Type', value: data.eventType, step: 2 },
    { label: 'Date', value: data.date, step: 3 },
    { label: 'Guests', value: `${data.guests} guests`, step: 4 },
    { label: 'Budget', value: `₦${data.budget.toLocaleString()}`, step: 5 },
    { label: 'Name', value: data.name, step: 6 },
    { label: 'Email', value: data.email, step: 6 },
    { label: 'Phone', value: data.phone, step: 6 },
  ]

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="font-medium">{row.label}</td>
                <td>{row.value}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => onEdit(row.step)}
                    className="btn btn-ghost btn-xs text-primary"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.message && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <p className="font-medium text-sm mb-1">Message:</p>
          <p className="text-sm text-base-content/70">{data.message}</p>
        </div>
      )}
    </div>
  )
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'][
              Math.floor(Math.random() * 6)
            ],
          }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            x: Math.random() * 200 - 100,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

function SuccessMessage() {
  return (
    <div className="text-center py-16">
      <Confetti />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
      >
        <HiCheck className="w-10 h-10 text-success" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-3"
      >
        Booking Submitted!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-base-content/70 max-w-md mx-auto"
      >
        Thank you for your booking request. Our team will review your details and get back to you within 24 hours.
      </motion.p>
    </div>
  )
}

function StepRenderer({
  step,
  register,
  errors,
  getValues,
  setValue,
  watch,
  onEdit,
}: {
  step: number
  register: any
  errors: any
  getValues: () => BookingFormData
  setValue: any
  watch: any
  onEdit: (step: number) => void
}) {
  const props = { register, errors, setValue }
  const watchedService = watch('service')
  const watchedGuests = watch('guests')
  const watchedBudget = watch('budget')

  switch (step) {
    case 1: return <StepService {...props} value={watchedService} />
    case 2: return <StepEventType {...props} />
    case 3: return <StepDate {...props} />
    case 4: return <StepGuests {...props} value={watchedGuests} />
    case 5: return <StepBudget {...props} value={watchedBudget} />
    case 6: return <StepPersonalInfo {...props} />
    case 7: return <StepReview data={getValues()} onEdit={onEdit} />
    default: return null
  }
}

export default function BookPage() {
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      ...defaultValues,
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  })

  const allFields: (keyof BookingFormData)[] = [
    'service', 'eventType', 'date', 'guests', 'budget', 'name', 'email', 'phone',
  ]

  const handleNext = async () => {
    const fieldsToValidate = currentStep === 7 ? allFields : allFields.slice(0, currentStep)
    const valid = await trigger(fieldsToValidate)
    if (valid) {
      if (currentStep === 7) {
        handleSubmit(onSubmit)()
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 7))
      }
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
  }

  const onSubmit = async (data: BookingFormData) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to submit')
    } catch {
      // silently fail
    }
    setIsSubmitted(true)
  }

  if (status === 'loading') {
    return (
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary" />
      </section>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <HiCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign In Required</h1>
            <p className="text-base-content/70 mb-8 max-w-md mx-auto">
              You need to be signed in to book a consultation. Please sign in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login?callbackUrl=/book" className="btn btn-primary text-white">
                Sign In
              </Link>
              <Link href="/register?callbackUrl=/book" className="btn btn-outline">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (isSubmitted) {
    return (
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-lg">
          <SuccessMessage />
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Book Now</span>
          <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Book a Consultation</h1>
          <p className="text-base-content/70 max-w-xl mx-auto">
            Tell us about your event and we will create something amazing together.
          </p>
        </motion.div>

        <ProgressBar currentStep={currentStep} />

        <div className="card bg-base-100 shadow-sm border border-base-200 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-1">{steps[currentStep - 1].title}</h2>
              <p className="text-sm text-base-content/60 mb-6">{steps[currentStep - 1].description}</p>
              <StepRenderer
                step={currentStep}
                register={register}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                onEdit={handleEditStep}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-base-200">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="btn btn-ghost gap-2"
            >
              <HiArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary text-white gap-2"
            >
              {currentStep === 7 ? (
                'Submit Booking'
              ) : (
                <>Next <HiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
