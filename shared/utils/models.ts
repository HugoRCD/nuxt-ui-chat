import type { SelectMenuItem } from '@nuxt/ui'

export const MODELS = [
  {
    label: 'GPT-5 Mini',
    icon: 'i-simple-icons:openai',
    company: 'OpenAI',
    value: 'openai/gpt-5-mini'
  },
  {
    label: 'GPT-5 Nano',
    icon: 'i-simple-icons:openai',
    company: 'OpenAI',
    value: 'openai/gpt-5-nano'
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
