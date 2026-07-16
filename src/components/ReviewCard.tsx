'use client'

import { RatingStars } from './RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'

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
  pros?: string[]
  cons?: string[]
  recommend?: boolean
  createdAt: string
  helpfulUp?: number
  helpfulDown?: number
  replies?: Reply[]
}

const localeToIntl: Record<string, string> = { ru: 'ru-RU', en: 'en-US', es: 'es-ES' }

export function ReviewCard({
  authorName,
  title,
  body,
  rating,
  pros = [],
  cons = [],
  recommend,
  createdAt,
  helpfulUp = 0,
  helpfulDown = 0,
  replies = [],
}: ReviewCardProps) {
  const { t, locale } = useLanguage()
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
