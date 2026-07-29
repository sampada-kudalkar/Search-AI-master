import { CardHeader } from '../CardHeader/CardHeader'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import type { BreakdownColumn, BreakdownMetricKey } from '../HealthBreakdownCard/HealthBreakdownCard.types'
import type { HealthBreakdownSummaryCardProps } from './HealthBreakdownSummaryCard.types'

const METRIC_NAME: Record<BreakdownMetricKey, string> = {
  ai: 'AI readiness',
  disc: 'discoverability',
  fresh: 'freshness',
}

function lowerFirst(label: string): string {
  const firstWord = label.split(' ')[0]
  if (/^[A-Z]{2,}$/.test(firstWord)) return label
  return label.charAt(0).toLowerCase() + label.slice(1)
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function buildSummary(column: BreakdownColumn): string {
  const metricName = METRIC_NAME[column.key]
  const failing = column.signals.filter((s) => s.status !== 'pass')
  const passing = column.signals.filter((s) => s.status === 'pass')

  if (failing.length === 0) {
    const list = joinList(passing.map((s) => lowerFirst(s.label)))
    return `Your ${list} are accurate and contributing to a high ${metricName} score.`
  }

  const list = joinList(failing.map((s) => lowerFirst(s.label)))
  return `Your ${list} have issues. They're affecting your ${metricName} score and dragging down your overall health score. Focus on these areas.`
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

const TABLE_COLUMNS: Column<BreakdownColumn>[] = [
  {
    key: 'title',
    label: 'Metric',
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
    label: 'Summary',
    width: '40%',
    resizable: false,
    render: (_v, row) => <p className="text-body text-text-primary">{buildSummary(row)}</p>,
  },
]

export function HealthBreakdownSummaryCard({ columns, onSeeBreakdown }: HealthBreakdownSummaryCardProps) {
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
