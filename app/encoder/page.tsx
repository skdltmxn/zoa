'use client'

import { useState, useCallback } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InputOutputPanel } from '@/components/shared/input-output-panel'
import { encode, decode } from '@/lib/encoder'
import type { EncoderAlgorithm } from '@/types'

export default function EncoderPage(): React.ReactElement {
  const [algorithm, setAlgorithm] = useState<EncoderAlgorithm>('base64')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleEncode = useCallback((): void => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }
    const result = encode(algorithm, input)
    if (result.success) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput('')
      setError(result.error ?? 'Encoding failed')
    }
  }, [algorithm, input])

  const handleDecode = useCallback((): void => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }
    const result = decode(algorithm, input)
    if (result.success) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput('')
      setError(result.error ?? 'Decoding failed')
    }
  }, [algorithm, input])

  const handleAlgorithmChange = (value: string): void => {
    setAlgorithm(value as EncoderAlgorithm)
    setOutput('')
    setError(null)
  }

  const handleSwap = useCallback((): void => {
    setInput(output)
    setOutput(input)
    setError(null)
  }, [input, output])

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Encoder / Decoder
        </h1>
        <p className="text-text-secondary">
          Convert text between Base64, URL, and Hex encoding formats
        </p>
      </div>

      <Card>
        <Tabs defaultValue="base64" onChange={handleAlgorithmChange}>
          <TabsList>
            <TabsTrigger value="base64">Base64</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="hex">Hex</TabsTrigger>
          </TabsList>

          <TabsContent value="base64">
            <EncoderContent
              input={input}
              output={output}
              error={error}
              onInputChange={setInput}
              onEncode={handleEncode}
              onDecode={handleDecode}
              onSwap={handleSwap}
            />
          </TabsContent>

          <TabsContent value="url">
            <EncoderContent
              input={input}
              output={output}
              error={error}
              onInputChange={setInput}
              onEncode={handleEncode}
              onDecode={handleDecode}
              onSwap={handleSwap}
            />
          </TabsContent>

          <TabsContent value="hex">
            <EncoderContent
              input={input}
              output={output}
              error={error}
              onInputChange={setInput}
              onEncode={handleEncode}
              onDecode={handleDecode}
              onSwap={handleSwap}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </PageContainer>
  )
}

interface EncoderContentProps {
  input: string
  output: string
  error: string | null
  onInputChange: (value: string) => void
  onEncode: () => void
  onDecode: () => void
  onSwap: () => void
}

function EncoderContent({
  input,
  output,
  error,
  onInputChange,
  onEncode,
  onDecode,
  onSwap,
}: EncoderContentProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <InputOutputPanel
        inputValue={input}
        outputValue={output}
        onInputChange={onInputChange}
        onSwap={onSwap}
        inputPlaceholder="Enter text to encode or decode..."
        outputPlaceholder="Result will appear here..."
        error={error}
      />

      <div className="flex justify-center gap-4">
        <Button onClick={onEncode}>Encode</Button>
        <Button onClick={onDecode}>Decode</Button>
      </div>
    </div>
  )
}
