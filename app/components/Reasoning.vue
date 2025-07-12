<script setup lang="ts">
import type { ReasoningUIPart } from 'ai'

const { part } = defineProps<{
  part: ReasoningUIPart
}>()

const open = ref(false)

watch(() => part.state, () => {
  if (part.state === 'streaming') {
    open.value = true
  }
  if (part.state === 'done') {
    open.value = false
  }
}, { immediate: true })

// Parse text into structured segments for safe rendering
const parsedParagraphs = computed(() => {
  if (!part.text) return []

  const paragraphs = part.text.split(/\n\s*\n/)

  return paragraphs.map((paragraph) => {
    const lines = paragraph.split(/\n/)
    return lines.map(line => parseTextSegments(line))
  })
})

// Parse a line of text into segments with formatting
function parseTextSegments(text: string) {
  const segments: Array<{ type: 'text' | 'bold' | 'italic' | 'code' | 'bullet', content: string }> = []

  // Handle bullet points first
  if (text.trim().startsWith('- ')) {
    text = '• ' + text.trim().substring(2)
  }

  const currentText = text

  // Regex patterns for different formatting
  const patterns = [
    { type: 'bold' as const, regex: /\*\*(.*?)\*\*/g },
    { type: 'italic' as const, regex: /\*(.*?)\*/g },
    { type: 'code' as const, regex: /`(.*?)`/g }
  ]

  // Find all matches and their positions
  const matches: Array<{ type: 'bold' | 'italic' | 'code', start: number, end: number, content: string }> = []

  patterns.forEach((pattern) => {
    let match
    while ((match = pattern.regex.exec(currentText)) !== null) {
      if (match[1]) {
        matches.push({
          type: pattern.type,
          start: match.index,
          end: match.index + match[0].length,
          content: match[1]
        })
      }
    }
  })

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start)

  // Build segments
  let lastIndex = 0
  matches.forEach((match) => {
    // Add text before this match
    if (match.start > lastIndex) {
      const textBefore = currentText.substring(lastIndex, match.start)
      if (textBefore) {
        segments.push({ type: 'text', content: textBefore })
      }
    }

    // Add the formatted segment
    segments.push({ type: match.type, content: match.content })
    lastIndex = match.end
  })

  // Add remaining text
  if (lastIndex < currentText.length) {
    const remainingText = currentText.substring(lastIndex)
    if (remainingText) {
      segments.push({ type: 'text', content: remainingText })
    }
  }

  // If no matches, return the whole text as a single segment
  if (segments.length === 0) {
    segments.push({ type: 'text', content: currentText })
  }

  return segments
}
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
      <div class="border-l-2 border-default pl-4 text-sm text-muted mt-2 space-y-2">
        <div
          v-for="(paragraph, paragraphIndex) in parsedParagraphs"
          :key="paragraphIndex"
          class="space-y-1"
        >
          <div
            v-for="(line, lineIndex) in paragraph"
            :key="`${paragraphIndex}-${lineIndex}`"
            class="leading-relaxed"
          >
            <template v-for="(segment, segmentIndex) in line" :key="segmentIndex">
              <strong v-if="segment.type === 'bold'">{{ segment.content }}</strong>
              <em v-else-if="segment.type === 'italic'">{{ segment.content }}</em>
              <code
                v-else-if="segment.type === 'code'"
                class="bg-elevated px-1 py-0.5 rounded text-xs font-mono"
              >{{ segment.content }}</code>
              <span v-else>{{ segment.content }}</span>
            </template>
          </div>
        </div>
      </div>
    </template>
  </UCollapsible>
</template>
