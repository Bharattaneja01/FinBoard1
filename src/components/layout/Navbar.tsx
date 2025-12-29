'use client'

import { useDashboardStore } from '@/store/dashboardStore'
import { exportDashboard, importDashboard } from '@/lib/dashboardBackup'
import { useUIStore } from '@/store/uiStore'
import { Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const widgets = useDashboardStore((s) => s.widgets)
  const setWidgets = useDashboardStore((s) => s.setWidgets)
  const openAddWidget = useUIStore((s) => s.openAddWidget)
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return

    try {
      const imported = await importDashboard(e.target.files[0])
      setWidgets(imported)
    } catch {
      alert('Invalid dashboard configuration file')
    }
  }

  return (
    <header className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold truncate">
            Finance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-black/60 dark:text-white/60">
            {widgets.length} widgets active
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <button
            onClick={toggleTheme}
            className="p-2 border border-black/20 dark:border-white/20 rounded"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => exportDashboard(widgets)}
            className="text-xs sm:text-sm px-3 py-2 border border-black/20 dark:border-white/20 rounded whitespace-nowrap"
          >
            Export
          </button>

          <label className="text-xs sm:text-sm px-3 py-2 border border-black/20 dark:border-white/20 rounded cursor-pointer whitespace-nowrap">
            Import
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={handleImport}
            />
          </label>

          <button
            onClick={openAddWidget}
            className="bg-emerald-600 px-4 py-2 rounded text-xs sm:text-sm whitespace-nowrap text-white"
          >
            + Add Widget
          </button>
        </div>
      </div>
    </header>
  )
}
