export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  return (await useDrizzle().select().from(tables.chats).where(eq(tables.chats.userId, session.user?.id || session.id))).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})
