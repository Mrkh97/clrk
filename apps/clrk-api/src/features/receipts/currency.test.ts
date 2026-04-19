import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_RECEIPT_CURRENCY, getCurrencyAdornment, resolveReceiptCurrency } from './currency.js'

test('resolveReceiptCurrency maps common OCR symbols and aliases', () => {
  assert.equal(resolveReceiptCurrency('₺'), 'TRY')
  assert.equal(resolveReceiptCurrency('TL'), 'TRY')
  assert.equal(resolveReceiptCurrency('$'), 'USD')
  assert.equal(resolveReceiptCurrency('Euro'), 'EUR')
  assert.equal(resolveReceiptCurrency('pound sterling'), 'GBP')
})

test('resolveReceiptCurrency falls back to TRY for missing or invalid values', () => {
  assert.equal(resolveReceiptCurrency(null), DEFAULT_RECEIPT_CURRENCY)
  assert.equal(resolveReceiptCurrency(''), DEFAULT_RECEIPT_CURRENCY)
  assert.equal(resolveReceiptCurrency('unknown money token'), DEFAULT_RECEIPT_CURRENCY)
})

test('getCurrencyAdornment returns a compact symbol when available', () => {
  assert.equal(getCurrencyAdornment('TRY'), '₺')
  assert.equal(getCurrencyAdornment('USD'), '$')
  assert.equal(getCurrencyAdornment('CAD'), 'CAD')
})
