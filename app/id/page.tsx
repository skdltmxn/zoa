'use client'

import { useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CopyButton } from '@/components/shared/copy-button'
import { ID_FORMATS, ID_FORMAT_ORDER, generateIds } from '@/lib/id'
import type { IdFormat } from '@/types'

export default function IdGeneratorPage(): React.ReactElement {
  const [format, setFormat] = useState<IdFormat>('uuidv4')
  const [count, setCount] = useState(1)
  const [ids, setIds] = useState<string[]>([])

  const handleGenerate = useCallback((): void => {
    const generated = generateIds(format, count)
    setIds(generated)
  }, [format, count])

  const handleFormatChange = (value: string): void => {
    setFormat(value as IdFormat)
    setIds([])
  }

  const handleCountChange = (value: string): void => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setCount(num)
    }
  }

  const output = ids.join('\n')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          ID Generator
        </h1>
        <p className="text-text-secondary">
          Generate random unique identifiers in various formats
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <Tabs defaultValue="uuidv4" onChange={handleFormatChange}>
            <TabsList>
              {ID_FORMAT_ORDER.map((fmt) => (
                <TabsTrigger key={fmt} value={fmt}>
                  {ID_FORMATS[fmt].displayName}
                </TabsTrigger>
              ))}
            </TabsList>

            {ID_FORMAT_ORDER.map((fmt) => (
              <TabsContent key={fmt} value={fmt}>
                <p className="text-text-secondary text-sm mb-4">
                  {ID_FORMATS[fmt].description}
                </p>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex items-center gap-4 mt-4">
            <label className="text-sm text-text-secondary">Count:</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
              className="w-20 px-3 py-2 bg-bg-secondary border border-border-default rounded-lg text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none"
            />
            <span className="text-text-muted text-sm">(max 100)</span>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={handleGenerate} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </Card>

        {ids.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Generated IDs ({ids.length})
              </h2>
              <CopyButton text={output} />
            </div>
            <Textarea
              value={output}
              readOnly
              monospace
              rows={Math.min(ids.length + 1, 12)}
              className="resize-none"
            />
          </Card>
        )}
      </div>
    </PageContainer>
  )
}
