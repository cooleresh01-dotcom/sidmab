'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-base-content">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-base-content/40">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content',
          'placeholder:text-base-content/40',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[var(--site-primary)]/20 focus:border-[var(--site-primary)]',
          error ? 'border-red-400' : 'border-base-300 hover:border-base-content/20',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
    )

    if (label || error || hint) {
      return (
        <FormField label={label} error={error} hint={hint} required={required}>
          {input}
        </FormField>
      )
    }
    return input
  }
)
Input.displayName = 'Input'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content',
          'placeholder:text-base-content/40',
          'transition-all duration-200 resize-y min-h-[100px]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--site-primary)]/20 focus:border-[var(--site-primary)]',
          error ? 'border-red-400' : 'border-base-300 hover:border-base-content/20',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
    )

    if (label || error || hint) {
      return (
        <FormField label={label} error={error} hint={hint} required={required}>
          {textarea}
        </FormField>
      )
    }
    return textarea
  }
)
TextArea.displayName = 'TextArea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, placeholder, className, ...props }, ref) => {
    const select = (
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[var(--site-primary)]/20 focus:border-[var(--site-primary)]',
          error ? 'border-red-400' : 'border-base-300 hover:border-base-content/20',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )

    if (label || error || hint) {
      return (
        <FormField label={label} error={error} hint={hint} required={required}>
          {select}
        </FormField>
      )
    }
    return select
  }
)
Select.displayName = 'Select'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[var(--site-primary)] text-white hover:brightness-110 active:scale-[0.98]',
    secondary: 'bg-base-200 text-base-content hover:bg-base-300 active:scale-[0.98]',
    outline: 'border-1.5 border-[var(--site-primary)] text-[var(--site-primary)] hover:bg-[var(--site-primary)] hover:text-white',
    ghost: 'text-base-content hover:bg-base-200 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-sm',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
