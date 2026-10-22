import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  titre: string
  valeur: string | number
  description?: string
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  badgeText?: string
  badgeVariant?: 'success' | 'warning' | 'johmann' | 'neutral'
}

export function StatCard({
  titre,
  valeur,
  description,
  icon: Icon,
  iconBgColor = 'bg-slate-100',
  iconColor = 'text-slate-700',
  badgeText,
  badgeVariant = 'success',
}: StatCardProps) {
  const badgeClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    johmann: 'bg-[#FDF2F4] text-[#7A1B29] border-[#FBCFE8]',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  }[badgeVariant]

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm shadow-slate-900/5 hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {titre}
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block tracking-tight">
            {valeur}
          </span>
        </div>

        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(description || badgeText) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {description && <span className="text-slate-500">{description}</span>}
          {badgeText && (
            <span className={`px-2 py-0.5 rounded-full font-medium border ${badgeClasses}`}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
