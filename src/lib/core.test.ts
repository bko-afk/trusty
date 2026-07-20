import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReviewStats } from './companyReviewStats'
import { localizePath, splitLocalePath } from '@/i18n/routing'
import { safeHttpUrl } from './safeUrl'

test('published rating statistics include the overall and criterion averages', () => {
  const stats = calculateReviewStats([
    { rating: 5, includeInRating: true, criteria: { coverage: 5, support: 4 } },
    { rating: 3, includeInRating: true, criteria: { coverage: 3, support: 2 } },
    { rating: 1, includeInRating: false, criteria: { coverage: 1, support: 1 } },
  ])

  assert.equal(stats.ratingReviewCount, 2)
  assert.equal(stats.overallRating, 4)
  assert.equal(stats.criteriaAverages.coverage, 4)
  assert.equal(stats.criteriaAverages.support, 3)
})

test('localized routes keep one locale prefix and preserve query and hash', () => {
  assert.equal(localizePath('/ru/companies?page=2#results', 'es'), '/es/companies?page=2#results')
  assert.equal(localizePath('/companies', 'en'), '/companies')
  assert.deepEqual(splitLocalePath('/es/articles'), { locale: 'es', pathname: '/articles' })
})

test('external URLs only allow credential-free HTTP and HTTPS links', () => {
  assert.equal(safeHttpUrl('https://example.com/path'), 'https://example.com/path')
  assert.equal(safeHttpUrl('javascript:alert(1)'), undefined)
  assert.equal(safeHttpUrl('data:text/html,unsafe'), undefined)
  assert.equal(safeHttpUrl('https://user:pass@example.com'), undefined)
})
