'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin-login') || pathname.startsWith('/dashboard')
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password')
  const isAccount = pathname.startsWith('/account')
  if (isAdmin || isAuth || isAccount) return null
  return <Navbar />
}
