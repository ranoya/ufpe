"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DAYS, PERIODS, COLORS, type Course } from "@/types/course"
import { Check } from "lucide-react"

interface CourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onSave: (course: Course) => void
  currentTab: "disciplinas" | "orientacoes"
}

export function CourseDialog({ open, onOpenChange, course, onSave, currentTab }: CourseDialogProps) {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    professor: "",
    modality: "hibrida",
    workload: "60h",
    schedule: {
      segunda: { manha: false, tarde: false },
      terca: { manha: false, tarde: false },
      quarta: { manha: false, tarde: false },
      quinta: { manha: false, tarde: false },
      sexta: { manha: false, tarde: false },
    },
    color: COLORS[0],
    tab: currentTab,
  })

  useEffect(() => {
    if (course) {
      setFormData(course)
    } else {
      setFormData({
        title: currentTab === "orientacoes" ? "Orientação" : "",
        professor: "",
        modality: "hibrida",
        workload: "60h",
        schedule: {
          segunda: { manha: false, tarde: false },
          terca: { manha: false, tarde: false },
          quarta: { manha: false, tarde: false },
          quinta: { manha: false, tarde: false },
          sexta: { manha: false, tarde: false },
        },
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        tab: currentTab,
      })
    }
  }, [course, open, currentTab])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const courseData: Course = {
      id: course?.id || crypto.randomUUID(),
      title: currentTab === "orientacoes" ? "Orientação" : formData.title || "",
      professor: formData.professor || "",
      modality: formData.modality || "hibrida",
      workload: formData.workload || "60h",
      schedule: formData.schedule || {
        segunda: { manha: false, tarde: false },
        terca: { manha: false, tarde: false },
        quarta: { manha: false, tarde: false },
        quinta: { manha: false, tarde: false },
        sexta: { manha: false, tarde: false },
      },
      color: formData.color || COLORS[0],
      tab: currentTab,
    }

    onSave(courseData)
  }

  const toggleSchedule = (day: string, period: string) => {
    if (currentTab === "disciplinas") {
      const newSchedule = {
        segunda: { manha: false, tarde: false },
        terca: { manha: false, tarde: false },
        quarta: { manha: false, tarde: false },
        quinta: { manha: false, tarde: false },
        sexta: { manha: false, tarde: false },
      }
      newSchedule[day][period] = true
      setFormData((prev) => ({
        ...prev,
        schedule: newSchedule,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule!,
          [day]: {
            ...prev.schedule![day],
            [period]: !prev.schedule![day][period],
          },
        },
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {currentTab === "orientacoes"
              ? course
                ? "Editar Orientação"
                : "Nova Orientação"
              : course
                ? "Editar Disciplina"
                : "Nova Disciplina"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentTab === "disciplinas" && (
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Nome da disciplina"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="professor">Professor</Label>
            <Input
              id="professor"
              value={formData.professor}
              onChange={(e) => setFormData((prev) => ({ ...prev, professor: e.target.value }))}
              placeholder="Nome do professor"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workload">Carga Horária</Label>
              <Select
                value={formData.workload}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, workload: value as Course["workload"] }))}
              >
                <SelectTrigger id="workload">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15h">15h</SelectItem>
                  <SelectItem value="30h">30h</SelectItem>
                  <SelectItem value="45h">45h</SelectItem>
                  <SelectItem value="60h">60h</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modality">Modalidade</Label>
              <Select
                value={formData.modality}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, modality: value as Course["modality"] }))}
              >
                <SelectTrigger id="modality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hibrida">Híbrida</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Horário</Label>
            {currentTab === "disciplinas" && (
              <p className="text-xs text-muted-foreground mb-2">Selecione apenas um horário</p>
            )}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-6 gap-2 text-center text-sm font-medium mb-2">
                <div />
                <div>S</div>
                <div>T</div>
                <div>Q</div>
                <div>Q</div>
                <div>S</div>
              </div>
              {PERIODS.map((period) => (
                <div key={period} className="grid grid-cols-6 gap-2 mb-2 last:mb-0">
                  <div className="flex items-center justify-center text-sm font-medium">
                    {period === "manha" ? "M" : "T"}
                  </div>
                  {DAYS.map((day) => (
                    <button
                      key={`${day}-${period}`}
                      type="button"
                      onClick={() => toggleSchedule(day, period)}
                      className={`h-10 rounded border-2 transition-colors ${
                        formData.schedule?.[day]?.[period]
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      {formData.schedule?.[day]?.[period] && <Check className="h-4 w-4 mx-auto" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
