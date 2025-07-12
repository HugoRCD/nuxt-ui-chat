<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { useClipboard } from '@vueuse/core'
import ProseStreamPre from '../../components/prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const { user, loggedIn } = useUserSession()

const canUseReasoningModels = computed(() => {
  return loggedIn.value && model.value.reasoning
})

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
  maxSteps: 5,
  onFinish() {
    refreshNuxtData('chats')
  }
})

const copied = ref(false)

function copy(e: MouseEvent, message: UIMessage) {
  clipboard.copy(message.parts?.map((part) => {
    if (part.type === 'text') {
      return part.text
    }
    return part.type
  }).join(''))

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

function getMessageContent(message: UIMessage & { content?: string }) {
  if (message.content) return message.content
  const parts = message.parts?.map((part) => {
    if (part.type === 'text') {
      return part.text
    }
  })
  return parts?.join('')
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
          :messages="chat.messages as any"
          :status="chat.status"
          :user="{
            avatar: {
              src: user?.avatar,
              alt: user?.username
            }
          }"
          :assistant="{
            avatar: {
              icon: 'i-lucide-sparkles'
            },
            actions: [
              {
                abel: 'Copy',
                icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy',
                onClick: copy
              }
            ]
          }"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
          :spacing-offset="160"
          :ui="{
            indicator: 'h-auto *:size-auto *:bg-transparent [&>*:nth-child(1)]:animate-none [&>*:nth-child(2)]:animate-none [&>*:nth-child(3)]:animate-none'
          }"
        >
          <template #content="{ message }">
            <div class="space-y-4">
              <!-- <div v-if="message.role === 'assistant' && message.parts?.length === 0">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-sparkles" class="size-4" />
                  <TextGradient text="Thinking..." class="mt-0.5" />
                </div>
              </div> -->
              <MDCCached
                :value="getMessageContent(message as UIMessage)"
                :cache-key="message.id"
                unwrap="p"
                :components="components"
                :parser-options="{ highlight: false }"
              />
              <template v-for="part in message.parts as UIMessage['parts']" :key="part.type">
                <ToolWeather
                  v-if="part.type === 'tool-weather'"
                  :state="part.state"
                  :output="(part as any).output"
                />
              </template>
            </div>
          </template>
          <template #indicator>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-loader" class="animate-spin size-4" />
              <TextGradient text="Thinking..." class="mt-0.5" />
            </div>
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="chat.error"
          :disabled="!canUseReasoningModels"
          variant="subtle"
          class="sticky bottom-4 [view-transition-name:chat-prompt] z-10"
          @submit="handleSubmit"
        >
          <UChatPromptSubmit
            :status="chat.status"
            color="neutral"
            :disabled="!canUseReasoningModels"
            @stop="chat.stop"
            @reload="chat.regenerate"
          />

          <template #footer>
            <ModelSelect v-model="model" />
            <div v-if="!canUseReasoningModels && model.reasoning" class="text-xs sm:text-sm flex items-center gap-2 text-red-500">
              <UIcon name="i-lucide-alert-triangle" class="size-4 shrink-0" />
              <span>You need to be logged in to use reasoning models</span>
            </div>
          </template>
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
