<script setup lang="ts">
import type { ReasoningUIPart } from 'ai'

const props = defineProps<{
  part: ReasoningUIPart
}>()

const open = ref(true)

watch(() => props.part.state, () => {
  if (props.part.state === 'done') {
    open.value = false
  }
})
</script>

<template>
  <UCollapsible v-model:open="open">
    <UButton
      class="px-0 group"
      color="neutral"
      variant="link"
      :loading="part.state !== 'done'"
      trailing-icon="i-lucide-chevron-down"
      loading-icon="i-lucide-loader"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
    >
      <TextGradient v-if="part.state !== 'done'" text="Reasoning..." />
      <span v-else>Reasoning</span>
    </UButton>

    <template #content>
      <div class="text-sm text-muted mt-2">
        {{ part.text }}
      </div>
    </template>
  </UCollapsible>
</template>
