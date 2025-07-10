export function partsToContent(parts: unknown[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parts?.map((part: any) => part?.type === 'text' ? part?.text : '').join('') || ''
}
