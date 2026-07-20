'use client'

import { RatingStars } from './RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import { useState } from 'react'
import Link from '@/components/LocalizedLink'
import { useCustomer } from '@/lib/useCustomer'

type Reply = {
  id: string
  authorName: string
  authorType: 'admin' | 'company' | 'customer'
  body: string
  createdAt: string
}

type ReviewCardProps = {
  reviewId: string
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
  criteria?: Partial<Record<'coverage' | 'price' | 'claimsService' | 'support', number>>
}

const localeToIntl: Record<string, string> = { ru: 'ru-RU', en: 'en-US', es: 'es-ES' }

const metadataCopy = {
  ru: { purchase: 'Покупка полиса', claim: 'Страховой случай', verified: 'Опыт подтвержден', outcome: 'Результат', amount: 'Сумма', response: 'Ответ компании', outcomes: { paid: 'выплачено полностью', partially_paid: 'выплачено частично', denied: 'отказано', pending: 'рассматривается', not_applicable: 'не применимо' }, times: { same_day: 'в тот же день', '1_3_days': '1-3 дня', '4_7_days': '4-7 дней', '8_30_days': '8-30 дней', more_30_days: 'более 30 дней', no_response: 'ответа не было' } },
  en: { purchase: 'Policy purchase', claim: 'Claim experience', verified: 'Verified experience', outcome: 'Outcome', amount: 'Amount', response: 'Company response', outcomes: { paid: 'paid in full', partially_paid: 'partially paid', denied: 'denied', pending: 'pending', not_applicable: 'not applicable' }, times: { same_day: 'same day', '1_3_days': '1-3 days', '4_7_days': '4-7 days', '8_30_days': '8-30 days', more_30_days: 'more than 30 days', no_response: 'no response' } },
  es: { purchase: 'Compra de póliza', claim: 'Experiencia de siniestro', verified: 'Experiencia verificada', outcome: 'Resultado', amount: 'Importe', response: 'Respuesta de la empresa', outcomes: { paid: 'pagado por completo', partially_paid: 'pagado parcialmente', denied: 'rechazado', pending: 'en revisión', not_applicable: 'no aplicable' }, times: { same_day: 'el mismo día', '1_3_days': '1-3 días', '4_7_days': '4-7 días', '8_30_days': '8-30 días', more_30_days: 'más de 30 días', no_response: 'sin respuesta' } },
} as const

const actionCopy = {
  ru: { helpful: 'Отзыв полезен?', up: 'Да', down: 'Нет', reply: 'Ответить', signIn: 'Войдите, чтобы ответить', placeholder: 'Напишите содержательный ответ', send: 'Отправить на модерацию', sending: 'Отправка…', sent: 'Ответ отправлен на модерацию.', error: 'Не удалось выполнить действие. Попробуйте ещё раз.', cancel: 'Отмена', criteria: 'Оценки по критериям' },
  en: { helpful: 'Was this review helpful?', up: 'Yes', down: 'No', reply: 'Reply', signIn: 'Sign in to reply', placeholder: 'Write a helpful reply', send: 'Send for moderation', sending: 'Sending…', sent: 'Your reply was sent for moderation.', error: 'The action could not be completed. Please try again.', cancel: 'Cancel', criteria: 'Criterion scores' },
  es: { helpful: '¿Te resultó útil?', up: 'Sí', down: 'No', reply: 'Responder', signIn: 'Inicia sesión para responder', placeholder: 'Escribe una respuesta útil', send: 'Enviar a moderación', sending: 'Enviando…', sent: 'Tu respuesta fue enviada a moderación.', error: 'No se pudo completar la acción. Inténtalo de nuevo.', cancel: 'Cancelar', criteria: 'Puntuaciones por criterio' },
} as const

