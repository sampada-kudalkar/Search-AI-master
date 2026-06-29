export interface CompetitorEntry {
  value: string
  name: string
  delta?: string
  trend?: 'up' | 'down'
}

/** New comparison layout: You vs Competitor(s) */
export interface ComparisonStat {
  id: string
  label: string
  tooltip?: string
  youValue: string
  competitors: CompetitorEntry[]
}

/** Legacy flat KPI layout (used by other screens) */
export interface KpiStat {
  id: string
  value: string
  label: string
  delta?: string
  trend?: 'up' | 'down'
}

export type SummaryStat = ComparisonStat | KpiStat

export interface SummaryStatsProps {
  title?: string
  stats: SummaryStat[]
}

function isComparison(s: SummaryStat): s is ComparisonStat {
  return 'youValue' in s
}

function kFormat(raw: string): { display: string; tooltip?: string } {
  const numeric = parseFloat(raw.replace(/,/g, ''))
  if (!isNaN(numeric) && numeric >= 1000) {
    const k = parseFloat((numeric / 1000).toFixed(1))
    return { display: `${k}K`, tooltip: numeric.toLocaleString() }
  }
  return { display: raw }
}

import { InfoTooltip } from '../InfoTooltip/InfoTooltip'

export function SummaryStats({ title = 'Summary', stats }: SummaryStatsProps) {
  const isComparisonLayout = stats.length > 0 && isComparison(stats[0])

  if (isComparisonLayout) {
    return (
      <section className="rounded-md border border-border bg-surface pt-[16px] px-[20px] pb-[24px]">
        <div className="flex items-center justify-between mb-[16px]">
          <p className="text-[16px] leading-[24px] tracking-[-0.32px] text-text-secondary">{title}</p>
        </div>
        <div className="flex gap-[48px_120px]">
          {(stats as ComparisonStat[]).map((s) => (
            <div key={s.id} className="flex flex-col gap-[8px] items-start">
              <div className="flex items-center gap-xs">
                <p className="text-[14px] leading-[20px] tracking-[-0.28px] text-text-secondary whitespace-nowrap">{s.label}</p>
                {s.tooltip && <InfoTooltip text={s.tooltip} />}
              </div>
              <div className="flex items-center gap-[24px]">
                {/* You block */}
                <div className="flex flex-col items-start gap-0">
                  <span className="text-[32px] leading-[48px] tracking-[-0.64px] text-text-primary">{s.youValue}</span>
                  <div
                    className="flex items-center justify-center px-[8px] py-[2px] rounded-full border border-white"
                    style={{ background: 'linear-gradient(rgb(15, 113, 149) 0%, rgb(5, 36, 47) 100%)' }}
                  >
                    <span className="text-[12px] leading-[16px] text-white">You</span>
                  </div>
                </div>

                {/* Competitors */}
                {s.competitors.map((c, i) => (
                  <div key={i} className="flex items-center gap-[24px]">
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{ width: 40, height: 32, background: '#ecf5fd' }}
                    >
                      <span className="text-[16px] leading-[28px] text-text-primary">vs</span>
                    </div>
                    <div className="flex flex-col items-start gap-0">
                      <div className="flex items-center gap-[4px]">
                        <span className="text-[32px] leading-[48px] tracking-[-0.64px] text-text-primary">{c.value}</span>
                        {c.delta && (
                          <span
                            className="text-[12px] leading-[18px]"
                            style={{ color: c.trend === 'down' ? '#de1b0c' : '#2e7d32' }}
                          >
                            {c.trend === 'down' ? '-' : '+'}{c.delta.replace(/^[+-]/, '')}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] leading-[18px] text-text-secondary whitespace-nowrap">{c.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Legacy flat KPI layout
  return (
    <section className="rounded-md border border-border bg-surface p-2xl">
      <h3 className="mb-lg text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{title}</h3>
      <div className="grid gap-y-lg" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
        {(stats as KpiStat[]).map((s) => {
          const { display, tooltip } = kFormat(s.value)
          return (
            <div key={s.id} title={tooltip}>
              <div className="flex items-end gap-sm">
                <span className="text-[24px] leading-8 text-text-primary">{display}</span>
                {s.delta && (
                  <span
                    className={`mb-[2px] text-small font-medium ${
                      s.trend === 'down' ? 'text-chip-danger-text' : 'text-chip-success-text'
                    }`}
                  >
                    {s.trend === 'down' ? '-' : '+'}{s.delta.replace(/^[+-]/, '')}
                  </span>
                )}
              </div>
              <p className="text-body text-text-secondary">{s.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
