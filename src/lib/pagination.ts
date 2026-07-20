export function boundedPage(value: unknown, max = 10_000) {
  const page = Number(value)
  if (!Number.isInteger(page) || page < 1) return 1
  return Math.min(page, max)
}

export function paginationMeta(page: number, totalPages: number) {
  const safeTotalPages = Math.max(1, totalPages)
  return {
    page: Math.min(Math.max(1, page), safeTotalPages),
    totalPages: safeTotalPages,
  }
}
