import type { EncoderResult } from '@/types'

export function encodeHex(input: string): EncoderResult {
  try {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(input)
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return { success: true, output: hex }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to encode'
    return { success: false, output: '', error: message }
  }
}

export function decodeHex(input: string): EncoderResult {
  try {
    const cleaned = input.replace(/\s/g, '').toLowerCase()

    if (!/^[0-9a-f]*$/.test(cleaned)) {
      return { success: false, output: '', error: 'Invalid hex characters' }
    }

    if (cleaned.length % 2 !== 0) {
      return { success: false, output: '', error: 'Hex string must have even length' }
    }

    const bytes = new Uint8Array(cleaned.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16)
    }

    const decoder = new TextDecoder()
    const decoded = decoder.decode(bytes)
    return { success: true, output: decoded }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid hex input'
    return { success: false, output: '', error: message }
  }
}
