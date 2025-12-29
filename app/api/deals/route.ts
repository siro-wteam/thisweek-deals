import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('store_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
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
      .range(offset, offset + limit - 1)

    if (storeId) {
      query = query.eq('store_id', storeId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ deals: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

