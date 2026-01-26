import type { HashAlgorithm } from '@/types'

interface AlgorithmMetadata {
  name: string
  displayName: string
  outputLength: number // in hex characters
}

export const HASH_ALGORITHMS: Record<HashAlgorithm, AlgorithmMetadata> = {
  md5: {
    name: 'md5',
    displayName: 'MD5',
    outputLength: 32,
  },
  sha1: {
    name: 'sha1',
    displayName: 'SHA-1',
    outputLength: 40,
  },
  sha256: {
    name: 'sha256',
    displayName: 'SHA-256',
    outputLength: 64,
  },
  sha384: {
    name: 'sha384',
    displayName: 'SHA-384',
    outputLength: 96,
  },
  sha512: {
    name: 'sha512',
    displayName: 'SHA-512',
    outputLength: 128,
  },
}
