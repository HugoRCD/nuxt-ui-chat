export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const today = new Date().toISOString().split('T')[0]! // Format: YYYY-MM-DD

  const rateLimitData = session.secure?.rateLimits || {}
  const todayUsage = rateLimitData[today] || 0

  return {
    used: todayUsage,
    remaining: RATE_LIMIT_DAILY_LIMIT - todayUsage,
    limit: RATE_LIMIT_DAILY_LIMIT,
    resetDate: today
  }
})
