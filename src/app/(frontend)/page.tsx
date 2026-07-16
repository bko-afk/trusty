import Link from 'next/link'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyCard } from '@/components/CompanyCard'
import { SearchBox } from '@/components/SearchBox'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [companies, insuranceTypes, articles] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 8,
      depth: 1,
    }),
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 20 }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
    }),
  ])

  return (
    <div>
      <section className="bg-brand-light/60 py-14">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold max-w-2xl">
            Отзывы и рейтинги страховых компаний
          </h1>
          <p className="text-gray-600 max-w-xl">
            Выбирайте страховую компанию осознанно: реальные отзывы клиентов, рейтинги по ОСАГО,
            КАСКО, ДМС, страхованию жизни и путешествий.
          </p>
          <SearchBox />
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {insuranceTypes.docs.map((type: any) => (
              <Link
                key={type.id}
                href={`/companies?type=${type.slug}`}
                className="rounded-full bg-white border border-gray-200 px-4 py-1.5 text-sm hover:border-brand hover:text-brand"
              >
                {type.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Лучшие страховые компании</h2>
          <Link href="/companies" className="text-sm text-brand hover:underline">
            Все компании →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companies.docs.map((company: any) => (
            <CompanyCard
              key={company.id}
              slug={company.slug}
              name={company.name}
              logoUrl={company.logo?.url}
              rating={company.overallRating || 0}
              reviewCount={company.reviewCount || 0}
              verified={company.verified}
              insuranceTypeLabel={company.insuranceTypes?.[0]?.title}
            />
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="card flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div>
            <h3 className="font-semibold text-lg">Ваша компания есть на сайте?</h3>
            <p className="text-gray-500 text-sm mt-1">
              Добавьте страховую компанию в каталог или предложите правки к существующей карточке.
            </p>
          </div>
          <Link href="/add-company" className="btn-primary shrink-0">
            Добавить компанию
          </Link>
        </div>
      </section>

      {articles.docs.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="text-xl font-semibold mb-5">Статьи и обзоры</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {articles.docs.map((article: any) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="card p-4">
                <div className="font-semibold mb-1">{article.title}</div>
                <p className="text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
