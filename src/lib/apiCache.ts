const cache = new Map<string, any>()

export function getCachedData(key: string) {
  return cache.get(key)
}

export function setCachedData(key: string, data: any, ttl: number) {
  cache.set(key, data)
  setTimeout(() => cache.delete(key), ttl)
}
