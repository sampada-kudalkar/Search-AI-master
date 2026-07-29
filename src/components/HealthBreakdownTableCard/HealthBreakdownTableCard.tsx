import { CardHeader } from '../CardHeader/CardHeader'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { Icon } from '../Icon/Icon'
import type { BreakdownColumn, BreakdownSignal } from '../HealthBreakdownCard/HealthBreakdownCard.types'
import type { HealthBreakdownTableCardProps } from './HealthBreakdownTableCard.types'

function signalIcon(status: BreakdownSignal['status']) {
  if (status === 'pass') return { name: 'check_circle', className: 'text-chip-success-text' }
  if (status === 'warning') return { name: 'warning', className: 'text-chip-warning-text' }
  return { name: 'cancel', className: 'text-chip-danger-text' }
}

function DeltaTag({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-small text-text-tertiary">0%</span>
  const positive = delta > 0
  return (
    <span className={`text-small ${positive ? 'text-chip-success-text' : 'text-chip-danger-text'}`}>
      {positive ? '+' : ''}
      {delta.toFixed(1)}%
    </span>
  )
}

const TABLE_COLUMNS: Column<BreakdownColumn>[] = [
  {
    key: 'title',
    label: 'Score breakdown',
    width: 220,
    resizable: false,
    render: (v) => <span className="text-body text-text-primary group-hover/row:text-text-action">{v as string}</span>,
  },
  {
    key: 'score',
    label: 'Score',
    width: 140,
    resizable: false,
    render: (v, row) => (
      <div className="flex items-baseline gap-sm">
        <span className="text-body text-text-primary">{(v as number | null) ?? '—'}</span>
        <DeltaTag delta={row.delta} />
      </div>
    ),
  },
  {
    key: 'signals',
    label: 'Key factors',
    resizable: false,
    render: (v) => (
      <div className="flex flex-col gap-sm">
        {(v as BreakdownSignal[]).map((signal) => {
          const icon = signalIcon(signal.status)
          return (
            <div key={signal.label} className="flex items-start gap-xs">
              <Icon name={icon.name} size={16} fill className={`mt-[2px] shrink-0 ${icon.className}`} />
              <span className="text-body text-text-primary">
                {signal.label}
                {signal.affectedLabel && <span className="text-text-secondary"> • {signal.affectedLabel}</span>}
              </span>
            </div>
          )
        })}
      </div>
    ),
  },
]

export function HealthBreakdownTableCard({ columns, onSeeBreakdown }: HealthBreakdownTableCardProps) {
  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="px-2xl pb-lg pt-2xl">
        <CardHeader title="What's your health score breakdown?" subtitle="See what's working and what needs fixing" />
      </div>
      <div className="px-2xl pb-xl">
        <DataTable columns={TABLE_COLUMNS} data={columns} onRowClick={(row) => onSeeBreakdown(row.key)} autoRowHeight />
      </div>
    </div>
  )
}
