'use client'

import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4 text-base-content/30">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      {description && (
        <p className="text-sm text-base-content/50 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
