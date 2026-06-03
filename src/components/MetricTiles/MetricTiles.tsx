import { MetricTilesProps } from './MetricTiles.types'

export function MetricTiles({ metrics }: MetricTilesProps) {
  return (
    <div className="flex gap-md">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="flex flex-1 flex-col items-start rounded-md border border-border px-lg pb-lg pt-md"
        >
          <span className="text-display text-text-primary">{metric.value}</span>
          <span className="text-body text-text-primary">{metric.label}</span>
        </div>
      ))}
    </div>
  )
}
