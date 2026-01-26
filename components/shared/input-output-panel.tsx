'use client'

import { ArrowUpDown } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/shared/copy-button'
import { cn } from '@/lib/utils'

interface InputOutputPanelProps {
  inputLabel?: string
  outputLabel?: string
  inputValue: string
  outputValue: string
  onInputChange: (value: string) => void
  onSwap?: () => void
  inputPlaceholder?: string
  outputPlaceholder?: string
  error?: string | null
  className?: string
}

export function InputOutputPanel({
  inputLabel = 'Input',
  outputLabel = 'Output',
  inputValue,
  outputValue,
  onInputChange,
  onSwap,
  inputPlaceholder = 'Enter text...',
  outputPlaceholder = 'Result will appear here...',
  error,
  className,
}: InputOutputPanelProps): React.ReactElement {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">
            {inputLabel}
          </label>
          {inputValue && <CopyButton text={inputValue} />}
        </div>
        <Textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          monospace
          rows={6}
        />
      </div>

      {onSwap && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwap}
            className="gap-2"
            aria-label="Swap input and output"
          >
            <ArrowUpDown className="h-4 w-4" />
            Swap
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">
            {outputLabel}
          </label>
          {outputValue && <CopyButton text={outputValue} />}
        </div>
        <Textarea
          value={outputValue}
          readOnly
          placeholder={outputPlaceholder}
          monospace
          rows={6}
          className={cn(error && 'border-accent-error')}
        />
        {error && <p className="text-accent-error text-sm">{error}</p>}
      </div>
    </div>
  )
}
