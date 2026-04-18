export const DEFAULT_RECEIPT_CURRENCY = 'TRY'
export const ANALYTICS_CURRENCY = 'TRY'

const directCurrencyMap: Record<string, string> = {
  '₺': 'TRY',
  TL: 'TRY',
  TRY: 'TRY',
  TRYL: 'TRY',
  USD: 'USD',
  '$': 'USD',
  'US$': 'USD',
  EUR: 'EUR',
  '€': 'EUR',
  GBP: 'GBP',
  '£': 'GBP',
  JPY: 'JPY',
  '¥': 'JPY',
}

export function resolveReceiptCurrency(
  value: string | null | undefined,
  fallback = DEFAULT_RECEIPT_CURRENCY,
) {
  if (!value) {
    return fallback
  }

  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return fallback
  }

  const upper = trimmed.toUpperCase()
  const directMatch = directCurrencyMap[upper]

  if (directMatch) {
    return directMatch
  }

  if (/TURKISH\s+LIRA|TURKISH\s+LIRASI|\bLIRA\b|\bTURKISH\b/.test(upper)) {
    return 'TRY'
  }

  if (/US\s+DOLLAR|AMERICAN\s+DOLLAR|\bDOLLAR\b/.test(upper)) {
    return 'USD'
  }

  if (/\bEURO\b/.test(upper)) {
    return 'EUR'
  }

  if (/POUND\s+STERLING|\bSTERLING\b|\bPOUND\b/.test(upper)) {
    return 'GBP'
  }

  const alphaCode = upper.replace(/[^A-Z]/g, '')

  if (/^[A-Z]{3}$/.test(alphaCode)) {
    return alphaCode
  }

  return fallback
}

export function getCurrencyAdornment(currency: string) {
  switch (resolveReceiptCurrency(currency)) {
    case 'TRY':
      return '₺'
    case 'USD':
      return '$'
    case 'EUR':
      return '€'
    case 'GBP':
      return '£'
    default:
      return resolveReceiptCurrency(currency)
  }
}
