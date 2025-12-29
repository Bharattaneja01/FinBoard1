import { create } from 'zustand'
import { Widget } from '@/types/widget'

type Theme = 'light' | 'dark'

interface UIState {
  isAddWidgetOpen: boolean
  isConfigOpen: boolean
  activeWidget: Widget | null
  theme: Theme

  openAddWidget: () => void
  closeAddWidget: () => void

  openConfig: (widget: Widget) => void
  closeConfig: () => void

  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isAddWidgetOpen: false,
  isConfigOpen: false,
  activeWidget: null,
  theme: 'dark',

  openAddWidget: () => set({ isAddWidgetOpen: true }),
  closeAddWidget: () => set({ isAddWidgetOpen: false }),

  openConfig: (widget) =>
    set({ isConfigOpen: true, activeWidget: widget }),

  closeConfig: () =>
    set({ isConfigOpen: false, activeWidget: null }),

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    set({ theme })
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next)
        document.documentElement.classList.toggle('dark', next === 'dark')
      }
      return { theme: next }
    }),
}))
