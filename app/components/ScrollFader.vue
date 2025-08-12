<script setup lang="ts">
interface Props {
  stop?: string
  blur?: string
  threshold?: number
}

const {
  stop = '25%',
  blur = '1px',
  threshold = 100
} = defineProps<Props>()

const opacity = ref(0)

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  const { scrollTop } = target

  opacity.value = clamp(scrollTop / threshold, 0, 1)
}

// Expose the scroll handler to parent components
defineExpose({
  handleScroll
})
</script>

<template>
  <div
    aria-hidden="true"
    class="fader h-[100px] -mb-[100px] sm:h-[150px] sm:-mb-[150px]"
    data-side="top"
    :style="{
      '--stop': stop,
      '--blur': blur,
      opacity
    }"
  />
</template>

<style scoped>
.fader {
  position: sticky;
  width: 100%;
  pointer-events: none;
  user-select: none;
  backdrop-filter: blur(var(--blur));
  z-index: 10;
}

.fader[data-side="top"] {
  top: 0;
  background: linear-gradient(to top, transparent, var(--ui-bg));
  mask-image: linear-gradient(to bottom, var(--ui-bg) var(--stop), transparent);
}
</style>
