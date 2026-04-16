import 'dotenv/config'
import { z } from 'zod'

const localDevHosts = new Set(['localhost', '127.0.0.1'])

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`)
}

export const env = parsedEnv.data

export function isAllowedWebOrigin(origin: string | undefined | null) {
  if (!origin) {
    return false
  }

  if (origin === env.WEB_ORIGIN) {
    return true
  }

  try {
    const url = new URL(origin)

    return url.protocol === 'http:' && localDevHosts.has(url.hostname)
  } catch {
    return false
  }
}

export function getTrustedOrigins(origin?: string | null) {
  const trustedOrigins = new Set([env.WEB_ORIGIN])

  if (isAllowedWebOrigin(origin)) {
    trustedOrigins.add(origin!)
  }

  return Array.from(trustedOrigins)
}
