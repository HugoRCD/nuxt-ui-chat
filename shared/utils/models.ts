import type { SelectMenuItem } from '@nuxt/ui'

export const MODELS = [
  {
    label: 'GPT-4.1 Mini',
    icon: 'i-simple-icons:openai',
    company: 'OpenAI',
    value: 'openai/gpt-4.1-mini'
  },
  {
    label: 'GPT-4.1 Nano',
    icon: 'i-simple-icons:openai',
    company: 'OpenAI',
    value: 'openai/gpt-4.1-nano'
  },
  {
    label: 'Gemini 2.0 Flash',
    icon: 'i-simple-icons:google',
    company: 'Google',
    value: 'google/gemini-2.0-flash'
  },
  {
    label: 'Gemini 2.5 Flash',
    icon: 'i-simple-icons:google',
    company: 'Google',
    value: 'google/gemini-2.5-flash',
    reasoning: true
  }
] satisfies SelectMenuItem[]

export function isReasoningModel(model: string) {
  return MODELS.find(m => m.value === model)?.reasoning
}
