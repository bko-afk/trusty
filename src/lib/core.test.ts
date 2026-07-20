import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReviewStats } from './companyReviewStats'
import { localizePath, splitLocalePath } from '@/i18n/routing'
import { safeHttpUrl } from './safeUrl'
import { categoryEditorialPosition, editorialPosition, sortCompaniesByRanking } from './companyRanking'
import { hasPayloadAuthCookie, toCustomerSession } from './customerSession'
import { boundedPage, paginationMeta } from './pagination'

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

test('empty rating statistics stay at zero', () => {
  const stats = calculateReviewStats([])
  assert.equal(stats.overallRating, 0)
  assert.equal(stats.reviewCount, 0)
  assert.deepEqual(stats.criteriaAverages, { coverage: 0, price: 0, claimsService: 0, support: 0 })
})

test('editorial ranking wins before calculated rating', () => {
  const companies = [
    { name: 'High rating', overallRating: 5 },
    { name: 'Editorial first', overallRating: 1, ranking: { globalPosition: 1 } },
  ]
  assert.equal(sortCompaniesByRanking(companies)[0]?.name, 'Editorial first')
  assert.equal(editorialPosition(companies[1]), 1)
})

test('category ranking takes precedence for a selected insurance type', () => {
  const company = {
    ranking: {
      globalPosition: 8,
      categoryPositions: [{ insuranceType: { id: 4 }, position: 2 }],
    },
  }
  assert.equal(categoryEditorialPosition(company, 4), 2)
  assert.equal(editorialPosition(company, [4]), 2)
})

test('customer session exposes only public account data', () => {
  assert.deepEqual(toCustomerSession({
    collection: 'customers',
    id: 7,
    email: 'user@example.com',
    name: 'User',
    password: 'must-not-leak',
    companySubscriptions: [3, { id: 5 }],
  }), {
    id: '7',
    email: 'user@example.com',
    name: 'User',
    subscriptions: ['3', '5'],
  })
})

test('server authentication is skipped when the Payload cookie is absent', () => {
  assert.equal(hasPayloadAuthCookie('locale=en; theme=light'), false)
  assert.equal(hasPayloadAuthCookie('locale=en; payload-token=signed-token'), true)
})

test('pagination rejects invalid values and clamps excessive pages', () => {
  assert.equal(boundedPage('not-a-page'), 1)
  assert.equal(boundedPage(-4), 1)
  assert.equal(boundedPage('20', 10), 10)
  assert.deepEqual(paginationMeta(8, 3), { page: 3, totalPages: 3 })
})
