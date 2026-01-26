export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'

export type HashInputType = 'string' | 'file' | 'hex'

export interface HashResult {
  algorithm: HashAlgorithm
  hash: string
  error?: string
}

export type EncoderAlgorithm = 'base64' | 'url' | 'hex'

export interface EncoderResult {
  success: boolean
  output: string
  error?: string
}

export type IdFormat = 'uuidv4' | 'uuidv7' | 'ulid' | 'nanoid' | 'cuid'

export interface IdFormatMetadata {
  name: IdFormat
  displayName: string
  description: string
}
