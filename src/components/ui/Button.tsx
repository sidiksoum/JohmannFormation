import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size]

  const variantStyles = {
    primary:
      'bg-[#7A1B29] text-white hover:bg-[#631420] active:scale-[0.98] shadow-sm shadow-[#7A1B29]/20 border border-[#7A1B29]',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98] border border-slate-200',
    outline:
      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 hover:border-slate-400 active:scale-[0.98]',
    gold:
      'bg-[#C59B27] text-white hover:bg-[#A9831F] active:scale-[0.98] shadow-sm shadow-[#C59B27]/20 border border-[#C59B27]',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm shadow-rose-600/20 border border-rose-600',
  }[variant]

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}
