import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'johmann' | 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  }[size]

  const variantStyles = {
    johmann: 'bg-[#FDF2F4] text-[#7A1B29] border border-[#FBCFE8]',
    gold: 'bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A]',
    success: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
    info: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  )
}
