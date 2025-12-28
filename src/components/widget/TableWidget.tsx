'use client'

import { SelectedField } from '@/types/widget'

function getValue(obj: any, path: string) {
  return obj[path];
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

  if (!rows.length) {
    return <div>No data available</div>
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-white/60 border-b border-white/10">
            {fields.map((f) => (
              <th key={f.path} className="text-left p-2">
                {labelFromPath(f.path)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.slice(0, 20).map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-white/5 hover:bg-white/5"
            >
              {fields.map((f) => (
                <td key={f.path} className="p-2">
                  {String(getValue(row, f.path) ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

