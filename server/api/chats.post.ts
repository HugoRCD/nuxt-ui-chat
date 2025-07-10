export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { input } = await readBody(event)
  const db = useDrizzle()

  const chat = await db.insert(tables.chats).values({
    title: '',
    userId: session.user?.id || session.id
  }).returning()

  await db.insert(tables.messages).values({
    chatId: chat[0]?.id || '',
    role: 'user',
    content: input
  })

  return chat[0]
})
