'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Store {
  id: string
  name: string
  slug: string
}

interface Subscription {
  id?: string
  email: string
  store_preferences: string[]
  notification_preference: string
  is_active: boolean
}

export default function SubscribePage() {
  const router = useRouter()
  const supabase = createClient()
  const [stores, setStores] = useState<Store[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [notificationPreference, setNotificationPreference] =
    useState('weekly')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Load stores
      const { data: storesData } = await supabase
        .from('stores')
        .select('*')
        .order('name')

      if (storesData) {
        setStores(storesData)
      }

      // Load existing subscription if user is logged in
      if (user) {
        const response = await fetch('/api/subscriptions')
        if (response.ok) {
          const { subscription } = await response.json()
          if (subscription) {
            setSubscription(subscription)
            setEmail(subscription.email || user.email || '')
            setSelectedStores(subscription.store_preferences || [])
            setNotificationPreference(
              subscription.notification_preference || 'weekly'
            )
          } else {
            setEmail(user.email || '')
          }
        }
      }

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const handleStoreToggle = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // If user is not logged in, sign up first
      if (!user) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: Math.random().toString(36).slice(-12), // Random password
          options: {
            emailRedirectTo: `${window.location.origin}/subscribe`,
          },
        })

        if (error) throw error

        if (data.user) {
          setUser(data.user)
        }
      }

      // Save subscription
      const method = subscription ? 'PATCH' : 'POST'
      const response = await fetch('/api/subscriptions', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          store_preferences: selectedStores,
          notification_preference: notificationPreference,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }

      const { subscription: newSubscription } = await response.json()
      setSubscription(newSubscription)

      alert('구독이 완료되었습니다!')
      router.push('/')
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              이번주 세일 🛒
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                홈
              </Link>
              <Link
                href="/subscribe"
                className="text-gray-700 hover:text-gray-900 font-semibold"
              >
                구독하기
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h1 className="text-3xl font-bold mb-2">구독하기</h1>
            <p className="text-gray-600 mb-8">
              원하는 매장의 세일 정보를 이메일로 받아보세요
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  이메일 주소
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  알림 받을 매장 선택
                </label>
                <div className="space-y-2">
                  {stores.map((store) => (
                    <label
                      key={store.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.id)}
                        onChange={() => handleStoreToggle(store.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">{store.name}</span>
                    </label>
                  ))}
                </div>
                {stores.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    매장 정보를 불러올 수 없습니다.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="notification"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  알림 주기
                </label>
                <select
                  id="notification"
                  value={notificationPreference}
                  onChange={(e) => setNotificationPreference(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="biweekly">격주</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving || selectedStores.length === 0}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? '저장 중...'
                  : subscription
                    ? '구독 정보 업데이트'
                    : '구독하기'}
              </button>
            </form>

            {subscription && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ 구독이 활성화되어 있습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

