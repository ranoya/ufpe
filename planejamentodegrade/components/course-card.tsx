"use client"

import { useDrag } from "react-dnd"
import type { Course } from "@/types/course"

interface CourseCardProps {
  course: Course
  onClick: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

export function CourseCard({ course, onClick, onDragStart, onDragEnd }: CourseCardProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "course",
      item: { id: course.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [course.id],
  )

  return (
    <div
      ref={drag}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`${course.color} p-3 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow text-sm min-w-[120px] ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {course.tab === "disciplinas" && (
        <div className="font-medium text-foreground mb-1 line-clamp-2">{course.title}</div>
      )}
      <div className="text-xs text-muted-foreground mb-1">{course.professor}</div>
      <div className="text-xs text-muted-foreground mb-1 capitalize">{course.modality}</div>
      <div className="text-xs text-muted-foreground">{course.workload}</div>
    </div>
  )
}
