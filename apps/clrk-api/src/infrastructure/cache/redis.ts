import { createClient } from 'redis'
import { env } from '../../lib/env.js'

export type StringCache = {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttlSeconds: number): Promise<void>
}

type RedisClient = ReturnType<typeof createClient>

let redisClientPromise: Promise<RedisClient> | null = null

async function getRedisClient() {
  if (!env.REDIS_URL) {
    return null
  }

  if (!redisClientPromise) {
    const client = createClient({
      url: env.REDIS_URL,
    })

    client.on('error', (error) => {
      console.error('Redis Client Error', error)
    })

    redisClientPromise = client.connect().then(() => client).catch((error) => {
      redisClientPromise = null
      throw error
    })
  }

  return redisClientPromise
}

export async function getRedisStringCache(): Promise<StringCache | null> {
  const client = await getRedisClient().catch(() => null)

  if (!client) {
    return null
  }

  return {
    get: (key) => client.get(key),
    set: async (key, value, ttlSeconds) => {
      await client.set(key, value, { EX: ttlSeconds })
    },
  }
}
