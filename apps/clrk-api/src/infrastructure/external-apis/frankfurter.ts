import { z } from 'zod'
import { getRedisStringCache, type StringCache } from '../cache/redis.js'

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v2'
const EXCHANGE_RATE_CACHE_TTL_SECONDS = 60 * 60

const frankfurterRateSchema = z.object({
  date: z.string().min(1),
  base: z.string().min(1),
  quote: z.string().min(1),
  rate: z.number().positive(),
})

const frankfurterRatesSchema = z.array(frankfurterRateSchema)

export type FrankfurterRate = z.infer<typeof frankfurterRateSchema>

type FrankfurterDependencies = {
  cache?: StringCache | null
  fetchFn?: typeof fetch
}

function getExchangeRateCacheKey(base: string, quote: string) {
  return `fx:latest:${base}:${quote}`
}

async function parseFrankfurterError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string }
    return payload.message ?? payload.error ?? `Frankfurter request failed with ${response.status}.`
  } catch {
    return `Frankfurter request failed with ${response.status}.`
  }
}

export async function fetchLatestExchangeRate(
  base: string,
  quote: string,
  dependencies: FrankfurterDependencies = {},
): Promise<FrankfurterRate> {
  if (base === quote) {
    return {
      date: new Date().toISOString().slice(0, 10),
      base,
      quote,
      rate: 1,
    }
  }

  const cache = dependencies.cache === undefined ? await getRedisStringCache() : dependencies.cache
  const cacheKey = getExchangeRateCacheKey(base, quote)

  if (cache) {
    const cachedRate = await cache.get(cacheKey)

    if (cachedRate) {
      try {
        return frankfurterRateSchema.parse(JSON.parse(cachedRate))
      } catch {
        // Ignore malformed cache entries and fall back to live fetch.
      }
    }
  }

  const searchParams = new URLSearchParams({
    base,
    quotes: quote,
  })

  const response = await (dependencies.fetchFn ?? fetch)(
    `${FRANKFURTER_BASE_URL}/rates?${searchParams.toString()}`,
  )

  if (!response.ok) {
    throw new Error(await parseFrankfurterError(response))
  }

  const payload = frankfurterRatesSchema.parse(await response.json())
  const rate = payload[0]

  if (!rate) {
    throw new Error(`Frankfurter did not return a rate for ${base}/${quote}.`)
  }

  if (cache) {
    await cache.set(cacheKey, JSON.stringify(rate), EXCHANGE_RATE_CACHE_TTL_SECONDS)
  }

  return rate
}
