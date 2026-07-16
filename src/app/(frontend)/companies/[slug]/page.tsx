import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'

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

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company: any = await getCompany(slug)
  if (!company) notFound()

  const spec: Array<[string, string]> = [
    ['Официальный сайт', company.website || '—'],
    ['Год основания', company.foundedYear ? String(company.foundedYear) : '—'],
    ['Город', company.city || '—'],
    ['Телефон', company.contacts?.phone || '—'],
    ['Email', company.contacts?.email || '—'],
    ['Адрес', company.contacts?.address || '—'],
    [
      'Виды страхования',
      (company.insuranceTypes || []).map((t: any) => t.title).join(', ') || '—',
    ],
  ]

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Каталог компаний', href: '/companies' },
          { label: company.name },
        ]}
      />

      <div className="card p-6 flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <Image
            src={company.logo?.url || '/placeholders/logo-placeholder.svg'}
            alt={company.name}
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{company.name}</h1>
            {company.verified && (
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
                Подтверждённая компания
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RatingStars value={company.overallRating || 0} size="lg" />
            <Link href={`/companies/${slug}/reviews`} className="text-brand hover:underline text-sm">
              {company.reviewCount || 0} отзывов
            </Link>
          </div>
          <p className="text-gray-600 mt-3">{company.shortDescription}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-primary"
              >
                Перейти на сайт
              </a>
            )}
            <Link href={`/companies/${slug}/reviews`} className="btn-secondary">
              Читать отзывы
            </Link>
            <Link href={`/add-review?company=${company.slug}`} className="btn-secondary">
              Оставить отзыв
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="card p-6">
            <h2 className="text-lg font-semibold mb-4">О компании</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              {company.description ? (
                <RichTextPreview content={company.description} />
              ) : (
                <p>Описание компании пока не добавлено.</p>
              )}
            </div>
          </section>

          {(company.pros?.length > 0 || company.cons?.length > 0) && (
            <section className="card p-6 grid gap-6 sm:grid-cols-2">
              {company.pros?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-2">Преимущества</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {company.pros.map((p: any, i: number) => (
                      <li key={i}>{p.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {company.cons?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-rose-700 mb-2">Недостатки</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {company.cons.map((c: any, i: number) => (
                      <li key={i}>{c.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="card p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Характеристики компании</h2>
          <dl className="text-sm divide-y divide-gray-100">
            {spec.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2">
                <dt className="text-gray-500">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  )
}

// Простейший рендер lexical-контента без внешних зависимостей,
// достаточно для тестовой версии. Можно заменить на официальный
// @payloadcms/richtext-lexical/react конвертер позже.
function RichTextPreview({ content }: { content: any }) {
  const text = extractText(content)
  return <p className="whitespace-pre-line">{text}</p>
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
