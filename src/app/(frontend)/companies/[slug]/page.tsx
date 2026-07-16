import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { CompanyDetailText } from './CompanyDetailText'

export const dynamic = 'force-dynamic'

async function getCompany(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'companies',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0]
}

function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.root) return extractText(node.root)
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join(node.type === 'paragraph' ? '\n\n' : '')
  }
  if (typeof node.text === 'string') return node.text
  return ''
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company: any = await getCompany(slug)
  if (!company) notFound()

  return (
    <CompanyDetailText
      slug={slug}
      name={company.name}
      logoUrl={companyLogoUrl(company.logoFile)}
      overallRating={company.overallRating || 0}
      reviewCount={company.reviewCount || 0}
      verified={company.verified}
      website={company.website}
      foundedYear={company.foundedYear}
      city={company.city}
      country={company.country}
      phone={company.contacts?.phone}
      email={company.contacts?.email}
      address={company.contacts?.address}
      insuranceTypes={(company.insuranceTypes || []).map((it: any) => ({ slug: it.slug, title: it.title }))}
      shortDescription={company.shortDescription}
      description={company.description ? extractText(company.description) : ''}
      pros={(company.pros || []).map((p: any) => p.text)}
      cons={(company.cons || []).map((c: any) => c.text)}
    />
  )
}
