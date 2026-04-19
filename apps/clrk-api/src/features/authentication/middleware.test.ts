import assert from 'node:assert/strict'
import test from 'node:test'
import { isPublicVerificationPath, shouldBlockUnverifiedUser } from './middleware.js'

const verifiedUser = {
  id: 'user_1',
  email: 'verified@example.com',
  emailVerified: true,
} as const

const unverifiedUser = {
  id: 'user_2',
  email: 'pending@example.com',
  emailVerified: false,
} as const

test('isPublicVerificationPath allows health, auth, and verify-email routes', () => {
  assert.equal(isPublicVerificationPath('/api/health'), true)
  assert.equal(isPublicVerificationPath('/api/auth/sign-in/email'), true)
  assert.equal(isPublicVerificationPath('/verify-email'), true)
  assert.equal(isPublicVerificationPath('/api/receipts'), false)
})

test('shouldBlockUnverifiedUser blocks protected api routes for signed-in unverified users only', () => {
  assert.equal(shouldBlockUnverifiedUser('/api/receipts', unverifiedUser), true)
  assert.equal(shouldBlockUnverifiedUser('/api/dashboard', unverifiedUser), true)
  assert.equal(shouldBlockUnverifiedUser('/api/auth/get-session', unverifiedUser), false)
  assert.equal(shouldBlockUnverifiedUser('/verify-email', unverifiedUser), false)
  assert.equal(shouldBlockUnverifiedUser('/api/receipts', verifiedUser), false)
  assert.equal(shouldBlockUnverifiedUser('/api/receipts', null), false)
  assert.equal(shouldBlockUnverifiedUser('/login', unverifiedUser), false)
})
