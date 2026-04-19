import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchLatestExchangeRate } from './frankfurter.js'

test('fetchLatestExchangeRate uses Frankfurter v2 rates endpoint with quotes param', async () => {
  const cacheWrites: Array<{ key: string; value: string; ttlSeconds: number }> = []

  const rate = await fetchLatestExchangeRate('USD', 'TRY', {
    cache: {
      get: async () => null,
      set: async (key, value, ttlSeconds) => {
        cacheWrites.push({ key, value, ttlSeconds })
      },
    },
    fetchFn: async (input: string | URL | Request) => {
      assert.equal(
        String(input),
        'https://api.frankfurter.dev/v2/rates?base=USD&quotes=TRY',
      )

      return new Response(
        JSON.stringify([
          {
            date: '2026-04-18',
            base: 'USD',
            quote: 'TRY',
            rate: 38.72,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    },
  })

  assert.deepEqual(rate, {
    date: '2026-04-18',
    base: 'USD',
    quote: 'TRY',
    rate: 38.72,
  })

  assert.deepEqual(cacheWrites, [
    {
      key: 'fx:latest:USD:TRY',
      value: JSON.stringify({
        date: '2026-04-18',
        base: 'USD',
        quote: 'TRY',
        rate: 38.72,
      }),
      ttlSeconds: 3600,
    },
  ])
})

test('fetchLatestExchangeRate returns cached rate without refetching', async () => {
  let fetchCalls = 0

  const rate = await fetchLatestExchangeRate('USD', 'TRY', {
    cache: {
      get: async () =>
        JSON.stringify({
          date: '2026-04-18',
          base: 'USD',
          quote: 'TRY',
          rate: 38.72,
        }),
      set: async () => {
        throw new Error('cache set should not run on cache hit')
      },
    },
    fetchFn: async () => {
      fetchCalls += 1
      throw new Error('fetch should not run on cache hit')
    },
  })

  assert.equal(fetchCalls, 0)
  assert.deepEqual(rate, {
    date: '2026-04-18',
    base: 'USD',
    quote: 'TRY',
    rate: 38.72,
  })
})
