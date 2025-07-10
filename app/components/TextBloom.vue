<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  textColor?: string
  bloomColor?: string
  bloomIntensity?: number
  class?: string
}>(), {
  label: 'Generating summary...',
  textColor: 'text-muted',
  bloomColor: '#ffffff',
  bloomIntensity: 1.18,
  class: 'font-semibold'
})

const textBloomRef = ref<HTMLElement | null>(null)
const contentHolderRef = ref<HTMLElement | null>(null)
const animatedTextRef = ref<HTMLElement | null>(null)

const rootStyles = computed(() => ({
  '--text-color': props.textColor,
  '--bloom-color': props.bloomColor,
  '--bloom-intensity': props.bloomIntensity
}))

const updateAnimation = (): void => {
  const contentHolder = contentHolderRef.value
  const animatedText = animatedTextRef.value

  if (contentHolder && animatedText) {
    const text = contentHolder.textContent?.trim() || props.label || ''

    animatedText.innerHTML = ''

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span')
      span.className = 'text-bloom-character'

      if (text[i] === ' ') {
        span.innerHTML = '&nbsp;'
      } else {
        span.textContent = text[i] || ''
      }

      span.style.animationDelay = `${i * 0.05}s`
      animatedText.appendChild(span)
    }
  }
}

watch(() => props.label, () => {
  nextTick(updateAnimation)
})

onMounted(updateAnimation)
onUpdated(updateAnimation)
</script>

<template>
  <div
    ref="textBloomRef"
    :style="rootStyles"
    class="text-bloom-container"
    :class="[props.class, props.textColor]"
  >
    <div ref="contentHolderRef" class="hidden">
      <slot>{{ label }}</slot>
    </div>
    <div ref="animatedTextRef" />
  </div>
</template>

<style>
.text-bloom-container {
  perspective: 80px;
  transform-style: preserve-3d;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
}

.text-bloom-character {
  position: relative;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  display: inline-block;
  animation: bloom 2.4s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
  letter-spacing: 0.01em;
  transform-origin: 100% 50%;
  transform-style: preserve-3d;
  will-change: transform, color;
}

@keyframes bloom {
  0% {
    transform: translate3D(0,0,0) scale(1) rotateY(0);
    color: var(--text-color, #46afc8);
    text-shadow: 0 0 0 rgba(0,0,0,0);
  }
  12% {
    transform: translate3D(2px,-1px,2px) scale(var(--bloom-intensity, 1.18)) rotateY(6deg);
    color: var(--bloom-color, #ffffff);
  }
  15% {
    text-shadow: 0 0 1px var(--bloom-color, #ffffff);
  }
  24% {
    transform: translate3D(0,0,0) scale(1) rotateY(0);
    color: var(--text-color, #46afc8);
    opacity: 1;
  }
  36% {
    transform: translate3D(0,0,0) scale(1);
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
</style>
