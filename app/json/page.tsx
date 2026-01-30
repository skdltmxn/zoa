'use client'

import { useState, useCallback } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/shared/copy-button'
import { OPERATIONS, processData, type Operation } from '@/lib/json'

export default function JsonPage(): React.ReactElement {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

  const handleSwap = useCallback((): void => {
    setInput(output)
    setOutput(input)
    setError('')
  }, [input, output])

  const handleProcess = useCallback(
    (operation: Operation): void => {
      setError('')
      if (!input) {
        setOutput('')
        return
      }
      const result = processData(input, operation, indent)
      if (result.success) {
        setOutput(result.output)
      } else {
        setError(result.error || 'Unknown error')
        setOutput('')
      }
    },
    [input, indent]
  )

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          JSON / YAML Formatter
        </h1>
        <p className="text-text-secondary">
          Format, minify, or convert between JSON and YAML
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  Input (JSON or YAML)
                </label>
                {input && <CopyButton text={input} />}
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={'{"key": "value"}\nor\nkey: value'}
                monospace
                rows={10}
              />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {OPERATIONS.map((op) => (
                  <Button
                    key={op.name}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleProcess(op.name)}
                    title={op.description}
                  >
                    {op.displayName}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-text-secondary">Indent:</label>
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="bg-bg-tertiary border border-border-default rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-border-focus"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={1}>1 space</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="text-sm text-accent-error bg-accent-error/10 border border-accent-error/20 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwap}
                disabled={!output}
                className="gap-2"
                aria-label="Swap input and output"
              >
                <ArrowUpDown className="h-4 w-4" />
                Swap
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  Output
                </label>
                {output && <CopyButton text={output} />}
              </div>
              <Textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                monospace
                rows={10}
              />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
