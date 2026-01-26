'use client'

import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps): React.ReactElement {
  const { copied, copy } = useClipboard()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copy(text)}
      className={cn('gap-1.5', className)}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-accent-success" />
          <span className="text-accent-success">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </>
      )}
    </Button>
  )
}
