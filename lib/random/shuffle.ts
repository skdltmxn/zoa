export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const bytes = new Uint8Array(4)
    crypto.getRandomValues(bytes)
    const randomValue = (bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3]) >>> 0
    const j = randomValue % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function shuffleLines(input: string): string {
  const lines = input.split('\n').filter(line => line.trim() !== '')
  const shuffled = shuffleArray(lines)
  return shuffled.join('\n')
}
