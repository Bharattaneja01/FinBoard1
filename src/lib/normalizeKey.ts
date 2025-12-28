export function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/\s+/g, '_')     
    .replace(/\./g, '')        
}
