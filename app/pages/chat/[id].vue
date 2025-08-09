<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { useClipboard } from '@vueuse/core'
import ProseStreamPre from '../../components/prose/PreStream.vue'
import type { ThemeToolUIPart } from '../../../shared/utils/tools/theme'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const { user } = useUserSession()
const { handleRateLimitError, incrementUsage } = useRateLimit()

const route = useRoute()
const clipboard = useClipboard()
const { model } = useLLM()
const input = ref('')

const { data } = await useFetch(`/api/chats/${route.params.id}`, {
  cache: 'force-cache'
})
console.log('data', data.value)
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found', fatal: true })
}

const chat = new Chat({
  id: data.value.id,
  messages: data.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${data.value.id}`,
    body: {
      model: model.value.value
    }
  }),
  onFinish() {
    refreshNuxtData('chats')

    if (isReasoningModel(model.value.value)) {
      incrementUsage()
    }
  },
  onError: (error) => {
    if (error.message?.includes('Rate limit exceeded') || error.message?.includes('429')) {
      handleRateLimitError()
    } else {
      useToast().add({
        title: 'Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  }
})

const copied = ref(false)

function copy(e: MouseEvent, message: UIMessage) {
  clipboard.copy(getTextFromMessage(message))

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

onMounted(() => {
  if (data.value?.messages.length === 1) {
    chat.regenerate()
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>
    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
        <UChatMessages
          :messages="chat.messages.map(message => ({
            ...message,
            content: '', // FIXME: This is a hack to make the UChatMessages component work with aiSDK v5
            createdAt: new Date(message.createdAt) // FIXME: aiSDK v5 Type is a string instead of expected Date
          }))"
          :status="chat.status"
          :user="{
            avatar: user ? {
              src: user?.avatar,
              alt: user?.username
            } : {
              icon: 'i-lucide-user'
            }
          }"
          :assistant="{
            avatar: {
              icon: 'i-lucide-sparkles'
            },
            actions: [
              {
                label: 'Copy',
                icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy',
                onClick: (e, message) => copy(e, message as UIMessage)
              }
            ]
          }"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
          should-auto-scroll
          :spacing-offset="160"
          :ui="{
            indicator: 'py-0 h-auto *:size-auto *:bg-transparent [&>*:nth-child(1)]:animate-none [&>*:nth-child(2)]:animate-none [&>*:nth-child(3)]:animate-none'
          }"
        >
          <template #content="{ message }">
            <UButton
              v-if="message.parts?.length === 0 && message.role === 'assistant'"
              class="px-0 group"
              color="neutral"
              variant="link"
              loading
              loading-icon="i-lucide-loader"
            >
              <TextGradient text="Thinking..." />
            </UButton>
            <div class="space-y-4">
              <template v-for="(part, index) in message.parts as UIMessage['parts']" :key="`${part.type}-${index}-${message.id}`">
                <Reasoning v-if="part.type === 'reasoning'" :state="part.state" :text="part.text" />
              </template>
              <MDCCached
                :value="getTextFromMessage(message as UIMessage)"
                :cache-key="message.id"
                unwrap="p"
                :components="components"
                :parser-options="{ highlight: false }"
              />
              <template v-for="(part, index) in message.parts as UIMessage['parts']" :key="`${part.type}-${index}-${message.id}`">
                <ToolWeather v-if="part.type === 'tool-weather'" :state="part.state as WeatherToolUIPart['state']" :output="part.output as WeatherToolUIPart['output']" />
                <ToolTheme v-if="part.type === 'tool-theme'" :state="part.state as ThemeToolUIPart['state']" :output="part.output as ThemeToolUIPart['output']" />
              </template>
            </div>
          </template>
          <template #indicator>
            <UButton
              class="px-0 group"
              color="neutral"
              variant="link"
              loading
              loading-icon="i-lucide-loader"
            >
              <TextGradient text="Thinking..." />
            </UButton>
          </template>
        </UChatMessages>

        <ChatPrompt
          v-model="input"
          mode="chat"
          :error="chat.error"
          :status="chat.status"
          :on-stop="chat.stop"
          :on-reload="chat.regenerate"
          @submit="handleSubmit"
        />
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
