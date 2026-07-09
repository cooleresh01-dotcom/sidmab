'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { adminSignOut, getAdminSession } from '@/lib/admin-auth-client'
import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  Users,
  MessageSquare,
  FileText,
  CalendarCheck,
  UserCircle,
  BarChart3,
  Search,
  Settings,
  Bell,
  LogOut,
  Menu,
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  Image,
  Film,
  Send,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Event Pages', href: '/dashboard/services', icon: ClipboardList },
  { label: 'Gallery', href: '/dashboard/gallery', icon: Image },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Testimonials', href: '/dashboard/testimonials', icon: MessageSquare },
  { label: 'Blog', href: '/dashboard/blog', icon: FileText },
  { label: 'Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
  { label: 'Messages', href: '/dashboard/messages', icon: Mail },
  { label: 'Newsletter', href: '/dashboard/newsletter', icon: Send },
  { label: 'Users', href: '/dashboard/users', icon: UserCircle },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'SEO', href: '/dashboard/seo', icon: Search },
  { label: 'Media Library', href: '/dashboard/media', icon: Film },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function Mail({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [siteName, setSiteName] = useState('SIDMAB Events & Management')
  const [showNotif, setShowNotif] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<{ id: string; type: 'message' | 'booking'; name: string; label: string; createdAt: string }[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const [adminSession, setAdminSession] = useState<any | null>(null)
  const [adminLoading, setAdminLoading] = useState(true)

  useEffect(() => {
    getAdminSession().then((s) => {
      setAdminSession(s)
      setAdminLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!adminLoading && !adminSession) {
      router.push('/admin-login')
    } else if (adminSession?.user?.role === 'client') {
      router.push('/')
    }
  }, [adminLoading, adminSession, router])

  const handleAdminSignOut = async () => {
    await adminSignOut()
    router.replace('/')
  }

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const [msgRes, bookRes] = await Promise.all([
          fetch('/api/messages'),
          fetch('/api/bookings'),
        ])
        const messages = await msgRes.json()
        const bookings = await bookRes.json()

        const items: typeof notifications = []

        if (Array.isArray(messages)) {
          messages.filter((m: any) => !m.read).forEach((m: any) => {
            items.push({ id: `msg-${m.id}`, type: 'message', name: m.name, label: m.subject, createdAt: m.createdAt })
          })
        }
        if (Array.isArray(bookings)) {
          bookings.filter((b: any) => b.status === 'pending').forEach((b: any) => {
            items.push({ id: `book-${b.id}`, type: 'booking', name: b.name, label: `${b.eventType} - ${b.service}`, createdAt: b.createdAt })
          })
        }

        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setUnreadCount(items.length)
        setNotifications(items.slice(0, 5))
      } catch {}
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!adminLoading && !adminSession) {
      router.push('/admin-login')
    } else if (adminSession?.user?.role === 'client') {
      router.push('/')
    }
  }, [adminLoading, adminSession, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.siteName) setSiteName(data.siteName)
      })
      .catch(() => {})
  }, [])

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary animate-pulse" />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="loading loading-spinner loading-sm text-primary" />
            <span className="text-sm text-base-content/50 font-medium">Loading dashboard...</span>
        </div>
      </div>
    </div>
  )
}

  if (!adminSession) return null

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-base-300">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
          S
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-lg truncate"
          >
            SIDMAB
        </motion.span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-sm'
                    : 'text-base-content/70 hover:bg-base-300/50 hover:text-base-content'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-base-300">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {adminSession.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminSession.user?.name || 'User'}</p>
              <p className="text-xs text-base-content/50 truncate">{adminSession.user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-200">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-base-100 shadow-2xl lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        <aside
          className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-base-100 border-r border-base-300 transition-all duration-300 ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          <SidebarContent />
        </aside>

        <div
          className={`transition-all duration-300 ${
            collapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          <header className="sticky top-0 z-20 bg-base-100/80 backdrop-blur-md border-b border-base-300">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
              <div className="flex items-center gap-3">
                <button
                  className="btn btn-ghost btn-sm btn-square lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-square hidden lg:flex"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? (
                    <PanelRightOpen className="w-5 h-5" />
                  ) : (
                    <PanelRightClose className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotif(!showNotif)}
                    className="btn btn-ghost btn-sm btn-square relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-[10px] text-white font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotif && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-base-200 flex items-center justify-between">
                          <p className="text-sm font-semibold">Notifications</p>
                          {unreadCount > 0 && (
                            <span className="text-xs text-base-content/50">{unreadCount} unread</span>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-base-content/40">
                              No new notifications
                            </div>
                          ) : (
                            notifications.map((item) => (
                              <Link
                                key={item.id}
                                href={item.type === 'booking' ? '/dashboard/bookings' : '/dashboard/messages'}
                                onClick={() => setShowNotif(false)}
                                className="flex items-start gap-3 p-3 hover:bg-base-200/50 transition-colors border-b border-base-200 last:border-0"
                              >
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${item.type === 'booking' ? 'bg-warning' : 'bg-primary'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{item.name}</p>
                                  <p className="text-xs text-base-content/50 truncate">{item.label}</p>
                                  <span className="text-[10px] uppercase tracking-wider text-base-content/30">{item.type}</span>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {adminSession.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">
                      {adminSession.user?.name || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 hidden sm:block text-base-content/50" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-1"
                  >
                    <li>
                      <Link href="/dashboard/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleAdminSignOut}
                        className="flex items-center gap-2 text-error"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-6">{children}</main>
        </div>
    </div>
  )
}
