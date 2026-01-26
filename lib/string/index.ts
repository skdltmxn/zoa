export type StringTransform =
  | 'reverse'
  | 'uppercase'
  | 'lowercase'
  | 'invertCase'
  | 'camelToSnake'
  | 'snakeToCamel'
  | 'camelToKebab'
  | 'kebabToCamel'
  | 'trim'
  | 'removeExtraSpaces'
  | 'sortLines'
  | 'sortLinesDesc'
  | 'removeDuplicateLines'

export interface TransformMetadata {
  name: StringTransform
  displayName: string
  description: string
}

export const TRANSFORMS: TransformMetadata[] = [
  { name: 'reverse', displayName: 'Reverse', description: 'Reverse the string' },
  { name: 'uppercase', displayName: 'UPPERCASE', description: 'Convert to uppercase' },
  { name: 'lowercase', displayName: 'lowercase', description: 'Convert to lowercase' },
  { name: 'invertCase', displayName: 'iNVERT cASE', description: 'Swap uppercase and lowercase' },
  { name: 'camelToSnake', displayName: 'camel → snake', description: 'camelCase to snake_case' },
  { name: 'snakeToCamel', displayName: 'snake → camel', description: 'snake_case to camelCase' },
  { name: 'camelToKebab', displayName: 'camel → kebab', description: 'camelCase to kebab-case' },
  { name: 'kebabToCamel', displayName: 'kebab → camel', description: 'kebab-case to camelCase' },
  { name: 'trim', displayName: 'Trim', description: 'Remove leading and trailing whitespace' },
  { name: 'removeExtraSpaces', displayName: 'Remove Extra Spaces', description: 'Collapse multiple spaces into one' },
  { name: 'sortLines', displayName: 'Sort Lines (A-Z)', description: 'Sort lines alphabetically' },
  { name: 'sortLinesDesc', displayName: 'Sort Lines (Z-A)', description: 'Sort lines in reverse order' },
  { name: 'removeDuplicateLines', displayName: 'Remove Duplicate Lines', description: 'Remove duplicate lines' },
]

export function transformString(input: string, transform: StringTransform): string {
  switch (transform) {
    case 'reverse':
      return [...input].reverse().join('')

    case 'uppercase':
      return input.toUpperCase()

    case 'lowercase':
      return input.toLowerCase()

    case 'invertCase':
      return [...input]
        .map((char) => {
          if (char === char.toUpperCase()) {
            return char.toLowerCase()
          }
          return char.toUpperCase()
        })
        .join('')

    case 'camelToSnake':
      return input
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')

    case 'snakeToCamel':
      return input
        .toLowerCase()
        .replace(/_([a-z])/g, (_, char) => char.toUpperCase())

    case 'camelToKebab':
      return input
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')

    case 'kebabToCamel':
      return input
        .toLowerCase()
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase())

    case 'trim':
      return input.trim()

    case 'removeExtraSpaces':
      return input.replace(/  +/g, ' ')

    case 'sortLines':
      return input.split('\n').sort().join('\n')

    case 'sortLinesDesc':
      return input.split('\n').sort().reverse().join('\n')

    case 'removeDuplicateLines':
      return [...new Set(input.split('\n'))].join('\n')

    default:
      return input
  }
}
