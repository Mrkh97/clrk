import 'dotenv/config'
import { z } from 'zod'

const localDevHosts = new Set(['localhost', '127.0.0.1'])
const optionalEnvString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().min(1).optional(),
)

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  AUTH_COOKIE_DOMAIN: optionalEnvString,
  RESEND_API_KEY: optionalEnvString,
  RESEND_FROM_EMAIL: optionalEnvString,
  OPENAI_API_KEY: optionalEnvString,
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  REDIS_URL: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().url().optional(),
  ),
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

function getHostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

export function getCrossSubDomainCookiesConfig() {
  if (env.AUTH_COOKIE_DOMAIN) {
    return {
      enabled: true as const,
      domain: env.AUTH_COOKIE_DOMAIN,
    }
  }

  const webHostname = getHostname(env.WEB_ORIGIN)
  const authHostname = getHostname(env.BETTER_AUTH_URL)

  if (!webHostname || !authHostname) {
    return undefined
  }

  if (localDevHosts.has(webHostname) || localDevHosts.has(authHostname)) {
    return undefined
  }

  if (webHostname === authHostname) {
    return undefined
  }

  return {
    enabled: true as const,
  }
}
