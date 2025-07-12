import type { SelectMenuItem } from '@nuxt/ui'

export function useLLM() {
  const models = [
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

  const model = useCookie<
  {
    label: string
    icon: string
    company: string
    value: string
    reasoning?: boolean
  }>('llm-model', { default: () => {
    return {
      label: 'GPT-4.1 Nano',
      icon: 'i-simple-icons:openai',
      company: 'OpenAI',
      value: 'openai/gpt-4.1-nano'
    }
  } })

  return {
    models,
    model
  }
}
