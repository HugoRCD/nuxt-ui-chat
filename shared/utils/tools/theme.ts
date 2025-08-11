import type { ToolUIPart } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'

export const themeInputSchema = z.object({})

export type ThemeInput = z.infer<typeof themeInputSchema>

export const themeOutputSchema = z.object({
  message: z.string()
})

export type ThemeOutput = z.infer<typeof themeOutputSchema>
export type ThemeToolUIPart = ToolUIPart & { output: ThemeOutput }

export const themeTool = tool({
  description: 'Widget to change the application theme (light/dark). Use when the user asks about appearance, dark mode, or light mode.',
  inputSchema: themeInputSchema,
  execute: async () => {
    return {
      message: 'Toggle theme'
    }
  }
})
