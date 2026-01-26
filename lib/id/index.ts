import type { IdFormat, IdFormatMetadata } from '@/types'

export const ID_FORMATS: Record<IdFormat, IdFormatMetadata> = {
  uuidv4: {
    name: 'uuidv4',
    displayName: 'UUID v4',
    description: 'Random UUID (RFC 4122)',
  },
  uuidv7: {
    name: 'uuidv7',
    displayName: 'UUID v7',
    description: 'Timestamp-based UUID (RFC 9562)',
  },
  ulid: {
    name: 'ulid',
    displayName: 'ULID',
    description: 'Universally Unique Lexicographically Sortable Identifier',
  },
  nanoid: {
    name: 'nanoid',
    displayName: 'NanoID',
    description: 'Compact, URL-safe unique ID (21 chars)',
  },
  cuid: {
    name: 'cuid',
    displayName: 'CUID',
    description: 'Collision-resistant unique ID',
  },
}

export const ID_FORMAT_ORDER: IdFormat[] = ['uuidv4', 'uuidv7', 'ulid', 'nanoid', 'cuid']

// UUID v4: Random UUID
export function generateUUIDv4(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Set version (4) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-')
}

// UUID v7: Timestamp-based UUID
export function generateUUIDv7(): string {
  const timestamp = Date.now()
  const timestampHex = timestamp.toString(16).padStart(12, '0')

  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)

  // Set version (7) and variant bits
  randomBytes[0] = (randomBytes[0] & 0x0f) | 0x70 // version 7
  randomBytes[2] = (randomBytes[2] & 0x3f) | 0x80 // variant 10

  const randomHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return [
    timestampHex.slice(0, 8),
    timestampHex.slice(8, 12) + randomHex.slice(0, 2),
    randomHex.slice(2, 6),
    randomHex.slice(6, 10),
    randomHex.slice(10, 22),
  ].join('-')
}

// ULID: Universally Unique Lexicographically Sortable Identifier
const ULID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export function generateULID(): string {
  const timestamp = Date.now()
  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)

  // Encode timestamp (48 bits = 10 characters)
  let timeEncoded = ''
  let time = timestamp
  for (let i = 0; i < 10; i++) {
    timeEncoded = ULID_ENCODING[time % 32] + timeEncoded
    time = Math.floor(time / 32)
  }

  // Encode random (80 bits = 16 characters)
  let randomEncoded = ''
  for (let i = 0; i < 16; i++) {
    const byteIndex = Math.floor((i * 5) / 8)
    const bitOffset = (i * 5) % 8

    let value = (randomBytes[byteIndex] >> bitOffset) & 0x1f
    if (bitOffset > 3 && byteIndex + 1 < randomBytes.length) {
      value |= (randomBytes[byteIndex + 1] << (8 - bitOffset)) & 0x1f
    }
    randomEncoded += ULID_ENCODING[value]
  }

  return timeEncoded + randomEncoded
}

// NanoID: Compact URL-safe ID
const NANOID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

export function generateNanoID(size: number = 21): string {
  const randomBytes = new Uint8Array(size)
  crypto.getRandomValues(randomBytes)

  let id = ''
  for (let i = 0; i < size; i++) {
    id += NANOID_ALPHABET[randomBytes[i] & 63]
  }
  return id
}

// CUID: Collision-resistant ID
let cuidCounter = Math.floor(Math.random() * 1679616) // Base 36: 36^4

export function generateCUID(): string {
  const timestamp = Date.now().toString(36)
  const counter = (cuidCounter++).toString(36).padStart(4, '0')

  if (cuidCounter >= 1679616) {
    cuidCounter = 0
  }

  const randomBytes = new Uint8Array(8)
  crypto.getRandomValues(randomBytes)
  const random = Array.from(randomBytes)
    .map((b) => (b % 36).toString(36))
    .join('')

  return 'c' + timestamp + counter + random
}

// Generate IDs by format
export function generateId(format: IdFormat): string {
  switch (format) {
    case 'uuidv4':
      return generateUUIDv4()
    case 'uuidv7':
      return generateUUIDv7()
    case 'ulid':
      return generateULID()
    case 'nanoid':
      return generateNanoID()
    case 'cuid':
      return generateCUID()
    default:
      throw new Error(`Unknown format: ${format}`)
  }
}

export function generateIds(format: IdFormat, count: number): string[] {
  const ids: string[] = []
  const safeCount = Math.min(Math.max(1, count), 100)

  for (let i = 0; i < safeCount; i++) {
    ids.push(generateId(format))
  }

  return ids
}
