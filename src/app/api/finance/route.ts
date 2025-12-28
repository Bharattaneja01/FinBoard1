import { NextResponse } from 'next/server'
import { getCachedData, setCachedData } from '@/lib/apiCache'

export async function POST(req: Request) {
  try {
    const { apiUrl, provider } = await req.json()

    if (!apiUrl || !provider) {
      return NextResponse.json(
        { error: 'API URL or provider missing' },
        { status: 400 }
      )
    }

    const cacheKey = `${provider}:${apiUrl}`
    const cached = getCachedData(cacheKey)
    if (cached) return NextResponse.json(cached)

    let headers: HeadersInit = {}
    let finalUrl = apiUrl

    if (provider === 'alpha-vantage') {
      const key = process.env.ALPHA_VANTAGE_API_KEY
      if (!key)
        return NextResponse.json(
          { error: 'Alpha Vantage key missing' },
          { status: 500 }
        )
      finalUrl += `&apikey=${key}`
    }

    if (provider === 'finnhub') {
      const key = process.env.FINNHUB_API_KEY
      if (!key)
        return NextResponse.json(
          { error: 'Finnhub key missing' },
          { status: 500 }
        )
      finalUrl += `&token=${key}`
    }

    if (provider === 'indianapi') {
      const key = process.env.INDIAN_API_KEY
      if (!key)
        return NextResponse.json(
          { error: 'IndianAPI key missing' },
          { status: 500 }
        )

      finalUrl += `&token=${key}`
      headers = {
        'X-Api-Key': key,
      }
    }

    console.log('Final URL:', finalUrl)
    
    
    const res = await fetch(finalUrl, {
      headers,
      cache: 'no-store',
    })
    
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: 'Upstream API error', detail: text },
        { status: res.status }
      )
    }
    
    const contentType = res.headers.get('content-type') || ''
    let data: any
    
    if (contentType.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      return NextResponse.json(
        { error: 'Non-JSON response', detail: text },
        { status: 502 }
      )
    }
    console.log('Provider:', data)

    if (
      data?.Note || 
      data?.['Error Message'] ||
      data?.s === 'no_data' 
    ) {
      return NextResponse.json(
        { error: 'API rate limit or no data', raw: data },
        { status: 429 }
      )
    }

    setCachedData(cacheKey, data, 30_000)

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    )
  }
}
