import { randomUUID } from 'node:crypto'
import { sql, relations } from 'drizzle-orm'
import { sqliteTable, text, integer, index, unique } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text().primaryKey().$defaultFn(() => randomUUID()),
  email: text().notNull(),
  name: text().notNull(),
  avatar: text().notNull(),
  username: text().notNull(),
  provider: text({ enum: ['github'] }).notNull(),
  providerId: integer().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
}, t => [
  unique().on(t.provider, t.providerId)
])

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats)
}))

export const chats = sqliteTable('chats', {
  id: text().primaryKey().$defaultFn(() => randomUUID()),
  title: text(),
  userId: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
}, t => [
  index('userIdIdx').on(t.userId)
])

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id]
  }),
  messages: many(messages)
}))

export const messages = sqliteTable('messages', {
  id: text().primaryKey().$defaultFn(() => randomUUID()),
  chatId: text().notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  content: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
}, t => [
  index('chatIdIdx').on(t.chatId)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))
