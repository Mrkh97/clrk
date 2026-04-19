import { z } from 'zod'

const optimizerDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format.')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
  }, 'Date must be a real calendar date.')

export const optimizerLevelSchema = z.enum(['easy', 'hard'])

export const optimizerRequestSchema = z
  .object({
    level: optimizerLevelSchema,
    from: optimizerDateSchema,
    to: optimizerDateSchema,
  })
  .refine((value) => value.from <= value.to, {
    message: '`from` must be on or before `to`.',
    path: ['from'],
  })

export type OptimizerLevel = z.infer<typeof optimizerLevelSchema>
export type OptimizerRequest = z.infer<typeof optimizerRequestSchema>
