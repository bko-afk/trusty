export function richTextToPlainText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (typeof node !== 'object') return ''

  const value = node as { root?: unknown; children?: unknown[]; text?: unknown; type?: unknown }
  if (value.root) return richTextToPlainText(value.root)
  if (typeof value.text === 'string') return value.text
  if (!Array.isArray(value.children)) return ''

  return value.children
    .map(richTextToPlainText)
    .join(value.type === 'paragraph' ? '\n\n' : '')
}
