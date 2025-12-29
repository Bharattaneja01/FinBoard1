'use client'

import { useEffect, useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { fetchFinanceData } from '@/lib/apiClient'
import JsonExplorer from '@/components/widget/JsonExplorer'
import { DataFormat, Widget } from '@/types/widget'
import { X } from 'lucide-react'

export default function EditWidgetModal() {
  const { isConfigOpen, activeWidget, closeConfig } = useUIStore()
  const updateWidget = useDashboardStore((s) => s.updateWidget)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [refreshInterval, setRefreshInterval] = useState(30)

  const [apiData, setApiData] = useState<any>(null)
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [formats, setFormats] = useState<Record<string, DataFormat>>({})

  useEffect(() => {
    if (!activeWidget) return

    setName(activeWidget.name)
    setDescription(activeWidget.description || '')
    setApiUrl(activeWidget.apiUrl)
    setRefreshInterval(activeWidget.refreshInterval)

    const paths = activeWidget.config.selectedFields.map((f) => f.path)
    const fmts: Record<string, DataFormat> = {}

    activeWidget.config.selectedFields.forEach((f) => {
      fmts[f.path] = f.format
    })

    setSelectedPaths(paths)
    setFormats(fmts)
  }, [activeWidget])

  if (!isConfigOpen || !activeWidget) return null

  const widget: Widget = activeWidget

  async function testApi() {
    const data = await fetchFinanceData(
      apiUrl,
      widget.config.provider
    )
    setApiData(data)
  }

  function toggleField(path: string) {
    setSelectedPaths((prev) =>
      prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path]
    )
  }

  function saveChanges() {
    updateWidget(widget.id, {
      name,
      description,
      apiUrl,
      refreshInterval,
      config: {
        ...widget.config,
        selectedFields: selectedPaths.map((p) => ({
          path: p,
          format: formats[p] || 'number',
        })),
      },
    })

    closeConfig()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold">
            Edit Widget
          </h2>
          <button
            onClick={closeConfig}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <input
          className="w-full mb-2 p-2 rounded bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-sm sm:text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full mb-2 p-2 rounded bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-sm sm:text-base resize-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full mb-2 p-2 rounded bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-sm sm:text-base"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />

        <input
          type="number"
          className="w-full mb-2 p-2 rounded bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-sm sm:text-base"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
        />

        <button
          onClick={testApi}
          className="w-full sm:w-auto bg-emerald-600 px-3 py-2 rounded text-sm sm:text-base text-white mb-3"
        >
          Re-test API
        </button>

        {apiData && (
          <div className="max-h-[40vh] overflow-auto rounded border border-black/10 dark:border-white/10 mb-3">
            <JsonExplorer
              data={apiData}
              selected={selectedPaths}
              onToggle={toggleField}
            />
          </div>
        )}

        {selectedPaths.map((path) => (
          <div
            key={path}
            className="flex items-center gap-2 mt-2 text-sm"
          >
            <span className="flex-1 truncate text-black dark:text-white">
              {path}
            </span>
            <select
              className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-1 rounded text-sm"
              value={formats[path] || 'number'}
              onChange={(e) =>
                setFormats((prev) => ({
                  ...prev,
                  [path]: e.target.value as DataFormat,
                }))
              }
            >
              <option value="number">Number</option>
              <option value="currency">Currency</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
        ))}

        <button
          onClick={saveChanges}
          className="mt-4 w-full bg-emerald-700 py-2 rounded text-sm sm:text-base text-white"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
