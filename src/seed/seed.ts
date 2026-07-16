import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Наполняет базу тестовыми данными для Trusty — каталога отзывов
 * о страховых компаниях (в первую очередь туристических).
 * Идемпотентно: пропускает записи, которые уже существуют по slug,
 * так что скрипт можно безопасно перезапускать.
 *
 * Запуск: npm run seed
 */
async function seed() {
  const payload = await getPayload({ config })

  console.log('Создаю виды страхования...')
  const typeDefs = [
    { title: 'Медицинская страховка', slug: 'medical', shortDescription: 'Покрытие экстренной медицинской помощи', order: 1 },
    { title: 'Туристическая страховка', slug: 'travel', shortDescription: 'Комплексная страховка для путешествий за границу', order: 2 },
    { title: 'ОСАГО', slug: 'osago', shortDescription: 'Обязательное страхование автогражданской ответственности', order: 3 },
    { title: 'КАСКО', slug: 'kasko', shortDescription: 'Добровольное страхование автомобиля', order: 4 },
  ]

  const types: Record<string, any> = {}
  for (const t of typeDefs) {
    const existing = await payload.find({ collection: 'insurance-types', where: { slug: { equals: t.slug } }, limit: 1 })
    types[t.slug] = existing.docs[0] || (await payload.create({ collection: 'insurance-types', data: t }))
  }

  // Реальные, публично известные туристические страховые компании.
  // Указаны только проверяемые публичные факты (название, сайт, страна),
  // без вымышленных характеристик. Отзывы к ним намеренно не добавляются —
  // публиковать выдуманные "отзывы" от имени реальных компаний было бы
  // недобросовестно по отношению к посетителям сайта. Реальные отзывы
  // появятся здесь органически, когда пользователи начнут их оставлять.
  console.log('Добавляю реальные страховые компании...')
  const realCompaniesData = [
    {
      name: 'Auras Insurance',
      slug: 'auras-insurance',
      status: 'published',
      verified: false,
      website: 'https://auras.insure',
      country: 'US',
      insuranceTypes: [types.travel.id, types.medical.id],
      shortDescription: 'Международный сервис туристического медицинского страхования для путешественников любого возраста.',
    },
    {
      name: 'EKTA',
      slug: 'ekta',
      status: 'published',
      verified: false,
      website: 'https://ektatraveling.com',
      country: 'UA',
      insuranceTypes: [types.travel.id],
      shortDescription: 'Страховая компания для путешественников, оформление полисов онлайн, доступна на русском, английском и украинском языках.',
    },
    {
      name: 'World Nomads',
      slug: 'world-nomads',
      status: 'published',
      verified: false,
      website: 'https://www.worldnomads.com',
      foundedYear: 2002,
      country: 'AU',
      insuranceTypes: [types.travel.id],
      shortDescription: 'Одна из наиболее известных в мире марок туристического страхования для самостоятельных путешественников.',
    },
    {
      name: 'Allianz Travel',
      slug: 'allianz-travel',
      status: 'published',
      verified: false,
      website: 'https://www.allianztravelinsurance.com',
      country: 'DE',
      insuranceTypes: [types.travel.id],
      shortDescription: 'Туристическое страхование от Allianz Partners — части международной группы Allianz.',
    },
  ]

  const realCompanies: any[] = []
  for (const c of realCompaniesData) {
    const existing = await payload.find({ collection: 'companies', where: { slug: { equals: c.slug } }, limit: 1 })
    realCompanies.push(existing.docs[0] || (await payload.create({ collection: 'companies', data: c as any })))
  }

  // Вымышленные тестовые компании (для демонстрации отзывов/рейтингов —
  // весь связанный с ними контент полностью синтетический).
  console.log('Добавляю тестовые (вымышленные) компании с демо-отзывами...')
  const demoCompaniesData = [
    {
      name: 'VoyageGuard',
      slug: 'voyageguard',
      status: 'published',
      verified: true,
      website: 'https://example.com/voyageguard',
      foundedYear: 2012,
      city: 'Москва',
      country: 'RU',
      insuranceTypes: [types.travel.id, types.medical.id],
      shortDescription: 'Тестовая компания для демонстрации каталога Trusty (медицинская и туристическая страховка).',
      contacts: { phone: '+7 (900) 000-00-01', email: 'info@example.com', address: 'г. Москва, ул. Примерная, д. 1' },
      pros: [{ text: 'Быстрое оформление полиса онлайн' }, { text: 'Круглосуточная поддержка за границей' }],
      cons: [{ text: 'Ограниченный список партнёрских клиник в отдельных странах' }],
    },
    {
      name: 'SafeTrip Insurance',
      slug: 'safetrip-insurance',
      status: 'published',
      verified: false,
      website: 'https://example.com/safetrip',
      foundedYear: 2016,
      city: 'Санкт-Петербург',
      country: 'RU',
      insuranceTypes: [types.travel.id],
      shortDescription: 'Тестовая компания для демонстрации каталога Trusty (страхование от невыезда и багажа).',
      contacts: { phone: '+7 (900) 000-00-02', email: 'hello@example.com', address: 'г. Санкт-Петербург, пр. Тестовый, д. 5' },
      pros: [{ text: 'Понятные условия возврата при отмене поездки' }],
      cons: [{ text: 'Долгое рассмотрение заявлений на компенсацию багажа' }],
    },
  ]

  const demoCompanies: any[] = []
  for (const c of demoCompaniesData) {
    const existing = await payload.find({ collection: 'companies', where: { slug: { equals: c.slug } }, limit: 1 })
    demoCompanies.push(existing.docs[0] || (await payload.create({ collection: 'companies', data: c as any })))
  }

  console.log('Добавляю демо-отзывы (только к вымышленным компаниям)...')
  const reviewsData = [
    {
      company: demoCompanies[0].id,
      authorName: 'Ирина К.',
      title: 'Оформила страховку за 10 минут перед поездкой в Турцию',
      body: 'Заполнила данные на сайте, оплатила картой, полис пришёл на почту сразу. Пригодилась медицинская помощь на месте — всё оплатили без проблем.',
      rating: 5,
      criteria: { coverage: 5, price: 4, claimsService: 5, support: 5 },
      pros: [{ text: 'Быстрое оформление' }, { text: 'Реальная помощь на месте' }],
      cons: [],
      recommend: true,
      status: 'published',
      helpfulUp: 6,
      helpfulDown: 0,
    },
    {
      company: demoCompanies[0].id,
      authorName: 'Дмитрий П.',
      title: 'Долго рассматривали заявление на компенсацию',
      body: 'Обращался в клинику за границей, полис покрыл лечение, но возврат части расходов ждал почти месяц. Пришлось несколько раз уточнять статус.',
      rating: 3,
      criteria: { coverage: 4, price: 3, claimsService: 2, support: 3 },
      pros: [{ text: 'В итоге компенсацию всё же получил' }],
      cons: [{ text: 'Долгие сроки рассмотрения' }],
      recommend: false,
      status: 'published',
      helpfulUp: 3,
      helpfulDown: 1,
    },
    {
      company: demoCompanies[1].id,
      authorName: 'Анна В.',
      title: 'Понятные условия перед поездкой',
      body: 'Читала договор перед покупкой — всё написано простым языком, без мелкого шрифта. В итоге поездка прошла без страховых случаев, но осадок приятный.',
      rating: 4,
      criteria: { coverage: 4, price: 4, claimsService: 4, support: 4 },
      pros: [{ text: 'Понятные условия' }],
      cons: [],
      recommend: true,
      status: 'published',
      helpfulUp: 2,
      helpfulDown: 0,
    },
  ]

  for (const r of reviewsData) {
    const existingReview = await payload.find({
      collection: 'reviews',
      where: { and: [{ company: { equals: r.company } }, { title: { equals: r.title } }] },
      limit: 1,
    })
    const review = existingReview.docs[0] || (await payload.create({ collection: 'reviews', data: r as any }))
    if (r.rating <= 3 && !existingReview.docs[0]) {
      await payload.create({
        collection: 'review-replies',
        data: {
          review: review.id,
          authorType: 'company',
          authorName: 'Представитель компании',
          body: 'Спасибо за обратную связь, передали ваш случай в отдел контроля качества для проверки сроков рассмотрения заявлений.',
          status: 'published',
        },
      })
    }
  }

  console.log('Создаю статьи...')
  const existingArticle = await payload.find({
    collection: 'articles',
    where: { slug: { equals: 'kak-vybrat-turisticheskuyu-strahovku' } },
    limit: 1,
  })
  if (!existingArticle.docs[0]) {
    await payload.create({
      collection: 'articles',
      data: {
        title: 'Как выбрать туристическую страховку: на что обращать внимание',
        slug: 'kak-vybrat-turisticheskuyu-strahovku',
        excerpt: 'Разбираем ключевые критерии выбора страховки для путешествий: покрытие, франшиза, скорость выплат.',
        status: 'published',
        publishedAt: new Date().toISOString(),
        relatedInsuranceTypes: [types.travel.id, types.medical.id],
      },
    })
  }

  console.log('Готово! Данные Trusty загружены (реальные компании — без вымышленных отзывов).')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
