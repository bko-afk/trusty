import { getPayload } from 'payload'
import config from '../payload.config'

// Простой конструктор Lexical-контента (формат richText в Payload) из
// массива абзацев обычного текста — без внешних зависимостей.
function richTextFromParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

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
  ]

  const types: Record<string, any> = {}
  for (const t of typeDefs) {
    const existing = await payload.find({ collection: 'insurance-types', where: { slug: { equals: t.slug } }, limit: 1 })
    types[t.slug] = existing.docs[0] || (await payload.create({ collection: 'insurance-types', data: t }))
  }

  // Сайт снова только про туристическое/медицинское страхование —
  // ОСАГО и КАСКО больше не нужны. Убираем их у компаний (если были
  // отмечены) и удаляем сами виды, если они остались в базе от
  // предыдущего запуска seed.
  console.log('Убираю ОСАГО и КАСКО (больше не используются)...')
  const obsoleteTypes = await payload.find({
    collection: 'insurance-types',
    where: { slug: { in: ['osago', 'kasko'] } },
    limit: 10,
  })
  for (const obsoleteType of obsoleteTypes.docs as any[]) {
    const affectedCompanies = await payload.find({
      collection: 'companies',
      where: { insuranceTypes: { contains: obsoleteType.id } },
      limit: 200,
      depth: 0,
    })
    for (const company of affectedCompanies.docs as any[]) {
      const remainingTypeIds = (company.insuranceTypes || []).filter((id: any) => id !== obsoleteType.id)
      await payload.update({
        collection: 'companies',
        id: company.id,
        data: { insuranceTypes: remainingTypeIds },
      })
    }
    await payload.delete({ collection: 'insurance-types', id: obsoleteType.id })
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
      logoFile: 'auras-insurance.svg',
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
      logoFile: 'ekta.svg',
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
      logoFile: 'world-nomads.svg',
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
      logoFile: 'allianz-travel.svg',
      insuranceTypes: [types.travel.id],
      shortDescription: 'Туристическое страхование от Allianz Partners — части международной группы Allianz.',
    },
  ]

  const realCompanies: any[] = []
  for (const c of realCompaniesData) {
    const existing = await payload.find({ collection: 'companies', where: { slug: { equals: c.slug } }, limit: 1 })
    if (existing.docs[0]) {
      const doc = existing.docs[0]
      if (!doc.logoFile) {
        await payload.update({ collection: 'companies', id: doc.id, data: { logoFile: c.logoFile } })
        doc.logoFile = c.logoFile
      }
      realCompanies.push(doc)
    } else {
      realCompanies.push(await payload.create({ collection: 'companies', data: c as any }))
    }
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
      logoFile: 'voyageguard.svg',
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
      logoFile: 'safetrip-insurance.svg',
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
    if (existing.docs[0]) {
      const doc = existing.docs[0]
      if (!doc.logoFile) {
        await payload.update({ collection: 'companies', id: doc.id, data: { logoFile: c.logoFile } })
        doc.logoFile = c.logoFile
      }
      demoCompanies.push(doc)
    } else {
      demoCompanies.push(await payload.create({ collection: 'companies', data: c as any }))
    }
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
  const articlesData = [
    {
      title: 'Как выбрать туристическую страховку: на что обращать внимание',
      slug: 'kak-vybrat-turisticheskuyu-strahovku',
      excerpt: 'Разбираем ключевые критерии выбора страховки для путешествий: покрытие, франшиза, скорость выплат.',
      relatedInsuranceTypes: [types.travel.id, types.medical.id],
      body: richTextFromParagraphs([
        'Туристическая страховка — это не формальность для визы, а реальная финансовая защита на случай болезни, травмы или другого происшествия в поездке. Чтобы полис действительно помог, а не разочаровал в нужный момент, стоит сравнивать компании не только по цене.',
        'Сумма покрытия. Для большинства направлений разумный минимум — от 30 000 евро (или эквивалент в долларах), для активного отдыха и удалённых регионов лучше брать больше. Слишком дешёвые полисы часто имеют заниженное покрытие.',
        'Франшиза — сумма, которую придётся заплатить самому, прежде чем страховка начнёт возмещать расходы. Чем выше франшиза, тем дешевле полис, но и тем больше вы рискуете заплатить из своего кармана при небольшом страховом случае.',
        'Список исключений. Экстремальные виды спорта, хронические заболевания, алкогольное опьянение — почти в каждом полисе есть ситуации, которые не покрываются. Их стоит прочитать до поездки, а не после отказа в выплате.',
        'Скорость и способ выплат. У части страховщиков расчёты с клиникой идут напрямую (cashless), у других — сначала нужно заплатить самому и потом требовать компенсацию. Второй вариант неудобен, если сумма лечения большая.',
        'Наконец, читайте отзывы реальных клиентов о том, как компания вела себя именно при страховых случаях — это показательнее, чем маркетинговые обещания на сайте.',
      ]),
    },
    {
      title: 'Страховой случай за границей: что делать в первые часы',
      slug: 'strahovoy-sluchay-za-granitsey',
      excerpt: 'Пошаговый план действий, если в поездке понадобилась медицинская помощь или произошла другая страховая ситуация.',
      relatedInsuranceTypes: [types.travel.id, types.medical.id],
      body: richTextFromParagraphs([
        'Даже с хорошей страховкой в стрессовой ситуации легко забыть простые, но важные шаги. Вот базовый порядок действий при страховом случае в поездке.',
        '1. Свяжитесь с сервисной линией страховой компании — телефон обычно указан прямо в полисе (сохраните его в заметках телефона заранее, а не только в почте). Большинство компаний работают круглосуточно и подскажут ближайшую партнёрскую клинику.',
        '2. Не соглашайтесь на лечение без согласования, если ситуация не угрожает жизни. Многие полисы требуют предварительного одобрения, иначе в выплате могут отказать по формальной причине.',
        '3. Сохраняйте все документы: чеки, счета из клиники, выписки, результаты анализов, справки полиции (если это кража или ДТП). Фотографируйте их сразу — бумажные оригиналы легко потерять в дороге.',
        '4. Узнайте формат выплат — cashless (страховая платит клинике напрямую) или reimbursement (сначала платите вы, потом подаёте на возмещение). Это влияет на то, что именно нужно требовать от клиники: счёт для страховой или просто чек.',
        '5. Подайте заявление на выплату как можно раньше — у большинства компаний есть срок давности (обычно 30–90 дней с момента случая), после которого документы уже не примут.',
        'И самое важное — не молчите, если что-то идёт не так. Если сервисная линия не отвечает или отказывает без объяснений, фиксируйте переписку и обращайтесь повторно — это пригодится, если придётся оспаривать решение.',
      ]),
    },
    {
      title: '7 частых ошибок при покупке страховки для путешествий',
      slug: 'oshibki-pri-pokupke-strahovki',
      excerpt: 'От игнорирования франшизы до покупки полиса «для галочки» — разбираем типичные промахи и как их избежать.',
      relatedInsuranceTypes: [types.travel.id],
      body: richTextFromParagraphs([
        '1. Покупка полиса только ради визы. Многие берут минимальную страховку, которая формально подходит для документов, но не покрывает реальные риски поездки — активный отдых, регион с дорогой медициной, длительное пребывание.',
        '2. Игнорирование франшизы. Разница в цене между полисом без франшизы и с франшизой в 100–200 евро может быть небольшой, а разница в итоговых расходах при страховом случае — существенной.',
        '3. Незнание списка исключений. Катание на лыжах, дайвинг, аренда скутера — активности, которые часто не покрываются базовым полисом без отдельной опции.',
        '4. Несовпадение дат полиса с датами поездки. Рейс задержали или продлили отпуск — а страховка уже закончилась. Стоит закладывать небольшой запас по датам.',
        '5. Покупка полиса в последний момент. Некоторые опции (например, страхование от невыезда) действуют только если купить полис заранее, до наступления события, из-за которого поездка может не состояться.',
        '6. Отсутствие франшизы за хронические заболевания. Если есть постоянный диагноз, важно проверить, покрывает ли полис его обострение — по умолчанию многие компании это исключают.',
        '7. Выбор компании только по цене, без отзывов. Дешёвый полис, по которому реально ничего не платят при случае, обходится дороже дорогого полиса с хорошей репутацией. Сравнивайте не только тариф, но и то, как компания вела себя в реальных ситуациях.',
      ]),
    },
  ]

  for (const a of articlesData) {
    const existingArticle = await payload.find({
      collection: 'articles',
      where: { slug: { equals: a.slug } },
      limit: 1,
    })
    if (!existingArticle.docs[0]) {
      await payload.create({
        collection: 'articles',
        data: {
          ...a,
          status: 'published',
          publishedAt: new Date().toISOString(),
        } as any,
      })
    } else if (!existingArticle.docs[0].body) {
      await payload.update({
        collection: 'articles',
        id: existingArticle.docs[0].id,
        data: { body: a.body } as any,
      })
    }
  }

  console.log('Готово! Данные Trusty загружены (реальные компании — без вымышленных отзывов).')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
