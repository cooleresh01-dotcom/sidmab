export async function adminSignIn(email: string, password: string) {
  try {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { error: data.error || 'Login failed', ok: false }
    }

    return { error: null, ok: true }
  } catch {
    return { error: 'Request failed', ok: false }
  }
}

export async function adminSignOut() {
  try {
    await fetch('/api/auth/admin-logout', { method: 'POST' })
  } catch {
    // ignore
  }
}

export async function getAdminSession() {
  try {
    const res = await fetch('/api/auth/admin-session')
    if (!res.ok) return null
    const data = await res.json()
    return data?.user ? data : null
  } catch {
    return null
  }
}
