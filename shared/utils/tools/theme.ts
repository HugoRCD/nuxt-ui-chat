import type { ToolUIPart } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'

export const themeInputSchema = z.object({
  action: z.enum(['set', 'toggle']).describe('Set a specific theme or toggle the current one'),
  mode: z.enum(['light', 'dark']).optional().describe('Desired theme when action is set')
})

export type ThemeInput = z.infer<typeof themeInputSchema>

export const themeOutputSchema = z.object({
  mode: z.enum(['light', 'dark']),
  message: z.string()
})

export type ThemeOutput = z.infer<typeof themeOutputSchema>
export type ThemeToolUIPart = ToolUIPart & { output: ThemeOutput }

export const themeTool = tool({
  description: 'Change the application theme (light/dark). Use when the user asks about appearance, dark mode, or light mode.',
  inputSchema: themeInputSchema,
  execute: async ({ action, mode }) => {
    // Server cannot change client theme directly. We only return a UI instruction
    // that the client component will act on (proactive action button).
    if (action === 'set') {
      if (!mode) {
        throw new Error('Mode must be provided when action is "set"')
      }
      return {
        mode,
        message: mode === 'dark' ? 'Enable dark mode' : 'Enable light mode'
      }
    }

    // For toggle, we default to suggesting dark mode (LLM should prefer `set` with explicit mode)
    return {
      mode: 'dark',
      message: 'Toggle theme'
    }
  }
})
