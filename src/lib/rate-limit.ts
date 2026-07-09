const store = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
}

const defaults: RateLimitConfig = {
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later',
}

export function rateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): { success: boolean; remaining: number; resetInMs: number } {
  const { windowMs, max, message } = { ...defaults, ...config }
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: max - 1, resetInMs: windowMs }
  }

  if (record.count >= max) {
    return { success: false, remaining: 0, resetInMs: record.resetAt - now }
  }

  record.count++
  return { success: true, remaining: max - record.count, resetInMs: record.resetAt - now }
}

const WINDOW_1M = 60 * 1000
const WINDOW_15M = 15 * 60 * 1000

export const limits = {
  login: { windowMs: WINDOW_1M, max: 5, message: 'Too many login attempts, try again in a minute' },
  register: { windowMs: WINDOW_15M, max: 3, message: 'Too many registration attempts, try again later' },
  contact: { windowMs: WINDOW_1M, max: 3, message: 'Too many messages, try again in a minute' },
  newsletter: { windowMs: WINDOW_1M, max: 2, message: 'Too many signups, try again in a minute' },
  forgotPassword: { windowMs: WINDOW_15M, max: 3, message: 'Too many password reset requests, try again later' },
  api: { windowMs: WINDOW_1M, max: 30, message: 'Too many requests' },
}
