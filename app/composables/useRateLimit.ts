export function useRateLimit() {
  const remaining = useState('remaining', () => RATE_LIMIT_DAILY_LIMIT)
  const used = useState('used', () => 0)
  const limit = useState('limit', () => RATE_LIMIT_DAILY_LIMIT)
  const toast = useToast()

  const handleRateLimitError = () => {
    toast.add({
      title: 'Rate limit exceeded',
      description: `You have reached your daily limit of ${RATE_LIMIT_DAILY_LIMIT} reasoning messages. Please try again tomorrow.`,
      color: 'error',
      icon: 'i-lucide-alert-triangle',
      duration: 5000
    })

    remaining.value = 0
    used.value = limit.value

    return true
  }

  const isRateLimited = computed(() => remaining.value <= 0)

  return {
    remaining: readonly(remaining),
    used: readonly(used),
    limit: readonly(limit),
    isRateLimited: readonly(isRateLimited),
    handleRateLimitError
  }
}
