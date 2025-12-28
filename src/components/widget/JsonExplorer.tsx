'use client'

import { DataFormat } from '@/types/widget'

interface Props {
  data: any
  selected: string[]
  search?: string
  formats?: Record<string, DataFormat>
  onToggle: (path: string) => void
  onFormatChange?: (path: string, format: DataFormat) => void
}

function walk(value: any, path: string, result: string[]) {
  if (typeof value !== 'object' || value === null) return

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      walk(item, `${path}.${index}`, result)
    )
    return
  }

  Object.entries(value).forEach(([key, val]) => {
    const newPath = path ? `${path}.${key}` : key
    result.push(newPath)
    walk(val, newPath, result)
  })
}

export default function JsonExplorer({
  data,
  selected,
  search = '',
  formats = {},      
  onToggle,
  onFormatChange,
}: Props) {
  const paths: string[] = []
  walk(data, '', paths)

  const filtered = search
    ? paths.filter((p) =>
        p.toLowerCase().includes(search.toLowerCase())
      )
    : paths

  return (
    <div className="max-h-64 overflow-auto border border-white/10 rounded p-2 space-y-1">
      {filtered.map((path) => (
        <div key={path} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(path)}
            onChange={() => onToggle(path)}
          />

          <span className="flex-1 text-sm truncate">
            {path}
          </span>

          {selected.includes(path) && onFormatChange && (
            <select
              className="bg-black/30 text-xs rounded"
              value={formats[path] ?? 'number'}
              onChange={(e) =>
                onFormatChange(path, e.target.value as DataFormat)
              }
            >
              <option value="number">Number</option>
              <option value="currency">Currency</option>
              <option value="percentage">Percentage</option>
            </select>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-xs text-white/40 px-2">
          No matching fields
        </div>
      )}
    </div>
  )
}
