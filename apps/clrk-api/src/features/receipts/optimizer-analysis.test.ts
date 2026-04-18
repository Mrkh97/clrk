import assert from 'node:assert/strict'
import test from 'node:test'
import { createOptimizerAnalysis } from './optimizer-analysis.js'
import { generateSeedReceipts } from './seed-data.js'

test('createOptimizerAnalysis returns savings-oriented suggestions for easy level', () => {
  const receipts = generateSeedReceipts().map((receipt) => ({
    id: receipt.id,
    merchant: receipt.merchant,
    amount: receipt.amount,
    category: receipt.category,
    paymentMethod: receipt.paymentMethod,
    date: new Date(`${receipt.date}T00:00:00.000Z`),
  }))

  const analysis = createOptimizerAnalysis(receipts, 'easy')

  assert.equal(analysis.currency, 'TRY')
  assert.equal(analysis.level, 'easy')
  assert.ok(analysis.totalCurrentSpend > 0)
  assert.ok(analysis.totalSavings > 0)
  assert.ok(analysis.suggestions.length > 0)
  assert.ok(analysis.suggestions.some((suggestion) => suggestion.category === 'entertainment'))
  assert.ok(analysis.suggestions.every((suggestion) => suggestion.suggestedSpend <= suggestion.currentSpend))
})

test('hard level produces at least as much savings as easy level for the same receipts', () => {
  const receipts = generateSeedReceipts().map((receipt) => ({
    id: receipt.id,
    merchant: receipt.merchant,
    amount: receipt.amount,
    category: receipt.category,
    paymentMethod: receipt.paymentMethod,
    date: new Date(`${receipt.date}T00:00:00.000Z`),
  }))

  const easyAnalysis = createOptimizerAnalysis(receipts, 'easy')
  const hardAnalysis = createOptimizerAnalysis(receipts, 'hard')

  assert.equal(hardAnalysis.currency, 'TRY')
  assert.ok(hardAnalysis.totalSavings >= easyAnalysis.totalSavings)
  assert.ok(hardAnalysis.suggestions.length > 0)
  assert.ok(hardAnalysis.suggestions.some((suggestion) => /subscription|streaming|shopping|food/i.test(suggestion.reason)))
})
