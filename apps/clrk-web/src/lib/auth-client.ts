import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

const explicitApiBaseUrl = import.meta.env.VITE_API_BASE_URL

function resolveApiBaseUrl() {
  if (explicitApiBaseUrl) {
    return explicitApiBaseUrl
  }

  if (typeof window !== 'undefined') {
    const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)

    if (!isLocalHost) {
      throw new Error('VITE_API_BASE_URL must be configured for non-local environments.')
    }

    return `http://${window.location.hostname}:3001`
  }

  return 'http://localhost:3001'
}

export const apiBaseUrl = resolveApiBaseUrl()

export const authClient = createAuthClient({
  baseURL: apiBaseUrl,
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    inferAdditionalFields({
      user: {
        subscriptionEnabled: {
          type: 'boolean',
        },
      },
    }),
  ],
})

export const { signIn, signOut, signUp } = authClient

type RawSession = typeof authClient.$Infer.Session

export type AuthUser = RawSession['user']
export type AuthSession = RawSession

export function getSafeRedirectTarget(redirect?: string) {
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }

  return '/dashboard'
}

function normalizeSession(session: RawSession | null | undefined): AuthSession | null {
  if (!session) {
    return null
  }

  return session
}

export function useAuthSession() {
  const session = authClient.useSession()

  return {
    ...session,
    data: normalizeSession(session.data),
  }
}
