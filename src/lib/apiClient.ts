export async function fetchFinanceData(
  apiUrl: string,
  provider: string
) {
  const res = await fetch('/api/finance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiUrl, provider }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data
}
