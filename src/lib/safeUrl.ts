export function safeHttpUrl(value: unknown, maxLength = 500) {
  if (typeof value !== 'string') return undefined
  const input = value.trim()
  if (!input || input.length > maxLength) return undefined

  try {
    const url = new URL(input)
    if (!['http:', 'https:'].includes(url.protocol)) return undefined
    if (url.username || url.password) return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

export function validateHttpUrl(value: unknown) {
  return !value || safeHttpUrl(value)
    ? true
    : 'Введите полный безопасный URL, начинающийся с https:// или http://'
}
