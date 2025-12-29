import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// This endpoint will be used to collect deals from stores
// You'll need to implement web scraping or API integration for each store
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated (you might want to restrict this to admin)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { store_id, deals } = body

    if (!store_id || !deals || !Array.isArray(deals)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Insert or update deals
    const dealPromises = deals.map((deal: any) =>
      supabase
        .from('deals')
        .upsert({
          store_id,
          title: deal.title,
          description: deal.description,
          original_price: deal.original_price,
          sale_price: deal.sale_price,
          discount_percentage: deal.discount_percentage,
          image_url: deal.image_url,
          product_url: deal.product_url,
          category: deal.category,
          valid_from: deal.valid_from,
          valid_to: deal.valid_to,
          is_active: true,
        })
        .select()
    )

    const results = await Promise.all(dealPromises)
    const errors = results.filter((r) => r.error)

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Some deals failed to save', errors },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${deals.length} deals`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

