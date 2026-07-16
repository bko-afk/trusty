import type { Locale } from '@/i18n/dictionary'

// Небольшой список стран, актуальных для туристического страхования
// (основные рынки и популярные направления). Код страны — ISO 3166-1
// alpha-2, флаг генерируется из кода без внешних картинок/сервисов.
export type Country = {
  code: string
  ru: string
  en: string
  es: string
}

export const countries: Country[] = [
  { code: 'RU', ru: 'Россия', en: 'Russia', es: 'Rusia' },
  { code: 'UA', ru: 'Украина', en: 'Ukraine', es: 'Ucrania' },
  { code: 'BY', ru: 'Беларусь', en: 'Belarus', es: 'Bielorrusia' },
  { code: 'KZ', ru: 'Казахстан', en: 'Kazakhstan', es: 'Kazajistán' },
  { code: 'UZ', ru: 'Узбекистан', en: 'Uzbekistan', es: 'Uzbekistán' },
  { code: 'AM', ru: 'Армения', en: 'Armenia', es: 'Armenia' },
  { code: 'GE', ru: 'Грузия', en: 'Georgia', es: 'Georgia' },
  { code: 'AZ', ru: 'Азербайджан', en: 'Azerbaijan', es: 'Azerbaiyán' },
  { code: 'US', ru: 'США', en: 'United States', es: 'Estados Unidos' },
  { code: 'GB', ru: 'Великобритания', en: 'United Kingdom', es: 'Reino Unido' },
  { code: 'DE', ru: 'Германия', en: 'Germany', es: 'Alemania' },
  { code: 'FR', ru: 'Франция', en: 'France', es: 'Francia' },
  { code: 'ES', ru: 'Испания', en: 'Spain', es: 'España' },
  { code: 'IT', ru: 'Италия', en: 'Italy', es: 'Italia' },
  { code: 'PT', ru: 'Португалия', en: 'Portugal', es: 'Portugal' },
  { code: 'NL', ru: 'Нидерланды', en: 'Netherlands', es: 'Países Bajos' },
  { code: 'PL', ru: 'Польша', en: 'Poland', es: 'Polonia' },
  { code: 'CZ', ru: 'Чехия', en: 'Czech Republic', es: 'República Checa' },
  { code: 'TR', ru: 'Турция', en: 'Turkey', es: 'Turquía' },
  { code: 'AE', ru: 'ОАЭ', en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos' },
  { code: 'EG', ru: 'Египет', en: 'Egypt', es: 'Egipto' },
  { code: 'TH', ru: 'Таиланд', en: 'Thailand', es: 'Tailandia' },
  { code: 'VN', ru: 'Вьетнам', en: 'Vietnam', es: 'Vietnam' },
  { code: 'ID', ru: 'Индонезия', en: 'Indonesia', es: 'Indonesia' },
  { code: 'IN', ru: 'Индия', en: 'India', es: 'India' },
  { code: 'CN', ru: 'Китай', en: 'China', es: 'China' },
  { code: 'JP', ru: 'Япония', en: 'Japan', es: 'Japón' },
  { code: 'KR', ru: 'Южная Корея', en: 'South Korea', es: 'Corea del Sur' },
  { code: 'CA', ru: 'Канада', en: 'Canada', es: 'Canadá' },
  { code: 'MX', ru: 'Мексика', en: 'Mexico', es: 'México' },
  { code: 'BR', ru: 'Бразилия', en: 'Brazil', es: 'Brasil' },
  { code: 'AR', ru: 'Аргентина', en: 'Argentina', es: 'Argentina' },
  { code: 'AU', ru: 'Австралия', en: 'Australia', es: 'Australia' },
  { code: 'GR', ru: 'Греция', en: 'Greece', es: 'Grecia' },
  { code: 'CY', ru: 'Кипр', en: 'Cyprus', es: 'Chipre' },
  { code: 'RS', ru: 'Сербия', en: 'Serbia', es: 'Serbia' },
  { code: 'MC', ru: 'Монако', en: 'Monaco', es: 'Mónaco' },
  { code: 'CH', ru: 'Швейцария', en: 'Switzerland', es: 'Suiza' },
  { code: 'AT', ru: 'Австрия', en: 'Austria', es: 'Austria' },
  { code: 'MV', ru: 'Мальдивы', en: 'Maldives', es: 'Maldivas' },
  { code: 'LK', ru: 'Шри-Ланка', en: 'Sri Lanka', es: 'Sri Lanka' },
]

export function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

export function countryName(code: string, locale: Locale): string {
  const country = countries.find((c) => c.code === code)
  if (!country) return code
  return country[locale]
}
