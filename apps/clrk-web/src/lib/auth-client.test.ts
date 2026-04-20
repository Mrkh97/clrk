import { describe, expect, it } from 'vitest'
import {
  confirmEmailPath,
  defaultRedirectTarget,
  getConfirmEmailRedirectTarget,
  getSafeRedirectTarget,
  toAuthSession,
} from './auth-client'

describe('auth-client helpers', () => {
  it('keeps only safe in-app redirect targets', () => {
    expect(getSafeRedirectTarget('/receipt')).toBe('/receipt')
    expect(getSafeRedirectTarget('https://evil.example')).toBe(defaultRedirectTarget)
    expect(getSafeRedirectTarget('//evil.example')).toBe(defaultRedirectTarget)
    expect(getSafeRedirectTarget(undefined)).toBe(defaultRedirectTarget)
  })

  it('maps redirect targets into the confirm-email route safely', () => {
    expect(getConfirmEmailRedirectTarget(undefined)).toBe(confirmEmailPath)
    expect(getConfirmEmailRedirectTarget('/dashboard')).toBe(confirmEmailPath)
    expect(getConfirmEmailRedirectTarget('/optimizer')).toBe('/confirm-email?redirect=%2Foptimizer')
    expect(getConfirmEmailRedirectTarget('https://evil.example')).toBe(confirmEmailPath)
  })

  it('removes sensitive session metadata from the client-facing session shape', () => {
    const session = toAuthSession({
      user: {
        id: 'user_123',
        name: 'Mohammadreza',
        email: 'mkhorasanchian@gmail.com',
        emailVerified: true,
        image: null,
        createdAt: new Date('2026-04-20T09:20:47.348Z'),
        updatedAt: new Date('2026-04-20T09:21:01.773Z'),
        subscriptionEnabled: false,
      },
      session: {
        id: 'session_123',
        userId: 'user_123',
        token: 'secret-token',
        ipAddress: '162.159.113.52',
        userAgent: 'Mozilla/5.0',
        expiresAt: new Date('2026-04-27T09:22:12.802Z'),
        createdAt: new Date('2026-04-20T09:22:12.803Z'),
        updatedAt: new Date('2026-04-20T09:22:12.803Z'),
      },
    })

    expect(session).toMatchObject({
      user: {
        id: 'user_123',
        email: 'mkhorasanchian@gmail.com',
        subscriptionEnabled: false,
      },
      session: {
        id: 'session_123',
        userId: 'user_123',
      },
    })
    expect(session?.session).not.toHaveProperty('token')
    expect(session?.session).not.toHaveProperty('ipAddress')
    expect(session?.session).not.toHaveProperty('userAgent')
  })
})
