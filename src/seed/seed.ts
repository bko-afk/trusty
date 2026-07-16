import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Наполняет базу тестовыми данными: виды страхования, компании,
 * отзывы, ответы на отзывы, статьи. Все данные — вымышленные,
 * созданы специально для тестовой версии, а не скопированы
 * с какого-либо стороннего сайта.
 *
 * Запуск: npm run seed
 */
async function seed() {
  const payload = await getPayload({ config })

  console.log('Создаю виды страхования...')
  const typeSlugs = [
    { title: 'ОСАГО', slug: 'osago', shortDescription: 'Обязательное страхование автогражданской ответственности', order: 1 },
    { title: 'КАСКО', slug: 'kasko', shortDescription: 'Добровольное страхование автомобиля', order: 2 },
    { title: 'ДМС', slug: 'dms', shortDescription: 'Добровольное медицинское страхование', order: 3 },
    { title: 'Страхование жизни', slug: 'life', shortDescription: 'Накопительное и рисковое страхование жизни', order: 4 },
    { title: 'Страхование путешественников', slug: 'travel', shortDescription: 'Страховка для поездок за границу', order: 5 },
    { title: 'Страхование имущества', slug: 'property', shortDescription: 'Страхование квартир, домов и имущества', order: 6 },
  ]

  const types: Record<string, any> = {}
  for (const t of typeSlugs) {
    types[t.slug] = await payload.create({ collection: 'insurance-types', data: t })
  }

  console.log('Создаю компании...')
  const companiesData = [
    {
      name: 'СтрахГарант',
      slug: 'strahgarant',
      status: 'published',
      verified: true,
      website: 'https://example.com/strahgarant',
      foundedYear: 2004,
      city: 'Москва',
      insuranceTypes: [types.osago.id, types.kasko.id],
      shortDescription: 'Тестовая страховая компания для демонстрации каталога (ОСАГО, КАСКО).',
      contacts: { phone: '+7 (900) 000-00-01', email: 'info@example.com', address: 'г. Москва, ул. Примерная, д. 1' },
      pros: [{ text: 'Быстрое оформление полиса онлайн' }, { text: 'Понятные условия' }],
      cons: [{ text: 'Ограниченная сеть офисов' }],
    },
    {
      name: 'НадёжныйПолис',
      slug: 'nadezhny-polis',
      status: 'published',
      verified: false,
      website: 'https://example.com/nadezhny-polis',
      foundedYear: 2011,
      city: 'Санкт-Петербург',
      insuranceTypes: [types.dms.id, types.life.id],
      shortDescription: 'Тестовая компания для демонстрации каталога (ДМС, страхование жизни).',
      contacts: { phone: '+7 (900) 000-00-02', email: 'hello@example.com', address: 'г. Санкт-Петербург, пр. Тестовый, д. 5' },
      pros: [{ text: 'Широкий выбор программ ДМС' }],
      cons: [{ text: 'Долгое ожидание оператора' }],
    },
    {
      name: 'ПутешествиеБезопасно',
      slug: 'puteshestvie-bezopasno',
      status: 'published',
      verified: true,
      website: 'https://example.com/travel-safe',
      foundedYear: 2016,
      city: 'Казань',
      insuranceTypes: [types.travel.id],
      shortDescription: 'Тестовая компания для демонстрации каталога (страхование путешественников).',
      contacts: { phone: '+7 (900) 000-00-03', email: 'travel@example.com', address: 'г. Казань, ул. Демо, д. 12' },
      pros: [{ text: 'Круглосуточная поддержка за границей' }],
      cons: [{ text: 'Выше средней цены по рынку' }],
    },
    {
      name: 'ДомИКвартираСтрахование',
      slug: 'dom-i-kvartira',
      status: 'published',
      verified: false,
      website: 'https://example.com/dom-strah',
      foundedYear: 2009,
      city: 'Екатеринбург',
      insuranceTypes: [types.property.id],
      shortDescription: 'Тестовая компания для демонстрации каталога (страхование имущества).',
      contacts: { phone: '+7 (900) 000-00-04', email: 'dom@example.com', address: 'г. Екатеринбург, ул. Образцовая, д. 8' },
      pros: [{ text: 'Гибкие тарифы под разные типы жилья' }],
      cons: [{ text: 'Сложная процедура подачи заявления на выплату' }],
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
      title: 'Оформила ОСАГО за 10 минут',
      body: 'Заполнила данные на сайте, оплатила картой, полис пришёл на почту сразу. Раньше приходилось ездить в офис.',
      rating: 5,
      criteria: { coverage: 4, price: 5, claimsService: 4, support: 5 },
      pros: [{ text: 'Быстрое оформление' }, { text: 'Удобный сайт' }],
      cons: [],
      recommend: true,
      status: 'published',
      helpfulUp: 6,
      helpfulDown: 0,
    },
    {
      company: companies[0].id,
      authorName: 'Дмитрий П.',
      title: 'Долго рассматривали заявление по КАСКО',
      body: 'После ДТП собрал все документы, но выплату ждал почти месяц. Пришлось несколько раз звонить и уточнять статус.',
      rating: 3,
      criteria: { coverage: 3, price: 3, claimsService: 2, support: 3 },
      pros: [{ text: 'В итоге выплату всё же получил' }],
      cons: [{ text: 'Долгие сроки рассмотрения' }, { text: 'Слабая обратная связь' }],
      recommend: false,
      status: 'published',
      helpfulUp: 3,
      helpfulDown: 1,
    },
    {
      company: companies[1].id,
      authorName: 'Анна В.',
      title: 'Хорошая программа ДМС от работодателя',
      body: 'Компания подключена к нескольким клиникам в городе, запись через приложение, врачи вежливые.',
      rating: 4,
      criteria: { coverage: 5, price: 3, claimsService: 4, support: 4 },
      pros: [{ text: 'Большой выбор клиник' }],
      cons: [{ text: 'Не все анализы входят в базовую программу' }],
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
          body: 'Спасибо за обратную связь, передали ваш случай в отдел контроля качества для проверки сроков рассмотрения.',
          status: 'published',
        },
      })
    }
  }

  console.log('Создаю статьи...')
  await payload.create({
    collection: 'articles',
    data: {
      title: 'Как выбрать страховую компанию: на что обращать внимание',
      slug: 'kak-vybrat-strahovuyu-kompaniyu',
      excerpt: 'Разбираем ключевые критерии выбора страховой компании: лицензия, рейтинг, скорость выплат.',
      status: 'published',
      publishedAt: new Date().toISOString(),
      relatedInsuranceTypes: [types.osago.id, types.kasko.id],
    },
  })

  console.log('Готово! Тестовые данные загружены.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
