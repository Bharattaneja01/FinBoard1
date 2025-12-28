import { create } from 'zustand'
import { Widget } from '@/types/widget'

interface UIState {
  isAddWidgetOpen: boolean
  isConfigOpen: boolean
  activeWidget: Widget | null

  openAddWidget: () => void
  closeAddWidget: () => void

  openConfig: (widget: Widget) => void
  closeConfig: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isAddWidgetOpen: false,
  isConfigOpen: false,
  activeWidget: null,

  openAddWidget: () => set({ isAddWidgetOpen: true }),
  closeAddWidget: () => set({ isAddWidgetOpen: false }),

  openConfig: (widget) =>
    set({ isConfigOpen: true, activeWidget: widget }),

  closeConfig: () =>
    set({ isConfigOpen: false, activeWidget: null }),
}))
