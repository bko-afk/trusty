import 'server-only'

import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DEFAULT_LOCALE, isLocale, locales, type Locale } from './dictionary'
import { localizePath } from './routing'

export const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  es: 'es_ES',
}

export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get('x-trusty-locale')
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export async function getRequestPathname(): Promise<string> {
  return (await headers()).get('x-trusty-pathname') || '/'
}

export function localizedAlternates(
  pathname: string,
  locale: Locale,
  availableLocales: Locale[] = locales,
): Metadata['alternates'] {
  const defaultLocale = availableLocales.includes(DEFAULT_LOCALE)
    ? DEFAULT_LOCALE
    : availableLocales[0] || locale
  const languages = Object.fromEntries(
    availableLocales.map((availableLocale) => [availableLocale, localizePath(pathname, availableLocale)]),
  )

  return {
    canonical: localizePath(pathname, locale),
    languages: { ...languages, 'x-default': localizePath(pathname, defaultLocale) },
  }
}

export function localizedOpenGraph(locale: Locale) {
  return {
    locale: openGraphLocales[locale],
    alternateLocale: locales
      .filter((availableLocale) => availableLocale !== locale)
      .map((availableLocale) => openGraphLocales[availableLocale]),
  }
}

const pageSeo = {
  en: {
    companies: ['Insurance Company Ratings', 'Compare travel and medical insurance companies by customer reviews, ratings, countries, and policy types.'],
    articles: ['Insurance Guides and Articles', 'Practical guides to travel and medical insurance, choosing a policy, and handling an insurance claim.'],
    addReview: ['Write an Insurance Company Review', 'Share your experience of buying a policy, contacting support, or handling an insurance claim.'],
    addComplaint: ['File an Insurance Company Complaint', 'Describe your issue with an insurance company and submit it to Trusty for moderation.'],
    addCompany: ['Suggest an Insurance Company', 'Suggest an insurance company for review and inclusion in the Trusty directory.'],
    login: ['Log in', 'Log in to manage your Trusty submissions and followed insurance companies.'],
    register: ['Create an account', 'Create a Trusty account to track reviews, complaints, and insurance companies.'],
    search: ['Search Insurance Companies', 'Search the Trusty insurance company directory.'],
    account: ['My account', 'Manage your Trusty account and submissions.'],
  },
  ru: {
    companies: ['Рейтинг страховых компаний', 'Сравнивайте туристические и медицинские страховые компании по отзывам, рейтингу, странам и видам полисов.'],
    articles: ['Статьи и гиды о страховании', 'Практические материалы о туристическом и медицинском страховании, выборе полиса и страховых случаях.'],
    addReview: ['Оставить отзыв о страховой компании', 'Расскажите о покупке полиса, работе поддержки или урегулировании страхового случая.'],
    addComplaint: ['Подать жалобу на страховую компанию', 'Опишите проблему со страховой компанией и отправьте жалобу на модерацию Trusty.'],
    addCompany: ['Добавить страховую компанию', 'Предложите страховую компанию для проверки и добавления в каталог Trusty.'],
    login: ['Вход', 'Войдите, чтобы управлять своими публикациями и подписками на Trusty.'],
    register: ['Создать аккаунт', 'Создайте аккаунт Trusty, чтобы отслеживать отзывы, жалобы и компании.'],
    search: ['Поиск страховых компаний', 'Поиск по каталогу страховых компаний Trusty.'],
    account: ['Мой кабинет', 'Управляйте аккаунтом и своими публикациями на Trusty.'],
  },
  es: {
    companies: ['Ranking de compañías de seguros', 'Compara aseguradoras de viaje y salud por reseñas, calificación, países y tipos de póliza.'],
    articles: ['Guías y artículos de seguros', 'Guías prácticas sobre seguros de viaje y salud, elección de pólizas y gestión de siniestros.'],
    addReview: ['Escribir una reseña de una aseguradora', 'Comparte tu experiencia con la compra de una póliza, la atención y la gestión de un siniestro.'],
    addComplaint: ['Presentar una queja sobre una aseguradora', 'Describe tu problema con una aseguradora y envíalo a moderación en Trusty.'],
    addCompany: ['Sugerir una aseguradora', 'Sugiere una aseguradora para su revisión e inclusión en el catálogo de Trusty.'],
    login: ['Iniciar sesión', 'Inicia sesión para gestionar tus publicaciones y empresas seguidas en Trusty.'],
    register: ['Crear una cuenta', 'Crea una cuenta de Trusty para seguir reseñas, quejas y aseguradoras.'],
    search: ['Buscar compañías de seguros', 'Busca en el catálogo de compañías de seguros de Trusty.'],
    account: ['Mi cuenta', 'Gestiona tu cuenta y tus publicaciones en Trusty.'],
  },
} as const

export type SeoPage = keyof typeof pageSeo.en

export async function localizedPageMetadata(
  page: SeoPage,
  pathname: string,
  options: { noIndex?: boolean } = {},
): Promise<Metadata> {
  const locale = await getRequestLocale()
  const [title, description] = pageSeo[locale][page]

  return {
    title,
    description,
    alternates: localizedAlternates(pathname, locale),
    openGraph: {
      ...localizedOpenGraph(locale),
      url: localizePath(pathname, locale),
      title,
      description,
    },
    robots: options.noIndex ? { index: false, follow: false, nocache: true } : undefined,
  }
}

export const rootSeoCopy = {
  en: {
    title: 'Trusty — Travel Insurance Reviews and Ratings',
    description: 'Compare travel and medical insurance companies using verified customer reviews, independent ratings, and practical insurance guides.',
    keywords: ['travel insurance companies', 'travel insurance reviews', 'medical insurance', 'insurance company ratings', 'travel insurance complaints'],
  },
  ru: {
    title: 'Trusty — отзывы и рейтинги страховых компаний',
    description: 'Сравнивайте туристические и медицинские страховые компании по проверенным отзывам, независимому рейтингу и практическим материалам.',
    keywords: ['туристическая страховка', 'отзывы о страховых компаниях', 'медицинская страховка', 'рейтинг страховых компаний', 'жалобы на страховые компании'],
  },
  es: {
    title: 'Trusty — reseñas y rankings de seguros de viaje',
    description: 'Compara compañías de seguros de viaje y salud mediante reseñas verificadas, rankings independientes y guías prácticas.',
    keywords: ['seguros de viaje', 'reseñas de aseguradoras', 'seguro médico', 'ranking de aseguradoras', 'quejas de seguros'],
  },
} as const
