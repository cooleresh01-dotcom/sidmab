import type { Metadata } from "next"
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/ThemeProvider"
import ConditionalNavbar from "@/components/layout/ConditionalNavbar"
import ConditionalFooter from "@/components/layout/ConditionalFooter"
import { prisma } from "@/lib/db"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "SIDMAB Events & Management - Premier Event Planning Services",
    template: "%s | SIDMAB Events & Management",
  },
  description:
    "Premier event planning and management services. We create unforgettable experiences for weddings, corporate events, birthdays, and special celebrations across Nigeria.",
  keywords: [
    "event planning",
    "wedding planner",
    "corporate events",
    "event management",
    "Nigeria events",
    "SIDMAB",
  ],
  openGraph: {
    title: "SIDMAB Events & Management",
    description:
      "Premier event planning and management services. Creating unforgettable experiences.",
    type: "website",
    locale: "en_US",
    siteName: "SIDMAB Events & Management",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let primaryColor = '#BA4583'
  let secondaryColor = '#C8963E'

  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['primaryColor', 'secondaryColor'] } },
    })
    for (const row of rows) {
      if (row.key === 'primaryColor' && row.value) primaryColor = row.value
      if (row.key === 'secondaryColor' && row.value) secondaryColor = row.value
    }
  } catch {}

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}
      data-theme="light"
      style={{
        '--site-primary': primaryColor,
        '--site-secondary': secondaryColor,
      } as React.CSSProperties}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          <ThemeProvider>
            <ConditionalNavbar />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
