'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SelectedField } from '@/types/widget'

function getValue(obj: any, path: string) {
  return obj[path]
}

export default function ChartWidget({
  data,
  fields,
}: {
  data: any
  fields: SelectedField[]
}) {
  const rows = Array.isArray(data) ? data : [data]

  if (!rows.length || fields.length < 2) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-black/60 dark:text-white/60">
        Not enough data to plot
      </div>
    )
  }

  const xKey = fields[0].path
  const yKey = fields[1].path

  const chartData = rows.map((d) => ({
    x: getValue(d, xKey),
    y: getValue(d, yKey),
  }))

  return (
    <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <XAxis
            dataKey="x"
            tick={{ fontSize: 12, fill: 'currentColor' }}
            tickMargin={8}
            className="text-black dark:text-white"
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'currentColor' }}
            tickMargin={8}
            className="text-black dark:text-white"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
