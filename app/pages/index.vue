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
      <div class="whitespace-nowrap group/elements relative rounded-full text-sm flex items-center justify-center">
        <div class="relative flex items-center justify-center gap-1.5 rounded-full">
          <span class="relative z-10 transition-colors duration-300 text-zinc-500 dark:text-zinc-400">
            AI Elements
            <span
              class="absolute inset-0 bg-clip-text bg-zinc-800 dark:bg-zinc-100 text-transparent opacity-0 group-hover/elements:opacity-100 group-hover/elements:animate-shimmer-once transition-opacity duration-200"
              style="background-image:linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px));background-size:200% 100%;background-position:-50% center"
            >
              AI Elements
              <span class="text-zinc-800 dark:text-zinc-100"><svg
                width="3"
                height="3"
                viewBox="0 0 4 4"
                xmlns="http://www.w3.org/2000/svg"
                class="absolute right-0 top-[2px] opacity-0 scale-0 group-hover/elements:opacity-100 group-hover/elements:scale-100 transition-all duration-300 ease-out"
              ><path d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z" fill="currentColor" /></svg><svg
                width="4"
                height="4"
                viewBox="0 0 4 4"
                xmlns="http://www.w3.org/2000/svg"
                class="absolute right-[-5px] top-[6px] opacity-0 scale-0 group-hover/elements:opacity-100 group-hover/elements:scale-100 transition-all duration-300 ease-out delay-75"
              ><path d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z" fill="currentColor" /></svg>
              </span>
            </span>
          </span>
        </div>
      </div>
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
