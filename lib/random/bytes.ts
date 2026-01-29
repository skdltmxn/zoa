export type HexSeparator = 'none' | 'space' | 'colon'

export interface RandomBytesOptions {
  length: number
  separator?: HexSeparator
}

export interface RandomBytesResult {
  hex: string
  base64: string
}

export function generateRandomBytes(options: RandomBytesOptions): RandomBytesResult {
  const { length, separator = 'none' } = options
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)

  const hexArray = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'))
  let hex: string
  switch (separator) {
    case 'space':
      hex = hexArray.join(' ')
      break
    case 'colon':
      hex = hexArray.join(':')
      break
    default:
      hex = hexArray.join('')
  }

  const binary = String.fromCharCode(...bytes)
  const base64 = btoa(binary)

  return { hex, base64 }
}
