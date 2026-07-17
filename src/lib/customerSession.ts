export type CustomerSession = {
  id: string
  email: string
  name?: string
  subscriptions: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function toCustomerSession(user: unknown): CustomerSession | null {
  if (!isRecord(user) || user.collection !== 'customers' || typeof user.email !== 'string') return null
  if (typeof user.id !== 'string' && typeof user.id !== 'number') return null

  const subscriptions = Array.isArray(user.companySubscriptions)
    ? user.companySubscriptions.flatMap((company) => {
        if (typeof company === 'string' || typeof company === 'number') return [String(company)]
        if (isRecord(company) && (typeof company.id === 'string' || typeof company.id === 'number')) {
          return [String(company.id)]
        }
        return []
      })
    : []

  return {
    id: String(user.id),
    email: user.email,
    name: typeof user.name === 'string' ? user.name : undefined,
    subscriptions,
  }
}
