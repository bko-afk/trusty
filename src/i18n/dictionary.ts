export type Locale = 'ru' | 'en' | 'es'

export const locales: Locale[] = ['ru', 'en', 'es']

export const localeLabels: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
  es: 'ES',
}

export const dictionary = {
  ru: {
    brand: 'Trusty',
    nav: {
      catalog: 'Каталог компаний',
      ratings: 'Рейтинги',
      articles: 'Статьи и обзоры',
      addReview: 'Добавить отзыв',
      addCompany: 'Добавить компанию',
    },
    hero: {
      title: 'Отзывы и рейтинги туристических страховых компаний',
      subtitle:
        'Выбирайте туристическую страховку осознанно: реальные отзывы клиентов, рейтинги компаний, сравнение условий перед поездкой.',
    },
    home: {
      bestCompanies: 'Лучшие страховые компании',
      allCompanies: 'Все компании →',
      latestReviews: 'Последние отзывы',
      allReviews: 'Все отзывы →',
      claimCtaTitle: 'Ваша компания есть на сайте?',
      claimCtaText: 'Добавьте туристическую страховую компанию в каталог или предложите правки к существующей карточке.',
      addCompanyBtn: 'Добавить компанию',
      articlesTitle: 'Статьи и обзоры',
      aboutTitle: 'О Trusty',
      aboutText:
        'Trusty — независимый каталог отзывов и рейтингов туристических страховых компаний. Мы помогаем путешественникам сравнивать условия полисов, читать реальные отзывы клиентов и выбирать страховку осознанно, до поездки, а не после проблем в ней.',
    },
    footer: {
      tagline: 'Каталог туристических страховых компаний, рейтинги и реальные отзывы клиентов.',
      forCompanies: 'Компаниям',
      community: 'Сообщество',
      catalog: 'Каталог',
      writeReview: 'Написать отзыв',
      testVersion: 'Тестовая версия.',
    },
    company: {
      readReviews: 'Читать отзывы',
      leaveReview: 'Оставить отзыв',
      visitSite: 'Перейти на сайт',
      verified: 'Подтверждённая компания',
      reviewsCount: 'отзывов',
    },
  },
  en: {
    brand: 'Trusty',
    nav: {
      catalog: 'Company Catalog',
      ratings: 'Ratings',
      articles: 'Articles & Guides',
      addReview: 'Write a Review',
      addCompany: 'Add a Company',
    },
    hero: {
      title: 'Reviews and Ratings of Travel Insurance Companies',
      subtitle:
        'Choose your travel insurance with confidence: real customer reviews, company ratings, and side-by-side comparisons before your trip.',
    },
    home: {
      bestCompanies: 'Top-rated insurance companies',
      allCompanies: 'All companies →',
      latestReviews: 'Latest reviews',
      allReviews: 'All reviews →',
      claimCtaTitle: 'Is your company listed on Trusty?',
      claimCtaText: 'Add your travel insurance company to the catalog or suggest edits to an existing listing.',
      addCompanyBtn: 'Add a company',
      articlesTitle: 'Articles & Guides',
      aboutTitle: 'About Trusty',
      aboutText:
        'Trusty is an independent catalog of reviews and ratings for travel insurance companies. We help travelers compare policy terms, read real customer reviews, and choose coverage with confidence — before the trip, not after something goes wrong.',
    },
    footer: {
      tagline: 'A catalog of travel insurance companies, ratings, and real customer reviews.',
      forCompanies: 'For Companies',
      community: 'Community',
      catalog: 'Catalog',
      writeReview: 'Write a review',
      testVersion: 'Test version.',
    },
    company: {
      readReviews: 'Read reviews',
      leaveReview: 'Leave a review',
      visitSite: 'Visit website',
      verified: 'Verified company',
      reviewsCount: 'reviews',
    },
  },
  es: {
    brand: 'Trusty',
    nav: {
      catalog: 'Catálogo de empresas',
      ratings: 'Clasificaciones',
      articles: 'Artículos y guías',
      addReview: 'Escribir una reseña',
      addCompany: 'Añadir empresa',
    },
    hero: {
      title: 'Reseñas y clasificaciones de seguros de viaje',
      subtitle:
        'Elige tu seguro de viaje con confianza: reseñas reales de clientes, clasificaciones de empresas y comparaciones antes de tu viaje.',
    },
    home: {
      bestCompanies: 'Empresas mejor valoradas',
      allCompanies: 'Todas las empresas →',
      latestReviews: 'Últimas reseñas',
      allReviews: 'Todas las reseñas →',
      claimCtaTitle: '¿Tu empresa está en Trusty?',
      claimCtaText: 'Añade tu empresa de seguros de viaje al catálogo o sugiere cambios a una ficha existente.',
      addCompanyBtn: 'Añadir empresa',
      articlesTitle: 'Artículos y guías',
      aboutTitle: 'Sobre Trusty',
      aboutText:
        'Trusty es un catálogo independiente de reseñas y clasificaciones de empresas de seguros de viaje. Ayudamos a los viajeros a comparar condiciones de las pólizas, leer reseñas reales de clientes y elegir su cobertura con confianza, antes del viaje.',
    },
    footer: {
      tagline: 'Catálogo de empresas de seguros de viaje, clasificaciones y reseñas reales de clientes.',
      forCompanies: 'Para empresas',
      community: 'Comunidad',
      catalog: 'Catálogo',
      writeReview: 'Escribir una reseña',
      testVersion: 'Versión de prueba.',
    },
    company: {
      readReviews: 'Leer reseñas',
      leaveReview: 'Dejar una reseña',
      visitSite: 'Visitar sitio web',
      verified: 'Empresa verificada',
      reviewsCount: 'reseñas',
    },
  },
} as const
