export type WidgetType = 'card' | 'table' | 'chart'

export type DataFormat = 'number' | 'currency' | 'percentage'

export interface SelectedField {
  path: string
  format: DataFormat
}

export interface WidgetConfig {
  provider: 'coingecko' | 'alpha-vantage' | 'finnhub' | 'indianapi'
  endpoint: string
  selectedFields: SelectedField[]
}

export interface Widget {
  id: string
  name: string
  description?: string
  type: WidgetType
  apiUrl: string
  refreshInterval: number
  order: number

  lastUpdated?: number

  config: WidgetConfig
}
