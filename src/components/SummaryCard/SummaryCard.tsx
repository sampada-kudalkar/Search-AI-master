import { SummaryCardProps } from './SummaryCard.types'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'

export function SummaryCard({ title, subtitle, titleTooltip, stats, toolbar }: SummaryCardProps) {
  return (
    <section className="rounded-md border border-border bg-surface p-2xl">
      <div className="flex items-start justify-between gap-md">
        <div>
          <h3 className="flex items-center gap-xs text-[16px] leading-6 tracking-[-0.32px] text-text-secondary">
            {title}
            {titleTooltip && <InfoTooltip text={titleTooltip} />}
          </h3>
          {subtitle && <p className="mt-[2px] text-small text-text-secondary">{subtitle}</p>}
        </div>
        {toolbar && <div className="flex items-center gap-[8px] shrink-0 ml-md">{toolbar}</div>}
      </div>
      <div className="mt-lg grid gap-y-lg" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
        {stats.map((s) => {
          const isPositive = s.trend !== 'down'
          return (
            <div key={s.id}>
              <div className="flex items-baseline gap-sm">
                <span className="text-[28px] leading-9 tracking-[-0.56px] text-text-primary">{s.value}</span>
                {s.delta && (
                  <span className={`text-small ${isPositive ? 'text-chip-success-text' : 'text-chip-danger-text'}`}>
                    {isPositive ? '+' : ''}{s.delta}
                  </span>
                )}
              </div>
              <p className="mt-[4px] flex items-center gap-xs text-body text-text-secondary">
                {s.label}
                {s.tooltip && <InfoTooltip text={s.tooltip} />}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
