'use client'

import { useMemo, useState } from 'react'
import { SelectedField } from '@/types/widget'

function getValue(obj: any, path: string) {
  return obj?.[path]
}

function labelFromPath(path: string) {
  return path.split('.').slice(-1)[0]
}

export default function TableWidget({
  data,
  fields,
}: {
  data: any
  fields: SelectedField[]
}) {
  const rows = Array.isArray(data) ? data : [data]

  const [search, setSearch] = useState('')
  const [filterField, setFilterField] = useState<string>('all')

  const filteredRows = useMemo(() => {
    if (!search) return rows

    const query = search.toLowerCase()

    return rows.filter((row) => {
      if (filterField === 'all') {
        return fields.some((f) => {
          const value = getValue(row, f.path)
          return String(value ?? '').toLowerCase().includes(query)
        })
      }

      const value = getValue(row, filterField)
      return String(value ?? '').toLowerCase().includes(query)
    })
  }, [rows, search, filterField, fields])

  if (!rows.length) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-black/60 dark:text-white/60">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="flex-1 p-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm"
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
        >
          <option value="all">All fields</option>
          {fields.map((f) => (
            <option key={f.path} value={f.path}>
              {labelFromPath(f.path)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded border border-black/10 dark:border-white/10">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-black/60 dark:text-white/60 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
              {fields.map((f) => (
                <th
                  key={f.path}
                  className="text-left p-2 font-medium whitespace-nowrap"
                >
                  {labelFromPath(f.path)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.slice(0, 20).map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {fields.map((f) => (
                  <td
                    key={f.path}
                    className="p-2 whitespace-nowrap text-black/80 dark:text-white/80"
                  >
                    {String(getValue(row, f.path) ?? '—')}
                  </td>
                ))}
              </tr>
            ))}

            {!filteredRows.length && (
              <tr>
                <td
                  colSpan={fields.length}
                  className="text-center p-4 text-sm text-black/50 dark:text-white/50"
                >
                  No matching results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
