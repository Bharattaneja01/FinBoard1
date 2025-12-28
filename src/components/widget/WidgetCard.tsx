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

    // 🔥 Normalize keys
    const normalizedRaw = normalizeObject(raw)

    // 🔥 Normalize structure
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
    <div className="rounded-xl bg-slate-800 p-4 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition">
      {/* ───────── HEADER (ALWAYS VISIBLE) ───────── */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-medium">{widget.name}</h3>
          {widget.description && (
            <p className="text-xs text-white/40">
              {widget.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            title="Refresh"
            onClick={() => fetchData(true)}
            className="hover:text-emerald-400"
          >
            <RefreshCcw size={14} />
          </button>

          <button
            title="Update widget"
            onClick={() => openConfig(widget)}
            className="hover:text-blue-400"
          >
            <Settings size={14} />
          </button>

          <button
            title="Delete widget"
            onClick={() => removeWidget(widget.id)}
            className="hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ───────── BODY (STATE-BASED) ───────── */}
      {loading && (
        <div className="text-sm text-white/50">
          Loading data…
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-400">
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

      <div className="text-xs text-white/40 mt-3 flex justify-between">
        <span>
          Last updated:{' '}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleTimeString()
            : '—'}
        </span>
      </div>
    </div>
  )
}
