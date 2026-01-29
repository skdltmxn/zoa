import type { EncoderResult } from '@/types'

export function encodeBase64(input: string): EncoderResult {
  try {
    // Handle UTF-8 properly by encoding to bytes first
    const encoder = new TextEncoder()
    const bytes = encoder.encode(input)
    const binary = String.fromCharCode(...bytes)
    const encoded = btoa(binary)
    return { success: true, output: encoded }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to encode'
    return { success: false, output: '', error: message }
  }
}

export function decodeBase64(input: string): EncoderResult {
  try {
    const binary = atob(input)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const decoder = new TextDecoder()
    const decoded = decoder.decode(bytes)
    return { success: true, output: decoded }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Base64 input'
    return { success: false, output: '', error: message }
  }
}

export function encodeBase64FromHex(hexInput: string): EncoderResult {
  try {
    const cleaned = hexInput.replace(/\s/g, '')
    if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
      return { success: false, output: '', error: 'Invalid hex: only 0-9, a-f allowed' }
    }
    if (cleaned.length % 2 !== 0) {
      return { success: false, output: '', error: 'Invalid hex: length must be even' }
    }
    const bytes = new Uint8Array(cleaned.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16)
    }
    const binary = String.fromCharCode(...bytes)
    const encoded = btoa(binary)
    return { success: true, output: encoded }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to encode'
    return { success: false, output: '', error: message }
  }
}

export function decodeBase64ToHex(input: string): EncoderResult {
  try {
    const binary = atob(input)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    return { success: true, output: hex }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Base64 input'
    return { success: false, output: '', error: message }
  }
}
