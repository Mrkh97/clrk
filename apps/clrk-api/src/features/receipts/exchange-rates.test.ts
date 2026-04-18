import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeMoneyRecordsToCurrency } from './exchange-rates.js'

test('normalizeMoneyRecordsToCurrency converts mixed amounts into the target currency', async () => {
  const records = await normalizeMoneyRecordsToCurrency(
    [
      { amount: 100, currency: 'USD', id: 'usd' },
      { amount: 50, currency: 'TRY', id: 'try' },
    ],
    'TRY',
    async (base, quote) => {
      assert.equal(quote, 'TRY')
      return { rate: base === 'USD' ? 38.5 : 1 }
    },
  )

  assert.deepEqual(records, [
    { amount: 3850, currency: 'TRY', id: 'usd' },
    { amount: 50, currency: 'TRY', id: 'try' },
  ])
})
