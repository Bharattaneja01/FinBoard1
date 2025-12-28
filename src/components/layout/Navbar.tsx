'use client'

import { useDashboardStore } from '@/store/dashboardStore'
import { exportDashboard, importDashboard } from '@/lib/dashboardBackup'
import { useUIStore } from '@/store/uiStore'

export default function Navbar() {
  const widgets = useDashboardStore((s) => s.widgets)
  const setWidgets = useDashboardStore((s) => s.setWidgets)
  const openAddWidget = useUIStore((s) => s.openAddWidget)

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
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div>
        <h1 className="text-lg font-semibold">Finance Dashboard</h1>
        <p className="text-sm text-white/60">
          {widgets.length} widgets active
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => exportDashboard(widgets)}
          className="text-sm px-3 py-2 border border-white/20 rounded"
        >
          Export
        </button>

        <label className="text-sm px-3 py-2 border border-white/20 rounded cursor-pointer">
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
          className="bg-emerald-600 px-4 py-2 rounded text-sm"
        >
          + Add Widget
        </button>
      </div>
    </header>
  )
}
