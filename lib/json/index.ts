import YAML from 'yaml'

export type DataFormat = 'json' | 'yaml'
export type Operation = 'format' | 'minify' | 'toJson' | 'toYaml'

export interface ProcessResult {
  success: boolean
  output: string
  error?: string
}

export interface OperationMetadata {
  name: Operation
  displayName: string
  description: string
}

export const OPERATIONS: OperationMetadata[] = [
  { name: 'format', displayName: 'Format', description: 'Beautify with indentation' },
  { name: 'minify', displayName: 'Minify', description: 'Remove all whitespace' },
  { name: 'toJson', displayName: 'To JSON', description: 'Convert to JSON' },
  { name: 'toYaml', displayName: 'To YAML', description: 'Convert to YAML' },
]

function detectFormat(input: string): DataFormat {
  const trimmed = input.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json'
  }
  return 'yaml'
}

function parseInput(input: string): { data: unknown; format: DataFormat } {
  const format = detectFormat(input)

  if (format === 'json') {
    return { data: JSON.parse(input), format: 'json' }
  }
  return { data: YAML.parse(input), format: 'yaml' }
}

export function processData(input: string, operation: Operation, indent: number = 2): ProcessResult {
  if (!input.trim()) {
    return { success: false, output: '', error: 'Input is empty' }
  }

  try {
    const { data, format } = parseInput(input)

    switch (operation) {
      case 'format':
        if (format === 'json') {
          return { success: true, output: JSON.stringify(data, null, indent) }
        }
        return { success: true, output: YAML.stringify(data, { indent }) }

      case 'minify':
        if (format === 'json') {
          return { success: true, output: JSON.stringify(data) }
        }
        return { success: true, output: YAML.stringify(data, { indent: 0, lineWidth: 0 }).trim() }

      case 'toJson':
        return { success: true, output: JSON.stringify(data, null, indent) }

      case 'toYaml':
        return { success: true, output: YAML.stringify(data, { indent }) }

      default:
        return { success: false, output: '', error: 'Unknown operation' }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid input'
    return { success: false, output: '', error: message }
  }
}
