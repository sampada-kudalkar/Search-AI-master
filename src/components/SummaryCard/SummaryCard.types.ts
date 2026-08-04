import type { ReactNode } from 'react'

export interface SummaryCardStat {
  id: string
  value: string
  label: string
  /** Optional delta shown next to the value, e.g. "3.1%". */
  delta?: string
  trend?: 'up' | 'down'
}

export interface SummaryCardProps {
  title: string
  subtitle?: string
  stats: SummaryCardStat[]
  toolbar?: ReactNode
}
