import { SummaryCardProps } from './SummaryCard.types'

export function SummaryCard({ title, subtitle, stats }: SummaryCardProps) {
  return (
    <section className="rounded-md border border-border bg-surface p-2xl">
      <h3 className="text-[16px] leading-6 tracking-[-0.32px] text-text-secondary">{title}</h3>
      {subtitle && <p className="mt-[2px] text-small text-text-secondary">{subtitle}</p>}
      <div className="mt-lg grid gap-y-lg" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
        {stats.map((s) => (
          <div key={s.id}>
            <span className="block text-[32px] leading-10 tracking-[-0.64px] text-text-primary">{s.value}</span>
            <p className="mt-[4px] text-body text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
