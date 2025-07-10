export function useLLM() {
  const models = [
    'openai/gpt-4.1-nano',
    'openai/gpt-4.1-mini'
  ]
  const model = useCookie<string>('llm-model', { default: () => 'gpt-4.1-nano' })

  return {
    models,
    model
  }
}
