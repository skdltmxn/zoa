'use client'

import { useState, useCallback, useMemo } from 'react'
import { RefreshCw, Shuffle } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CopyButton } from '@/components/shared/copy-button'
import {
    generateRandomBytes,
    generateRandomString,
    generateRandomNumbers,
    shuffleLines,
    type HexSeparator,
    type CharsetOptions,
} from '@/lib/random'

export default function RandomPage(): React.ReactElement {
    return (
        <PageContainer>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    Random Generator
                </h1>
                <p className="text-text-secondary">
                    Generate random bytes, strings, numbers, or shuffle lists
                </p>
            </div>

            <Card>
                <Tabs defaultValue="bytes">
                    <TabsList>
                        <TabsTrigger value="bytes">Bytes</TabsTrigger>
                        <TabsTrigger value="string">String</TabsTrigger>
                        <TabsTrigger value="number">Number</TabsTrigger>
                        <TabsTrigger value="shuffle">Shuffle</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bytes">
                        <BytesTab />
                    </TabsContent>

                    <TabsContent value="string">
                        <StringTab />
                    </TabsContent>

                    <TabsContent value="number">
                        <NumberTab />
                    </TabsContent>

                    <TabsContent value="shuffle">
                        <ShuffleTab />
                    </TabsContent>
                </Tabs>
            </Card>
        </PageContainer>
    )
}

