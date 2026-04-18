import { eq } from 'drizzle-orm'
import { generateSeedReceipts, seededUserId, summarizeSeedReceipts } from '../features/receipts/seed-data.js'

const applyMode = process.argv.includes('--apply')
const receipts = generateSeedReceipts()
const summary = summarizeSeedReceipts(receipts)

console.log(JSON.stringify({
  mode: applyMode ? 'apply' : 'dry-run',
  summary,
  preview: receipts.slice(0, 12),
}, null, 2))

if (!applyMode) {
  console.log(`Dry run only. Re-run with --apply to insert ${receipts.length} receipts for ${seededUserId}.`)
  process.exit(0)
}

const [{ db }, { receipt, user }] = await Promise.all([
  import('../db/index.js'),
  import('../db/schema.js'),
])

const [existingUser] = await db
  .select({ id: user.id })
  .from(user)
  .where(eq(user.id, seededUserId))
  .limit(1)

if (!existingUser) {
  console.error(`Cannot seed receipts because user ${seededUserId} does not exist.`)
  process.exit(1)
}

const insertedRows = await db.insert(receipt).values(
  receipts.map((item) => ({
    id: item.id,
    userId: item.userId,
    merchant: item.merchant,
    amount: item.amount,
    currency: item.currency,
    date: new Date(`${item.date}T00:00:00.000Z`),
    category: item.category,
    paymentMethod: item.paymentMethod,
    notes: item.notes,
    status: item.status,
    aiExtracted: item.aiExtracted,
  })),
).onConflictDoNothing({ target: receipt.id }).returning({ id: receipt.id })

console.log(`Inserted ${insertedRows.length} seed receipts for ${seededUserId}.`)
