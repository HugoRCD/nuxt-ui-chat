export function useRateLimit() {
  const remaining = useState('remaining', () => RATE_LIMIT_DAILY_LIMIT)
  const used = useState('used', () => 0)
  const limit = useState('limit', () => RATE_LIMIT_DAILY_LIMIT)
  const toast = useToast()

  const initialized = useState('rate-limit-initialized', () => false)

  const initialize = async () => {
    if (initialized.value) return

    try {
      const data = await $fetch('/api/rate-limit')

      remaining.value = data.remaining
      used.value = data.used
      limit.value = data.limit
      initialized.value = true
    } catch (error) {
      console.warn('Failed to initialize rate limit data:', error)
    }
  }

  const handleRateLimitError = () => {
    toast.add({
      title: 'Rate limit exceeded',
      description: `You have reached your daily limit of ${limit.value} reasoning messages. Please try again tomorrow.`,
      color: 'error',
      icon: 'i-lucide-alert-triangle',
      duration: 5000
    })

    remaining.value = 0
    used.value = limit.value

    return true
  }

  const incrementUsage = () => {
    if (used.value < limit.value) {
      used.value += 1
      remaining.value = limit.value - used.value
    }
  }

  const isRateLimited = computed(() => remaining.value <= 0)

  if (import.meta.client && !initialized.value) {
    initialize()
  }

  return {
    remaining: readonly(remaining),
    used: readonly(used),
    limit: readonly(limit),
    isRateLimited: readonly(isRateLimited),
    initialize,
    incrementUsage,
    handleRateLimitError
  }
}
