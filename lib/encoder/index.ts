import type { EncoderAlgorithm, EncoderResult } from '@/types'
import { encodeBase64, decodeBase64 } from './base64'
import { encodeURL, decodeURL } from './url'
import { encodeHex, decodeHex } from './hex'

export function encode(algorithm: EncoderAlgorithm, input: string): EncoderResult {
  switch (algorithm) {
    case 'base64':
      return encodeBase64(input)
    case 'url':
      return encodeURL(input)
    case 'hex':
      return encodeHex(input)
    default:
      return { success: false, output: '', error: 'Unknown algorithm' }
  }
}

export function decode(algorithm: EncoderAlgorithm, input: string): EncoderResult {
  switch (algorithm) {
    case 'base64':
      return decodeBase64(input)
    case 'url':
      return decodeURL(input)
    case 'hex':
      return decodeHex(input)
    default:
      return { success: false, output: '', error: 'Unknown algorithm' }
  }
}

export { encodeBase64, decodeBase64, encodeBase64FromHex, decodeBase64ToHex } from './base64'
export { encodeURL, decodeURL } from './url'
export { encodeHex, decodeHex } from './hex'
