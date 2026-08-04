import { useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { TrendLineChart } from '../charts/TrendLineChart'
import { DateRangeSelector } from '../DateRangeSelector/DateRangeSelector'
import { SummarizeIcon } from '../SummarizeIcon/SummarizeIcon'
import { MoreMenu } from '../charts/ChartCard'
import type { HealthScoreTrendCardProps } from './HealthScoreTrendCard.types'

const DATE_RANGE_OPTIONS = ['Last 3 months', 'Last 6 months', 'Last 12 months']

export function HealthScoreTrendCard({
  data,
  series,
  title = 'Health score over time',
  subtitle = "Track how your domain's health score has changed over the last 6 months",
}: HealthScoreTrendCardProps) {
  const [dateRange, setDateRange] = useState(DATE_RANGE_OPTIONS[1])

  return (
    <div className="flex flex-col bg-surface rounded-md border border-border">
      <div className="px-xl py-lg">
        <CardHeader
          title={<span className="text-[16px] leading-[24px] text-text-secondary">{title}</span>}
          subtitle={subtitle}
          toolbar={
            <div className="flex items-center gap-sm">
              <DateRangeSelector value={dateRange} options={DATE_RANGE_OPTIONS} onChange={setDateRange} />
              <button
                type="button"
                className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover"
              >
                <SummarizeIcon size={16} />
              </button>
              <MoreMenu />
            </div>
          }
        />
      </div>
      <div className="px-xl pt-lg pb-xl">
        <TrendLineChart data={data} series={series} height={320} yDomain={[0, 100]} />
        <div className="flex flex-wrap items-center gap-xl mt-sm px-xs">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-xs">
              <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[12px] text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
