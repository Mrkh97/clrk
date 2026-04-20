import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { customSession } from 'better-auth/plugins'
import { db } from '@/db/index.js'
import * as schema from '@/db/schema.js'
import { env, getCrossSubDomainCookiesConfig, getTrustedOrigins } from '@/lib/env.js'
import { sendVerificationEmail } from './email.js'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: async (request) => {
    const origin = request?.headers.get('origin')
    return getTrustedOrigins(origin)
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  advanced: {
    crossSubDomainCookies: getCrossSubDomainCookiesConfig(),
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        token,
        verificationUrl: url,
      })
    },
  },
  user: {
    additionalFields: {
      subscriptionEnabled: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const {
        token: _token,
        ipAddress: _ipAddress,
        userAgent: _userAgent,
        ...publicSession
      } = session

      return {
        user,
        session: publicSession,
      }
    }),
  ],
})

export type AuthSession = typeof auth.$Infer.Session
