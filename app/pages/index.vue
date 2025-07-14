<script setup lang="ts">
const input = ref('')
const loading = ref(false)

const { model } = useLLM()
const { loggedIn } = useUserSession()

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
    label: 'Help me create a Vue composable',
    icon: 'i-logos-vue'
  },
  {
    label: 'Tell me more about UnJS',
    icon: 'i-logos-unjs'
  },
  {
    label: 'Why should I consider VueUse?',
    icon: 'i-logos-vueuse'
  },
  {
    label: 'Tailwind CSS best practices',
    icon: 'i-logos-tailwindcss-icon'
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center items-center gap-4 sm:gap-6 py-8">
        <div class="flex flex-col items-center gap-2">
          <UIcon name="i-lucide-sparkles" class="size-12 text-highlighted" />
          <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
            How can I help you today?
          </h1>
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
            :disabled="!canUseModel"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
