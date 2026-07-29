export type SignalStatus = 'pass' | 'fail' | 'warning'

export interface BreakdownSignal {
  label: string
  status: SignalStatus
  affectedLabel?: string
}

export type BreakdownMetricKey = 'ai' | 'disc' | 'fresh'

export interface BreakdownColumn extends Record<string, unknown> {
  key: BreakdownMetricKey
  title: string
  score: number | null
  delta: number
  signals: BreakdownSignal[]
}

export interface HealthBreakdownCardProps {
  columns: BreakdownColumn[]
  onSeeBreakdown: (key: BreakdownMetricKey) => void
}
