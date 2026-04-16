import { serve } from '@hono/node-server'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth, type AuthSession } from './auth.js'
import { extractedReceiptSchema } from './features/receipts/schema.js'
import { env, isAllowedWebOrigin } from './lib/env.js'

type AppVariables = {
  user: AuthSession['user'] | null
  session: AuthSession['session'] | null
}

const app = new Hono<{ Variables: AppVariables }>()

app.use('/api/*', cors({
  origin: (origin) => (isAllowedWebOrigin(origin) ? origin : env.WEB_ORIGIN),
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  c.set('user', session?.user ?? null)
  c.set('session', session?.session ?? null)

  await next()
})

app.get('/', (c) => {
  return c.json({
    message: 'clrk api ready',
  })
})

app.get('/api/health', (c) => {
  return c.json({
    ok: true,
  })
})

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.post('/api/receipts/extract', async (c) => {
  const session = c.get('session')

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (!env.OPENAI_API_KEY) {
    return c.json({ error: 'OPENAI_API_KEY is not configured.' }, 503)
  }

  try {
    const body = await c.req.parseBody()
    const file = body.file

    if (!(file instanceof File)) {
      return c.json({ error: 'A receipt image is required in the `file` field.' }, 400)
    }

    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'Only image uploads are supported right now.' }, 400)
    }

    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'Images must be 10MB or smaller.' }, 400)
    }

    const imageBase64 = Buffer.from(await file.arrayBuffer()).toString('base64')
    const imageDataUrl = `data:${file.type};base64,${imageBase64}`
    const openai = createOpenAI({ 
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY })

    const { output } = await generateText({
      model: openai.responses(env.OPENAI_MODEL),
      output: Output.object({
        schema: extractedReceiptSchema,
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: [
                'You are extracting structured receipt data from a single image.',
                'Return only the schema fields requested.',
                'Infer pricing details, merchant, purchase date, payment method, line items, notes, and raw text when visible.',
                'Use null when a value is not visible. Keep confidence between 0 and 1.',
              ].join(' '),
            },
            {
              type: 'image',
              image: imageDataUrl,
            },
          ],
        },
      ],
    })

    return c.json({
      fileName: file.name,
      receipt: output,
    })
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Receipt extraction failed unexpectedly.',
      },
      500,
    )
  }
})

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
