import type { UserSession } from '#auth-utils'
import { gateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'
import type { UIMessage } from 'ai'

export async function generateTitleFromUserMessage({
  message
}: {
  message: UIMessage
}) {
  console.log('message', message)
  const { text: title } = await generateText({
    model: gateway('openai/gpt-4.1-nano'),
    system: `You are a title generator for a chat:
        - Generate a short title based on the first user's message
        - The title should be less than 30 characters long
        - The title should be a summary of the user's message
        - Do not use quotes (' or ") or colons (:) or any other punctuation
        - Do not use markdown, just plain text`,
    prompt: JSON.stringify(message)
  })

  console.log('title', title)

  return title
}

export async function saveLastUserMessage({
  chatId,
  message
}: {
  chatId: string
  message: UIMessage
}) {
  const db = useDrizzle()

  await db.insert(tables.messages).values({
    chatId,
    role: 'user',
    parts: message.parts
  })
}

export async function saveMessages({
  chatId,
  messages
}: {
  chatId: string
  messages: UIMessage[]
}) {
  const db = useDrizzle()

  await db.insert(tables.messages).values(messages.map(message => ({
    chatId,
    role: message.role as 'user' | 'assistant',
    parts: message.parts
  })))
}

export async function getChat({
  chatId,
  session
}: {
  chatId: string
  session: UserSession
}) {
  const db = useDrizzle()

  return await db.query.chats.findFirst({
    where: (chat, { eq }) => and(eq(chat.id, chatId as string), eq(chat.userId, session.user?.id || session.id)),
    with: {
      messages: true
    }
  })
}
