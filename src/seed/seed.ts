import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Наполняет базу тестовыми данными для Trusty — каталога отзывов
 * о туристических страховых компаниях. Все данные вымышленные,
 * созданы специально для тестовой версии.
 *
 * Запуск: npm run seed
 */
async function seed() {
  const payload = await getPayload({ config })

  console.log('Создаю виды туристического страхования...')
  const typeSlugs = [
    { title: 'Медицинская страховка для путешественников', slug: 'travel-medical', shortDescription: 'Покрытие экстренной медицинской помощи за границей', order: 1 },
    { title: 'Страхование от невыезда', slug: 'trip-cancellation', shortDescription: 'Возврат стоимости поездки при отмене по уважительной причине', order: 2 },
    { title: 'Страхование багажа', slug: 'baggage', shortDescription: 'Компенсация при утере, краже или повреждении багажа', order: 3 },
    { title: 'Мультирисковая страховка', slug: 'multi-risk', shortDescription: 'Комплексная защита: медицина, багаж, отмена поездки', order: 4 },
    { title: 'Страхование для активного отдыха', slug: 'sports-travel', shortDescription: 'Покрытие для горнолыжного спорта, дайвинга и других активностей', order: 5 },
    { title: 'Страхование для длительных поездок', slug: 'long-stay', shortDescription: 'Полисы для длительного пребывания за границей, учёбы, релокации', order: 6 },
  ]

  const types: Record<string, any> = {}
  for (const t of typeSlugs) {
    types[t.slug] = await payload.create({ collection: 'insurance-types', data: t })
  }

  console.log('Создаю страховые компании...')
  const companiesData = [
    {
      name: 'VoyageGuard',
      slug: 'voyageguard',
      status: 'published',
      verified: true,
      website: 'https://example.com/voyageguard',
      foundedYear: 2012,
      city: 'Москва',
      insuranceTypes: [types['travel-medical'].id, types['multi-risk'].id],
      shortDescription: 'Тестовая компания для демонстрации каталога Trusty (медицинская и мультирисковая страховка для путешественников).',
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
      insuranceTypes: [types['trip-cancellation'].id, types.baggage.id],
      shortDescription: 'Тестовая компания для демонстрации каталога Trusty (страхование от невыезда и багажа).',
      contacts: { phone: '+7 (900) 000-00-02', email: 'hello@example.com', address: 'г. Санкт-Петербург, пр. Тестовый, д. 5' },
      pros: [{ text: 'Понятные условия возврата при отмене поездки' }],
      cons: [{ text: 'Долгое рассмотрение заявлений на компенсацию багажа' }],
    },
    {
      name: 'PeakCover',
      slug: 'peakcover',
      status: 'published',
      verified: true,
      website: 'https://example.com/peakcover',
      foundedYear: 2019,
      city: 'Казань',
      insuranceTypes: [types['sports-travel'].id],
      shortDescription: 'Тестовая компания для демонстрации каталога Trusty (страхование для активного отдыха и горнолыжного спорта).',
      contacts: { phone: '+7 (900) 000-00-03', email: 'sport@example.com', address: 'г. Казань, ул. Демо, д. 12' },
      pros: [{ text: 'Широкий список покрываемых видов спорта' }],
      cons: [{ text: 'Выше средней цены по рынку' }],
    },
    {
      name: 'NomadShield',
      slug: 'nomadshield',
      status: 'published',
      verified: false,
      website: 'https://example.com/nomadshield',
      foundedYear: 2014,
      city: 'Екатеринбург',
      insuranceTypes: [types['long-stay'].id, types['travel-medical'].id],
      shortDescription: 'Тестовая компания для демонстрации каталога Trusty (страхование для долгосрочных поездок и релокации).',
      contacts: { phone: '+7 (900) 000-00-04', email: 'nomad@example.com', address: 'г. Екатеринбург, ул. Образцовая, д. 8' },
      pros: [{ text: 'Гибкие тарифы под разные сроки пребывания' }],
      cons: [{ text: 'Сложная процедура продления полиса онлайн' }],
    },
  ]

  const companies: any[] = []
  for (const c of companiesData) {
    companies.push(await payload.create({ collection: 'companies', data: c as any }))
  }

  console.log('Создаю отзывы и ответы...')
  const reviewsData = [
    {
      company: companies[0].id,
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
      company: companies[0].id,
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
      company: companies[2].id,
      authorName: 'Анна В.',
      title: 'Хорошее покрытие для горнолыжного отдыха',
      body: 'Брала полис для поездки на лыжный курорт, в списке было именно катание на лыжах вне трасс — редкость для таких страховок.',
      rating: 4,
      criteria: { coverage: 5, price: 3, claimsService: 4, support: 4 },
      pros: [{ text: 'Покрывает катание вне трасс' }],
      cons: [{ text: 'Цена выше, чем у обычной туристической страховки' }],
      recommend: true,
      status: 'published',
      helpfulUp: 4,
      helpfulDown: 0,
    },
  ]

  for (const r of reviewsData) {
    const review = await payload.create({ collection: 'reviews', data: r as any })
    if (r.rating <= 3) {
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
  await payload.create({
    collection: 'articles',
    data: {
      title: 'Как выбрать туристическую страховку: на что обращать внимание',
      slug: 'kak-vybrat-turisticheskuyu-strahovku',
      excerpt: 'Разбираем ключевые критерии выбора страховки для путешествий: покрытие, франшиза, скорость выплат.',
      status: 'published',
      publishedAt: new Date().toISOString(),
      relatedInsuranceTypes: [types['travel-medical'].id, types['multi-risk'].id],
    },
  })

  console.log('Готово! Тестовые данные Trusty загружены.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
