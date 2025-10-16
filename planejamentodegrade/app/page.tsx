"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ScheduleBoard } from "@/components/schedule-board"
import { CourseDialog } from "@/components/course-dialog"
import { DeleteZone } from "@/components/delete-zone"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Course } from "@/types/course"

export default function Home() {
  const [disciplinasData, setDisciplinasData] = useState<Course[]>([])
  const [orientacoesData, setOrientacoesData] = useState<Course[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState<"disciplinas" | "orientacoes">("disciplinas")
  const [isDeleteZoneActive, setIsDeleteZoneActive] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDisciplinas = localStorage.getItem("disciplinas")
    const savedOrientacoes = localStorage.getItem("orientacoes")

    if (savedDisciplinas) {
      setDisciplinasData(JSON.parse(savedDisciplinas))
    }
    if (savedOrientacoes) {
      setOrientacoesData(JSON.parse(savedOrientacoes))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("disciplinas", JSON.stringify(disciplinasData))
  }, [disciplinasData])

  useEffect(() => {
    localStorage.setItem("orientacoes", JSON.stringify(orientacoesData))
  }, [orientacoesData])

  const handleAddCourse = () => {
    setEditingCourse(null)
    setIsDialogOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setIsDialogOpen(true)
  }

  const handleSaveCourse = (course: Course) => {
    if (activeTab === "disciplinas") {
      if (editingCourse) {
        setDisciplinasData((prev) => prev.map((c) => (c.id === course.id ? course : c)))
      } else {
        setDisciplinasData((prev) => [...prev, course])
      }
    } else {
      if (editingCourse) {
        setOrientacoesData((prev) => prev.map((c) => (c.id === course.id ? course : c)))
      } else {
        setOrientacoesData((prev) => [...prev, course])
      }
    }
    setIsDialogOpen(false)
    setEditingCourse(null)
  }

  const handleDeleteCourse = (courseId: string) => {
    if (activeTab === "disciplinas") {
      setDisciplinasData((prev) => prev.filter((c) => c.id !== courseId))
    } else {
      setOrientacoesData((prev) => prev.filter((c) => c.id !== courseId))
    }
  }

  const handleMoveCourse = (courseId: string, day: string, period: string) => {
    if (activeTab === "disciplinas") {
      setDisciplinasData((prev) =>
        prev.map((c) => {
          if (c.id === courseId) {
            // Clear all schedule slots and set only the new one
            const newSchedule = {
              segunda: { manha: false, tarde: false },
              terca: { manha: false, tarde: false },
              quarta: { manha: false, tarde: false },
              quinta: { manha: false, tarde: false },
              sexta: { manha: false, tarde: false },
            }
            newSchedule[day][period] = true
            return { ...c, schedule: newSchedule }
          }
          return c
        }),
      )
    } else {
      setOrientacoesData((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, schedule: { ...c.schedule, [day]: { ...c.schedule[day], [period]: true } } } : c,
        ),
      )
    }
  }

  const currentData = activeTab === "disciplinas" ? disciplinasData : orientacoesData

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "disciplinas" | "orientacoes")}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl grid-cols-2 mb-6">
              <TabsTrigger value="disciplinas" className="text-base">
                Disciplinas (matrícula ampla)
              </TabsTrigger>
              <TabsTrigger value="orientacoes" className="text-base">
                Orientação (matrícula restrita)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="disciplinas" className="mt-0">
              <ScheduleBoard
                courses={disciplinasData}
                onEditCourse={handleEditCourse}
                onMoveCourse={handleMoveCourse}
                onDragStart={() => setIsDeleteZoneActive(true)}
                onDragEnd={() => setIsDeleteZoneActive(false)}
              />
            </TabsContent>

            <TabsContent value="orientacoes" className="mt-0">
              <ScheduleBoard
                courses={orientacoesData}
                onEditCourse={handleEditCourse}
                onMoveCourse={handleMoveCourse}
                onDragStart={() => setIsDeleteZoneActive(true)}
                onDragEnd={() => setIsDeleteZoneActive(false)}
              />
            </TabsContent>
          </Tabs>

          {/* Floating action buttons */}
          <div className="fixed bottom-8 right-8 flex flex-col gap-4">
            <DeleteZone isActive={isDeleteZoneActive} onDelete={handleDeleteCourse} />
            <Button size="lg" onClick={handleAddCourse} className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          <CourseDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            course={editingCourse}
            onSave={handleSaveCourse}
            currentTab={activeTab}
          />
        </div>
      </div>
    </DndProvider>
  )
}
