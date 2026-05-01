import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
      primary: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300',
      success: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full font-medium transition-all duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
