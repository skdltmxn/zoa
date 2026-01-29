'use client'

import { useState, useCallback } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InputOutputPanel } from '@/components/shared/input-output-panel'
import { encode, decode, encodeBase64FromHex, decodeBase64ToHex } from '@/lib/encoder'
import type { EncoderAlgorithm } from '@/types'

type Base64InputType = 'text' | 'hex'

export default function EncoderPage(): React.ReactElement {
  const [algorithm, setAlgorithm] = useState<EncoderAlgorithm>('base64')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [base64InputType, setBase64InputType] = useState<Base64InputType>('text')

  const handleEncode = useCallback((): void => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }
    let result
    if (algorithm === 'base64' && base64InputType === 'hex') {
      result = encodeBase64FromHex(input)
    } else {
      result = encode(algorithm, input)
    }
    if (result.success) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput('')
      setError(result.error ?? 'Encoding failed')
    }
  }, [algorithm, input, base64InputType])

  const handleDecode = useCallback((): void => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }
    let result
    if (algorithm === 'base64' && base64InputType === 'hex') {
      result = decodeBase64ToHex(input)
    } else {
      result = decode(algorithm, input)
    }
    if (result.success) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput('')
      setError(result.error ?? 'Decoding failed')
    }
  }, [algorithm, input, base64InputType])

  const handleAlgorithmChange = (value: string): void => {
    setAlgorithm(value as EncoderAlgorithm)
    setOutput('')
    setError(null)
  }

  const handleBase64InputTypeChange = (type: Base64InputType): void => {
    setBase64InputType(type)
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
            <Base64Content
              input={input}
              output={output}
              error={error}
              inputType={base64InputType}
              onInputChange={setInput}
              onInputTypeChange={handleBase64InputTypeChange}
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

interface Base64ContentProps {
  input: string
  output: string
  error: string | null
  inputType: Base64InputType
  onInputChange: (value: string) => void
  onInputTypeChange: (type: Base64InputType) => void
  onEncode: () => void
  onDecode: () => void
  onSwap: () => void
}

function Base64Content({
  input,
  output,
  error,
  inputType,
  onInputChange,
  onInputTypeChange,
  onEncode,
  onDecode,
  onSwap,
}: Base64ContentProps): React.ReactElement {
  const inputTypeSelector = (
    <div className="flex rounded bg-bg-tertiary p-0.5">
      <button
        type="button"
        onClick={() => onInputTypeChange('text')}
        className={`px-2 py-0.5 text-xs rounded transition-colors ${
          inputType === 'text'
            ? 'bg-bg-secondary text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        Text
      </button>
      <button
        type="button"
        onClick={() => onInputTypeChange('hex')}
        className={`px-2 py-0.5 text-xs rounded transition-colors ${
          inputType === 'hex'
            ? 'bg-bg-secondary text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        Hex
      </button>
    </div>
  )

  return (
    <div className="space-y-4">
      <InputOutputPanel
        inputValue={input}
        outputValue={output}
        onInputChange={onInputChange}
        onSwap={onSwap}
        inputPlaceholder={
          inputType === 'hex'
            ? "Enter hex values (e.g., 48656c6c6f)..."
            : "Enter text to encode or decode..."
        }
        outputPlaceholder="Result will appear here..."
        error={error}
        inputLabelExtra={inputTypeSelector}
      />

      <div className="flex justify-center gap-4">
        <Button onClick={onEncode}>Encode</Button>
        <Button onClick={onDecode}>Decode</Button>
      </div>
    </div>
  )
}
