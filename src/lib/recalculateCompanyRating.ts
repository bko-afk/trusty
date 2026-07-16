import type { Payload } from 'payload'

/**
 * Пересчитывает средний рейтинг и количество отзывов компании
 * на основе опубликованных отзывов. Вызывается хуком после
 * создания/изменения/удаления отзыва.
 */
export async function recalculateCompanyRating(
  payload: Payload,
  company: string | number | { id: string | number },
) {
  const companyId = typeof company === 'object' ? company.id : company
  if (!companyId) return

  const { docs, totalDocs } = await payload.find({
    collection: 'reviews',
    where: {
      and: [{ company: { equals: companyId } }, { status: { equals: 'published' } }],
    },
    limit: 0,
    depth: 0,
  })

  const average =
    totalDocs > 0 ? docs.reduce((sum, review) => sum + (review.rating || 0), 0) / totalDocs : 0

  await payload.update({
    collection: 'companies',
    id: companyId,
    data: {
      overallRating: Math.round(average * 10) / 10,
      reviewCount: totalDocs,
    },
  })
}
