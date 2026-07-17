'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import { useCustomer } from '@/lib/useCustomer'

const detailCopy = {
  ru: {
    verified: 'Профиль подтвержден', unverified: 'Профиль не подтвержден', positive: 'Плюсы', negative: 'Минусы', complaints: 'Жалобы', resolved: 'решено',
    trustTitle: 'Проверка компании', legalName: 'Юридическое название', regulator: 'Регулятор', license: 'Лицензия', checkedAt: 'Данные актуализированы', registry: 'Проверить в реестре',
    insuranceTitle: 'Страховые характеристики', coverage: 'Максимальное покрытие', deductible: 'Франшиза', support: 'Поддержка 24/7', directBilling: 'Прямая оплата клинике', online: 'Покупка онлайн', apps: 'Приложения', extraCoverage: 'Дополнительное покрытие', yes: 'Да', no: 'Нет', notSpecified: 'Не указано',
    covid: 'COVID-19', sports: 'Активный спорт', baggage: 'Багаж', tripCancellation: 'Отмена поездки',
    subscribe: 'Следить за компанией', unsubscribe: 'Вы подписаны', loginToSubscribe: 'Войдите, чтобы подписаться', compare: 'Сравнить с другими', rankings: 'Компания в рейтингах', place: 'место из', similar: 'Похожие компании', guides: 'Полезные материалы', complaintsTab: 'Жалобы', methodology: 'Как считается рейтинг', methodologyText: 'Оценка формируется только из опубликованных отзывов. Профиль, реклама и партнерские ссылки не повышают позицию. Положительными считаются оценки 4-5, отрицательными — 1-2.',
  },
  en: {
    verified: 'Verified profile', unverified: 'Unverified profile', positive: 'Positive', negative: 'Negative', complaints: 'Complaints', resolved: 'resolved',
    trustTitle: 'Company verification', legalName: 'Legal name', regulator: 'Regulator', license: 'License', checkedAt: 'Data updated', registry: 'Check registry',
    insuranceTitle: 'Insurance details', coverage: 'Maximum coverage', deductible: 'Deductible', support: '24/7 support', directBilling: 'Direct clinic billing', online: 'Buy online', apps: 'Mobile apps', extraCoverage: 'Additional coverage', yes: 'Yes', no: 'No', notSpecified: 'Not specified',
    covid: 'COVID-19', sports: 'Adventure sports', baggage: 'Baggage', tripCancellation: 'Trip cancellation',
    subscribe: 'Follow company', unsubscribe: 'Following', loginToSubscribe: 'Sign in to follow', compare: 'Compare with others', rankings: 'Company rankings', place: 'place of', similar: 'Similar companies', guides: 'Useful guides', complaintsTab: 'Complaints', methodology: 'How the rating works', methodologyText: 'The score is based only on published customer reviews. Profiles, ads, and partner links do not improve rank. Scores 4-5 are positive and 1-2 are negative.',
  },
  es: {
    verified: 'Perfil verificado', unverified: 'Perfil no verificado', positive: 'Positivas', negative: 'Negativas', complaints: 'Quejas', resolved: 'resueltas',
    trustTitle: 'Verificación de la empresa', legalName: 'Nombre legal', regulator: 'Regulador', license: 'Licencia', checkedAt: 'Datos actualizados', registry: 'Consultar registro',
    insuranceTitle: 'Características del seguro', coverage: 'Cobertura máxima', deductible: 'Franquicia', support: 'Atención 24/7', directBilling: 'Pago directo a la clínica', online: 'Compra en línea', apps: 'Aplicaciones', extraCoverage: 'Cobertura adicional', yes: 'Sí', no: 'No', notSpecified: 'No especificado',
    covid: 'COVID-19', sports: 'Deportes de aventura', baggage: 'Equipaje', tripCancellation: 'Cancelación de viaje',
    subscribe: 'Seguir empresa', unsubscribe: 'Siguiendo', loginToSubscribe: 'Inicia sesión para seguir', compare: 'Comparar con otras', rankings: 'Empresa en rankings', place: 'puesto de', similar: 'Empresas similares', guides: 'Guías útiles', complaintsTab: 'Quejas', methodology: 'Cómo funciona el ranking', methodologyText: 'La puntuación se basa únicamente en reseñas publicadas. El perfil, la publicidad y los enlaces de socios no mejoran la posición. Las notas 4-5 son positivas y 1-2 negativas.',
  },
} as const

