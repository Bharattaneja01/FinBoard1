'use client'

import { SelectedField } from '@/types/widget'
import { formatValue } from '@/lib/formatValue'

function getValue(obj: any, path?: string) {
  if (!obj || !path) return undefined
  return obj[path]
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
    <div className="space-y-2 sm:space-y-3">
      {fields.map((field) => {
        const value = getValue(data, field.path)

        return (
          <div
            key={field.path}
            className="flex items-start justify-between gap-3 text-xs sm:text-sm border-b border-black/10 dark:border-white/10 pb-1 sm:pb-2"
          >
            <span className="text-black/60 dark:text-white/60 break-words max-w-[60%]">
              {labelFromPath(field.path)}
            </span>

            <span className="font-medium text-right break-all text-black dark:text-white">
              {formatValue(value, field.format)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
