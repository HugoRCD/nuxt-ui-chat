<script setup lang="ts">
const { loggedIn, openInPopup } = useUserSession()
</script>

<template>
  <UDashboardNavbar
    :toggle="false"
    class="sticky lg:absolute top-0 inset-x-0 border-b-0 z-10 bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none pointer-events-none"
    :ui="{ left: 'pointer-events-auto gap-0.5', right: 'pointer-events-auto' }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-0.5">
        <Logo class="h-7 w-auto shrink-0" />
        <span class="hidden sm:block text-lg font-bold text-highlighted">Chat</span>
      </NuxtLink>
      <span aria-hidden="true" class="ml-2 text-muted w-4 min-w-4 select-none text-center text-lg">/</span>
      <UserMenu v-if="loggedIn" />
      <UButton
        v-else
        label="Login with GitHub"
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="openInPopup('/auth/github')"
      />
      <span aria-hidden="true" class="text-muted w-4 min-w-4 select-none text-center text-lg">/</span>
      <CommandPalette />
      <span aria-hidden="true" class="text-muted w-4 min-w-4 select-none text-center text-lg">/</span>
      <UTooltip text="New Chat">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-plus"
          size="sm"
          to="/"
        />
      </UTooltip>
    </template>
  </UDashboardNavbar>
</template>
