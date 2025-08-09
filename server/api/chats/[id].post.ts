import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  stepCountIs
} from 'ai'
import { gateway } from '@ai-sdk/gateway'
import type { UIMessage } from 'ai'
import { z } from 'zod'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { model, messages } = await readValidatedBody(event, z.object({
    model: z.string(),
    messages: z.array(z.custom<UIMessage>())
  }).parse)

  const db = useDrizzle()
  const reasoningModel = isReasoningModel(model)
  console.log('reasoningModel', reasoningModel)
  console.log('model', model)

  const chat = await getChat({ chatId: id, session })
  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  if (reasoningModel) {
    await handleRateLimit(event)
  }

  if (!chat.title) {
    const message = messages[0]
    if (!message) {
      throw createError({ statusCode: 400, statusMessage: 'No message provided' })
    }
    const title = await generateTitleFromUserMessage({ message })
    await db.update(tables.chats).set({ title }).where(eq(tables.chats.id, id))
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await saveLastUserMessage({
      chatId: id,
      message: lastMessage
    })
  }

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const result = streamText({
        model: gateway(model),
        system: `You are a helpful assistant. Be proactive and slightly more descriptive (avoid being overly concise):
          - When the user mentions dark mode, light mode, appearance, theme, or "mode" for the app, show the "theme" tool UI part so the user can toggle the theme himself directly.
            And explain how to change the theme manually via the UI with clear, visual steps:
               Top navbar → click your profile avatar/name → Appearance → choose Light (sun icon) or Dark (moon icon).
          - Prefer 2–4 short paragraphs with friendly, visual language when giving instructions.
          - Keep code blocks to a minimum, focus on UI guidance.`,
        messages: convertToModelMessages(messages),
        experimental_transform: smoothStream({ chunking: 'word' }),
        stopWhen: stepCountIs(5),
        providerOptions: {
          google: {
            thinkingConfig: reasoningModel
              ? {
                includeThoughts: true,
                thinkingBudget: 2048
              }
              : {}
          }
        },
        tools: {
          weather: weatherTool,
          theme: themeTool
        }
      })

      result.consumeStream()

      writer.merge(result.toUIMessageStream({
        sendReasoning: true
      }))
    },
    onFinish: async ({ messages }) => {
      await saveMessages({
        chatId: chat.id,
        messages
      })
    }
  })

  return createUIMessageStreamResponse({
    stream
  })
})
