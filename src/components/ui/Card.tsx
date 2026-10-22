import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'clean' | 'elevated' | 'subtle'
  className?: string
}

export function Card({ children, variant = 'clean', className = '', ...props }: CardProps) {
  const variantStyles = {
    clean: 'bg-white border border-slate-200/90 rounded-2xl shadow-sm shadow-slate-900/5',
    elevated: 'bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5',
    subtle: 'bg-slate-50/70 border border-slate-200/80 rounded-2xl',
  }[variant]

  return (
    <div className={`${variantStyles} p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}
