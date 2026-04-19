import { describe, expect, it } from 'vitest'
import {
  confirmEmailPath,
  defaultRedirectTarget,
  getConfirmEmailRedirectTarget,
  getSafeRedirectTarget,
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
})
