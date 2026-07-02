export interface SummaryCardStat {
  id: string
  value: string
  label: string
}

export interface SummaryCardProps {
  title: string
  subtitle?: string
  stats: SummaryCardStat[]
}
