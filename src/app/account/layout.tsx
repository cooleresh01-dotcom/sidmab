'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import CompanyLogo from '@/components/ui/CompanyLogo'

const navItems = [
  { label: 'Overview', href: '/account', icon: LayoutDashboard },
  { label: 'My Bookings', href: '/account/bookings', icon: CalendarCheck },
  { label: 'Profile', href: '/account/profile', icon: User },
]

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { settings } = useSettings()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" checked={sidebarOpen} onChange={() => setSidebarOpen(!sidebarOpen)} />

        <div className="drawer-content flex flex-col">
          <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-base-200 bg-base-100/80 backdrop-blur px-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-base-content/60 hidden sm:block">{session.user?.email}</span>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="avatar placeholder cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-1.5 shadow-lg bg-base-100 rounded-box w-36 border border-base-200 mt-2">
                  <li><Link href="/account/profile" className="text-xs py-1.5">Profile</Link></li>
                  <li><button onClick={() => signOut()} className="text-xs py-1.5 text-error">Sign Out</button></li>
                </ul>
              </div>
            </div>
          </div>

          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>

        <div className="drawer-side">
          <label htmlFor="sidebar-drawer" className="drawer-overlay" onClick={() => setSidebarOpen(false)} />
          <aside className="flex h-full w-64 flex-col bg-gray-950 border-r border-white/10">
            <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
              <Link href="/">
                <CompanyLogo className="h-10 w-auto rounded-lg" width={40} height={40} />
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm ml-auto lg:hidden text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 px-3 mb-2">My Account</p>
              {navItems.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary text-primary-content shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/70 hover:text-error hover:bg-error/5 w-full transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
