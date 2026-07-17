'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SearchBox } from '@/components/SearchBox'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import { companyLogoUrl } from '@/lib/companyLogo'

type Props = {
  companies: any[]
  popularCompanies: any[]
  newestCompanies: any[]
  latestReviews: any[]
}

const INITIAL_VISIBLE = 6

export function HomeText({ companies, popularCompanies, newestCompanies, latestReviews }: Props) {
  const { t } = useLanguage()
  const [showAll, setShowAll] = useState(false)
  const visibleCompanies = showAll ? companies : companies.slice(0, INITIAL_VISIBLE)

  return (
    <div>
      <section className="overflow-hidden bg-brand pb-12 pt-10 text-white md:bg-white md:pb-20 md:pt-16 md:text-brand-dark">
        <div className="container-page">
          <div className="max-w-4xl">
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-[44px] md:text-[#071b45]">
              Поиск информации и отзывов о страховых компаниях
            </h1>
          </div>

          <div className="mt-10 max-w-6xl">
            <SearchBox size="large" popularCompanies={popularCompanies} />
          </div>

          {popularCompanies.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-base">
              <span className="text-white/65 md:text-gray-400">Популярно:</span>
              {popularCompanies.map((company: any) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="border-b border-dotted border-current text-white/85 transition-colors hover:text-white md:text-[#579c9e] md:hover:text-brand"
                >
                  {company.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="surface-section py-12 md:py-16">
        <div className="container-page">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Сервисы</p>
              <h2 className="section-title mt-2">Помогаем выбрать страховку</h2>
            </div>
            <Link href="/companies" className="dotted-link hidden text-sm font-semibold sm:inline">Открыть рейтинг</Link>
          </div>

          <div className="grid gap-px overflow-hidden border border-gray-200 bg-gray-200 md:grid-cols-3">
            <Link href="/add-review" className="group min-h-48 bg-white p-7 transition-colors hover:bg-[#fbf9ff]">
              <span className="text-xs font-bold text-brand">01</span>
              <h3 className="mt-8 text-2xl font-bold">Добавить отзыв</h3>
              <p className="mt-3 max-w-xs leading-6 text-gray-500">Расскажите о выплате, поддержке и условиях полиса.</p>
              <span className="dotted-link mt-6 inline-block text-sm font-semibold">Подробнее</span>
            </Link>
            <Link href="/companies" className="group min-h-48 bg-white p-7 transition-colors hover:bg-[#fbf9ff]">
              <span className="text-xs font-bold text-brand">02</span>
              <h3 className="mt-8 text-2xl font-bold">Сравнить компании</h3>
              <p className="mt-3 max-w-xs leading-6 text-gray-500">Фильтруйте страховщиков по типу полиса, стране и рейтингу.</p>
              <span className="dotted-link mt-6 inline-block text-sm font-semibold">К каталогу</span>
            </Link>
            <a href="#methodology" className="group min-h-48 bg-white p-7 transition-colors hover:bg-[#fbf9ff]">
              <span className="text-xs font-bold text-brand">03</span>
              <h3 className="mt-8 text-2xl font-bold">Понять рейтинг</h3>
              <p className="mt-3 max-w-xs leading-6 text-gray-500">Показываем, из каких оценок складывается итоговый балл.</p>
              <span className="dotted-link mt-6 inline-block text-sm font-semibold">Как это работает</span>
            </a>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Популярные категории</p>
            <h2 className="section-title mt-2">Выберите тип страхования</h2>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-lg">
            <Link href="/companies?type=travel" className="dotted-link">Туристическая страховка</Link>
            <Link href="/companies?type=medical" className="dotted-link">Медицинская страховка</Link>
            <Link href="/companies" className="dotted-link">Все компании</Link>
          </div>
        </div>

        <div className="mt-10 border-y border-gray-200">
          <div className="hidden grid-cols-[70px_1.8fr_0.8fr_0.7fr] gap-5 border-b border-gray-200 px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-400 md:grid">
            <span>Место</span><span>Компания</span><span>Отзывы</span><span>Рейтинг</span>
          </div>
          {visibleCompanies.map((company: any, index: number) => (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              className="grid gap-4 border-b border-gray-100 px-4 py-5 transition-colors last:border-0 hover:bg-gray-50 md:grid-cols-[70px_1.8fr_0.8fr_0.7fr] md:items-center md:gap-5 md:px-5"
            >
              <div className="text-sm font-bold text-brand md:text-lg">№ {index + 1}</div>
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-gray-100 bg-white">
                  <Image src={companyLogoUrl(company.logoFile) || '/placeholders/logo-placeholder.svg'} alt={company.name} fill className="object-contain p-1.5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-lg font-bold">{company.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#579c9e]">
                    {(company.insuranceTypes || []).map((it: any) => <span key={it.id || it.slug}>{insuranceTypeLabel(t, it)}</span>)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500"><strong className="text-brand-dark">{company.reviewCount || 0}</strong> отзывов</div>
              <div className="flex items-center gap-3"><span className="text-2xl font-extrabold">{Number(company.overallRating || 0).toFixed(1)}</span><RatingStars value={company.overallRating || 0} size="sm" /></div>
            </Link>
          ))}
        </div>
        {!showAll && companies.length > INITIAL_VISIBLE && (
          <div className="mt-8 text-center"><button type="button" onClick={() => setShowAll(true)} className="btn-secondary">Показать ещё</button></div>
        )}
      </section>

      {latestReviews.length > 0 && (
        <section className="surface-section py-14 md:py-20">
          <div className="container-page">
            <p className="section-kicker">Опыт клиентов</p>
            <h2 className="section-title mt-2">Последние отзывы</h2>
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latestReviews.map((review: any) => {
                const company = typeof review.company === 'object' ? review.company : null
                return (
                  <Link key={review.id} href={company?.slug ? `/companies/${company.slug}/reviews` : '/companies'} className="content-auto flex min-h-64 flex-col border border-gray-200 bg-white p-6 transition-transform hover:-translate-y-1">
                    <div className="flex items-center justify-between gap-3"><span className="font-bold">{review.authorName}</span><RatingStars value={review.rating} size="sm" /></div>
                    <div className="mt-3 text-xs font-bold uppercase tracking-wider text-[#579c9e]">{company?.name}</div>
                    <h3 className="mt-4 text-lg font-bold leading-snug">{review.title}</h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">{review.body}</p>
                    <span className="dotted-link mt-auto pt-5 text-sm font-semibold">Читать отзыв</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section id="methodology" className="container-page py-14 md:py-20">
        <div className="grid overflow-hidden border border-gray-200 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative min-h-[340px] bg-[#faf7f2] lg:min-h-[520px]">
            <Image src="/images/trusty-insurance-rating.png" alt="Иллюстрация выбора туристической страховки" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="section-kicker">Методология Trusty</p>
            <h2 className="section-title mt-3">Рейтинг строится на реальном клиентском опыте</h2>
            <p className="mt-6 leading-7 text-gray-600">Мы учитываем опубликованные отзывы и оценки по четырём критериям: покрытие, цена полиса, выплаты и поддержка. Непроверенные обещания компаний не повышают позицию в рейтинге.</p>
            <div className="mt-8 grid grid-cols-2 gap-px bg-gray-200">
              <div className="bg-white p-4"><strong className="block text-2xl text-brand">4</strong><span className="text-sm text-gray-500">критерия оценки</span></div>
              <div className="bg-white p-4"><strong className="block text-2xl text-brand">100%</strong><span className="text-sm text-gray-500">открытая методика</span></div>
            </div>
            <Link href="/companies" className="btn-primary mt-8 self-start">Смотреть рейтинг</Link>
          </div>
        </div>
      </section>

      {newestCompanies.length > 0 && (
        <section className="container-page pb-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold">Новые компании</h2><Link href="/companies" className="dotted-link text-sm">Весь каталог</Link></div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-3">
            {newestCompanies.map((company: any) => (
              <Link key={company.id} href={`/companies/${company.slug}`} className="flex min-w-64 items-center gap-4 border border-gray-200 p-4 hover:border-brand">
                <div className="relative h-12 w-12 shrink-0"><Image src={companyLogoUrl(company.logoFile) || '/placeholders/logo-placeholder.svg'} alt={company.name} fill className="object-contain" /></div>
                <div className="min-w-0"><div className="truncate font-bold">{company.name}</div><div className="mt-1 text-sm text-gray-400">Рейтинг {Number(company.overallRating || 0).toFixed(1)}</div></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
