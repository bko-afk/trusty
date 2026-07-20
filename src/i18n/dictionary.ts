export type Locale = 'ru' | 'en' | 'es'

export const locales: Locale[] = ['ru', 'en', 'es']

export const localeLabels: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
  es: 'ES',
}

export const localeFlags: Record<Locale, string> = {
  ru: '🇷🇺',
  en: '🇬🇧',
  es: '🇪🇸',
}

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
}

export type Dictionary = {
  brand: string
  nav: {
    catalog: string
    ratings: string
    articles: string
    addReview: string
    addCompany: string
  }
  hero: {
    title: string
    subtitle: string
  }
  home: {
    bestCompanies: string
    allCompanies: string
    latestReviews: string
    allReviews: string
    claimCtaTitle: string
    claimCtaText: string
    addCompanyBtn: string
    writeReviewBtn: string
    articlesTitle: string
    articlesKicker: string
    articlesDescription: string
    allArticles: string
    readArticle: string
    aboutTitle: string
    aboutText: string
    aboutTextExtra: string
    popularCompaniesLabel: string
    ctaReviewTitle: string
    ctaComplaintTitle: string
    ctaCompanyTitle: string
    ctaMoreLink: string
    showMoreBtn: string
    newestCompaniesTitle: string
  }
  insuranceTypeNames: {
    medical: string
    travel: string
    osago: string
    kasko: string
  }
  footer: {
    tagline: string
    forCompanies: string
    community: string
    catalog: string
    writeReview: string
    testVersion: string
  }
  company: {
    readReviews: string
    leaveReview: string
    visitSite: string
    verified: string
    verifiedShort: string
    reviewsCount: string
  }
  common: {
    home: string
    breadcrumbsAria: string
    loading: string
  }
  search: {
    placeholder: string
    button: string
    pageTitle: string
    noResults: string
    clear: string
  }
  catalog: {
    title: string
    subtitle: string
    allTypes: string
    allCountries: string
    noResultsForType: string
  }
  portal: {
    insuranceCompanies: string
    home: {
      heroTitle: string
      popularLabel: string
      servicesKicker: string
      servicesTitle: string
      openRating: string
      reviewDescription: string
      compareTitle: string
      compareDescription: string
      catalogLink: string
      understandTitle: string
      understandDescription: string
      methodologyLink: string
      popularCategories: string
      selectInsuranceType: string
      allCompanies: string
      place: string
      company: string
      reviews: string
      rating: string
      customerExperience: string
      readReview: string
      methodologyKicker: string
      methodologyTitle: string
      methodologyDescription: string
      criteriaCount: string
      openMethod: string
      viewRating: string
      newCompanies: string
      entireCatalog: string
      ratingLabel: string
      imageAlt: string
      recentlyAdded: string
      carouselPrevious: string
      carouselNext: string
      carouselPosition: string
      openCompany: string
    }
    ranking: {
      ratingsBreadcrumb: string
      onlineInsuranceBreadcrumb: string
      title: string
      intro: string
      companiesInRating: string
      companyInRating: string
      companiesInRatingFew: string
      showFilter: string
      hideFilter: string
      companyName: string
      companyNamePlaceholder: string
      verifiedOnly: string
      popularOnly: string
      minimumRating: string
      countriesLabel: string
      insuranceTypesLabel: string
      foundedRange: string
      reviewsRange: string
      from: string
      to: string
      resetFilter: string
      applyFilter: string
      filtering: string
      filterError: string
      place: string
      company: string
      reviews: string
      rating: string
      programs: string
      mobilePlace: string
      verifiedProfile: string
      details: string
      noResults: string
      aboutRating: string
      chooseCompany: string
      chooseCompanyText1: string
      chooseCompanyText2: string
    }
    detail: {
      ratingsBreadcrumb: string
      notSpecified: string
      verifiedProfile: string
      companyRating: string
      customerReviews: string
      overview: string
      reviews: string
      specifications: string
      independentReview: string
      aboutCompanyPrefix: string
      advantages: string
      disadvantages: string
      emptyList: string
      experiencePrefix: string
      experienceText: string
      companyCard: string
      keyDetails: string
    }
    footer: {
      insurance: string
      companyRatings: string
      findInsurer: string
      forCompanies: string
      loginToProfile: string
      copyright: string
    }
  }
  companyDetail: {
    officialSite: string
    foundedYear: string
    city: string
    country: string
    phone: string
    email: string
    address: string
    insuranceTypesLabel: string
    aboutTitle: string
    noDescription: string
    advantages: string
    disadvantages: string
    specTitle: string
    reviewsSuffix: string
  }
  companyReviewsPage: {
    titlePrefix: string
    addReview: string
    noReviews: string
    criteria: {
      coverage: string
      price: string
      claimsService: string
      support: string
    }
  }
  ratingsPage: {
    title: string
    subtitle: string
  }
  articlesPage: {
    title: string
    noArticles: string
  }
  addCompanyPage: {
    title: string
    subtitle: string
    nameLabel: string
    websiteLabel: string
    cityLabel: string
    countryLabel: string
    countryPlaceholder: string
    insuranceTypesLabel: string
    descriptionLabel: string
    submitBtn: string
    submittingBtn: string
    successMsg: string
    errorMsg: string
    introText: string
    stepsTitle: string
    stepsSubtitle: string
    step1Title: string
    step1Text: string
    step2Title: string
    step2Text: string
    step3Title: string
    step3Text: string
    whyTitle: string
    whyText: string
    formTitle: string
  }
  addReviewPage: {
    title: string
    subtitle: string
    companyLabel: string
    companyPlaceholder: string
    nameLabel: string
    emailLabel: string
    ratingLabel: string
    criteriaLabel: string
    titleLabel: string
    bodyLabel: string
    prosLabel: string
    consLabel: string
    recommendLabel: string
    submitBtn: string
    submittingBtn: string
    successMsg: string
    errorMsg: string
    loggedInAs: string
    introText: string
    stepsTitle: string
    stepsSubtitle: string
    step1Title: string
    step1Text: string
    step2Title: string
    step2Text: string
    step3Title: string
    step3Text: string
    whyTitle: string
    whyText: string
    formTitle: string
  }
  addComplaintPage: {
    title: string
    subtitle: string
    companyLabel: string
    companyPlaceholder: string
    nameLabel: string
    emailLabel: string
    titleLabel: string
    bodyLabel: string
    submitBtn: string
    submittingBtn: string
    successMsg: string
    errorMsg: string
    loggedInAs: string
    introText: string
    stepsTitle: string
    stepsSubtitle: string
    step1Title: string
    step1Text: string
    step2Title: string
    step2Text: string
    step3Title: string
    step3Text: string
    whyTitle: string
    whyText: string
    formTitle: string
  }
  reviewCard: {
    pros: string
    cons: string
    recommends: string
    reply: string
    companyRep: string
  }
  notFound: {
    title: string
    text: string
    backHome: string
  }
  auth: {
    register: string
    login: string
    logout: string
    name: string
    email: string
    password: string
    confirmPassword: string
    account: string
    myAccount: string
    registerBtn: string
    loginBtn: string
    alreadyHaveAccount: string
    noAccountYet: string
    registerSuccess: string
    loginError: string
    registerError: string
    logoutBtn: string
    writingAsAccount: string
    passwordResetHint: string
    notLoggedIn: string
    registerIntro: string
    registerBenefit1: string
    registerBenefit2: string
    registerBenefit3: string
    loginIntro: string
    myReviews: string
    myComplaints: string
    noReviewsYet: string
    noComplaintsYet: string
    activityLoading: string
    submissionStatus: {
      pending: string
      published: string
      hidden: string
      rejected: string
      spam: string
    }
  }
}

