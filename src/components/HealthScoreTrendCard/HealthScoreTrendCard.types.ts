import type { SeriesConfig, TrendPoint } from '../charts/TrendLineChart'

export interface HealthScoreTrendCardProps {
  data: TrendPoint[]
  series: SeriesConfig[]
  title?: string
  subtitle?: string
}
