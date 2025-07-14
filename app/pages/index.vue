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
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
        <div class="flex flex-col gap-1">
          <span class="text-2xl sm:text-3xl text-highlighted font-medium">
            Welcome
          </span>
          <span class="text-3xl sm:text-4xl bg-gradient-to-r from-inverted/40 to-inverted/75 to-50% bg-clip-text text-transparent font-medium">
            How can I help you today?
          </span>
        </div>

        <ChatPrompt
          v-model="input"
          mode="index"
          :status="loading ? 'streaming' : 'ready'"
          @submit="onSubmit"
        />

        <div class="flex flex-wrap gap-2 justify-center">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            :disabled="!canUseModel || isRateLimited"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full grayscale"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
      <StarsBg class="opacity-30 hidden dark:block" />
    </template>
  </UDashboardPanel>
</template>
