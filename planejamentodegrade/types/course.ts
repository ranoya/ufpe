export interface Course {
  id: string
  title: string
  professor: string
  modality: "hibrida" | "presencial"
  workload: "15h" | "30h" | "45h" | "60h"
  schedule: {
    segunda: { manha: boolean; tarde: boolean }
    terca: { manha: boolean; tarde: boolean }
    quarta: { manha: boolean; tarde: boolean }
    quinta: { manha: boolean; tarde: boolean }
    sexta: { manha: boolean; tarde: boolean }
  }
  color: string
  tab: "disciplinas" | "orientacoes"
}

export const DAYS = ["segunda", "terca", "quarta", "quinta", "sexta"] as const
export const PERIODS = ["manha", "tarde"] as const

export const DAY_LABELS: Record<string, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
}

export const PERIOD_LABELS: Record<string, string> = {
  manha: "Manhã",
  tarde: "Tarde",
}

export const COLORS = [
  "bg-pink-200",
  "bg-blue-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-orange-200",
  "bg-red-200",
  "bg-teal-200",
]
