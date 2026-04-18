import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateDateRangeMetrics, calculateSavingsMetrics } from './optimizer-tools.js'

test('calculateSavingsMetrics returns exact savings amount and percent', () => {
  assert.deepEqual(calculateSavingsMetrics(200, 150), {
    saving: 50,
    savingRate: 25,
  })
})

test('calculateDateRangeMetrics returns inclusive days and normalized averages', () => {
  assert.deepEqual(calculateDateRangeMetrics('2026-01-01', '2026-01-30', 300), {
    inclusiveDays: 30,
    averageDailySpend: 10,
    averageMonthlySpend: 300,
  })
})
