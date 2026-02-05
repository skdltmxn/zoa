export type TimestampUnit = 'seconds' | 'milliseconds' | 'nanoseconds'

export interface TimeFormat {
  name: string
  displayName: string
  description: string
  format: (date: Date, timezone: string) => string
}

export const TIMESTAMP_UNITS: { name: TimestampUnit; displayName: string }[] = [
  { name: 'seconds', displayName: 'Seconds' },
  { name: 'milliseconds', displayName: 'Milliseconds' },
  { name: 'nanoseconds', displayName: 'Nanoseconds' },
]

function formatWithTimezone(date: Date, timezone: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezone }).format(date)
}

function getTimezoneOffset(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  })
  const parts = formatter.formatToParts(date)
  const offsetPart = parts.find((p) => p.type === 'timeZoneName')
  if (!offsetPart) return '+00:00'
  const match = offsetPart.value.match(/GMT([+-]\d{1,2}(?::\d{2})?)/)
  if (!match) return '+00:00'
  let offset = match[1]
  if (!offset.includes(':')) {
    offset = offset.length === 2 ? `${offset}:00` : `${offset.slice(0, -2)}:${offset.slice(-2)}`
  }
  if (offset.match(/^[+-]\d:/)) {
    offset = offset.replace(/^([+-])(\d):/, '$10$2:')
  }
  return offset
}

function toISOWithTimezone(date: Date, timezone: string): string {
  const parts = {
    year: formatWithTimezone(date, timezone, { year: 'numeric' }),
    month: formatWithTimezone(date, timezone, { month: '2-digit' }),
    day: formatWithTimezone(date, timezone, { day: '2-digit' }),
    hour: formatWithTimezone(date, timezone, { hour: '2-digit', hour12: false }),
    minute: formatWithTimezone(date, timezone, { minute: '2-digit' }),
    second: formatWithTimezone(date, timezone, { second: '2-digit' }),
  }
  const offset = getTimezoneOffset(date, timezone)
  const hour = parts.hour === '24' ? '00' : parts.hour.padStart(2, '0')
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute.padStart(2, '0')}:${parts.second.padStart(2, '0')}${offset}`
}

function toRFC2822(date: Date, timezone: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const dayName = formatWithTimezone(date, timezone, { weekday: 'short' })
  const day = formatWithTimezone(date, timezone, { day: '2-digit' })
  const monthIdx = parseInt(formatWithTimezone(date, timezone, { month: 'numeric' }), 10) - 1
  const year = formatWithTimezone(date, timezone, { year: 'numeric' })
  const hour = formatWithTimezone(date, timezone, { hour: '2-digit', hour12: false })
  const minute = formatWithTimezone(date, timezone, { minute: '2-digit' })
  const second = formatWithTimezone(date, timezone, { second: '2-digit' })

  const offset = getTimezoneOffset(date, timezone).replace(':', '')
  const dayOfWeek = days.find((d) => dayName.startsWith(d)) || dayName.slice(0, 3)
  const hourStr = hour === '24' ? '00' : hour.padStart(2, '0')

  return `${dayOfWeek}, ${day} ${months[monthIdx]} ${year} ${hourStr}:${minute.padStart(2, '0')}:${second.padStart(2, '0')} ${offset}`
}

export const TIME_FORMATS: TimeFormat[] = [
  {
    name: 'iso8601',
    displayName: 'ISO 8601',
    description: 'International standard format',
    format: (date, timezone) => toISOWithTimezone(date, timezone),
  },
  {
    name: 'iso8601utc',
    displayName: 'ISO 8601 (UTC)',
    description: 'ISO 8601 in UTC timezone',
    format: (date) => date.toISOString(),
  },
  {
    name: 'rfc2822',
    displayName: 'RFC 2822',
    description: 'Email date format',
    format: (date, timezone) => toRFC2822(date, timezone),
  },
  {
    name: 'rfc3339',
    displayName: 'RFC 3339',
    description: 'Internet date/time format',
    format: (date, timezone) => toISOWithTimezone(date, timezone),
  },
  {
    name: 'locale',
    displayName: 'Locale String',
    description: 'Localized date and time',
    format: (date, timezone) =>
      date.toLocaleString('en-US', {
        timeZone: timezone,
        dateStyle: 'full',
        timeStyle: 'long',
      }),
  },
  {
    name: 'relative',
    displayName: 'Relative',
    description: 'Relative time from now',
    format: (date) => {
      const now = Date.now()
      const diff = date.getTime() - now
      const absDiff = Math.abs(diff)
      const isPast = diff < 0

      const seconds = Math.floor(absDiff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const months = Math.floor(days / 30)
      const years = Math.floor(days / 365)

      let value: number
      let unit: string

      if (years > 0) {
        value = years
        unit = years === 1 ? 'year' : 'years'
      } else if (months > 0) {
        value = months
        unit = months === 1 ? 'month' : 'months'
      } else if (days > 0) {
        value = days
        unit = days === 1 ? 'day' : 'days'
      } else if (hours > 0) {
        value = hours
        unit = hours === 1 ? 'hour' : 'hours'
      } else if (minutes > 0) {
        value = minutes
        unit = minutes === 1 ? 'minute' : 'minutes'
      } else {
        value = seconds
        unit = seconds === 1 ? 'second' : 'seconds'
      }

      return isPast ? `${value} ${unit} ago` : `in ${value} ${unit}`
    },
  },
]

export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland',
]

export interface ParseResult {
  success: boolean
  date?: Date
  error?: string
}

export function parseTimestamp(input: string, unit: TimestampUnit): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { success: false, error: 'Input is empty' }
  }

  const num = BigInt(trimmed)
  let ms: bigint

  switch (unit) {
    case 'seconds':
      ms = num * BigInt(1000)
      break
    case 'milliseconds':
      ms = num
      break
    case 'nanoseconds':
      ms = num / BigInt(1000000)
      break
  }

  const msNumber = Number(ms)
  if (msNumber < -8640000000000000 || msNumber > 8640000000000000) {
    return { success: false, error: 'Timestamp out of valid range' }
  }

  return { success: true, date: new Date(msNumber) }
}

export function parseDateString(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { success: false, error: 'Input is empty' }
  }

  const date = new Date(trimmed)
  if (isNaN(date.getTime())) {
    return { success: false, error: 'Invalid date format' }
  }

  return { success: true, date }
}

export function dateToTimestamp(date: Date, unit: TimestampUnit): string {
  const ms = BigInt(date.getTime())

  switch (unit) {
    case 'seconds':
      return (ms / BigInt(1000)).toString()
    case 'milliseconds':
      return ms.toString()
    case 'nanoseconds':
      return (ms * BigInt(1000000)).toString()
  }
}

export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
