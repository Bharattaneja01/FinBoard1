import { DataFormat } from '@/types/widget'

export function formatValue(value: any, format: DataFormat) {
  console.log(value);
  if (value === null || value === undefined) return '—'
  

  switch (format) {
    case 'currency':
      return `$${Number(value).toLocaleString()}`
    case 'percentage':
      return `${Number(value).toFixed(2)}%`
    default:
      return (value)
  }
}
