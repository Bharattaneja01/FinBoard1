function normalizeKey(key: string): string {
  return key.replace(/\s+/g, "_");
}

export function normalizeObject(
  data: any,
  parentKey = "",
  result: Record<string, any> = {}
): Record<string, any> {
  if (Array.isArray(data)) {
    return data.map(item =>
      normalizeObject(item)
    ) as any;
  }
  

  if (data && typeof data === "object") {
    for (const [key, value] of Object.entries(data)) {
      const normalizedKey = normalizeKey(key);
      const newKey = parentKey
        ? `${parentKey}_${normalizedKey}`
        : normalizedKey;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        normalizeObject(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }

    return result;
  }

  return data;
}
