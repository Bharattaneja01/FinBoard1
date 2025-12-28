export type Provider =
  | 'coingecko'
  | 'alpha-vantage'
  | 'finnhub'
  | 'indianapi'

export function detectProviderFromUrl(url: unknown): Provider {
  if (typeof url !== 'string' || url.trim().length === 0) {
    return 'coingecko'
  }

  const lower = url.toLowerCase()

  if (lower.includes('alphavantage.co')) return 'alpha-vantage'
  if (lower.includes('finnhub.io')) return 'finnhub'
  if (lower.includes('indianapi.in')) return 'indianapi'
  if (lower.includes('coingecko.com')) return 'coingecko'

  return 'coingecko'
}
