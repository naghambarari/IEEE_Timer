import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'outline' | 'solid';
  size?: 'small' | 'medium' | 'large' | 'icon';
}

export function Button({ children, className = '', variant = 'solid', size = 'medium', ...props }: ButtonProps) {
  const baseClasses = 'rounded-md font-semibold transition-colors'
  const variantClasses = variant === 'outline' ? 'border-2' : 'bg-opacity-90'
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    icon: 'p-2'
  }[size]

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}