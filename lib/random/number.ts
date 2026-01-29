export interface RandomNumberOptions {
  min: number
  max: number
  count: number
}

export function generateRandomNumbers(options: RandomNumberOptions): number[] {
  const { min, max, count } = options

  if (min > max) {
    return []
  }

  const range = max - min + 1
  const results: number[] = []

  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(4)
    crypto.getRandomValues(bytes)
    const value = (bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3]) >>> 0
    const randomNum = min + (value % range)
    results.push(randomNum)
  }

  return results
}
