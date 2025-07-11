export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const { input } = await readBody(event)
  const db = useDrizzle()

  let userId = session.user?.id

  // If user is not logged in, create or use anonymous user
  if (!userId) {
    userId = session.id

    // Check if anonymous user already exists, if not create one
    const existingUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, session.id)
    })

    if (!existingUser) {
      await db.insert(tables.users).values({
        id: session.id,
        name: 'Anonymous User',
        email: '',
        avatar: '',
        username: `anonymous_${session.id.slice(0, 8)}`,
        provider: 'github',
        providerId: session.id
      })
    }
  }

  const chat = await db.insert(tables.chats).values({
    title: '',
    userId
  }).returning()

  await db.insert(tables.messages).values({
    chatId: chat[0]?.id || '',
    role: 'user',
    content: input
  })

  return chat[0]
})
