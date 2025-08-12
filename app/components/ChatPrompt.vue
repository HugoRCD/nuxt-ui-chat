<script setup lang="ts">
import { motion } from 'motion-v'

interface Props {
  mode?: 'index' | 'chat'
  status?: 'ready' | 'streaming' | 'error' | 'submitted'
  error?: Error
  disabled?: boolean
  onStop?: () => void
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'index',
  status: 'ready',
  disabled: false
})

const emit = defineEmits<{
  submit: [event: Event]
}>()

const input = defineModel<string>({ required: true })

const { model } = useLLM()
const { loggedIn } = useUserSession()
const { isRateLimited, used, limit } = useRateLimit()

const canUseModel = computed(() => {
  return !model.value.reasoning || (model.value.reasoning && loggedIn.value)
})

const promptClasses = computed(() => {
  const baseClasses = '[view-transition-name:chat-prompt]'

  if (props.mode === 'chat') {
    return `sticky bottom-4 ${baseClasses} z-10`
  }

  return baseClasses
})

const computedStatus = computed(() => {
  // For index mode, derive status from other props
  if (props.mode === 'index') {
    return props.status
  }

  // For chat mode, use the provided status
  return props.status
})

function handleSubmit(event: Event) {
  emit('submit', event)
}
</script>

<template>
  <motion.div
    :class="promptClasses"
    class="w-full p-2 bg-neutral-50 dark:bg-neutral-950 rounded-xl space-y-2 border border-default/30 shadow-sm"
    layout
  >
    <motion.div layout>
      <UChatPrompt
        v-model="input"
        :error="error"
        :status="computedStatus"
        :disabled="disabled || !canUseModel || isRateLimited"
        variant="subtle"
        class="px-2 bg-white dark:bg-neutral-900"
        @submit="handleSubmit"
      >
        <template #footer>
          <div class="flex items-center gap-1">
            <UTooltip text="Soon available">
              <UButton
                icon="i-lucide-paperclip"
                color="neutral"
                size="sm"
                variant="ghost"
                disabled
              />
            </UTooltip>
            <ModelSelect v-model="model" />
          </div>
          <UChatPromptSubmit
            :status="computedStatus"
            color="neutral"
            size="sm"
            :label="computedStatus === 'streaming' || computedStatus === 'submitted' ? 'Stop' : undefined"
            :disabled="disabled || !canUseModel || isRateLimited"
            @stop="onStop"
            @reload="onReload"
          />
        </template>
      </UChatPrompt>
    </motion.div>
    <motion.div v-if="model.reasoning" layout>
      <div class="w-full flex items-center" :class="isRateLimited || !canUseModel ? 'justify-between' : 'justify-end'">
        <div v-if="!canUseModel" class="text-xs sm:text-sm flex items-center gap-2 text-error">
          <UIcon name="i-lucide-alert-triangle" class="size-4 shrink-0" />
          <span>You need to be logged in to use reasoning models</span>
        </div>
        <div v-else-if="isRateLimited" class="text-xs sm:text-sm flex items-center gap-2 text-error">
          <UIcon name="i-lucide-alert-triangle" class="size-4 shrink-0" />
          <span>You have reached the rate limit for today. Please try again tomorrow.</span>
        </div>
        <div class="text-xs sm:text-sm flex items-center gap-2 text-muted">
          <span>Reasoning messages: {{ used }} / {{ limit }}</span>
        </div>
      </div>
    </motion.div>
  </motion.div>
</template>
