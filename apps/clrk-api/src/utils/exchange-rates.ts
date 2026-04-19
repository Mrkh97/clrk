import { fetchLatestExchangeRate } from '../infrastructure/external-apis/frankfurter.js'

type RateLookup = (base: string, quote: string) => Promise<{ rate: number }>

type MoneyRecord = {
  amount: number
  currency: string
}

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

export async function normalizeMoneyRecordsToCurrency<T extends MoneyRecord>(
  records: T[],
  targetCurrency: string,
  lookupRate: RateLookup = fetchLatestExchangeRate,
): Promise<T[]> {
  const rates = new Map<string, number>()
  const uniqueCurrencies = Array.from(new Set(records.map((record) => record.currency)))

  await Promise.all(
    uniqueCurrencies.map(async (currency) => {
      if (currency === targetCurrency) {
        rates.set(currency, 1)
        return
      }

      const quote = await lookupRate(currency, targetCurrency)
      rates.set(currency, quote.rate)
    }),
  )

  return records.map((record) => ({
    ...record,
    amount: roundMoney(record.amount * (rates.get(record.currency) ?? 1)),
    currency: targetCurrency,
  }))
}
