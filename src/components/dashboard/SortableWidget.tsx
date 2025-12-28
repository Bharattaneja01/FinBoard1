'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import WidgetCard from '@/components/widget/WidgetCard'
import { Widget } from '@/types/widget'

export default function SortableWidget({ widget }: { widget: Widget }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: widget.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <WidgetCard widget={widget} />
        </div>
    )
}
