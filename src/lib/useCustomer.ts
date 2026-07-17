'use client'

import { useCallback, useEffect, useState } from 'react'

export type Customer = { id: string; email: string; name?: string; subscriptions: string[] }

// Небольшой клиентский хук для проверки текущей сессии посетителя сайта
// (коллекция `customers`, отдельная от админской `users`). Использует
// отдельный POST-эндпоинт с cookie-сессией. Он возвращает только безопасные
// публичные поля клиента и не раскрывает внутренние auth-поля Payload.
export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customer-session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
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