export const dictionary: Record<Locale, Dictionary> = {
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
      writeReviewBtn: 'Написать отзыв',
      articlesTitle: 'Статьи и обзоры',
      articlesKicker: 'Полезно знать',
      articlesDescription: 'Разбираем условия полисов, страховые случаи и важные детали, которые стоит проверить до поездки.',
      allArticles: 'Все статьи',
      readArticle: 'Читать статью',
      aboutTitle: 'О Trusty',
      aboutText:
        'Trusty — независимый каталог отзывов и рейтингов туристических страховых компаний. Мы помогаем путешественникам сравнивать условия полисов, читать реальные отзывы клиентов и выбирать страховку осознанно, до поездки, а не после проблем в ней.',
      aboutTextExtra:
        'Мы не продаём страховки и не работаем с продавцами за комиссию — рейтинг компаний считается только по оценкам реальных пользователей. Каждый отзыв проходит модерацию, а карточки компаний можно дополнять и уточнять — как самим компаниям, так и клиентам, которые пользовались их услугами.',
      popularCompaniesLabel: 'Популярные компании',
      ctaReviewTitle: 'Добавить отзыв',
      ctaComplaintTitle: 'Оставить жалобу',
      ctaCompanyTitle: 'Добавить компанию',
      ctaMoreLink: 'Подробнее',
      showMoreBtn: 'Показать ещё',
      newestCompaniesTitle: 'Новые компании',
    },
    insuranceTypeNames: {
      medical: 'Медицинская страховка',
      travel: 'Туристическая страховка',
      osago: 'ОСАГО',
      kasko: 'КАСКО',
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
      verifiedShort: 'Проверено',
      reviewsCount: 'отзывов',
    },
    common: {
      home: 'Главная',
      breadcrumbsAria: 'Хлебные крошки',
      loading: 'Загрузка...',
    },
    search: {
      placeholder: 'Название страховой компании...',
      button: 'Найти',
      pageTitle: 'Поиск страховых компаний',
      noResults: 'Ничего не найдено по запросу',
      clear: 'Очистить',
    },
    catalog: {
      title: 'Каталог и рейтинг страховых компаний',
      subtitle: 'Компании отсортированы по рейтингу — среднему баллу опубликованных отзывов клиентов.',
      allTypes: 'Все виды',
      allCountries: 'Все страны',
      noResultsForType: 'По этому виду страхования пока нет компаний.',
    },
    portal: {
      insuranceCompanies: 'Страховые компании',
      home: {
        heroTitle: 'Поиск информации и отзывов о страховых компаниях',
        popularLabel: 'Популярно:',
        servicesKicker: 'Сервисы',
        servicesTitle: 'Помогаем выбрать страховку',
        openRating: 'Открыть рейтинг',
        reviewDescription: 'Расскажите о выплате, поддержке и условиях полиса.',
        compareTitle: 'Сравнить компании',
        compareDescription: 'Фильтруйте страховщиков по типу полиса, стране и рейтингу.',
        catalogLink: 'К каталогу',
        understandTitle: 'Понять рейтинг',
        understandDescription: 'Показываем, из каких оценок складывается итоговый балл.',
        methodologyLink: 'Как это работает',
        popularCategories: 'Популярные категории',
        selectInsuranceType: 'Выберите тип страхования',
        allCompanies: 'Все компании',
        place: 'Место',
        company: 'Компания',
        reviews: 'Отзывы',
        rating: 'Рейтинг',
        customerExperience: 'Опыт клиентов',
        readReview: 'Читать отзыв',
        methodologyKicker: 'Методология Trusty',
        methodologyTitle: 'Рейтинг строится на реальном клиентском опыте',
        methodologyDescription: 'Мы учитываем опубликованные отзывы и оценки по четырём критериям: покрытие, цена полиса, выплаты и поддержка. Непроверенные обещания компаний не повышают позицию в рейтинге.',
        criteriaCount: 'критерия оценки',
        openMethod: 'открытая методика',
        viewRating: 'Смотреть рейтинг',
        newCompanies: 'Новые компании',
        entireCatalog: 'Весь каталог',
        ratingLabel: 'Рейтинг',
        imageAlt: 'Иллюстрация выбора туристической страховки',
        recentlyAdded: 'Недавно добавлены',
        carouselPrevious: 'Предыдущие компании',
        carouselNext: 'Следующие компании',
        carouselPosition: 'Компания {current} из {total}',
        openCompany: 'Открыть компанию',
      },
      ranking: {
        ratingsBreadcrumb: 'Рейтинги',
        onlineInsuranceBreadcrumb: 'Страхование онлайн',
        title: 'Рейтинг сервисов страхования онлайн',
        intro: 'В рейтинге собраны страховые компании и онлайн-сервисы. Сравнивайте отзывы, итоговую оценку и доступные виды полисов.',
        companiesInRating: 'компаний в рейтинге',
        companyInRating: 'компания в рейтинге',
        companiesInRatingFew: 'компании в рейтинге',
        showFilter: 'Показать фильтр',
        hideFilter: 'Скрыть фильтр',
        companyName: 'Название компании',
        companyNamePlaceholder: 'Начните вводить название',
        verifiedOnly: 'Только проверенные',
        popularOnly: 'Рекомендуемые на главной',
        minimumRating: 'Рейтинг не ниже',
        countriesLabel: 'Страны регистрации',
        insuranceTypesLabel: 'Виды страхования',
        foundedRange: 'Год основания',
        reviewsRange: 'Количество отзывов',
        from: 'От',
        to: 'До',
        resetFilter: 'Сбросить фильтр',
        applyFilter: 'Фильтровать',
        filtering: 'Фильтруем...',
        filterError: 'Не удалось загрузить компании. Попробуйте ещё раз.',
        place: 'Место',
        company: 'Компания',
        reviews: 'Отзывы',
        rating: 'Рейтинг',
        programs: 'Программы',
        mobilePlace: 'Место',
        verifiedProfile: 'Профиль подтверждён',
        details: 'Подробнее',
        noResults: 'По выбранным фильтрам компании не найдены.',
        aboutRating: 'О рейтинге',
        chooseCompany: 'Как выбрать страховую компанию',
        chooseCompanyText1: 'Проверяйте не только стоимость полиса, но и список исключений, размер покрытия, порядок обращения при страховом случае и опыт клиентов с реальными выплатами.',
        chooseCompanyText2: 'Итоговая оценка Trusty формируется из опубликованных пользовательских отзывов. Профиль компании и рекламные обещания сами по себе не повышают позицию в таблице.',
      },
      detail: {
        ratingsBreadcrumb: 'Рейтинг страховщиков',
        notSpecified: 'Не указано',
        verifiedProfile: 'Профиль подтверждён',
        companyRating: 'Рейтинг компании',
        customerReviews: 'отзывов клиентов',
        overview: 'Обзор',
        reviews: 'Отзывы',
        specifications: 'Характеристики',
        independentReview: 'Независимый обзор',
        aboutCompanyPrefix: 'О компании',
        advantages: 'Преимущества',
        disadvantages: 'Недостатки',
        emptyList: 'Пока не указаны',
        experiencePrefix: 'Есть опыт с',
        experienceText: 'Подробный отзыв о покупке полиса или страховом случае поможет другим путешественникам сделать осознанный выбор.',
        companyCard: 'Карточка компании',
        keyDetails: 'Основные данные',
      },
      footer: {
        insurance: 'Страхование',
        companyRatings: 'Рейтинг компаний',
        findInsurer: 'Найти страховщика',
        forCompanies: 'Компаниям',
        loginToProfile: 'Войти в профиль',
        copyright: 'Независимый каталог отзывов о страховании.',
      },
    },
    companyDetail: {
      officialSite: 'Официальный сайт',
      foundedYear: 'Год основания',
      city: 'Город',
      country: 'Страна',
      phone: 'Телефон',
      email: 'Email',
      address: 'Адрес',
      insuranceTypesLabel: 'Виды страхования',
      aboutTitle: 'О компании',
      noDescription: 'Описание компании пока не добавлено.',
      advantages: 'Преимущества',
      disadvantages: 'Недостатки',
      specTitle: 'Характеристики компании',
      reviewsSuffix: 'отзывов',
    },
    companyReviewsPage: {
      titlePrefix: 'Отзывы о компании',
      addReview: 'Добавить отзыв',
      noReviews: 'Пока нет отзывов. Будьте первым!',
      criteria: {
        coverage: 'Полнота покрытия',
        price: 'Цена полиса',
        claimsService: 'Выплаты по страховым случаям',
        support: 'Поддержка и сервис',
      },
    },
    ratingsPage: {
      title: 'Рейтинг страховых компаний',
      subtitle: 'Рейтинг основан на среднем балле опубликованных отзывов клиентов.',
    },
    articlesPage: {
      title: 'Статьи и обзоры о страховании',
      noArticles: 'Статей пока нет.',
    },
    addCompanyPage: {
      title: 'Добавить страховую компанию',
      subtitle: 'Заявка попадёт на модерацию. После проверки администратор опубликует карточку компании.',
      nameLabel: 'Название компании *',
      websiteLabel: 'Сайт компании',
      cityLabel: 'Город',
      countryLabel: 'Страна',
      countryPlaceholder: 'Выберите страну',
      insuranceTypesLabel: 'Виды страхования',
      descriptionLabel: 'Краткое описание',
      submitBtn: 'Отправить на модерацию',
      submittingBtn: 'Отправка...',
      successMsg: 'Спасибо! Заявка отправлена и появится на сайте после проверки модератором.',
      errorMsg: 'Не удалось отправить форму. Попробуйте ещё раз.',
      introText:
        'Trusty — независимый каталог, и мы добавляем компании бесплатно. Заполните анкету — карточка появится в каталоге сразу после проверки модератором.',
      stepsTitle: 'Как добавить компанию?',
      stepsSubtitle: 'Всего 3 простых шага',
      step1Title: 'Заполните анкету',
      step1Text: 'Укажите название, сайт, страну и виды страхования, которые предлагает компания.',
      step2Title: 'Модерация',
      step2Text: 'Мы проверим данные — обычно это занимает не больше одного рабочего дня.',
      step3Title: 'Карточка в каталоге',
      step3Text: 'Компания появится в общем рейтинге, а клиенты смогут оставлять о ней отзывы.',
      whyTitle: 'Зачем добавлять компанию в Trusty?',
      whyText:
        'Чем больше компаний в каталоге — тем проще путешественникам сравнивать условия и находить надёжного страховщика. Карточку можно будет дополнять и уточнять позже, а подтверждённые компании получают отметку доверия рядом с названием.',
      formTitle: 'Анкета компании',
    },
    addReviewPage: {
      title: 'Оставить отзыв',
      subtitle: 'Отзыв появится на сайте после проверки модератором.',
      companyLabel: 'Компания *',
      companyPlaceholder: 'Выберите компанию',
      nameLabel: 'Ваше имя *',
      emailLabel: 'Email',
      ratingLabel: 'Оценка *',
      criteriaLabel: 'Оценки по критериям',
      titleLabel: 'Заголовок отзыва *',
      bodyLabel: 'Текст отзыва *',
      prosLabel: 'Плюсы (по одному в строке)',
      consLabel: 'Минусы (по одному в строке)',
      recommendLabel: 'Рекомендую эту компанию',
      submitBtn: 'Отправить отзыв',
      submittingBtn: 'Отправка...',
      successMsg: 'Спасибо за отзыв! Он появится на сайте после модерации.',
      errorMsg: 'Не удалось отправить отзыв. Попробуйте ещё раз.',
      loggedInAs: 'Вы пишете отзыв от имени аккаунта',
      introText:
        'Ваш отзыв помогает другим путешественникам выбрать надёжную страховую компанию — и попадает в общий рейтинг после проверки модератором.',
      stepsTitle: 'Как оставить отзыв?',
      stepsSubtitle: 'Всего 3 простых шага',
      step1Title: 'Найдите компанию',
      step1Text: 'Выберите страховую компанию из каталога, с которой у вас был опыт.',
      step2Title: 'Опишите опыт',
      step2Text: 'Поставьте оценку, расскажите о плюсах и минусах — это займёт пару минут.',
      step3Title: 'Модерация и публикация',
      step3Text: 'После проверки отзыв появится на странице компании и повлияет на её рейтинг.',
      whyTitle: 'Зачем оставлять отзывы?',
      whyText:
        'Реальные отзывы клиентов — основа рейтинга Trusty. Именно они помогают другим путешественникам понять, как компания ведёт себя при страховых случаях, а не только на словах в рекламе.',
      formTitle: 'Форма отзыва',
    },
    addComplaintPage: {
      title: 'Оставить жалобу',
      subtitle:
        'Расскажите, что произошло — жалоба появится на сайте после проверки модератором, и представитель компании сможет на неё ответить.',
      companyLabel: 'Компания *',
      companyPlaceholder: 'Выберите компанию',
      nameLabel: 'Ваше имя *',
      emailLabel: 'Email',
      titleLabel: 'Тема жалобы *',
      bodyLabel: 'Описание проблемы *',
      submitBtn: 'Отправить жалобу',
      submittingBtn: 'Отправка...',
      successMsg: 'Жалоба принята! Она появится на сайте после модерации.',
      errorMsg: 'Не удалось отправить жалобу. Попробуйте ещё раз.',
      loggedInAs: 'Вы отправляете жалобу от имени аккаунта',
      introText:
        'Если страховая компания нарушила условия полиса, затянула с выплатой или отказала без оснований — расскажите об этом. Жалоба видна другим пользователям и влияет на репутацию компании.',
      stepsTitle: 'Как оставить жалобу?',
      stepsSubtitle: 'Всего 3 простых шага',
      step1Title: 'Выберите компанию',
      step1Text: 'Укажите страховую компанию, к которой относится жалоба.',
      step2Title: 'Опишите ситуацию',
      step2Text: 'Кратко изложите суть проблемы: что произошло и чего вы ожидали.',
      step3Title: 'Ответ компании',
      step3Text: 'После модерации жалоба публикуется, а представитель компании может ответить на неё.',
      whyTitle: 'Почему важно оставлять жалобы?',
      whyText:
        'Жалобы — это сигнал для других путешественников и для самой компании. Открытая публикация проблем стимулирует страховщиков быстрее реагировать на страховые случаи и держать обещания из полиса.',
      formTitle: 'Форма жалобы',
    },
    reviewCard: {
      pros: 'Плюсы',
      cons: 'Минусы',
      recommends: 'Рекомендует',
      reply: 'Ответить на отзыв',
      companyRep: 'представитель компании',
    },
    notFound: {
      title: 'Страница не найдена',
      text: 'Такой страницы не существует или она была перемещена.',
      backHome: 'На главную',
    },
    auth: {
      register: 'Регистрация',
      login: 'Войти',
      logout: 'Выйти',
      name: 'Имя',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Повторите пароль',
      account: 'Аккаунт',
      myAccount: 'Личный кабинет',
      registerBtn: 'Зарегистрироваться',
      loginBtn: 'Войти',
      alreadyHaveAccount: 'Уже есть аккаунт? Войти',
      noAccountYet: 'Нет аккаунта? Зарегистрироваться',
      registerSuccess: 'Регистрация прошла успешно! Теперь вы можете войти.',
      loginError: 'Неверный email или пароль.',
      registerError: 'Не удалось зарегистрироваться. Проверьте данные и попробуйте снова.',
      logoutBtn: 'Выйти из аккаунта',
      writingAsAccount: 'Вы вошли как',
      passwordResetHint: 'Забыли пароль? Напишите нам, чтобы восстановить доступ вручную.',
      notLoggedIn: 'Вы не авторизованы.',
      registerIntro: 'Аккаунт нужен, чтобы отвечать на свои отзывы, следить за жалобами и быстрее оставлять новые.',
      registerBenefit1: 'Отзывы и жалобы публикуются от вашего имени, без повторного ввода данных',
      registerBenefit2: 'История ваших отзывов и жалоб — в личном кабинете',
      registerBenefit3: 'Уведомления об ответах от компаний',
      loginIntro: 'Войдите, чтобы оставлять отзывы и жалобы от своего аккаунта и видеть их статус.',
      myReviews: 'Мои отзывы',
      myComplaints: 'Мои жалобы',
      noReviewsYet: 'Вы ещё не оставляли отзывов.',
      noComplaintsYet: 'Вы ещё не отправляли жалоб.',
      activityLoading: 'Загружаем вашу историю...',
      submissionStatus: {
        pending: 'На модерации',
        published: 'Опубликовано',
        hidden: 'Скрыто',
        rejected: 'Отклонено',
        spam: 'Спам',
      },
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
      writeReviewBtn: 'Write a review',
      articlesTitle: 'Articles & Guides',
      articlesKicker: 'Good to know',
      articlesDescription: 'Clear guides to policy terms, claims, and the details worth checking before your trip.',
      allArticles: 'View all articles',
      readArticle: 'Read article',
      aboutTitle: 'About Trusty',
      aboutText:
        'Trusty is an independent catalog of reviews and ratings for travel insurance companies. We help travelers compare policy terms, read real customer reviews, and choose coverage with confidence — before the trip, not after something goes wrong.',
      aboutTextExtra:
        "We don't sell insurance and don't take commissions from sellers — company ratings are based only on scores from real users. Every review goes through moderation, and company listings can be expanded and corrected by both the companies themselves and customers who've used their services.",
      popularCompaniesLabel: 'Popular companies',
      ctaReviewTitle: 'Write a review',
      ctaComplaintTitle: 'File a complaint',
      ctaCompanyTitle: 'Add a company',
      ctaMoreLink: 'Learn more',
      showMoreBtn: 'Show more',
      newestCompaniesTitle: 'New companies',
    },
    insuranceTypeNames: {
      medical: 'Medical insurance',
      travel: 'Travel insurance',
      osago: 'OSAGO (auto liability)',
      kasko: 'KASKO (auto comprehensive)',
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
      verifiedShort: 'Verified',
      reviewsCount: 'reviews',
    },
    common: {
      home: 'Home',
      breadcrumbsAria: 'Breadcrumbs',
      loading: 'Loading...',
    },
    search: {
      placeholder: 'Insurance company name...',
      button: 'Search',
      pageTitle: 'Search insurance companies',
      noResults: 'No results found for',
      clear: 'Clear',
    },
    catalog: {
      title: 'Insurance company catalog & ratings',
      subtitle: 'Companies are ranked by rating — the average score of published customer reviews.',
      allTypes: 'All types',
      allCountries: 'All countries',
      noResultsForType: 'No companies for this insurance type yet.',
    },
    portal: {
      insuranceCompanies: 'Insurance companies',
      home: {
        heroTitle: 'Find information and reviews about insurance companies',
        popularLabel: 'Popular:',
        servicesKicker: 'Services',
        servicesTitle: 'Helping you choose insurance',
        openRating: 'Open ratings',
        reviewDescription: 'Share your experience with claims, support, and policy terms.',
        compareTitle: 'Compare companies',
        compareDescription: 'Filter insurers by policy type, country, and rating.',
        catalogLink: 'Open catalog',
        understandTitle: 'Understand the rating',
        understandDescription: 'See which customer scores make up the final rating.',
        methodologyLink: 'How it works',
        popularCategories: 'Popular categories',
        selectInsuranceType: 'Choose an insurance type',
        allCompanies: 'All companies',
        place: 'Rank',
        company: 'Company',
        reviews: 'Reviews',
        rating: 'Rating',
        customerExperience: 'Customer experience',
        readReview: 'Read review',
        methodologyKicker: 'Trusty methodology',
        methodologyTitle: 'Ratings are built on real customer experience',
        methodologyDescription: 'We use published reviews and scores across four criteria: coverage, policy price, claims handling, and support. Unverified marketing claims do not improve a company’s position.',
        criteriaCount: 'rating criteria',
        openMethod: 'transparent method',
        viewRating: 'View ratings',
        newCompanies: 'New companies',
        entireCatalog: 'Full catalog',
        ratingLabel: 'Rating',
        imageAlt: 'Illustration about choosing travel insurance',
        recentlyAdded: 'Recently added',
        carouselPrevious: 'Previous companies',
        carouselNext: 'Next companies',
        carouselPosition: 'Company {current} of {total}',
        openCompany: 'Open company',
      },
      ranking: {
        ratingsBreadcrumb: 'Ratings',
        onlineInsuranceBreadcrumb: 'Online insurance',
        title: 'Online insurance service ratings',
        intro: 'This ranking includes insurance companies and online services. Compare customer reviews, overall scores, and available policy types.',
        companiesInRating: 'companies in the ranking',
        companyInRating: 'company in the ranking',
        companiesInRatingFew: 'companies in the ranking',
        showFilter: 'Show filters',
        hideFilter: 'Hide filters',
        companyName: 'Company name',
        companyNamePlaceholder: 'Start typing a company name',
        verifiedOnly: 'Verified companies only',
        popularOnly: 'Featured on the homepage',
        minimumRating: 'Minimum rating',
        countriesLabel: 'Countries of registration',
        insuranceTypesLabel: 'Insurance types',
        foundedRange: 'Year founded',
        reviewsRange: 'Number of reviews',
        from: 'From',
        to: 'To',
        resetFilter: 'Reset filters',
        applyFilter: 'Filter',
        filtering: 'Filtering...',
        filterError: 'Unable to load companies. Please try again.',
        place: 'Rank',
        company: 'Company',
        reviews: 'Reviews',
        rating: 'Rating',
        programs: 'Programs',
        mobilePlace: 'Rank',
        verifiedProfile: 'Verified profile',
        details: 'Details',
        noResults: 'No companies match the selected filters.',
        aboutRating: 'About the rating',
        chooseCompany: 'How to choose an insurance company',
        chooseCompanyText1: 'Check more than the policy price: review exclusions, coverage limits, the claims process, and customers’ experience with real payouts.',
        chooseCompanyText2: 'Trusty’s overall score is calculated from published customer reviews. A company profile and marketing promises do not improve its table position by themselves.',
      },
      detail: {
        ratingsBreadcrumb: 'Insurer ratings',
        notSpecified: 'Not specified',
        verifiedProfile: 'Verified profile',
        companyRating: 'Company rating',
        customerReviews: 'customer reviews',
        overview: 'Overview',
        reviews: 'Reviews',
        specifications: 'Details',
        independentReview: 'Independent review',
        aboutCompanyPrefix: 'About',
        advantages: 'Advantages',
        disadvantages: 'Disadvantages',
        emptyList: 'Not specified yet',
        experiencePrefix: 'Have experience with',
        experienceText: 'A detailed review about buying a policy or handling a claim will help other travelers make an informed choice.',
        companyCard: 'Company profile',
        keyDetails: 'Key details',
      },
      footer: {
        insurance: 'Insurance',
        companyRatings: 'Company ratings',
        findInsurer: 'Find an insurer',
        forCompanies: 'For companies',
        loginToProfile: 'Log in to profile',
        copyright: 'Independent insurance review catalog.',
      },
    },
    companyDetail: {
      officialSite: 'Official website',
      foundedYear: 'Founded',
      city: 'City',
      country: 'Country',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      insuranceTypesLabel: 'Insurance types',
      aboutTitle: 'About the company',
      noDescription: 'No description has been added yet.',
      advantages: 'Advantages',
      disadvantages: 'Disadvantages',
      specTitle: 'Company details',
      reviewsSuffix: 'reviews',
    },
    companyReviewsPage: {
      titlePrefix: 'Reviews of',
      addReview: 'Add a review',
      noReviews: 'No reviews yet. Be the first!',
      criteria: {
        coverage: 'Coverage',
        price: 'Policy price',
        claimsService: 'Claims handling',
        support: 'Support and service',
      },
    },
    ratingsPage: {
      title: 'Insurance company ratings',
      subtitle: 'Ratings are based on the average score of published customer reviews.',
    },
    articlesPage: {
      title: 'Insurance articles & guides',
      noArticles: 'No articles yet.',
    },
    addCompanyPage: {
      title: 'Add an insurance company',
      subtitle: 'Your submission will be reviewed. Once approved, the listing will be published.',
      nameLabel: 'Company name *',
      websiteLabel: 'Company website',
      cityLabel: 'City',
      countryLabel: 'Country',
      countryPlaceholder: 'Select a country',
      insuranceTypesLabel: 'Insurance types',
      descriptionLabel: 'Short description',
      submitBtn: 'Submit for review',
      submittingBtn: 'Submitting...',
      successMsg: 'Thank you! Your submission will appear on the site after moderator review.',
      errorMsg: 'Could not submit the form. Please try again.',
      introText:
        "Trusty is an independent catalog, and adding a company is free. Fill in the form — the listing goes live right after moderator review.",
      stepsTitle: 'How to add a company?',
      stepsSubtitle: 'Just 3 simple steps',
      step1Title: 'Fill in the form',
      step1Text: 'Provide the name, website, country, and the insurance types the company offers.',
      step2Title: 'Moderation',
      step2Text: "We'll review the details — usually within one business day.",
      step3Title: 'Listed in the catalog',
      step3Text: 'The company appears in the overall rating, and customers can start leaving reviews.',
      whyTitle: 'Why add a company to Trusty?',
      whyText:
        'The more companies in the catalog, the easier it is for travelers to compare terms and find a reliable insurer. Listings can be expanded later, and verified companies get a trust badge next to their name.',
      formTitle: 'Company form',
    },
    addReviewPage: {
      title: 'Leave a review',
      subtitle: 'Your review will appear on the site after moderator review.',
      companyLabel: 'Company *',
      companyPlaceholder: 'Select a company',
      nameLabel: 'Your name *',
      emailLabel: 'Email',
      ratingLabel: 'Rating *',
      criteriaLabel: 'Scores by criterion',
      titleLabel: 'Review title *',
      bodyLabel: 'Review text *',
      prosLabel: 'Pros (one per line)',
      consLabel: 'Cons (one per line)',
      recommendLabel: 'I recommend this company',
      submitBtn: 'Submit review',
      submittingBtn: 'Submitting...',
      successMsg: 'Thanks for your review! It will appear after moderation.',
      errorMsg: 'Could not submit the review. Please try again.',
      loggedInAs: 'You are writing this review as',
      introText:
        'Your review helps other travelers pick a reliable insurance company — and feeds into the overall rating once a moderator approves it.',
      stepsTitle: 'How to leave a review?',
      stepsSubtitle: 'Just 3 simple steps',
      step1Title: 'Find the company',
      step1Text: "Pick the insurance company you've had experience with from the catalog.",
      step2Title: 'Describe your experience',
      step2Text: 'Rate it, note the pros and cons — it only takes a couple of minutes.',
      step3Title: 'Moderation and publishing',
      step3Text: "After review, your review appears on the company's page and affects its rating.",
      whyTitle: 'Why leave a review?',
      whyText:
        "Real customer reviews are the foundation of Trusty's rating. They help other travelers see how a company actually behaves when a claim comes in — not just what its ads say.",
      formTitle: 'Review form',
    },
    addComplaintPage: {
      title: 'File a complaint',
      subtitle:
        "Tell us what happened — your complaint will appear on the site after moderator review, and the company's representative will be able to respond.",
      companyLabel: 'Company *',
      companyPlaceholder: 'Select a company',
      nameLabel: 'Your name *',
      emailLabel: 'Email',
      titleLabel: 'Complaint subject *',
      bodyLabel: 'Describe the issue *',
      submitBtn: 'Submit complaint',
      submittingBtn: 'Submitting...',
      successMsg: 'Complaint received! It will appear on the site after moderation.',
      errorMsg: 'Could not submit the complaint. Please try again.',
      loggedInAs: 'You are filing this complaint as',
      introText:
        "If an insurance company breached policy terms, delayed a payout, or refused a claim without grounds — tell us about it. Complaints are visible to other users and affect the company's reputation.",
      stepsTitle: 'How to file a complaint?',
      stepsSubtitle: 'Just 3 simple steps',
      step1Title: 'Choose the company',
      step1Text: 'Select the insurance company the complaint is about.',
      step2Title: 'Describe the situation',
      step2Text: 'Briefly explain what happened and what you expected instead.',
      step3Title: "Company's response",
      step3Text: "After moderation the complaint is published, and the company's representative can respond.",
      whyTitle: 'Why file a complaint?',
      whyText:
        'Complaints are a signal to other travelers and to the company itself. Publishing issues openly pushes insurers to respond faster to claims and keep the promises made in the policy.',
      formTitle: 'Complaint form',
    },
    reviewCard: {
      pros: 'Pros',
      cons: 'Cons',
      recommends: 'Recommends',
      reply: 'Reply to review',
      companyRep: 'company representative',
    },
    notFound: {
      title: 'Page not found',
      text: "This page doesn't exist or has been moved.",
      backHome: 'Back to home',
    },
    auth: {
      register: 'Register',
      login: 'Log in',
      logout: 'Log out',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      account: 'Account',
      myAccount: 'My account',
      registerBtn: 'Create account',
      loginBtn: 'Log in',
      alreadyHaveAccount: 'Already have an account? Log in',
      noAccountYet: "Don't have an account? Register",
      registerSuccess: 'Registration successful! You can now log in.',
      loginError: 'Incorrect email or password.',
      registerError: 'Could not register. Please check your details and try again.',
      logoutBtn: 'Log out',
      writingAsAccount: 'Logged in as',
      passwordResetHint: 'Forgot your password? Contact us to reset it manually.',
      notLoggedIn: 'You are not logged in.',
      registerIntro:
        'An account lets you reply to your own reviews, track your complaints, and post new ones faster.',
      registerBenefit1: 'Reviews and complaints are posted under your name, no need to re-enter details',
      registerBenefit2: 'Your review and complaint history in one account page',
      registerBenefit3: 'Notifications when companies respond',
      loginIntro: 'Log in to post reviews and complaints under your account and track their status.',
      myReviews: 'My reviews',
      myComplaints: 'My complaints',
      noReviewsYet: 'You have not submitted any reviews yet.',
      noComplaintsYet: 'You have not filed any complaints yet.',
      activityLoading: 'Loading your activity...',
      submissionStatus: {
        pending: 'Under review',
        published: 'Published',
        hidden: 'Hidden',
        rejected: 'Rejected',
        spam: 'Spam',
      },
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
      writeReviewBtn: 'Escribir una reseña',
      articlesTitle: 'Artículos y guías',
      articlesKicker: 'Información útil',
      articlesDescription: 'Explicamos las condiciones, los siniestros y los detalles que conviene revisar antes del viaje.',
      allArticles: 'Ver todos los artículos',
      readArticle: 'Leer artículo',
      aboutTitle: 'Sobre Trusty',
      aboutText:
        'Trusty es un catálogo independiente de reseñas y clasificaciones de empresas de seguros de viaje. Ayudamos a los viajeros a comparar condiciones de las pólizas, leer reseñas reales de clientes y elegir su cobertura con confianza, antes del viaje.',
      aboutTextExtra:
        'No vendemos seguros ni cobramos comisión a las aseguradoras — la clasificación se basa solo en las valoraciones de usuarios reales. Cada reseña pasa por moderación, y las fichas de empresas pueden ser completadas tanto por las propias empresas como por los clientes que usaron sus servicios.',
      popularCompaniesLabel: 'Empresas populares',
      ctaReviewTitle: 'Escribir una reseña',
      ctaComplaintTitle: 'Presentar una queja',
      ctaCompanyTitle: 'Añadir empresa',
      ctaMoreLink: 'Más información',
      showMoreBtn: 'Mostrar más',
      newestCompaniesTitle: 'Empresas nuevas',
    },
    insuranceTypeNames: {
      medical: 'Seguro médico',
      travel: 'Seguro de viaje',
      osago: 'OSAGO (responsabilidad civil auto)',
      kasko: 'KASKO (seguro auto a todo riesgo)',
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
      verifiedShort: 'Verificado',
      reviewsCount: 'reseñas',
    },
    common: {
      home: 'Inicio',
      breadcrumbsAria: 'Migas de pan',
      loading: 'Cargando...',
    },
    search: {
      placeholder: 'Nombre de la aseguradora...',
      button: 'Buscar',
      pageTitle: 'Buscar aseguradoras',
      noResults: 'No se encontraron resultados para',
      clear: 'Borrar',
    },
    catalog: {
      title: 'Catálogo y clasificación de aseguradoras',
      subtitle: 'Las empresas se ordenan por puntuación — la media de las reseñas publicadas.',
      allTypes: 'Todos los tipos',
      allCountries: 'Todos los países',
      noResultsForType: 'Todavía no hay empresas para este tipo de seguro.',
    },
    portal: {
      insuranceCompanies: 'Aseguradoras',
      home: {
        heroTitle: 'Busca información y reseñas sobre aseguradoras',
        popularLabel: 'Popular:',
        servicesKicker: 'Servicios',
        servicesTitle: 'Te ayudamos a elegir un seguro',
        openRating: 'Abrir clasificación',
        reviewDescription: 'Comparte tu experiencia con siniestros, atención y condiciones de la póliza.',
        compareTitle: 'Comparar empresas',
        compareDescription: 'Filtra aseguradoras por tipo de póliza, país y puntuación.',
        catalogLink: 'Abrir catálogo',
        understandTitle: 'Entender la clasificación',
        understandDescription: 'Consulta qué valoraciones forman la puntuación final.',
        methodologyLink: 'Cómo funciona',
        popularCategories: 'Categorías populares',
        selectInsuranceType: 'Elige un tipo de seguro',
        allCompanies: 'Todas las empresas',
        place: 'Puesto',
        company: 'Empresa',
        reviews: 'Reseñas',
        rating: 'Puntuación',
        customerExperience: 'Experiencia de clientes',
        readReview: 'Leer reseña',
        methodologyKicker: 'Metodología de Trusty',
        methodologyTitle: 'La clasificación se basa en experiencias reales',
        methodologyDescription: 'Usamos reseñas publicadas y puntuaciones en cuatro criterios: cobertura, precio, gestión de siniestros y atención. Las promesas publicitarias no verificadas no mejoran la posición.',
        criteriaCount: 'criterios de valoración',
        openMethod: 'método transparente',
        viewRating: 'Ver clasificación',
        newCompanies: 'Empresas nuevas',
        entireCatalog: 'Catálogo completo',
        ratingLabel: 'Puntuación',
        imageAlt: 'Ilustración sobre la elección de un seguro de viaje',
        recentlyAdded: 'Añadidas recientemente',
        carouselPrevious: 'Empresas anteriores',
        carouselNext: 'Empresas siguientes',
        carouselPosition: 'Empresa {current} de {total}',
        openCompany: 'Abrir empresa',
      },
      ranking: {
        ratingsBreadcrumb: 'Clasificaciones',
        onlineInsuranceBreadcrumb: 'Seguros online',
        title: 'Clasificación de servicios de seguros online',
        intro: 'Esta clasificación incluye aseguradoras y servicios online. Compara reseñas, puntuaciones generales y tipos de póliza disponibles.',
        companiesInRating: 'empresas en la clasificación',
        companyInRating: 'empresa en la clasificación',
        companiesInRatingFew: 'empresas en la clasificación',
        showFilter: 'Mostrar filtros',
        hideFilter: 'Ocultar filtros',
        companyName: 'Nombre de la empresa',
        companyNamePlaceholder: 'Empieza a escribir el nombre',
        verifiedOnly: 'Solo empresas verificadas',
        popularOnly: 'Destacadas en la página principal',
        minimumRating: 'Puntuación mínima',
        countriesLabel: 'Países de registro',
        insuranceTypesLabel: 'Tipos de seguro',
        foundedRange: 'Año de fundación',
        reviewsRange: 'Número de reseñas',
        from: 'Desde',
        to: 'Hasta',
        resetFilter: 'Restablecer filtros',
        applyFilter: 'Filtrar',
        filtering: 'Filtrando...',
        filterError: 'No se pudieron cargar las empresas. Inténtalo de nuevo.',
        place: 'Puesto',
        company: 'Empresa',
        reviews: 'Reseñas',
        rating: 'Puntuación',
        programs: 'Programas',
        mobilePlace: 'Puesto',
        verifiedProfile: 'Perfil verificado',
        details: 'Detalles',
        noResults: 'Ninguna empresa coincide con los filtros seleccionados.',
        aboutRating: 'Sobre la clasificación',
        chooseCompany: 'Cómo elegir una aseguradora',
        chooseCompanyText1: 'No compruebes solo el precio: revisa exclusiones, límites de cobertura, el proceso de siniestros y la experiencia de clientes con pagos reales.',
        chooseCompanyText2: 'La puntuación general de Trusty se calcula con reseñas publicadas. El perfil y las promesas publicitarias no mejoran por sí solos la posición en la tabla.',
      },
      detail: {
        ratingsBreadcrumb: 'Clasificación de aseguradoras',
        notSpecified: 'No especificado',
        verifiedProfile: 'Perfil verificado',
        companyRating: 'Puntuación de la empresa',
        customerReviews: 'reseñas de clientes',
        overview: 'Resumen',
        reviews: 'Reseñas',
        specifications: 'Detalles',
        independentReview: 'Análisis independiente',
        aboutCompanyPrefix: 'Sobre',
        advantages: 'Ventajas',
        disadvantages: 'Desventajas',
        emptyList: 'Todavía no se ha indicado',
        experiencePrefix: '¿Tienes experiencia con',
        experienceText: 'Una reseña detallada sobre la compra de una póliza o la gestión de un siniestro ayudará a otros viajeros a decidir mejor.',
        companyCard: 'Ficha de empresa',
        keyDetails: 'Datos principales',
      },
      footer: {
        insurance: 'Seguros',
        companyRatings: 'Clasificación de empresas',
        findInsurer: 'Buscar aseguradora',
        forCompanies: 'Para empresas',
        loginToProfile: 'Entrar al perfil',
        copyright: 'Catálogo independiente de reseñas de seguros.',
      },
    },
    companyDetail: {
      officialSite: 'Sitio web oficial',
      foundedYear: 'Año de fundación',
      city: 'Ciudad',
      country: 'País',
      phone: 'Teléfono',
      email: 'Email',
      address: 'Dirección',
      insuranceTypesLabel: 'Tipos de seguro',
      aboutTitle: 'Sobre la empresa',
      noDescription: 'Todavía no se ha añadido una descripción.',
      advantages: 'Ventajas',
      disadvantages: 'Desventajas',
      specTitle: 'Datos de la empresa',
      reviewsSuffix: 'reseñas',
    },
    companyReviewsPage: {
      titlePrefix: 'Reseñas de',
      addReview: 'Añadir reseña',
      noReviews: '¡Todavía no hay reseñas. Sé el primero!',
      criteria: {
        coverage: 'Cobertura',
        price: 'Precio de la póliza',
        claimsService: 'Gestión de siniestros',
        support: 'Atención y soporte',
      },
    },
    ratingsPage: {
      title: 'Clasificación de aseguradoras',
      subtitle: 'La clasificación se basa en la puntuación media de las reseñas publicadas.',
    },
    articlesPage: {
      title: 'Artículos y guías sobre seguros',
      noArticles: 'Todavía no hay artículos.',
    },
    addCompanyPage: {
      title: 'Añadir una aseguradora',
      subtitle: 'Tu solicitud será revisada. Tras la aprobación, la ficha se publicará.',
      nameLabel: 'Nombre de la empresa *',
      websiteLabel: 'Sitio web de la empresa',
      cityLabel: 'Ciudad',
      countryLabel: 'País',
      countryPlaceholder: 'Selecciona un país',
      insuranceTypesLabel: 'Tipos de seguro',
      descriptionLabel: 'Descripción breve',
      submitBtn: 'Enviar para revisión',
      submittingBtn: 'Enviando...',
      successMsg: '¡Gracias! Tu solicitud aparecerá en el sitio tras la revisión del moderador.',
      errorMsg: 'No se pudo enviar el formulario. Inténtalo de nuevo.',
      introText:
        'Trusty es un catálogo independiente y añadir una empresa es gratis. Completa el formulario — la ficha se publica justo después de la revisión del moderador.',
      stepsTitle: '¿Cómo añadir una empresa?',
      stepsSubtitle: 'Solo 3 pasos simples',
      step1Title: 'Completa el formulario',
      step1Text: 'Indica el nombre, sitio web, país y los tipos de seguro que ofrece la empresa.',
      step2Title: 'Moderación',
      step2Text: 'Revisaremos los datos — normalmente en menos de un día hábil.',
      step3Title: 'Ficha en el catálogo',
      step3Text: 'La empresa aparece en la clasificación general y los clientes pueden dejar reseñas.',
      whyTitle: '¿Por qué añadir una empresa a Trusty?',
      whyText:
        'Cuantas más empresas haya en el catálogo, más fácil será para los viajeros comparar condiciones y encontrar una aseguradora confiable. La ficha se puede ampliar más adelante, y las empresas verificadas reciben un distintivo de confianza junto al nombre.',
      formTitle: 'Formulario de la empresa',
    },
    addReviewPage: {
      title: 'Dejar una reseña',
      subtitle: 'Tu reseña aparecerá en el sitio tras la revisión del moderador.',
      companyLabel: 'Empresa *',
      companyPlaceholder: 'Selecciona una empresa',
      nameLabel: 'Tu nombre *',
      emailLabel: 'Email',
      ratingLabel: 'Puntuación *',
      criteriaLabel: 'Puntuaciones por criterio',
      titleLabel: 'Título de la reseña *',
      bodyLabel: 'Texto de la reseña *',
      prosLabel: 'Ventajas (una por línea)',
      consLabel: 'Desventajas (una por línea)',
      recommendLabel: 'Recomiendo esta empresa',
      submitBtn: 'Enviar reseña',
      submittingBtn: 'Enviando...',
      successMsg: '¡Gracias por tu reseña! Aparecerá tras la moderación.',
      errorMsg: 'No se pudo enviar la reseña. Inténtalo de nuevo.',
      loggedInAs: 'Estás escribiendo esta reseña como',
      introText:
        'Tu reseña ayuda a otros viajeros a elegir una aseguradora confiable — y se suma a la clasificación general tras la aprobación del moderador.',
      stepsTitle: '¿Cómo dejar una reseña?',
      stepsSubtitle: 'Solo 3 pasos simples',
      step1Title: 'Encuentra la empresa',
      step1Text: 'Elige en el catálogo la aseguradora con la que tuviste experiencia.',
      step2Title: 'Describe tu experiencia',
      step2Text: 'Puntúala y cuenta las ventajas y desventajas — toma solo un par de minutos.',
      step3Title: 'Moderación y publicación',
      step3Text: 'Tras la revisión, tu reseña aparece en la página de la empresa y afecta su clasificación.',
      whyTitle: '¿Por qué dejar reseñas?',
      whyText:
        'Las reseñas reales de clientes son la base de la clasificación de Trusty. Ayudan a otros viajeros a ver cómo se comporta realmente una empresa ante un siniestro, no solo lo que dice su publicidad.',
      formTitle: 'Formulario de reseña',
    },
    addComplaintPage: {
      title: 'Presentar una queja',
      subtitle:
        'Cuéntanos qué pasó — tu queja aparecerá en el sitio tras la revisión del moderador, y el representante de la empresa podrá responder.',
      companyLabel: 'Empresa *',
      companyPlaceholder: 'Selecciona una empresa',
      nameLabel: 'Tu nombre *',
      emailLabel: 'Email',
      titleLabel: 'Motivo de la queja *',
      bodyLabel: 'Describe el problema *',
      submitBtn: 'Enviar queja',
      submittingBtn: 'Enviando...',
      successMsg: '¡Queja recibida! Aparecerá en el sitio tras la moderación.',
      errorMsg: 'No se pudo enviar la queja. Inténtalo de nuevo.',
      loggedInAs: 'Estás presentando esta queja como',
      introText:
        'Si una aseguradora incumplió las condiciones de la póliza, retrasó un pago o rechazó un siniestro sin motivo, cuéntanoslo. Las quejas son visibles para otros usuarios y afectan la reputación de la empresa.',
      stepsTitle: '¿Cómo presentar una queja?',
      stepsSubtitle: 'Solo 3 pasos simples',
      step1Title: 'Elige la empresa',
      step1Text: 'Indica la aseguradora a la que se refiere la queja.',
      step2Title: 'Describe la situación',
      step2Text: 'Explica brevemente qué pasó y qué esperabas en su lugar.',
      step3Title: 'Respuesta de la empresa',
      step3Text: 'Tras la moderación, la queja se publica y el representante de la empresa puede responder.',
      whyTitle: '¿Por qué presentar una queja?',
      whyText:
        'Las quejas son una señal para otros viajeros y para la propia empresa. Publicar los problemas abiertamente impulsa a las aseguradoras a responder más rápido a los siniestros y cumplir lo prometido en la póliza.',
      formTitle: 'Formulario de queja',
    },
    reviewCard: {
      pros: 'Ventajas',
      cons: 'Desventajas',
      recommends: 'Recomienda',
      reply: 'Responder a la reseña',
      companyRep: 'representante de la empresa',
    },
    notFound: {
      title: 'Página no encontrada',
      text: 'Esta página no existe o ha sido movida.',
      backHome: 'Volver al inicio',
    },
    auth: {
      register: 'Registrarse',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      name: 'Nombre',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      account: 'Cuenta',
      myAccount: 'Mi cuenta',
      registerBtn: 'Crear cuenta',
      loginBtn: 'Iniciar sesión',
      alreadyHaveAccount: '¿Ya tienes cuenta? Inicia sesión',
      noAccountYet: '¿No tienes cuenta? Regístrate',
      registerSuccess: '¡Registro exitoso! Ya puedes iniciar sesión.',
      loginError: 'Email o contraseña incorrectos.',
      registerError: 'No se pudo registrar. Revisa los datos e inténtalo de nuevo.',
      logoutBtn: 'Cerrar sesión',
      writingAsAccount: 'Sesión iniciada como',
      passwordResetHint: '¿Olvidaste tu contraseña? Contáctanos para restablecerla manualmente.',
      notLoggedIn: 'No has iniciado sesión.',
      registerIntro:
        'Una cuenta te permite responder a tus propias reseñas, seguir tus quejas y publicar nuevas más rápido.',
      registerBenefit1: 'Las reseñas y quejas se publican con tu nombre, sin volver a ingresar tus datos',
      registerBenefit2: 'Historial de tus reseñas y quejas en tu cuenta',
      registerBenefit3: 'Notificaciones cuando las empresas respondan',
      loginIntro: 'Inicia sesión para publicar reseñas y quejas con tu cuenta y seguir su estado.',
      myReviews: 'Mis reseñas',
      myComplaints: 'Mis quejas',
      noReviewsYet: 'Todavía no has enviado reseñas.',
      noComplaintsYet: 'Todavía no has presentado quejas.',
      activityLoading: 'Cargando tu actividad...',
      submissionStatus: {
        pending: 'En moderación',
        published: 'Publicado',
        hidden: 'Oculto',
        rejected: 'Rechazado',
        spam: 'Spam',
      },
    },
  },
} as const
