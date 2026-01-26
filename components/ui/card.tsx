import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement>

function Card({ className, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'bg-bg-secondary border border-border-default rounded-xl p-6',
        'shadow-lg shadow-black/20',
        className
      )}
      {...props}
    />
  )
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>

function CardHeader({ className, ...props }: CardHeaderProps): React.ReactElement {
  return <div className={cn('mb-4', className)} {...props} />
}

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>

function CardTitle({ className, ...props }: CardTitleProps): React.ReactElement {
  return (
    <h3
      className={cn('text-lg font-semibold text-text-primary', className)}
      {...props}
    />
  )
}

type CardContentProps = HTMLAttributes<HTMLDivElement>

function CardContent({ className, ...props }: CardContentProps): React.ReactElement {
  return <div className={cn('', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }
