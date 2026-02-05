'use client'

import { useState, useCallback, useMemo } from 'react'
import { Clock, RefreshCw } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CopyButton } from '@/components/shared/copy-button'
import {
  TIME_FORMATS,
  COMMON_TIMEZONES,
  TIMESTAMP_UNITS,
  parseTimestamp,
  parseDateString,
  dateToTimestamp,
  getCurrentTimezone,
  type TimestampUnit,
} from '@/lib/time'

export default function TimePage(): React.ReactElement {
  const [timestampInput, setTimestampInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnit>('milliseconds')
  const [timezone, setTimezone] = useState(() => {
    if (typeof window === 'undefined') return 'UTC'
    return getCurrentTimezone()
  })
  const [error, setError] = useState('')

  const handleNow = useCallback((): void => {
    const now = new Date()
    setTimestampInput(dateToTimestamp(now, timestampUnit))
    setDateInput(now.toISOString())
    setError('')
  }, [timestampUnit])

  const parsedFromTimestamp = useMemo(() => {
    if (!timestampInput.trim()) return null
    try {
      return parseTimestamp(timestampInput, timestampUnit)
    } catch {
      return { success: false, error: 'Invalid timestamp' }
    }
  }, [timestampInput, timestampUnit])

  const parsedFromDate = useMemo(() => {
    if (!dateInput.trim()) return null
    return parseDateString(dateInput)
  }, [dateInput])

  const handleTimestampChange = useCallback(
    (value: string): void => {
      setTimestampInput(value)
      setError('')
      if (!value.trim()) {
        setDateInput('')
        return
      }
      try {
        const result = parseTimestamp(value, timestampUnit)
        if (result.success && result.date) {
          setDateInput(result.date.toISOString())
        } else {
          setError(result.error || 'Invalid timestamp')
        }
      } catch {
        setError('Invalid timestamp format')
      }
    },
    [timestampUnit]
  )

  const handleDateChange = useCallback(
    (value: string): void => {
      setDateInput(value)
      setError('')
      if (!value.trim()) {
        setTimestampInput('')
        return
      }
      const result = parseDateString(value)
      if (result.success && result.date) {
        setTimestampInput(dateToTimestamp(result.date, timestampUnit))
      } else {
        setError(result.error || 'Invalid date')
      }
    },
    [timestampUnit]
  )

  const handleUnitChange = useCallback(
    (unit: TimestampUnit): void => {
      setTimestampUnit(unit)
      if (dateInput.trim()) {
        const result = parseDateString(dateInput)
        if (result.success && result.date) {
          setTimestampInput(dateToTimestamp(result.date, unit))
        }
      }
    },
    [dateInput]
  )

  const currentDate = parsedFromTimestamp?.success
    ? parsedFromTimestamp.date
    : parsedFromDate?.success
      ? parsedFromDate.date
      : null

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Time Converter</h1>
        <p className="text-text-secondary">
          Convert between Unix timestamps and human-readable dates with timezone support
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary">Timestamp Unit:</label>
                <Tabs
                  defaultValue="milliseconds"
                  value={timestampUnit}
                  onChange={(v) => handleUnitChange(v as TimestampUnit)}
                >
                  <TabsList>
                    {TIMESTAMP_UNITS.map((unit) => (
                      <TabsTrigger key={unit.name} value={unit.name}>
                        {unit.displayName}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <Button variant="secondary" size="sm" onClick={handleNow} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Now
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-secondary">
                    Unix Timestamp ({timestampUnit})
                  </label>
                  {timestampInput && <CopyButton text={timestampInput} />}
                </div>
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => handleTimestampChange(e.target.value)}
                  placeholder="e.g., 1704067200000"
                  className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary font-mono focus:outline-none focus:border-border-focus"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-secondary">
                    Date String (ISO 8601, RFC 2822, etc.)
                  </label>
                  {dateInput && <CopyButton text={dateInput} />}
                </div>
                <input
                  type="text"
                  value={dateInput}
                  onChange={(e) => handleDateChange(e.target.value)}
                  placeholder="e.g., 2024-01-15T12:30:00Z"
                  className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary font-mono focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-accent-error bg-accent-error/10 border border-accent-error/20 rounded px-3 py-2">
                {error}
              </div>
            )}
          </div>
        </Card>

        {currentDate && (
          <>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent-primary" />
                    Formatted Output
                  </h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-text-secondary">Timezone:</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="bg-bg-tertiary border border-border-default rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-border-focus"
                    >
                      {COMMON_TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {TIME_FORMATS.map((format) => {
                    const formatted = format.format(currentDate, timezone)
                    return (
                      <div
                        key={format.name}
                        className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text-primary">
                              {format.displayName}
                            </span>
                            <span className="text-xs text-text-secondary">{format.description}</span>
                          </div>
                          <div className="font-mono text-text-secondary mt-1 truncate">
                            {formatted}
                          </div>
                        </div>
                        <CopyButton text={formatted} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">All Timestamps</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {TIMESTAMP_UNITS.map((unit) => {
                    const value = dateToTimestamp(currentDate, unit.name)
                    return (
                      <div key={unit.name} className="p-3 bg-bg-tertiary rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-text-primary">
                            {unit.displayName}
                          </span>
                          <CopyButton text={value} />
                        </div>
                        <div className="font-mono text-text-secondary text-sm break-all">
                          {value}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  )
}
