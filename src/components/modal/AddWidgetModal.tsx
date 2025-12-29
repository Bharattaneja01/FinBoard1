'use client'

import { useEffect, useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { fetchFinanceData } from '@/lib/apiClient'
import { detectProviderFromUrl } from '@/lib/detectProvider'
import { normalizeObject } from '@/lib/normalizeObject'
import JsonExplorer from '@/components/widget/JsonExplorer'
import { DataFormat, WidgetType } from '@/types/widget'

export default function AddWidgetModal() {
  const { isAddWidgetOpen, closeAddWidget } = useUIStore()
  const addWidget = useDashboardStore((s) => s.addWidget)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<WidgetType>('card')
  const [apiUrl, setApiUrl] = useState('')

  const [apiData, setApiData] = useState<any>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [formats, setFormats] = useState<Record<string, DataFormat>>({})
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAddWidgetOpen) {
      setName('')
      setDescription('')
      setType('card')
      setApiUrl('')
      setApiData(null)
      setSelected([])
      setFormats({})
      setSearch('')
      setCollapsed(false)
      setError(null)
    }
  }, [isAddWidgetOpen])

  if (!isAddWidgetOpen) return null

  async function testApi() {
    setError(null)
    try {
      const provider = detectProviderFromUrl(apiUrl)
      const raw = await fetchFinanceData(apiUrl, provider)
      const normalizedRaw = normalizeObject(raw)
      setApiData(normalizedRaw)
      setSelected([])
      setFormats({})
    } catch (e: any) {
      setError(e.message || 'Failed to fetch API')
    }
  }

  function createWidget() {
    if (!name || !apiUrl || selected.length === 0) {
      setError('Please fill all required fields and select at least one metric.')
      return
    }

    addWidget({
      id: crypto.randomUUID(),
      name,
      description,
      type,
      apiUrl,
      refreshInterval: 30,
      order: Date.now(),
      lastUpdated: Date.now(),
      config: {
        provider: detectProviderFromUrl(apiUrl),
        endpoint: '',
        selectedFields: selected.map((path) => ({
          path,
          format: formats[path] || 'number',
        })),
      },
    })

    closeAddWidget()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-black/10 dark:border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold">Add Widget</h2>
          <button
            onClick={closeAddWidget}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <input
          className="w-full p-2 mb-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm sm:text-base"
          placeholder="Widget name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm sm:text-base resize-none"
          rows={3}
          placeholder="Widget description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-2 mb-3 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm sm:text-base"
          value={type}
          onChange={(e) => setType(e.target.value as WidgetType)}
        >
          <option value="card">Finance Card</option>
          <option value="table">Table</option>
          <option value="chart">Chart</option>
        </select>

        <input
          className="w-full p-2 mb-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm sm:text-base"
          placeholder="Paste API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />

        <button
          onClick={testApi}
          className="w-full sm:w-auto bg-emerald-600 px-4 py-2 rounded mb-3 text-sm sm:text-base text-white"
        >
          Test API
        </button>

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        {apiData && (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-2 gap-2">
              <input
                className="flex-1 p-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded text-sm sm:text-base"
                placeholder="Search fields"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center gap-1 text-sm px-2 py-2 bg-black/5 dark:bg-white/5 rounded"
              >
                {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                {collapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>

            {!collapsed && (
              <div className="max-h-[40vh] overflow-auto rounded border border-black/10 dark:border-white/10">
                <JsonExplorer
                  data={apiData}
                  search={search}
                  selected={selected}
                  formats={formats}
                  onToggle={(path) =>
                    setSelected((prev) =>
                      prev.includes(path)
                        ? prev.filter((p) => p !== path)
                        : [...prev, path]
                    )
                  }
                  onFormatChange={(path, format) =>
                    setFormats((prev) => ({
                      ...prev,
                      [path]: format,
                    }))
                  }
                />
              </div>
            )}
          </>
        )}

        <button
          onClick={createWidget}
          className="mt-4 w-full bg-emerald-700 py-2 rounded text-sm sm:text-base text-white"
        >
          Add Widget
        </button>
      </div>
    </div>
  )
}
