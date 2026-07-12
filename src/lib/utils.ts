import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function generateId() {
  return crypto.randomUUID()
}

export function getCSSVar(name: string, fallback = '') {
  if (typeof document === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

export function getChartColors() {
  return {
    grid: getCSSVar('--chart-grid', 'oklch(0.9 0.01 240)'),
    axis: getCSSVar('--chart-axis', 'oklch(0.6 0.01 240)'),
    tooltipBg: getCSSVar('--chart-tooltip-bg', 'oklch(0.99 0 0)'),
    line: getCSSVar('--chart-line', 'oklch(0.55 0.18 25)'),
  }
}
