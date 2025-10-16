"use client"

import { useDrop } from "react-dnd"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteZoneProps {
  isActive: boolean
  onDelete: (courseId: string) => void
}

export function DeleteZone({ isActive, onDelete }: DeleteZoneProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "course",
      drop: (item: { id: string }) => {
        onDelete(item.id)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDelete],
  )

  if (!isActive) return null

  return (
    <div ref={drop}>
      <Button
        size="lg"
        variant={isOver ? "destructive" : "outline"}
        className={`h-14 w-14 rounded-full shadow-lg transition-all ${isOver ? "scale-110" : "scale-100"}`}
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  )
}
