import { CardHeader } from '../CardHeader/CardHeader'
import { Icon } from '../Icon/Icon'
import { BreakdownColumn, BreakdownSignal, HealthBreakdownCardProps } from './HealthBreakdownCard.types'

function signalIcon(status: BreakdownSignal['status']) {
  if (status === 'pass') return { name: 'check_circle', className: 'text-chip-success-text' }
  if (status === 'warning') return { name: 'warning', className: 'text-chip-warning-text' }
  return { name: 'cancel', className: 'text-chip-danger-text' }
}

function DeltaTag({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-small text-text-tertiary">0</span>
  const positive = delta > 0
  return (
    <span className={`text-small ${positive ? 'text-chip-success-text' : 'text-chip-danger-text'}`}>
      {positive ? '+' : ''}
      {delta.toFixed(1)}
    </span>
  )
}

function BreakdownColumnBlock({
  column,
  isFirst,
  onSeeBreakdown,
}: {
  column: BreakdownColumn
  isFirst: boolean
  onSeeBreakdown: HealthBreakdownCardProps['onSeeBreakdown']
}) {
  return (
    <div className={`flex flex-col gap-md px-xl py-lg ${isFirst ? '' : 'border-l border-border'}`}>
      <div className="text-body text-text-primary">{column.title}</div>
      <div className="flex items-baseline gap-sm">
        <span className="text-display text-text-primary">{column.score ?? '—'}</span>
        <DeltaTag delta={column.delta} />
      </div>
      <div className="flex flex-col gap-sm">
        {column.signals.map((signal) => {
          const icon = signalIcon(signal.status)
          return (
            <div key={signal.label} className="flex items-start gap-xs">
              <Icon name={icon.name} size={16} fill className={`mt-[2px] shrink-0 ${icon.className}`} />
              <div className="flex flex-col">
                <span className="text-body text-text-primary">{signal.label}</span>
                {signal.affectedLabel && <span className="text-small text-text-secondary">{signal.affectedLabel}</span>}
              </div>
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => onSeeBreakdown(column.key)}
        className="mt-xs self-start text-body text-text-action hover:underline"
      >
        See breakdown
      </button>
    </div>
  )
}

export function HealthBreakdownCard({ columns, onSeeBreakdown }: HealthBreakdownCardProps) {
  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="px-2xl pb-lg pt-2xl">
        <CardHeader title="What's your health score breakdown?" subtitle="See what's working and what needs fixing" />
      </div>
      <div className="grid grid-cols-3 pb-xl">
        {columns.map((column, i) => (
          <BreakdownColumnBlock key={column.key} column={column} isFirst={i === 0} onSeeBreakdown={onSeeBreakdown} />
        ))}
      </div>
    </div>
  )
}