export function ReviewCard({
  reviewId,
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
  criteria = {},
}: ReviewCardProps) {
  const { t, locale } = useLanguage()
  const { customer } = useCustomer()
  const meta = metadataCopy[locale]
  const actions = actionCopy[locale]
  const [voteCounts, setVoteCounts] = useState({ up: helpfulUp, down: helpfulDown })
  const [selectedVote, setSelectedVote] = useState<'up' | 'down' | null>(null)
  const [voteLoading, setVoteLoading] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyStatus, setReplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const date = new Date(createdAt).toLocaleDateString(localeToIntl[locale] || 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const criterionEntries = (['coverage', 'price', 'claimsService', 'support'] as const)
    .flatMap((key) => typeof criteria[key] === 'number' ? [[key, criteria[key]] as const] : [])

  async function submitVote(direction: 'up' | 'down') {
    if (voteLoading) return
    setVoteLoading(true)
    try {
      const response = await fetch('/api/review-actions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', reviewId, direction }),
      })
      if (!response.ok) throw new Error('Vote failed')
      const result = await response.json()
      setVoteCounts({ up: result.helpfulUp, down: result.helpfulDown })
      setSelectedVote(result.vote)
    } catch {
      setReplyStatus('error')
    } finally {
      setVoteLoading(false)
    }
  }

  async function submitReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const body = new FormData(form).get('replyBody')
    setReplyStatus('loading')
    try {
      const response = await fetch('/api/review-actions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', reviewId, body }),
      })
      if (!response.ok) throw new Error('Reply failed')
      form.reset()
      setReplyStatus('success')
      setReplyOpen(false)
    } catch {
      setReplyStatus('error')
    }
  }

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

      {criterionEntries.length > 0 && (
        <div className="border border-gray-100 bg-[#fafbfc] p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">{actions.criteria}</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {criterionEntries.map(([key, value]) => (
              <div key={key}>
                <div className="text-xs text-gray-500">{t.companyReviewsPage.criteria[key]}</div>
                <div className="mt-1 flex items-center gap-2"><RatingStars value={value} size="sm" /><strong className="text-xs">{value}/5</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-3 text-sm text-gray-500">
        <div className="flex flex-wrap items-center gap-2">
          {recommend && <span className="text-emerald-700 font-medium">{t.reviewCard.recommends}</span>}
          <span className="ml-1 text-xs">{actions.helpful}</span>
          <button type="button" onClick={() => submitVote('up')} disabled={voteLoading} aria-pressed={selectedVote === 'up'} className={`border px-2 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${selectedVote === 'up' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white hover:border-emerald-400'}`}>👍 {actions.up} {voteCounts.up}</button>
          <button type="button" onClick={() => submitVote('down')} disabled={voteLoading} aria-pressed={selectedVote === 'down'} className={`border px-2 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${selectedVote === 'down' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 bg-white hover:border-rose-300'}`}>👎 {actions.down} {voteCounts.down}</button>
        </div>
        {customer ? <button type="button" onClick={() => { setReplyOpen((open) => !open); setReplyStatus('idle') }} className="font-semibold text-brand hover:underline">{actions.reply}</button> : <Link href="/login" className="font-semibold text-brand hover:underline">{actions.signIn}</Link>}
      </div>

      {replyOpen && customer && (
        <form onSubmit={submitReply} className="border-l-4 border-brand bg-brand-light/20 p-4">
          <label htmlFor={`reply-${reviewId}`} className="form-label">{actions.reply}</label>
          <textarea id={`reply-${reviewId}`} name="replyBody" required minLength={5} maxLength={2000} rows={4} className="form-control" placeholder={actions.placeholder} />
          <div className="mt-3 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setReplyOpen(false)} className="btn-secondary">{actions.cancel}</button><button type="submit" disabled={replyStatus === 'loading'} className="btn-primary disabled:opacity-60">{replyStatus === 'loading' ? actions.sending : actions.send}</button></div>
        </form>
      )}
      {replyStatus === 'success' && <p role="status" className="border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{actions.sent}</p>}
      {replyStatus === 'error' && <p role="alert" className="border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actions.error}</p>}

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
