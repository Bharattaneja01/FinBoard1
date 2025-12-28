export function extractFields(
  obj: any,
  parentKey = '',
  result: string[] = []
): string[] {
  if (typeof obj !== 'object' || obj === null) return result

  for (const key of Object.keys(obj)) {
    const path = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj[key] === 'object') {
      extractFields(obj[key], path, result)
    } else {
      result.push(path)
    }
  }

  return result
}
