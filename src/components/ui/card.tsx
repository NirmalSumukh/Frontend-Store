import React from 'react'
import { clsx } from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'gradient'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    // MODIFICATION: Updated variants to use CSS variables
    const variants = {
      default: 'bg-card text-card-foreground border border-border shadow-sm',
      glass: 'bg-card/90 backdrop-blur-md border border-border shadow-xl',
      gradient: 'bg-gradient-to-br from-card to-secondary border border-border shadow-lg',
    }
    
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl overflow-hidden transition-all duration-300',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'