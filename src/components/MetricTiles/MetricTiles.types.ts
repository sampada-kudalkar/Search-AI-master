export interface Metric {
  id: string
  value: number | string
  label: string
}

export interface MetricTilesProps {
  metrics: Metric[]
}
