'use server'

import { createHash } from 'crypto'
import type { HashAlgorithm, HashResult } from '@/types'

const ALGORITHM_MAP: Record<HashAlgorithm, string> = {
  md5: 'md5',
  sha1: 'sha1',
  sha256: 'sha256',
  sha384: 'sha384',
  sha512: 'sha512',
}

export async function computeHash(
  algorithm: HashAlgorithm,
  data: string | number[]
): Promise<string> {
  const nodeAlgorithm = ALGORITHM_MAP[algorithm]
  const hash = createHash(nodeAlgorithm)

  if (typeof data === 'string') {
    hash.update(data, 'utf8')
  } else {
    hash.update(Buffer.from(data))
  }

  return hash.digest('hex')
}

export async function computeAllHashes(
  data: string | number[]
): Promise<HashResult[]> {
  const algorithms: HashAlgorithm[] = ['md5', 'sha1', 'sha256', 'sha384', 'sha512']
  const results: HashResult[] = []

  for (const algorithm of algorithms) {
    try {
      const hash = await computeHash(algorithm, data)
      results.push({ algorithm, hash })
    } catch (err) {
      results.push({
        algorithm,
        hash: '',
        error: err instanceof Error ? err.message : 'Hash failed',
      })
    }
  }

  return results
}
