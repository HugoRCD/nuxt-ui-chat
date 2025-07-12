export function useLLM() {
  const model = useCookie<
  {
    label: string
    icon: string
    company: string
    value: string
    reasoning?: boolean
  }>('llm-model', { default: () => MODELS[0]! })

  return {
    models: MODELS,
    model
  }
}
