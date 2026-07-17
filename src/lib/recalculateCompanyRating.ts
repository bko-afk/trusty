import type { Payload, PayloadRequest } from 'payload'

/**
 * Пересчитывает средний рейтинг и количество отзывов компании
 * на основе опубликованных отзывов. Вызывается хуком после
 * создания/изменения/удаления отзыва.
 *
 * Важно: принимает `req` и передаёт его дальше в find/update, чтобы
 * эти запросы выполнялись в той же транзакции, что и вызвавшая их
 * операция над отзывом. Без этого на Postgres возможна взаимная
 * блокировка/зависание (запрос ждёт снятия блокировки, которую держит
 * ещё не завершённая внешняя транзакция) — именно так и было раньше.
 */
export async function recalculateCompanyRating(
  payload: Payload,
  company: string | number | { id: string | number },
  req?: Partial<PayloadRequest>,
) {
  const companyId = typeof company === 'object' ? company.id : company
  if (!companyId) return

  const { docs, totalDocs } = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { company: { equals: companyId } },
        { status: { equals: 'published' } },
        { includeInRating: { equals: true } },
      ],
    },
    limit: 10000,
    depth: 0,
    req,
  })

  const average =
    totalDocs > 0 ? docs.reduce((sum, review) => sum + (review.rating || 0), 0) / totalDocs : 0
  const positiveReviewCount = docs.filter((review) => (review.rating || 0) >= 4).length
  const negativeReviewCount = docs.filter((review) => (review.rating || 0) <= 2).length

  await payload.update({
    collection: 'companies',
    id: companyId,
    data: {
      overallRating: Math.round(average * 10) / 10,
      reviewCount: totalDocs,
      positiveReviewCount,
      negativeReviewCount,
    },
    req,
  })
}
