import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

const legacyApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const publicApiBaseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL?.trim()

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

function isPrivateIpv4(hostname: string) {
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return true
  }

  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return true
  }

  const match = hostname.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/)
  if (!match) {
    return false
  }

  const secondOctet = Number.parseInt(match[1], 10)
  return secondOctet >= 16 && secondOctet <= 31
}

function isInternalHostname(hostname: string) {
  if (isLocalHost(hostname) || isPrivateIpv4(hostname)) {
    return true
  }

  if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return true
  }

  return !hostname.includes('.')
}

function parseAbsoluteUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function resolveBrowserApiBaseUrl() {
  if (publicApiBaseUrl) {
    return normalizeBaseUrl(publicApiBaseUrl)
  }

  if (legacyApiBaseUrl) {
    if (legacyApiBaseUrl.startsWith('/')) {
      return normalizeBaseUrl(legacyApiBaseUrl)
    }

    if (isLocalHost(window.location.hostname)) {
      return normalizeBaseUrl(legacyApiBaseUrl)
    }

    const parsedLegacyUrl = parseAbsoluteUrl(legacyApiBaseUrl)

    if (parsedLegacyUrl && !isInternalHostname(parsedLegacyUrl.hostname)) {
      return normalizeBaseUrl(legacyApiBaseUrl)
    }
  }

  if (isLocalHost(window.location.hostname)) {
    return `http://${window.location.hostname}:3001`
  }

  return window.location.origin
}

function resolveServerApiBaseUrl() {
  const internalApiBaseUrl = process.env.INTERNAL_API_BASE_URL?.trim()

  if (internalApiBaseUrl) {
    return normalizeBaseUrl(internalApiBaseUrl)
  }

  if (legacyApiBaseUrl) {
    return normalizeBaseUrl(legacyApiBaseUrl)
  }

  if (publicApiBaseUrl) {
    return normalizeBaseUrl(publicApiBaseUrl)
  }

  return 'http://localhost:3001'
}

function resolveApiBaseUrl() {
  if (typeof window === 'undefined') {
    return resolveServerApiBaseUrl()
  }

  return resolveBrowserApiBaseUrl()
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
type RawSessionInfo = RawSession['session']
type GetSessionOptions = Parameters<typeof authClient.getSession>[0]

export type AuthUser = RawSession['user']
export type AuthSessionInfo = Omit<RawSessionInfo, 'token' | 'ipAddress' | 'userAgent'>
export type AuthSession = {
  user: AuthUser
  session: AuthSessionInfo
}

export const defaultRedirectTarget = '/dashboard'
export const confirmEmailPath = '/confirm-email'
const verifiedSearchParam = 'verified'

function isAbsoluteUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://')
}

function joinUrlPaths(basePath: string, nextPath: string) {
  const normalizedBasePath = basePath.replace(/\/+$/, '')
  const normalizedNextPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`

  if (!normalizedBasePath || normalizedBasePath === '/') {
    return normalizedNextPath
  }

  return `${normalizedBasePath}${normalizedNextPath}`
}

function getAuthBaseUrl() {
  if (typeof window !== 'undefined') {
    if (isAbsoluteUrl(apiBaseUrl)) {
      const url = new URL(apiBaseUrl)
      const pathname = url.pathname.replace(/\/+$/, '')

      if (!pathname || pathname === '/') {
        url.pathname = '/api/auth'
      } else if (!pathname.endsWith('/auth')) {
        url.pathname = joinUrlPaths(pathname, '/auth')
      }

      return url.toString()
    }

    const resolvedBasePath = apiBaseUrl.replace(/\/+$/, '')
    const authPath = resolvedBasePath.endsWith('/api')
      ? `${resolvedBasePath}/auth`
      : resolvedBasePath.endsWith('/auth')
        ? resolvedBasePath
      : resolvedBasePath
        ? joinUrlPaths(resolvedBasePath, '/api/auth')
        : '/api/auth'

    return new URL(authPath, window.location.origin).toString()
  }

  if (isAbsoluteUrl(apiBaseUrl)) {
    const url = new URL(apiBaseUrl)
    const pathname = url.pathname.replace(/\/+$/, '')

    if (!pathname || pathname === '/') {
      url.pathname = '/api/auth'
    } else if (!pathname.endsWith('/auth')) {
      url.pathname = joinUrlPaths(pathname, '/auth')
    }

    return url.toString()
  }

  return apiBaseUrl
}

export function getSafeRedirectTarget(redirect?: string) {
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }

  return defaultRedirectTarget
}

export function getConfirmEmailRedirectTarget(redirect?: string) {
  const safeRedirect = getSafeRedirectTarget(redirect)

  if (safeRedirect === defaultRedirectTarget) {
    return confirmEmailPath
  }

  const searchParams = new URLSearchParams({ redirect: safeRedirect })

  return `${confirmEmailPath}?${searchParams.toString()}`
}

export function getConfirmEmailCallbackURL(redirect?: string) {
  const target = getConfirmEmailRedirectTarget(redirect)

  if (typeof window === 'undefined') {
    return target
  }

  return new URL(target, window.location.origin).toString()
}

export function getVerifiedSearchValue(verified?: string) {
  return verified === '1' ? '1' : undefined
}

export function appendVerifiedSearch(target: string) {
  const url = new URL(target, 'https://clrk.local')

  url.searchParams.set(verifiedSearchParam, '1')

  return `${url.pathname}${url.search}`
}

export async function verifyEmailToken(token: string) {
  const verificationUrl = new URL('/verify-email', getAuthBaseUrl())

  verificationUrl.searchParams.set('token', token)

  const response = await fetch(verificationUrl.toString(), {
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
  })

  const payload = await response.json().catch(() => null) as
    | { code?: string; message?: string }
    | null

  if (!response.ok) {
    return {
      error: payload?.code?.toLowerCase() ?? 'verification_failed',
    }
  }

  return {
    error: null,
  }
}

export function toAuthSession(session: RawSession | null | undefined): AuthSession | null {
  if (!session) {
    return null
  }

  const {
    token: _token,
    ipAddress: _ipAddress,
    userAgent: _userAgent,
    ...publicSession
  } = session.session

  return {
    user: session.user,
    session: publicSession,
  }
}

export async function getAuthSession(options?: GetSessionOptions) {
  const { data, error } = await authClient.getSession(options)

  if (error) {
    return null
  }

  return toAuthSession(data)
}

export function useAuthSession() {
  const session = authClient.useSession()

  return {
    ...session,
    data: toAuthSession(session.data),
  }
}
