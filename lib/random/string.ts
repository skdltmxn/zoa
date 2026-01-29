export interface CharsetOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

export interface RandomStringOptions {
  length: number
  charset: CharsetOptions
}

const CHARS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const CHARS_NUMBERS = '0123456789'
const CHARS_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

export function generateRandomString(options: RandomStringOptions): string {
  const { length, charset } = options

  let chars = ''
  if (charset.uppercase) chars += CHARS_UPPER
  if (charset.lowercase) chars += CHARS_LOWER
  if (charset.numbers) chars += CHARS_NUMBERS
  if (charset.symbols) chars += CHARS_SYMBOLS

  if (chars.length === 0) {
    return ''
  }

  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)

  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }

  return result
}
