'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowLeft } from 'react-icons/hi'

export default function BackButton() {
  return (
    <Link href="/">
      <motion.div
        className="fixed top-20 left-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
        style={{ color: 'var(--site-primary)' }}
        animate={{ x: [0, -6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HiArrowLeft className="w-6 h-6" />
        Back
      </motion.div>
    </Link>
  )
}
