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
  console.log(obj[path]);
  
  return obj[path];
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
    return <div>Not enough data to plot</div>
  }

  const xKey = fields[0].path
  const yKey = fields[1].path

  const chartData = rows.map((d) => ({
    x: getValue(d, xKey),
    y: getValue(d, yKey),
  }))

  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#10b981" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

