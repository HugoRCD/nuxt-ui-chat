<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="whitespace-nowrap group/shimmer relative rounded-full text-sm flex items-center justify-center">
    <div class="relative flex items-center justify-center gap-1.5 rounded-full">
      <span class="relative z-10 transition-colors duration-300 text-muted">
        {{ text }}
        <span
          class="absolute inset-0 bg-clip-text bg-inverted text-transparent opacity-0 group-hover/shimmer:opacity-100 group-hover/shimmer:animate-shimmer-once transition-opacity duration-200"
          style="background-image:linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px));background-size:200% 100%;background-position:-50% center"
        >
          {{ text }}
          <span class="text-highlighted"><svg
            width="3"
            height="3"
            viewBox="0 0 4 4"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute right-0 top-[2px] opacity-0 scale-0 group-hover/shimmer:opacity-100 group-hover/shimmer:scale-100 transition-all duration-300 ease-out"
          ><path d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z" fill="currentColor" /></svg><svg
            width="4"
            height="4"
            viewBox="0 0 4 4"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute right-[-5px] top-[6px] opacity-0 scale-0 group-hover/shimmer:opacity-100 group-hover/shimmer:scale-100 transition-all duration-300 ease-out delay-75"
          ><path d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z" fill="currentColor" /></svg>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: 100%
  }

  to {
    background-position: -50%
  }
}

.group\/shimmer:hover .group-hover\/shimmer\:animate-shimmer-once {
  animation: shimmer 1s ease-in-out forwards
}
</style>
