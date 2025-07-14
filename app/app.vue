<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Nuxt AI Chatbot template'
const description = 'A full-featured, hackable Nuxt AI chatbot template made with Nuxt UI Pro.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://nuxt-ui-chat.hrcd.fr/og.png',
  twitterImage: 'https://nuxt-ui-chat.hrcd.fr/og.png',
  twitterCard: 'summary_large_image'
})

defineShortcuts({
  c: () => {
    navigateTo('/')
  }
})
</script>

<template>
  <UApp :toaster="{ position: 'top-center', expand: false }" :tooltip="{ delayDuration: 0 }">
    <Analytics />
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <UDashboardGroup unit="rem">
      <NuxtPage />
    </UDashboardGroup>
  </UApp>
</template>
