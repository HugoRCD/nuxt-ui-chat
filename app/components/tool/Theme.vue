<script setup lang="ts">
const { state, output } = defineProps<{
  state: ThemeToolUIPart['state']
  output: ThemeToolUIPart['output']
}>()

const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val: boolean) => {
    colorMode.preference = val ? 'dark' : 'light'
  }
})
</script>

<template>
  <div v-if="state === 'output-available' || state === 'input-available'" class="w-[480px] rounded-xl px-5 py-4 bg-muted/50 text-highlighted border border-default/30 shadow">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <UIcon :name="(output?.mode ?? colorMode.value) === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" class="size-5" />
        <div class="text-sm">
          {{ output?.message || 'Switch theme?' }}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted">Light</span>
        <USwitch v-model="isDark" aria-label="Toggle dark mode" />
        <span class="text-xs text-muted">Dark</span>
      </div>
    </div>
  </div>

  <div v-else-if="state === 'output-error'" class="w-[480px] rounded-xl px-5 py-4 bg-error/10 text-error border border-error/30 shadow">
    <div class="text-sm">
      Unable to change theme
    </div>
  </div>
</template>
