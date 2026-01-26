'use client'

import { useState, useCallback, type ChangeEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const HEX_REGEX = /^[0-9a-fA-F\s]*$/

interface HexInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function HexInput({
  value,
  onChange,
  className,
}: HexInputProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>): void => {
      const newValue = e.target.value
      if (!HEX_REGEX.test(newValue)) {
        setError('Invalid hex: only 0-9, a-f, A-F, and spaces allowed')
      } else {
        setError(null)
      }
      onChange(newValue)
    },
    [onChange]
  )

  const cleanHex = value.replace(/\s/g, '')
  const byteCount = Math.floor(cleanHex.length / 2)

  return (
    <div className={cn('space-y-2', className)}>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Enter hex values (e.g., 48 65 6c 6c 6f or 48656c6c6f)"
        monospace
        rows={6}
        className={cn(error && 'border-accent-error focus:border-accent-error focus:ring-accent-error')}
      />
      <div className="flex justify-between text-sm">
        {error ? (
          <p className="text-accent-error">{error}</p>
        ) : (
          <p className="text-text-muted">
            {byteCount} byte{byteCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

export function isValidHex(value: string): boolean {
  const cleaned = value.replace(/\s/g, '')
  return HEX_REGEX.test(value) && cleaned.length % 2 === 0
}

export function hexToUint8Array(hex: string): Uint8Array {
  const cleaned = hex.replace(/\s/g, '')
  const bytes = new Uint8Array(cleaned.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
