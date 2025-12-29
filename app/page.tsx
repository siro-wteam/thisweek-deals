import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

async function getDeals() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('deals')
    .select(`
      *,
      stores (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .eq('is_active', true)
    .gte('valid_to', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false })
    .limit(12)

  return data || []
}

async function getStores() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('stores')
    .select('*')
    .order('name', { ascending: true })

  return data || []
}

export default async function Home() {
  const deals = await getDeals()
  const stores = await getStores()

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              이번주 세일 🛒
            </h1>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                홈
              </Link>
              <Link
                href="/subscribe"
                className="text-gray-700 hover:text-gray-900"
              >
                구독하기
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">이번주 세일 정보</h2>
          <p className="text-gray-600 mb-8">
            남캘리포니아 한인을 위한 최신 세일 정보를 확인하세요
          </p>

          {deals.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">
                아직 등록된 세일 정보가 없습니다.
              </p>
              <p className="text-gray-400 mt-2">
                곧 업데이트될 예정입니다!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal: any) => (
                <div key={deal.id} className="card">
                  {deal.image_url && (
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    {deal.stores?.logo_url && (
                      <img
                        src={deal.stores.logo_url}
                        alt={deal.stores.name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="text-sm text-gray-600">
                      {deal.stores?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                  {deal.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {deal.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    {deal.original_price && (
                      <span className="text-gray-400 line-through">
                        ${deal.original_price}
                      </span>
                    )}
                    {deal.sale_price && (
                      <span className="text-2xl font-bold text-red-600">
                        ${deal.sale_price}
                      </span>
                    )}
                    {deal.discount_percentage && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                        {deal.discount_percentage}% OFF
                      </span>
                    )}
                  </div>
                  {deal.product_url && (
                    <a
                      href={deal.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full text-center"
                    >
                      자세히 보기
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-4">
                    유효기간: {new Date(deal.valid_from).toLocaleDateString(
                      'ko-KR'
                    )}{' '}
                    ~ {new Date(deal.valid_to).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">참여 매장</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.map((store: any) => (
              <div key={store.id} className="card text-center">
                <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                {store.website_url && (
                  <a
                    href={store.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    웹사이트 방문
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container py-8 text-center text-gray-600">
          <p>© 2024 이번주 세일. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

