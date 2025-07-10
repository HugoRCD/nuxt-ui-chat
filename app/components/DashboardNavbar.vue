<script setup lang="ts">
const { loggedIn, openInPopup } = useUserSession()
</script>

<template>
  <UDashboardNavbar
    class="sticky lg:absolute top-0 inset-x-0 border-b-0 z-10 bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none pointer-events-none"
    :ui="{ left: 'pointer-events-auto', right: 'pointer-events-auto' }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-0.5">
        <Logo class="h-8 w-auto shrink-0" />
        <span class="text-xl font-bold text-highlighted">Chat</span>
      </NuxtLink>
    </template>

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-plus"
        to="/"
        class="lg:hidden"
      />
      <CommandPalette />
      <UserMenu v-if="loggedIn" />
      <UButton
        v-else
        label="Login with GitHub"
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        class="w-full"
        @click="openInPopup('/auth/github')"
      />
    </template>
  </UDashboardNavbar>
</template>
