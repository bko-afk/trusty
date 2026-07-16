'use client'

import { useCallback, useEffect, useState } from 'react'

export type Customer = { id: string; email: string; name?: string }

// Небольшой клиентский хук для проверки текущей сессии посетителя сайта
// (коллекция `customers`, отдельная от админской `users`). Использует
// стандартный эндпоинт Payload /api/{slug}/me с cookie-сессией.
export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customers/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setCustomer(data?.user || null)
      } else {
        setCustomer(null)
      }
    } catch {
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function logout() {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
    setCustomer(null)
  }

  return { customer, loading, refresh, logout }
}
