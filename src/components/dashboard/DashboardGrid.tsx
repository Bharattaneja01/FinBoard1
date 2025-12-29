'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

import { Widget } from '@/types/widget'
import { useDashboardStore } from '@/store/dashboardStore'
import SortableWidget from './SortableWidget'

interface Props {
  widgets: Widget[]
}

export default function DashboardGrid({ widgets }: Props) {
  const reorderWidgets = useDashboardStore((s) => s.reorderWidgets)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = widgets.findIndex((w) => w.id === active.id)
    const newIndex = widgets.findIndex((w) => w.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(widgets, oldIndex, newIndex)

    const withUpdatedOrder = reordered.map((w, index) => ({
      ...w,
      order: index,
    }))

    reorderWidgets(withUpdatedOrder)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={widgets.map((w) => w.id)}
        strategy={rectSortingStrategy}
      >
        <div
          className="
            p-3 sm:p-4 md:p-6
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-3 sm:gap-4 md:gap-6
          "
        >
          {widgets.map((widget) => (
            <SortableWidget key={widget.id} widget={widget} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
