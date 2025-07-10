export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { id } = getRouterParams(event)

  const db = useDrizzle()

  return await db.delete(tables.chats)
    .where(and(eq(tables.chats.id, id as string), eq(tables.chats.userId, session.user?.id || session.id)))
    .returning()
})
