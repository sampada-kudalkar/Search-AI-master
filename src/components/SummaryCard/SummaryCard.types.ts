import type { ReactNode } from 'react'

export interface SummaryCardStat {
  id: string
  value: string
  label: string
  /** Optional delta shown next to the value, e.g. "3.1%". */
  delta?: string
  trend?: 'up' | 'down'
  /** Optional info-tooltip text shown next to the label, e.g. a breakdown of the value. */
  tooltip?: string
}

export interface SummaryCardProps {
  title: string
  subtitle?: string
  /** Optional info-tooltip text shown next to the title, in place of a subtitle line. */
  titleTooltip?: string
  stats: SummaryCardStat[]
  toolbar?: ReactNode
}
