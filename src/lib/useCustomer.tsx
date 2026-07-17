'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { CustomerSession } from './customerSession'

type CustomerContextValue = {
  customer: CustomerSession | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextValue | null>(null)

export function CustomerProvider({
  initialCustomer,
  children,
}: {
  initialCustomer: CustomerSession | null
  children: React.ReactNode
}) {
  const [customer, setCustomer] = useState<CustomerSession | null>(initialCustomer)
  const [loading, setLoading] = useState(false)

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

  async function logout() {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
    setCustomer(null)
  }

  return (
    <CustomerContext.Provider value={{ customer, loading, refresh, logout }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (!context) throw new Error('useCustomer must be used inside CustomerProvider')
  return context
}
