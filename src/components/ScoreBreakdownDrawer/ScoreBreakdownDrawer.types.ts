import type { BreakdownMetricKey } from '../HealthBreakdownCard/HealthBreakdownCard.types'
import type { HorizontalBarDatum } from '../charts/HorizontalBarChart'

export type { BreakdownMetricKey }

export type DrawerSignalStatus = 'pass' | 'fail' | 'warning' | 'neutral'

export interface DrawerSignalRow {
  label: string
  status: DrawerSignalStatus
  note?: string
}

export interface KVRow extends Record<string, unknown> {
  label: string
  value: string | number
}

export interface DrawerBotRow {
  name: string
  status: string
}

export interface DrawerTopFix {
  rank: number
  title: string
  points: number
  affectedLabel?: string
}

interface DrawerSectionBase {
  key: string
  title: string
  /** Whether this accordion row starts expanded. Only one section per drawer should set this. */
  defaultOpen?: boolean
  /** Hidden entirely at domain scope — only rendered when scope === 'page'. */
  pageOnly?: boolean
}

export type DrawerSection =
  | (DrawerSectionBase & { kind: 'signals'; description?: string; signals: DrawerSignalRow[] })
  | (DrawerSectionBase & { kind: 'bots'; rows: DrawerBotRow[]; note?: string })
  | (DrawerSectionBase & { kind: 'bar'; data: HorizontalBarDatum[] })
  | (DrawerSectionBase & { kind: 'kv'; rows: KVRow[] })
  | (DrawerSectionBase & { kind: 'fixes'; fixes: DrawerTopFix[] })

export interface ScoreBreakdownDrawerProps {
  open: boolean
  onClose: () => void
  metricName: string
  score: number | null
  /** Bullet lines for the AI summary card's "Highlights" list. */
  highlights: string[]
  onRegenerate?: () => void
  sections: DrawerSection[]
  scope: 'domain' | 'page'
}
