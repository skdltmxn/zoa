import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  monospace?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, monospace = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-bg-secondary border border-border-default rounded-lg px-4 py-3',
          'text-text-primary placeholder:text-text-muted',
          'focus:border-border-focus focus:ring-1 focus:ring-border-focus',
          'transition-colors outline-none resize-none',
          monospace && 'font-mono text-sm',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
