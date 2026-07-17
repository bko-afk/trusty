'use client'

import { RatingStars } from './RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'

type Reply = {
  id: string
  authorName: string
  authorType: 'admin' | 'company'
  body: string
  createdAt: string
}

type ReviewCardProps = {
  authorName: string
  title: string
  body: string
  rating: number
  experienceType?: 'purchase' | 'claim'
  policyType?: { slug: string; title: string }
  tripCountry?: string
  claimOutcome?: string
  claimAmount?: string
  responseTime?: string
  verifiedExperience?: boolean
  pros?: string[]
  cons?: string[]
  recommend?: boolean
  createdAt: string
  helpfulUp?: number
  helpfulDown?: number
  replies?: Reply[]
}

const localeToIntl: Record<string, string> = { ru: 'ru-RU', en: 'en-US', es: 'es-ES' }

const metadataCopy = {
  ru: { purchase: 'Покупка полиса', claim: 'Страховой случай', verified: 'Опыт подтвержден', outcome: 'Результат', amount: 'Сумма', response: 'Ответ компании', outcomes: { paid: 'выплачено полностью', partially_paid: 'выплачено частично', denied: 'отказано', pending: 'рассматривается', not_applicable: 'не применимо' }, times: { same_day: 'в тот же день', '1_3_days': '1-3 дня', '4_7_days': '4-7 дней', '8_30_days': '8-30 дней', more_30_days: 'более 30 дней', no_response: 'ответа не было' } },
  en: { purchase: 'Policy purchase', claim: 'Claim experience', verified: 'Verified experience', outcome: 'Outcome', amount: 'Amount', response: 'Company response', outcomes: { paid: 'paid in full', partially_paid: 'partially paid', denied: 'denied', pending: 'pending', not_applicable: 'not applicable' }, times: { same_day: 'same day', '1_3_days': '1-3 days', '4_7_days': '4-7 days', '8_30_days': '8-30 days', more_30_days: 'more than 30 days', no_response: 'no response' } },
  es: { purchase: 'Compra de póliza', claim: 'Experiencia de siniestro', verified: 'Experiencia verificada', outcome: 'Resultado', amount: 'Importe', response: 'Respuesta de la empresa', outcomes: { paid: 'pagado por completo', partially_paid: 'pagado parcialmente', denied: 'rechazado', pending: 'en revisión', not_applicable: 'no aplicable' }, times: { same_day: 'el mismo día', '1_3_days': '1-3 días', '4_7_days': '4-7 días', '8_30_days': '8-30 días', more_30_days: 'más de 30 días', no_response: 'sin respuesta' } },
} as const

export function ReviewCard({
  authorName,
  title,
  body,
  rating,
  experienceType = 'purchase',
  policyType,
  tripCountry,
  claimOutcome,
  claimAmount,
  responseTime,
  verifiedExperience,
  pros = [],
  cons = [],
  recommend,
  createdAt,
  helpfulUp = 0,
  helpfulDown = 0,
  replies = [],
}: ReviewCardProps) {
  const { t, locale } = useLanguage()
  const meta = metadataCopy[locale]
  const date = new Date(createdAt).toLocaleDateString(localeToIntl[locale] || 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{authorName}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
        <RatingStars value={rating} />
      </div>

      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="flex flex-wrap gap-2 text-xs"><span className="bg-gray-100 px-3 py-1 font-bold">{experienceType === 'claim' ? meta.claim : meta.purchase}</span>{verifiedExperience && <span className="bg-emerald-50 px-3 py-1 font-bold text-emerald-700">{meta.verified}</span>}{policyType && <span className="bg-brand-light/40 px-3 py-1 font-bold text-brand-dark">{insuranceTypeLabel(t, policyType)}</span>}{tripCountry && <span className="bg-gray-100 px-3 py-1">{countryName(tripCountry, locale)}</span>}</div>
      {(experienceType === 'claim' || responseTime) && <dl className="grid gap-2 border-l-4 border-brand bg-brand-light/20 p-3 text-sm sm:grid-cols-3">{claimOutcome && <div><dt className="text-xs text-gray-500">{meta.outcome}</dt><dd className="font-bold">{meta.outcomes[claimOutcome as keyof typeof meta.outcomes] || claimOutcome}</dd></div>}{claimAmount && <div><dt className="text-xs text-gray-500">{meta.amount}</dt><dd className="font-bold">{claimAmount}</dd></div>}{responseTime && <div><dt className="text-xs text-gray-500">{meta.response}</dt><dd className="font-bold">{meta.times[responseTime as keyof typeof meta.times] || responseTime}</dd></div>}</dl>}
      <p className="text-gray-700 whitespace-pre-line">{body}</p>

      {(pros.length > 0 || cons.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {pros.length > 0 && (
            <div>
              <div className="text-sm font-medium text-emerald-700 mb-1">{t.reviewCard.pros}</div>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
                {pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div>
              <div className="text-sm font-medium text-rose-700 mb-1">{t.reviewCard.cons}</div>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
                {cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500">
        <div className="flex items-center gap-3">
          {recommend && <span className="text-emerald-700 font-medium">{t.reviewCard.recommends}</span>}
          <span>👍 {helpfulUp}</span>
          <span>👎 {helpfulDown}</span>
        </div>
        <button type="button" className="text-brand hover:underline">
          {t.reviewCard.reply}
        </button>
      </div>

      {replies.length > 0 && (
        <div className="mt-2 space-y-3 border-l-2 border-brand-light pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-brand-light/40 rounded-lg p-3">
              <div className="text-sm font-medium">
                {reply.authorName}
                {reply.authorType === 'company' && (
                  <span className="ml-2 text-[11px] text-brand-dark">{t.reviewCard.companyRep}</span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1">{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
