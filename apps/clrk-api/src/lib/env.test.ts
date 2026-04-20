import assert from 'node:assert/strict'
import test from 'node:test'

process.env.DATABASE_URL ??= 'postgres://postgres:postgres@localhost:5432/clrk'
process.env.BETTER_AUTH_SECRET ??= 'test-secret'

test('getCrossSubDomainCookiesConfig enables shared cookies for non-local split hosts', async () => {
  process.env.WEB_ORIGIN = 'https://app.example.com'
  process.env.BETTER_AUTH_URL = 'https://api.example.com'
  delete process.env.AUTH_COOKIE_DOMAIN

  const { getCrossSubDomainCookiesConfig } = await import(`./env.js?case=split-hosts-${Date.now()}`)

  assert.deepEqual(getCrossSubDomainCookiesConfig(), {
    enabled: true,
  })
})

test('getCrossSubDomainCookiesConfig prefers the explicit cookie domain override', async () => {
  process.env.WEB_ORIGIN = 'https://app.example.com'
  process.env.BETTER_AUTH_URL = 'https://api.example.com'
  process.env.AUTH_COOKIE_DOMAIN = 'example.com'

  const { getCrossSubDomainCookiesConfig } = await import(`./env.js?case=explicit-domain-${Date.now()}`)

  assert.deepEqual(getCrossSubDomainCookiesConfig(), {
    enabled: true,
    domain: 'example.com',
  })
})

test('getCrossSubDomainCookiesConfig stays disabled for localhost development', async () => {
  process.env.WEB_ORIGIN = 'http://localhost:3000'
  process.env.BETTER_AUTH_URL = 'http://localhost:3001'
  delete process.env.AUTH_COOKIE_DOMAIN

  const { getCrossSubDomainCookiesConfig } = await import(`./env.js?case=localhost-${Date.now()}`)

  assert.equal(getCrossSubDomainCookiesConfig(), undefined)
})