function BytesTab(): React.ReactElement {
    const [length, setLength] = useState(16)
    const [separator, setSeparator] = useState<HexSeparator>('none')
    const [bytes, setBytes] = useState<Uint8Array | null>(null)

    const handleGenerate = useCallback((): void => {
        const newBytes = new Uint8Array(length)
        crypto.getRandomValues(newBytes)
        setBytes(newBytes)
    }, [length])

    const hex = useMemo((): string => {
        if (!bytes) return ''
        const hexArray = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'))
        switch (separator) {
            case 'space': return hexArray.join(' ')
            case 'colon': return hexArray.join(':')
            default: return hexArray.join('')
        }
    }, [bytes, separator])

    const base64 = useMemo((): string => {
        if (!bytes) return ''
        const binary = String.fromCharCode(...bytes)
        return btoa(binary)
    }, [bytes])

    const handleLengthChange = (value: string): void => {
        const num = parseInt(value, 10)
        if (!isNaN(num) && num >= 1 && num <= 1024) {
            setLength(num)
        }
    }

    return (
        <div className="space-y-6">
            <p className="text-text-secondary text-sm">
                Generate cryptographically secure random bytes
            </p>

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Length:</label>
                    <input
                        type="number"
                        min={1}
                        max={1024}
                        value={length}
                        onChange={(e) => handleLengthChange(e.target.value)}
                        className="w-24 px-3 py-2 bg-bg-secondary border border-border-default rounded-lg text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none"
                    />
                    <span className="text-text-muted text-sm">bytes</span>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Hex separator:</label>
                    <div className="flex rounded-md bg-bg-tertiary p-1">
                        {(['none', 'space', 'colon'] as const).map((sep) => (
                            <button
                                key={sep}
                                type="button"
                                onClick={() => setSeparator(sep)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${separator === sep
                                    ? 'bg-bg-secondary text-text-primary'
                                    : 'text-text-muted hover:text-text-secondary'
                                    }`}
                            >
                                {sep === 'none' ? 'None' : sep === 'space' ? 'Space' : 'Colon'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={handleGenerate} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Generate
                </Button>
            </div>

            {bytes && (
                <div className="space-y-4">
                    <OutputField label="Hex" value={hex} />
                    <OutputField label="Base64" value={base64} />
                </div>
            )}
        </div>
    )
}

function StringTab(): React.ReactElement {
    const [length, setLength] = useState(16)
    const [charset, setCharset] = useState<CharsetOptions>({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
    })
    const [output, setOutput] = useState('')

    const handleGenerate = useCallback((): void => {
        const result = generateRandomString({ length, charset })
        setOutput(result)
    }, [length, charset])

    const handleLengthChange = (value: string): void => {
        const num = parseInt(value, 10)
        if (!isNaN(num) && num >= 1 && num <= 256) {
            setLength(num)
        }
    }

    const toggleCharset = (key: keyof CharsetOptions): void => {
        setCharset((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const hasAnyCharset = Object.values(charset).some(Boolean)

    return (
        <div className="space-y-6">
            <p className="text-text-secondary text-sm">
                Generate random string with custom character set
            </p>

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Length:</label>
                    <input
                        type="number"
                        min={1}
                        max={256}
                        value={length}
                        onChange={(e) => handleLengthChange(e.target.value)}
                        className="w-24 px-3 py-2 bg-bg-secondary border border-border-default rounded-lg text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Characters:</label>
                    <div className="flex flex-wrap gap-2">
                        {([
                            { key: 'uppercase', label: 'A-Z' },
                            { key: 'lowercase', label: 'a-z' },
                            { key: 'numbers', label: '0-9' },
                            { key: 'symbols', label: '!@#$' },
                        ] as const).map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => toggleCharset(key)}
                                className={`px-3 py-1 text-sm rounded border transition-colors ${charset[key]
                                    ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                                    : 'bg-bg-secondary border-border-default text-text-muted hover:text-text-secondary'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={handleGenerate} disabled={!hasAnyCharset} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Generate
                </Button>
            </div>

            {output && <OutputField label="Result" value={output} />}
        </div>
    )
}

function NumberTab(): React.ReactElement {
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(100)
    const [count, setCount] = useState(1)
    const [output, setOutput] = useState<number[]>([])

    const handleGenerate = useCallback((): void => {
        const result = generateRandomNumbers({ min, max, count })
        setOutput(result)
    }, [min, max, count])

    const handleMinChange = (value: string): void => {
        const num = parseInt(value, 10)
        if (!isNaN(num)) {
            setMin(num)
        }
    }

    const handleMaxChange = (value: string): void => {
        const num = parseInt(value, 10)
        if (!isNaN(num)) {
            setMax(num)
        }
    }

    const handleCountChange = (value: string): void => {
        const num = parseInt(value, 10)
        if (!isNaN(num) && num >= 1 && num <= 100) {
            setCount(num)
        }
    }

    const isValid = min <= max

    return (
        <div className="space-y-6">
            <p className="text-text-secondary text-sm">
                Generate random integers within a range
            </p>

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Min:</label>
                    <input
                        type="number"
                        value={min}
                        onChange={(e) => handleMinChange(e.target.value)}
                        className="w-28 px-3 py-2 bg-bg-secondary border border-border-default rounded-lg text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Max:</label>
                    <input
                        type="number"
                        value={max}
                        onChange={(e) => handleMaxChange(e.target.value)}
                        className="w-28 px-3 py-2 bg-bg-secondary border border-border-default rounded-lg text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary">Count:</label>
                    <input
                        type="number"
                        min={1}
                        max={100}
                        value={count}
                        onChange={(e) => handleCountChange(e.target.value)}
                        className="w-20 px-3 py-2 bg-bg-secondary border border-border-default rounded-lg text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none"
                    />
                </div>
            </div>

            {!isValid && (
                <p className="text-accent-error text-sm">Min must be less than or equal to Max</p>
            )}

            <div className="flex justify-center">
                <Button onClick={handleGenerate} disabled={!isValid} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Generate
                </Button>
            </div>

            {output.length > 0 && (
                <OutputField label="Result" value={output.join(', ')} />
            )}
        </div>
    )
}

function ShuffleTab(): React.ReactElement {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')

    const handleShuffle = useCallback((): void => {
        const result = shuffleLines(input)
        setOutput(result)
    }, [input])

    const hasInput = input.trim().length > 0

    return (
        <div className="space-y-6">
            <p className="text-text-secondary text-sm">
                Shuffle lines randomly (one item per line)
            </p>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">Input</label>
                    {input && <CopyButton text={input} />}
                </div>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter items, one per line..."
                    rows={6}
                />
            </div>

            <div className="flex justify-center">
                <Button onClick={handleShuffle} disabled={!hasInput} className="gap-2">
                    <Shuffle className="h-4 w-4" />
                    Shuffle
                </Button>
            </div>

            {output && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-text-secondary">Result</label>
                        <CopyButton text={output} />
                    </div>
                    <Textarea
                        value={output}
                        readOnly
                        rows={6}
                    />
                </div>
            )}
        </div>
    )
}

interface OutputFieldProps {
    label: string
    value: string
}

function OutputField({ label, value }: OutputFieldProps): React.ReactElement {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">{label}</label>
                <CopyButton text={value} />
            </div>
            <Textarea value={value} readOnly monospace rows={6} />
        </div>
    )
}
