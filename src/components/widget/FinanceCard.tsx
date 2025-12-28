'use client'

import { SelectedField } from '@/types/widget'
import { formatValue } from '@/lib/formatValue'

function getValue(obj: any, path?: string) {
  if (!obj || !path) return undefined;
  return obj[path];
}

function labelFromPath(path: string) {
  return path.split('.').slice(-1)[0]
}

export default function FinanceCard({
  data,
  fields,
}: {
  data: any
  fields: SelectedField[]
}) {
  return (
    <div className="space-y-2">
      {fields.map((field) => {
        const value = getValue(data, field.path)
        // console.log("value: ",field.path, value);
        
        return (
          <div
            key={field.path}
            className="flex justify-between text-sm border-b border-white/10 pb-1"
          >
            <span className="text-white/60">
              {labelFromPath(field.path)}
            </span>
            <span className="font-medium">
              {formatValue(value, field.format)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
