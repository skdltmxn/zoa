'use client'

import { useState, useCallback } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/shared/copy-button'
import { TRANSFORMS, transformString, type StringTransform } from '@/lib/string'

export default function StringsPage(): React.ReactElement {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const handleTransform = useCallback(
    (transform: StringTransform): void => {
      if (!input) {
        setOutput('')
        return
      }
      const result = transformString(input, transform)
      setOutput(result)
    },
    [input]
  )

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          String Transformer
        </h1>
        <p className="text-text-secondary">
          Transform strings with various operations
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  Input
                </label>
                {input && <CopyButton text={input} />}
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to transform..."
                monospace
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {TRANSFORMS.map((t) => (
                <Button
                  key={t.name}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTransform(t.name)}
                  title={t.description}
                >
                  {t.displayName}
                </Button>
              ))}
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
                rows={6}
              />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
