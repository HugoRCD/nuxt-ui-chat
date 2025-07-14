<script setup lang="ts">
import { LazyModalConfirm } from '#components'

const route = useRoute()
const toast = useToast()
const overlay = useOverlay()
const { loggedIn } = useUserSession()

const open = ref(false)

const deleteModal = overlay.create(LazyModalConfirm, {
  props: {
    title: 'Delete chat',
    description: 'Are you sure you want to delete this chat? This cannot be undone.'
  }
})

const { data: chats, refresh: refreshChats } = await useFetch('/api/chats', {
  key: 'chats',
  transform: data => data.map(chat => ({
    id: chat.id,
    label: chat.title || 'Untitled',
    to: `/chat/${chat.id}`,
    icon: 'i-lucide-message-circle',
    createdAt: chat.createdAt
  }))
})

onNuxtReady(async () => {
  const first10 = (chats.value || []).slice(0, 10)
  for (const chat of first10) {
    // prefetch the chat and let the browser cache it
    await $fetch(`/api/chats/${chat.id}`)
  }
})

watch(loggedIn, () => {
  refreshChats()

  open.value = false
})

const { groups: chatsGroups } = useChats(chats)

const groups = computed(() => {
  return [
    {
      id: 'new-chat',
      items: [{
        id: 'new-chat',
        label: 'New chat',
        icon: 'i-lucide-plus',
        to: '/'
      }]
    },
    ...chatsGroups.value
  ]
})

const modalUi = {
  overlay: 'bg-default/30 backdrop-blur-sm',
  content: 'max-w-2xl h-100 flex flex-col shadow-raycast'
}

const commandPaletteUi = {
  root: 'flex flex-col h-full',
  label: 'text-muted font-medium',
  item: 'data-highlighted:not-data-disabled:before:bg-muted',
  content: 'flex-1 overflow-y-auto'
}

async function deleteChat(id: string) {
  const instance = deleteModal.open()
  const result = await instance.result
  if (!result) {
    return
  }

  await $fetch(`/api/chats/${id}`, { method: 'DELETE' })

  toast.add({
    title: 'Chat deleted',
    description: 'Your chat has been deleted',
    icon: 'i-lucide-trash'
  })

  refreshChats()

  if (route.params.id === id) {
    navigateTo('/')
  }
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      open.value = true
    }
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="modalUi"
  >
    <UButton
      icon="i-lucide-text-search"
      variant="ghost"
      label="Browse Chats"
      size="sm"
      :ui="{ label: 'hidden sm:block' }"
    />
    <template #content>
      <UCommandPalette
        :groups
        :ui="commandPaletteUi"
        :fuse="{ resultLimit: 100, fuseOptions: { includeMatches: true } }"
      >
        <template #item-trailing="{ item }">
          <div v-if="item.id !== 'new-chat'" class="flex">
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="xs"
              class="text-muted hover:text-primary hover:bg-accented/50 focus-visible:bg-accented/50 p-0.5"
              tabindex="-1"
              @click.stop.prevent="deleteChat((item as any).id)"
            />
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
