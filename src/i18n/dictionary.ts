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
    articlesTitle: string
    aboutTitle: string
    aboutText: string
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
  }
  catalog: {
    title: string
    allTypes: string
    allCountries: string
    noResultsForType: string
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
  }
  addReviewPage: {
    title: string
    subtitle: string
    companyLabel: string
    companyPlaceholder: string
    nameLabel: string
    emailLabel: string
    ratingLabel: string
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
    },
    catalog: {
      title: 'Каталог страховых компаний',
      allTypes: 'Все виды',
      allCountries: 'Все страны',
      noResultsForType: 'По этому виду страхования пока нет компаний.',
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
    },
    addReviewPage: {
      title: 'Оставить отзыв',
      subtitle: 'Отзыв появится на сайте после проверки модератором.',
      companyLabel: 'Компания *',
      companyPlaceholder: 'Выберите компанию',
      nameLabel: 'Ваше имя *',
      emailLabel: 'Email',
      ratingLabel: 'Оценка *',
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
    },
    catalog: {
      title: 'Insurance company catalog',
      allTypes: 'All types',
      allCountries: 'All countries',
      noResultsForType: 'No companies for this insurance type yet.',
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
    },
    addReviewPage: {
      title: 'Leave a review',
      subtitle: 'Your review will appear on the site after moderator review.',
      companyLabel: 'Company *',
      companyPlaceholder: 'Select a company',
      nameLabel: 'Your name *',
      emailLabel: 'Email',
      ratingLabel: 'Rating *',
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
    },
    catalog: {
      title: 'Catálogo de aseguradoras',
      allTypes: 'Todos los tipos',
      allCountries: 'Todos los países',
      noResultsForType: 'Todavía no hay empresas para este tipo de seguro.',
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
    },
    addReviewPage: {
      title: 'Dejar una reseña',
      subtitle: 'Tu reseña aparecerá en el sitio tras la revisión del moderador.',
      companyLabel: 'Empresa *',
      companyPlaceholder: 'Selecciona una empresa',
      nameLabel: 'Tu nombre *',
      emailLabel: 'Email',
      ratingLabel: 'Puntuación *',
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
    },
  },
} as const
