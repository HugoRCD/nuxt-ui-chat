import { streamText, generateText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import type { UIMessage } from 'ai'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { id } = getRouterParams(event)
  // TODO: Use readValidatedBody
  const { model, messages } = await readBody(event) as { model: string, messages: UIMessage[] }

  const db = useDrizzle()

  const chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => and(eq(chat.id, id as string), eq(chat.userId, session.user?.id || session.id)),
    with: {
      messages: true
    }
  })
  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  if (!chat.title) {
    const { text: title } = await generateText({
      model: gateway('openai/gpt-4.1-nano'),
      messages: [{
        role: 'system',
        content: `You are a title generator for a chat:
        - Generate a short title based on the first user's message
        - The title should be less than 30 characters long
        - The title should be a summary of the user's message
        - Do not use quotes (' or ") or colons (:) or any other punctuation
        - Do not use markdown, just plain text`
      }, {
        role: 'user',
        content: chat.messages[0]!.content
      }]
    })
    setHeader(event, 'X-Chat-Title', title.replace(/:/g, '').split('\n')[0])
    await db.update(tables.chats).set({ title }).where(eq(tables.chats.id, id as string))
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(tables.messages).values({
      chatId: id as string,
      role: 'user',
      content: lastMessage.parts.map((part) => {
        if (part.type === 'text') {
          return part.text
        }
        return part.type
      }).join('')
    })
  }

  const result = streamText({
    model: gateway(model),
    system: 'You are a helpful assistant that can answer questions and help.',
    messages: convertToModelMessages(messages),
    async onFinish(response) {
      await db.insert(tables.messages).values({
        chatId: chat.id,
        role: 'assistant',
        content: response.text
      })
    }
  })

  return result.toUIMessageStreamResponse()
})
