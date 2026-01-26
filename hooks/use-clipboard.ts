'use client'

import { useState, useCallback } from 'react'

interface UseClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<void>
}

export function useClipboard(timeout = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      } catch {
        // Fallback for non-secure contexts (HTTP)
        try {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.left = '-9999px'
          document.body.appendChild(textarea)
          textarea.select()
          textarea.setSelectionRange(0, textarea.value.length)
          const success = document.execCommand('copy')
          document.body.removeChild(textarea)
          if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), timeout)
          }
        } catch (fallbackError) {
          console.error('Failed to copy to clipboard:', fallbackError)
        }
      }
    },
    [timeout]
  )

  return { copied, copy }
}
