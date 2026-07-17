import { getPayload } from 'payload'
import config from '@/payload.config'

const cards = [
  { key: 'reviews', label: 'Отзывы на модерации', href: '/admin/collections/reviews', color: '#5c24b8' },
  { key: 'complaints', label: 'Жалобы на модерации', href: '/admin/collections/complaints', color: '#c2415d' },
  { key: 'companies', label: 'Компании-черновики', href: '/admin/collections/companies', color: '#579c9e' },
] as const

export async function AdminDashboard() {
  const payload = await getPayload({ config })
  const [reviews, complaints, companies] = await Promise.all([
    payload.count({ collection: 'reviews', where: { status: { equals: 'pending' } } }),
    payload.count({ collection: 'complaints', where: { status: { equals: 'pending' } } }),
    payload.count({ collection: 'companies', where: { status: { equals: 'draft' } } }),
  ])
  const values = { reviews: reviews.totalDocs, complaints: complaints.totalDocs, companies: companies.totalDocs }

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ color: '#579c9e', fontSize: 12, fontWeight: 800, letterSpacing: '.12em', margin: 0, textTransform: 'uppercase' }}>Trusty Control Center</p>
        <h1 style={{ fontSize: 30, letterSpacing: '-.03em', margin: '6px 0 8px' }}>Что требует внимания</h1>
        <p style={{ color: 'var(--theme-elevation-500)', margin: 0 }}>Сначала проверьте новые публикации, затем управляйте позициями компаний и блоками главной.</p>
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        {cards.map((card) => (
          <a key={card.key} href={card.href} style={{ background: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-150)', borderLeft: `4px solid ${card.color}`, color: 'inherit', padding: 18, textDecoration: 'none' }}>
            <strong style={{ color: card.color, display: 'block', fontSize: 30 }}>{values[card.key]}</strong>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 700, marginTop: 4 }}>{card.label}</span>
          </a>
        ))}
        <a href="/admin/globals/site-settings" style={{ background: '#071b45', border: '1px solid #071b45', color: '#fff', padding: 18, textDecoration: 'none' }}>
          <strong style={{ color: '#80c5c7', display: 'block', fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase' }}>Настройки сайта</strong>
          <span style={{ display: 'block', fontSize: 16, fontWeight: 700, marginTop: 12 }}>Блоки главной и подборки компаний →</span>
        </a>
      </div>
    </section>
  )
}
