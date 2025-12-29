'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw, Settings, X } from 'lucide-react'
import { Widget } from '@/types/widget'
import { fetchFinanceData } from '@/lib/apiClient'
import { normalizeApiResponse } from '@/lib/normalizeApiResponse'
import { useDashboardStore } from '@/store/dashboardStore'
import { useUIStore } from '@/store/uiStore'
import FinanceCard from './FinanceCard'
import TableWidget from './TableWidget'
import ChartWidget from './ChartWidget'
import { normalizeObject } from '@/lib/normalizeObject'

export default function WidgetCard({ widget }: { widget: Widget }) {
  const removeWidget = useDashboardStore((s) => s.removeWidget)
  const updateWidget = useDashboardStore((s) => s.updateWidget)
  const openConfig = useUIStore((s) => s.openConfig)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    widget.lastUpdated ?? null
  )

  async function fetchData(manual = false) {
    try {
      if (manual) setLoading(true)
      setError(null)

      const raw = await fetchFinanceData(
        widget.apiUrl,
        widget.config.provider
      )

      const normalizedRaw = normalizeObject(raw)
      const normalized = normalizeApiResponse(normalizedRaw)

      setData(normalized)

      const now = Date.now()
      setLastUpdated(now)
      updateWidget(widget.id, { lastUpdated: now })
    } catch {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(
      () => fetchData(),
      widget.refreshInterval * 1000
    )
    return () => clearInterval(interval)
  }, [widget.apiUrl, widget.refreshInterval])

  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 p-3 sm:p-4 shadow transition flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="font-medium text-sm sm:text-base truncate">
            {widget.name}
          </h3>
          {widget.description && (
            <p className="text-xs text-black/60 dark:text-white/60 line-clamp-2">
              {widget.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <button
            onClick={() => fetchData(true)}
            className="p-1 text-black/60 dark:text-white/60 hover:text-emerald-500"
          >
            <RefreshCcw size={14} />
          </button>

          <button
            onClick={() => openConfig(widget)}
            className="p-1 text-black/60 dark:text-white/60 hover:text-blue-500"
          >
            <Settings size={14} />
          </button>

          <button
            onClick={() => removeWidget(widget.id)}
            className="p-1 text-black/60 dark:text-white/60 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center flex-1 text-sm text-black/50 dark:text-white/50">
          Loading data…
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-center flex-1 text-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && widget.type === 'card' && (
        <FinanceCard
          data={data}
          fields={widget.config.selectedFields}
        />
      )}

      {!loading && !error && widget.type === 'table' && (
        <TableWidget
          data={data}
          fields={widget.config.selectedFields}
        />
      )}

      {!loading && !error && widget.type === 'chart' && (
        <ChartWidget
          data={data}
          fields={widget.config.selectedFields}
        />
      )}

      <div className="text-xs text-black/50 dark:text-white/40 mt-3">
        Last updated:{' '}
        {lastUpdated
          ? new Date(lastUpdated).toLocaleTimeString()
          : '—'}
      </div>
    </div>
  )
}
