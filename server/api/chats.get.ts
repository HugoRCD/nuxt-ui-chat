export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  return await useDrizzle()
    .select()
    .from(tables.chats)
    .where(eq(tables.chats.userId, session.user?.id || session.id))
    .orderBy(desc(tables.chats.createdAt))
})
