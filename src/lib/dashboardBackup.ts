import { Widget } from '@/types/widget'

export function exportDashboard(widgets: Widget[]) {
  const blob = new Blob(
    [JSON.stringify(widgets, null, 2)],
    { type: 'application/json' }
  )

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = 'finance-dashboard-backup.json'
  a.click()

  URL.revokeObjectURL(url)
}

export function importDashboard(
  file: File
): Promise<Widget[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        resolve(data)
      } catch {
        reject(new Error('Invalid dashboard file'))
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
