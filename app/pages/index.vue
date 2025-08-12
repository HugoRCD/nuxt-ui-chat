<script setup lang="ts">
const input = ref('')
const loading = ref(false)

const { model } = useLLM()
const { loggedIn } = useUserSession()
const { isRateLimited } = useRateLimit()

const canUseModel = computed(() => {
  return !model.value.reasoning || (model.value.reasoning && loggedIn.value)
})

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { input: prompt }
  })
  if (!chat) {
    const toast = useToast()
    toast.add({
      title: 'Failed to create chat',
      description: 'Please try again later',
      color: 'error'
    })
    loading.value = false
    return
  }

  refreshNuxtData('chats')
  navigateTo(`/chat/${chat.id}`)
}

function onSubmit() {
  createChat(input.value)
}

const quickChats = [
  {
    label: 'What is the weather in London?',
    icon: 'i-lucide-sun'
  },
  {
    label: 'Why use Nuxt UI Pro?',
    icon: 'i-logos-nuxt-icon'
  },
  {
    label: 'What is the capital of France?',
    icon: 'i-lucide-map-pin'
  },
  {
    label: 'How to change the theme of the app?',
    icon: 'i-lucide-sun'
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 py-8">
        <div class="flex flex-col gap-1">
          <span class="text-2xl sm:text-3xl text-highlighted font-medium">
            Welcome
          </span>
          <span class="text-3xl sm:text-4xl bg-gradient-to-r from-inverted/40 to-inverted/75 to-50% bg-clip-text text-transparent font-medium">
            How can I help you today?
          </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            :disabled="!canUseModel || isRateLimited"
            size="sm"
            color="neutral"
            variant="outline"
            class="relative group/shimmer rounded-full"
            :ui="{
              leadingIcon: 'grayscale'
            }"
            @click="createChat(quickChat.label)"
          >
            <span class="relative z-10 transition-colors duration-300 text-muted">
              {{ quickChat.label }}
              <span
                class="absolute inset-0 bg-clip-text bg-inverted text-transparent opacity-0 group-hover/shimmer:opacity-100 group-hover/shimmer:animate-shimmer-once transition-opacity duration-200"
                style="background-image:linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px));background-size:200% 100%;background-position:-50% center"
              >
                {{ quickChat.label }}
              </span>
            </span>
          </UButton>
        </div>
        <ChatPrompt
          v-model="input"
          mode="index"
          :status="loading ? 'streaming' : 'ready'"
          @submit="onSubmit"
        />
      </UContainer>
      <StarsBg class="opacity-30 hidden dark:block" />
    </template>
  </UDashboardPanel>
</template>
