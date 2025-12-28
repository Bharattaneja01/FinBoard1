'use client'

import { useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import DashboardGrid from '@/components/dashboard/DashboardGrid'
import AddWidgetModal from '@/components/modal/AddWidgetModal'
import EditWidgetModal from '@/components/modal/EditWidgetModal'
import { useDashboardStore } from '@/store/dashboardStore'

export default function Home() {
 const widgets = useDashboardStore((state) => state.widgets)

const sortedWidgets = useMemo(
  () => [...widgets].sort((a, b) => a.order - b.order),
  [widgets]
)


  return (
    <>
      <Navbar />
      <DashboardGrid widgets={sortedWidgets} />

      <AddWidgetModal />
      <EditWidgetModal />
    </>
  )
}
