<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()
const { user, clear } = useUserSession()

const items = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: user.value?.name || user.value?.username,
  avatar: {
    src: user.value?.avatar,
    alt: user.value?.name || user.value?.username
  }
}], [{
  label: 'Appearance',
  icon: 'i-lucide-sun-moon',
  children: [{
    label: 'Light',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'light'
    }
  }, {
    label: 'Dark',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        colorMode.preference = 'dark'
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }]
}], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
  target: '_blank'
}, {
  label: 'GitHub repository',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/hugorcd/nuxt-ui-chat',
  target: '_blank'
}, {
  label: 'Upgrade to Pro',
  icon: 'i-lucide-rocket',
  to: 'https://ui.nuxt.com/pro/purchase',
  target: '_blank'
}], [{
  label: 'Log out',
  icon: 'i-lucide-log-out',
  onSelect() {
    clear()
    navigateTo('/')
  }
}]]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        label: collapsed ? undefined : (user?.name || user?.username),
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      :avatar="{
        src: user?.avatar || undefined,
        alt: user?.name || user?.username
      }"
      color="neutral"
      variant="ghost"
      size="md"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
