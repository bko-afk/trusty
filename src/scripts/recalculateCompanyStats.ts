import { getPayloadClient } from '@/lib/getPayloadClient'
import { recalculateCompanyComplaints } from '@/lib/recalculateCompanyComplaints'
import { recalculateCompanyRating } from '@/lib/recalculateCompanyRating'

const payload = await getPayloadClient()
const reviews = await payload.find({
  collection: 'reviews',
  pagination: false,
  depth: 0,
  overrideAccess: true,
})

for (const review of reviews.docs) {
  const shouldAffectRating = review.status === 'published'
  if (review.includeInRating !== shouldAffectRating) {
    await payload.update({
      collection: 'reviews',
      id: review.id,
      overrideAccess: true,
      data: { includeInRating: shouldAffectRating },
    })
  }
}

const companies = await payload.find({
  collection: 'companies',
  pagination: false,
  depth: 0,
  overrideAccess: true,
})

for (const company of companies.docs) {
  await recalculateCompanyRating(payload, company.id)
  await recalculateCompanyComplaints(payload, company.id)
}

console.log(`Recalculated review and complaint statistics for ${companies.docs.length} companies.`)
await payload.db.destroy?.()
process.exit(0)