export function CompanyDetailText({
  companyId,
  slug,
  name,
  logoUrl,
  overallRating,
  reviewCount,
  verified,
  verification,
  dataUpdatedAt,
  uniqueFeature,
  insuranceProfile,
  positiveReviewCount,
  negativeReviewCount,
  complaintCount,
  resolvedComplaintCount,
  website,
  foundedYear,
  city,
  country,
  phone,
  email,
  address,
  insuranceTypes,
  shortDescription,
  description,
  pros,
  cons,
  categoryPositions,
  relatedCompanies,
  articles,
}: {
  companyId: string
  slug: string
  name: string
  logoUrl?: string
  overallRating: number
  reviewCount: number
  verified?: boolean
  verification?: { legalName?: string; regulator?: string; licenseNumber?: string; licenseUrl?: string; verifiedAt?: string }
  dataUpdatedAt?: string
  uniqueFeature?: string
  insuranceProfile?: { coverageLimit?: string; deductible?: string; assistance24h?: boolean; directBilling?: boolean; onlinePurchase?: boolean; mobileApps?: string; supportedLanguages?: string; claimChannels?: string; coverageFeatures?: { covid?: boolean; sports?: boolean; baggage?: boolean; tripCancellation?: boolean } }
  positiveReviewCount: number
  negativeReviewCount: number
  complaintCount: number
  resolvedComplaintCount: number
  website?: string
  foundedYear?: number
  city?: string
  country?: string
  phone?: string
  email?: string
  address?: string
  insuranceTypes: { slug: string; title: string }[]
  shortDescription?: string
  description?: string
  pros: string[]
  cons: string[]
  categoryPositions: { slug: string; title: string; position: number; total: number }[]
  relatedCompanies: { slug: string; name: string; logoUrl?: string; rating: number }[]
  articles: { slug: string; title: string; excerpt?: string }[]
}) {
  const { t, locale } = useLanguage()
  const { customer } = useCustomer()
  const [subscriptionOverride, setSubscriptionOverride] = useState<boolean | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const text = detailCopy[locale]
  const isSubscribed = subscriptionOverride ?? customer?.subscriptions?.includes(companyId) ?? false
  const dateLocale = locale === 'ru' ? 'ru-RU' : locale === 'es' ? 'es-ES' : 'en-US'
  const updatedLabel = dataUpdatedAt
    ? new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium' }).format(new Date(dataUpdatedAt))
    : text.notSpecified
  const coverageFeatures = insuranceProfile?.coverageFeatures
    ? (['covid', 'sports', 'baggage', 'tripCancellation'] as const).filter((key) => insuranceProfile.coverageFeatures?.[key])
    : []
  const hasInsuranceProfileData = Boolean(
    insuranceProfile?.coverageLimit ||
    insuranceProfile?.deductible ||
    insuranceProfile?.assistance24h ||
    insuranceProfile?.directBilling ||
    insuranceProfile?.onlinePurchase ||
    (insuranceProfile?.mobileApps && insuranceProfile.mobileApps !== 'none') ||
    insuranceProfile?.supportedLanguages ||
    insuranceProfile?.claimChannels ||
    coverageFeatures.length > 0,
  )
  const booleanDetail = (value?: boolean) =>
    hasInsuranceProfileData ? (value ? text.yes : text.no) : text.notSpecified

  async function toggleSubscription() {
    if (!customer) {
      window.location.href = '/login'
      return
    }
    setSubscriptionLoading(true)
    try {
      const response = await fetch('/api/company-subscription', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      })
      if (response.ok) {
        const result = await response.json()
        setSubscriptionOverride(result.subscribed === true)
      }
    } finally {
      setSubscriptionLoading(false)
    }
  }
  const spec: Array<[string, string]> = [
    [t.companyDetail.foundedYear, foundedYear ? String(foundedYear) : t.portal.detail.notSpecified],
    [t.companyDetail.country, country ? countryName(country, locale) : t.portal.detail.notSpecified],
    [t.companyDetail.city, city || t.portal.detail.notSpecified],
    [t.companyDetail.phone, phone || t.portal.detail.notSpecified],
    [t.companyDetail.email, email || t.portal.detail.notSpecified],
    [t.companyDetail.address, address || t.portal.detail.notSpecified],
  ]

  return (
    <div>
      <section className="border-b border-gray-200 bg-white py-8 md:py-12">
        <div className="container-page">
          <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.portal.detail.ratingsBreadcrumb, href: '/companies' }, { label: name }]} />
          <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_280px] lg:items-start">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="relative h-24 w-40 shrink-0 overflow-hidden border border-gray-200 bg-white"><Image src={logoUrl || '/placeholders/logo-placeholder.svg'} alt={name} fill className="object-contain p-3" /></div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3"><h1 className="text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">{name}</h1><span className={`px-3 py-1 text-xs font-bold ${verified ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{verified ? text.verified : text.unverified}</span></div>
                <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600">{shortDescription || t.companyDetail.noDescription}</p>
                {uniqueFeature && <p className="mt-3 border-l-4 border-brand pl-4 text-sm font-bold text-brand-dark">{uniqueFeature}</p>}
                <div className="mt-5 flex flex-wrap gap-2">{insuranceTypes.map((type) => <Link key={type.slug} href="/companies#company-filter-panel" className="border-b border-dotted border-[#579c9e] text-sm text-[#579c9e]">{insuranceTypeLabel(t, type)}</Link>)}</div>
              </div>
            </div>
            <div className="border border-gray-200 p-5">
              <div className="flex items-end justify-between"><span className="text-sm text-gray-500">{t.portal.detail.companyRating}</span><strong className="text-4xl">{overallRating.toFixed(1)}</strong></div>
              <div className="mt-3"><RatingStars value={overallRating} size="md" /></div>
              <Link href={`/companies/${slug}/reviews`} className="dotted-link mt-4 inline-block text-sm font-semibold">{reviewCount} {t.portal.detail.customerReviews}</Link>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 text-center text-[11px] leading-tight"><div><strong className="block text-base text-emerald-700">+{positiveReviewCount}</strong>{text.positive}</div><div><strong className="block text-base text-rose-700">-{negativeReviewCount}</strong>{text.negative}</div><div><strong className="block text-base">{complaintCount}</strong>{text.complaints}</div></div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-px bg-gray-200">
            <a href="#overview" className="bg-brand px-5 py-3 text-sm font-bold text-white">{t.portal.detail.overview}</a>
            <Link href={`/companies/${slug}/reviews`} className="bg-[#f6f7f9] px-5 py-3 text-sm font-bold hover:bg-white">{t.portal.detail.reviews}</Link>
            <Link href={`/companies/${slug}/complaints`} className="bg-[#f6f7f9] px-5 py-3 text-sm font-bold hover:bg-white">{text.complaintsTab}</Link>
            <a href="#details" className="bg-[#f6f7f9] px-5 py-3 text-sm font-bold hover:bg-white">{t.portal.detail.specifications}</a>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <section id="overview" className="border border-gray-200 p-6 md:p-8">
              <p className="section-kicker">{t.portal.detail.independentReview}</p>
              <h2 className="mt-2 text-3xl font-extrabold">{t.portal.detail.aboutCompanyPrefix} {name}</h2>
              <div className="mt-6 space-y-4 leading-7 text-gray-600">{description ? <p className="whitespace-pre-line">{description}</p> : <p>{shortDescription || t.companyDetail.noDescription}</p>}</div>
            </section>

            {(pros.length > 0 || cons.length > 0) && (
              <section className="grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2">
                <div className="bg-white p-6"><h3 className="text-lg font-extrabold text-emerald-700">{t.portal.detail.advantages}</h3>{pros.length > 0 ? <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">{pros.map((item) => <li key={item} className="border-l-2 border-emerald-400 pl-3">{item}</li>)}</ul> : <p className="mt-4 text-sm text-gray-400">{t.portal.detail.emptyList}</p>}</div>
                <div className="bg-white p-6"><h3 className="text-lg font-extrabold text-rose-700">{t.portal.detail.disadvantages}</h3>{cons.length > 0 ? <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">{cons.map((item) => <li key={item} className="border-l-2 border-rose-400 pl-3">{item}</li>)}</ul> : <p className="mt-4 text-sm text-gray-400">{t.portal.detail.emptyList}</p>}</div>
              </section>
            )}

            <section className="border border-gray-200 bg-white p-6 md:p-8">
              <p className="section-kicker">Trusty facts</p>
              <h2 className="mt-2 text-2xl font-extrabold">{text.insuranceTitle}</h2>
              <dl className="mt-6 grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {[
                  [text.coverage, insuranceProfile?.coverageLimit || text.notSpecified],
                  [text.deductible, insuranceProfile?.deductible || text.notSpecified],
                  [text.support, booleanDetail(insuranceProfile?.assistance24h)],
                  [text.directBilling, booleanDetail(insuranceProfile?.directBilling)],
                  [text.online, booleanDetail(insuranceProfile?.onlinePurchase)],
                  [text.apps, !hasInsuranceProfileData ? text.notSpecified : insuranceProfile?.mobileApps && insuranceProfile.mobileApps !== 'none' ? insuranceProfile.mobileApps.toUpperCase().replace('BOTH', 'iOS / Android') : text.no],
                ].map(([label, value]) => <div key={label} className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</dt><dd className="mt-2 font-bold">{value}</dd></div>)}
              </dl>
              {coverageFeatures.length > 0 && <div className="mt-5"><h3 className="text-sm font-extrabold">{text.extraCoverage}</h3><div className="mt-3 flex flex-wrap gap-2">{coverageFeatures.map((feature) => <span key={feature} className="bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">{text[feature]}</span>)}</div></div>}
            </section>

            {categoryPositions.length > 0 && <section className="border border-gray-200 bg-white p-6 md:p-8"><h2 className="text-2xl font-extrabold">{text.rankings}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{categoryPositions.map((item) => <Link key={item.slug} href="/companies#company-filter-panel" className="flex items-center justify-between border border-gray-200 p-4 hover:border-brand"><span className="font-bold">{insuranceTypeLabel(t, item)}</span><strong className="text-brand">{item.position} {text.place} {item.total}</strong></Link>)}</div></section>}

            <section className="surface-section border border-gray-200 p-6 md:p-8"><h2 className="text-2xl font-extrabold">{text.methodology}</h2><p className="mt-3 leading-7 text-gray-600">{text.methodologyText}</p></section>

            <section className="surface-section border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-extrabold">{t.portal.detail.experiencePrefix} {name}?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">{t.portal.detail.experienceText}</p>
              <Link href={`/add-review?company=${slug}`} className="btn-primary mt-6">{t.company.leaveReview}</Link>
            </section>

            {relatedCompanies.length > 0 && <section><h2 className="text-2xl font-extrabold">{text.similar}</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{relatedCompanies.map((company) => <Link key={company.slug} href={`/companies/${company.slug}`} className="border border-gray-200 bg-white p-4 transition-colors hover:border-brand"><div className="relative h-14 w-full"><Image src={company.logoUrl || '/placeholders/logo-placeholder.svg'} alt={company.name} fill className="object-contain" /></div><h3 className="mt-4 font-extrabold">{company.name}</h3><div className="mt-2 flex items-center gap-2"><strong>{company.rating.toFixed(1)}</strong><RatingStars value={company.rating} size="sm" /></div></Link>)}</div></section>}

            {articles.length > 0 && <section><div className="flex items-end justify-between gap-4"><h2 className="text-2xl font-extrabold">{text.guides}</h2><Link href="/articles" className="dotted-link text-sm">{t.nav.articles}</Link></div><div className="mt-5 grid gap-4 sm:grid-cols-3">{articles.map((article) => <Link key={article.slug} href={`/articles/${article.slug}`} className="border border-gray-200 bg-white p-4 hover:border-brand"><h3 className="font-extrabold leading-6">{article.title}</h3>{article.excerpt && <p className="mt-2 line-clamp-3 text-sm text-gray-500">{article.excerpt}</p>}</Link>)}</div></section>}
          </div>

          <aside id="details" className="h-fit border border-gray-200 lg:sticky lg:top-5">
            <div className="bg-brand p-5 text-white"><div className="text-xs font-bold uppercase tracking-wider text-white/60">{t.portal.detail.companyCard}</div><h2 className="mt-2 text-xl font-extrabold">{t.portal.detail.keyDetails}</h2></div>
            <dl className="divide-y divide-gray-100 px-5 text-sm">{spec.map(([label, value]) => <div key={label} className="py-4"><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</dt><dd className="mt-1 break-words font-semibold">{value}</dd></div>)}</dl>
            <div className="border-t border-gray-200 p-5"><h3 className="font-extrabold">{text.trustTitle}</h3><dl className="mt-4 space-y-3 text-sm">{verification?.legalName && <div><dt className="text-gray-400">{text.legalName}</dt><dd className="font-semibold">{verification.legalName}</dd></div>}{verification?.regulator && <div><dt className="text-gray-400">{text.regulator}</dt><dd className="font-semibold">{verification.regulator}</dd></div>}{verification?.licenseNumber && <div><dt className="text-gray-400">{text.license}</dt><dd className="font-semibold">{verification.licenseNumber}</dd></div>}<div><dt className="text-gray-400">{text.checkedAt}</dt><dd className="font-semibold">{updatedLabel}</dd></div></dl>{verification?.licenseUrl && <a href={verification.licenseUrl} target="_blank" rel="noopener noreferrer nofollow" className="dotted-link mt-4 inline-block text-sm">{text.registry}</a>}</div>
            <div className="space-y-3 border-t border-gray-200 p-5">{website && <a href={website} target="_blank" rel="noopener noreferrer nofollow" className="btn-primary w-full">{t.company.visitSite}</a>}<Link href={`/companies/${slug}/reviews`} className="btn-secondary w-full">{t.company.readReviews}</Link><Link href={`/companies/${slug}/complaints`} className="btn-secondary w-full">{text.complaints}: {complaintCount} ({resolvedComplaintCount} {text.resolved})</Link><button type="button" onClick={toggleSubscription} disabled={subscriptionLoading} className="btn-secondary w-full disabled:opacity-60">{customer ? isSubscribed ? text.unsubscribe : text.subscribe : text.loginToSubscribe}</button><Link href="/companies#comparison" className="btn-secondary w-full">{text.compare}</Link></div>
          </aside>
        </div>
      </section>
    </div>
  )
}
