import type { Dictionary } from '@/i18n/dictionary'

// Заголовки видов страхования хранятся в БД на русском (это контент,
// а не статичный UI-текст, поэтому обычный словарь его не покрывает).
// Для четырёх известных на сегодня видов подставляем перевод по slug;
// для новых видов, которые администратор добавит сам, используем то,
// что он написал в админке (перевести на лету мы не можем).
export function insuranceTypeLabel(t: Dictionary, type: { slug: string; title: string }): string {
  return (t.insuranceTypeNames as Record<string, string | undefined>)[type.slug] || type.title
}
