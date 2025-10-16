"use client"

import { useDrop } from "react-dnd"
import { CourseCard } from "./course-card"
import { DAYS, PERIODS, DAY_LABELS, PERIOD_LABELS, type Course } from "@/types/course"

interface ScheduleBoardProps {
  courses: Course[]
  onEditCourse: (course: Course) => void
  onMoveCourse: (courseId: string, day: string, period: string) => void
  onDragStart: () => void
  onDragEnd: () => void
}

export function ScheduleBoard({ courses, onEditCourse, onMoveCourse, onDragStart, onDragEnd }: ScheduleBoardProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] border border-border rounded-lg bg-card">
        {/* Header row */}
        <div className="grid grid-cols-6 border-b border-border">
          <div className="p-4 border-r border-border" />
          {DAYS.map((day) => (
            <div key={day} className="p-4 text-center font-medium border-r border-border last:border-r-0">
              {DAY_LABELS[day]}
            </div>
          ))}
        </div>

        {/* Period rows */}
        {PERIODS.map((period) => (
          <div key={period} className="grid grid-cols-6 border-b border-border last:border-b-0">
            <div className="p-4 border-r border-border font-medium flex items-center">{PERIOD_LABELS[period]}</div>
            {DAYS.map((day) => (
              <ScheduleCell
                key={`${day}-${period}`}
                day={day}
                period={period}
                courses={courses.filter((c) => c.schedule[day]?.[period])}
                onEditCourse={onEditCourse}
                onMoveCourse={onMoveCourse}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface ScheduleCellProps {
  day: string
  period: string
  courses: Course[]
  onEditCourse: (course: Course) => void
  onMoveCourse: (courseId: string, day: string, period: string) => void
  onDragStart: () => void
  onDragEnd: () => void
}

function ScheduleCell({ day, period, courses, onEditCourse, onMoveCourse, onDragStart, onDragEnd }: ScheduleCellProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "course",
      drop: (item: { id: string }) => {
        onMoveCourse(item.id, day, period)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [day, period],
  )

  return (
    <div
      ref={drop}
      className={`min-h-[150px] p-2 border-r border-border last:border-r-0 transition-colors ${
        isOver ? "bg-accent" : "bg-background"
      }`}
    >
      <div className="flex flex-wrap gap-2">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => onEditCourse(course)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}
