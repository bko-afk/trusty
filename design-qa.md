# Design QA

## Comparison target

- Source visual truth: `https://eto-razvod.ru/`, `https://eto-razvod.ru/insurance/`
- Source captures: `/private/tmp/eto-razvod-reference-desktop.png`, `/private/tmp/eto-razvod-home-mobile.png`, `/private/tmp/eto-razvod-insurance-desktop.png`, `/private/tmp/eto-razvod-insurance-mobile.png`
- Implementation: `http://localhost:3000/`, `http://localhost:3000/companies`, `http://localhost:3000/companies/ekta`
- Implementation captures: `/private/tmp/trusty-home-desktop.png`, `/private/tmp/trusty-home-mobile-viewport.png`, `/private/tmp/trusty-catalog-mobile.png`
- Comparison images: `/private/tmp/trusty-home-comparison-desktop.png`, `/private/tmp/trusty-home-comparison-mobile.png`, `/private/tmp/trusty-catalog-comparison-mobile.png`
- Viewports: desktop `1440 x 900`; mobile `390 x 844`
- State: public, signed out, Russian locale

## Full-view comparison evidence

The implementation preserves the source hierarchy: utility header, search-led home hero, service cards, rating list, review stream, dense footer, and a separate white rating page with breadcrumbs, circular category marker, category links, filter, and ranked company rows. The product scope intentionally excludes non-insurance categories and articles.

## Focused region comparison evidence

Mobile hero and mobile insurance ranking were compared side by side. The generated implementation keeps the source purple/white palette, bold geometric typography, stacked search fields, underlined category links, table-to-card behavior, and green account action. It is intentionally more compact than the source and avoids the source's clipped mobile heading.

## Required fidelity surfaces

- Fonts and typography: Avenir Next/Trebuchet fallback approximates the source's geometric sans; heading weights, tight tracking, and body hierarchy are consistent. No actionable wrapping or truncation remains.
- Spacing and layout rhythm: desktop uses the source's wide centered frame and thin dividers; mobile measures `390px` content width inside a `390px` viewport with no horizontal overflow.
- Colors and visual tokens: deep navy, saturated purple, muted teal, cool gray surfaces, and green account action map to the source.
- Image quality and asset fidelity: existing company logos remain local; the old placeholder illustration was replaced by a project-local generated editorial asset at `public/images/trusty-insurance-rating.png` with an appropriate crop and palette.
- Copy and content: universal categories, articles, and unrelated services were removed from the visible experience; copy is insurance-specific.
- Interactions and accessibility: filter toggle, labelled company search, verified checkbox, catalog navigation, company detail navigation, alt text, and semantic headings/links were checked.

## Comparison history

### Pass 1

- P2 responsiveness: review cards produced a `482px` document width in the `390px` mobile viewport because `contain-intrinsic-size` supplied an intrinsic inline size.
- Fix: changed the optimization to `contain-intrinsic-block-size: 420px` so only off-screen height is reserved.
- Post-fix evidence: browser metrics report `clientWidth: 390`, `scrollWidth: 390`, and `bodyScrollWidth: 390`; mobile screenshots show the hero and catalog without horizontal scrolling.

### Pass 2

- P2 scope drift: the previous header/home/footer exposed articles, complaints, and generic catalog actions.
- Fix: visible navigation and home content now focus on insurance search, company ratings, reviews, and insurer profiles. Existing hidden routes remain to avoid breaking CMS data.
- Post-fix evidence: DOM snapshots for `/`, `/companies`, and `/companies/ekta` contain only insurance-focused primary navigation and content.

## Browser verification

- Page identity: passed for `/`, `/companies`, and `/companies/ekta`.
- Non-blank render and framework overlay: passed.
- Console errors/warnings: none relevant on checked routes.
- Primary interaction: `/` -> `Открыть рейтинг` -> `Показать фильтр` -> enter `EKTA` -> one result remains -> open `/companies/ekta`; passed.
- Responsive behavior: desktop and mobile checked; no mobile horizontal overflow.

## Remaining P3 polish

- The local Trusty logo and generated methodology illustration intentionally replace the source brand assets.
- The insurance-only dataset has five companies, so the ranking is shorter than the reference's production dataset.

final result: passed
