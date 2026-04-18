import { createOpenAI } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { env } from '../../lib/env.js'
import type { OptimizerResponse } from './optimizer-analysis.js'

const optimizerReasonSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.string().min(1),
      reason: z.string().trim().min(1),
      priority: z.number().int().min(1),
    }),
  ),
})

const optimizerModel = 'gpt-5.4'

function isUsableEnrichment(output: z.infer<typeof optimizerReasonSchema>, suggestionIds: Set<string>) {
  if (output.suggestions.length === 0) {
    return false
  }

  for (const suggestion of output.suggestions) {
    if (!suggestionIds.has(suggestion.id) || suggestion.reason.trim().length === 0) {
      return false
    }
  }

  return true
}

export async function enrichOptimizerSuggestions(
  response: OptimizerResponse,
): Promise<OptimizerResponse> {
  if (!env.OPENAI_API_KEY || response.suggestions.length === 0) {
    return response
  }

  const openai = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: env.OPENAI_API_KEY,
  })
  const suggestionIds = new Set(response.suggestions.map((suggestion) => suggestion.id))

  try {
    const { output } = await generateText({
      model: openai.responses(optimizerModel),
      output: Output.object({ schema: optimizerReasonSchema }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: [
                'You are prioritizing spending-cut suggestions from receipt history.',
                'Keep every original suggestion id and return one concise reason per suggestion.',
                'Make each reason practical, specific, and grounded in the provided spend pattern, including note context already embedded in the suggestion reasons when present.',
                'Prefer clearer prioritization, not new math. Do not change savings values.',
                `Current level: ${response.level}.`,
                `Current spend total: ${response.totalCurrentSpend}.`,
                `Deterministic suggestions: ${JSON.stringify(response.suggestions)}.`,
              ].join(' '),
            },
          ],
        },
      ],
    })

    if (!isUsableEnrichment(output, suggestionIds)) {
      return response
    }

    const metadata = new Map(output.suggestions.map((suggestion) => [suggestion.id, suggestion]))

    return {
      ...response,
      suggestions: [...response.suggestions]
        .sort((left, right) => {
          const leftPriority = metadata.get(left.id)?.priority ?? Number.MAX_SAFE_INTEGER
          const rightPriority = metadata.get(right.id)?.priority ?? Number.MAX_SAFE_INTEGER
          return leftPriority - rightPriority
        })
        .map((suggestion) => ({
          ...suggestion,
          reason: metadata.get(suggestion.id)?.reason.trim() || suggestion.reason,
        })),
    }
  } catch {
    return response
  }
}
