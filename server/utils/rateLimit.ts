import type { H3Event } from 'h3'

export async function handleRateLimit(event: H3Event) {
  const session = await getUserSession(event)
  const today = new Date().toISOString().split('T')[0]! // Format: YYYY-MM-DD

  const rateLimitData = session.secure?.rateLimits || {}
  console.log('rateLimitData', rateLimitData)
  const todayUsage = rateLimitData[today] || 0

  if (todayUsage >= RATE_LIMIT_DAILY_LIMIT) {
    throw createError({
      statusCode: 429,
      statusMessage: `Rate limit exceeded. You have reached the daily limit of ${RATE_LIMIT_DAILY_LIMIT} reasoning messages.`
    })
  }

  rateLimitData[today] = todayUsage + 1

  await setUserSession(event, {
    ...session,
    secure: {
      ...session.secure,
      rateLimits: rateLimitData
    }
  })
}
