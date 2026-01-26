'use client'

import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileUpload } from '@/components/shared/file-upload'
import { HexInput, isValidHex, hexToUint8Array } from '@/components/shared/hex-input'
import { CopyButton } from '@/components/shared/copy-button'
import { HASH_ALGORITHMS } from '@/lib/hash'
import { fileToBytes } from '@/lib/file'
import { computeAllHashes } from '@/actions/hash'
import type { HashInputType, HashResult } from '@/types'

export default function HashPage(): React.ReactElement {
  const [inputType, setInputType] = useState<HashInputType>('string')
  const [stringInput, setStringInput] = useState('')
  const [hexInput, setHexInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [results, setResults] = useState<HashResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateHash = useCallback(async (): Promise<void> => {
    setError(null)
    setResults([])

    let data: string | number[]
    try {
      if (inputType === 'string') {
        if (!stringInput.trim()) {
          setError('Please enter some text')
          return
        }
        data = stringInput
      } else if (inputType === 'file') {
        if (!selectedFile) {
          setError('Please select a file')
          return
        }
        data = await fileToBytes(selectedFile)
      } else {
        if (!hexInput.trim()) {
          setError('Please enter hex values')
          return
        }
        if (!isValidHex(hexInput)) {
          setError('Invalid hex format. Must be even number of hex characters.')
          return
        }
        data = Array.from(hexToUint8Array(hexInput))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read input')
      return
    }

    setIsLoading(true)
    try {
      const hashResults = await computeAllHashes(data)
      setResults(hashResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate hashes')
    }
    setIsLoading(false)
  }, [inputType, stringInput, hexInput, selectedFile])

  const handleInputTypeChange = (value: string): void => {
    setInputType(value as HashInputType)
    setResults([])
    setError(null)
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Hash Generator
        </h1>
        <p className="text-text-secondary">
          Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <Tabs defaultValue="string" onChange={handleInputTypeChange}>
            <TabsList>
              <TabsTrigger value="string">String</TabsTrigger>
              <TabsTrigger value="file">File</TabsTrigger>
              <TabsTrigger value="hex">Hex</TabsTrigger>
            </TabsList>

            <TabsContent value="string">
              <Textarea
                value={stringInput}
                onChange={(e) => setStringInput(e.target.value)}
                placeholder="Enter text to hash..."
                rows={6}
              />
            </TabsContent>

            <TabsContent value="file">
              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
                onClear={() => setSelectedFile(null)}
              />
            </TabsContent>

            <TabsContent value="hex">
              <HexInput value={hexInput} onChange={setHexInput} />
            </TabsContent>
          </Tabs>

          {error && (
            <p className="text-accent-error text-sm mt-4">{error}</p>
          )}

          <div className="mt-6 flex justify-center">
            <Button onClick={handleGenerateHash} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Hash'
              )}
            </Button>
          </div>
        </Card>

        {results.length > 0 && (
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Results
            </h2>
            <div className="space-y-3">
              {results.map((result) => (
                <HashResultRow key={result.algorithm} result={result} />
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  )
}

interface HashResultRowProps {
  result: HashResult
}

function HashResultRow({ result }: HashResultRowProps): React.ReactElement {
  const meta = HASH_ALGORITHMS[result.algorithm]

  return (
    <div className="flex items-center gap-4 p-3 bg-bg-primary rounded-lg">
      <span className="w-20 text-sm font-medium text-text-secondary shrink-0">
        {meta.displayName}
      </span>
      {result.error ? (
        <span className="text-accent-error text-sm">{result.error}</span>
      ) : (
        <>
          <code className="flex-1 font-mono text-sm text-text-primary break-all">
            {result.hash}
          </code>
          <CopyButton text={result.hash} />
        </>
      )}
    </div>
  )
}
