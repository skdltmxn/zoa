import type { EncoderResult } from '@/types'

export function encodeURL(input: string): EncoderResult {
  try {
    const encoded = encodeURIComponent(input)
    return { success: true, output: encoded }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to encode'
    return { success: false, output: '', error: message }
  }
}

export function decodeURL(input: string): EncoderResult {
  try {
    const decoded = decodeURIComponent(input)
    return { success: true, output: decoded }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid URL-encoded input'
    return { success: false, output: '', error: message }
  }
}
