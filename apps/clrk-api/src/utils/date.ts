import { format, isValid, parse } from 'date-fns'

function parseDateParts(value: string) {
  const parsed = parse(value, 'yyyy-MM-dd', new Date())

  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== value) {
    throw new RangeError(`Invalid date-only value: ${value}`)
  }

  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth(),
    day: parsed.getDate(),
  }
}

export function parseUtcDateOnly(value: string) {
  const { year, month, day } = parseDateParts(value)
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}

export function toUtcDayStart(value: string) {
  return parseUtcDateOnly(value)
}

export function toUtcDayEnd(value: string) {
  const { year, month, day } = parseDateParts(value)
  return new Date(Date.UTC(year, month, day, 23, 59, 59, 999))
}

export function formatUtcDate(value: Date) {
  return format(new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()), 'yyyy-MM-dd')
}

export function isValidDateOnlyInput(value: string) {
  try {
    parseDateParts(value)
    return true
  } catch {
    return false
  }
}
