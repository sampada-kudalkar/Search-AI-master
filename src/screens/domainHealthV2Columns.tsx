import { Chip, Icon, InfoTooltip, type ChipVariant, type Column } from '../components'
import type { HealthImprovementRow, TechnicalCheckRow } from '../data/domainHealthDataV2'

export function scoreVariant(value: number): ChipVariant {
  if (value >= 80) return 'success'
  if (value >= 50) return 'warning'
  return 'danger'
}

export function headerWithTooltip(label: string, tooltip: string) {
  return (
    <span className="flex items-center gap-xs">
      {label}
      <InfoTooltip text={tooltip} />
    </span>
  )
}

interface KVRow extends Record<string, unknown> {
  label: string
  value: string | number
}

export function kvColumns(valueClassName: (row: KVRow) => string = () => 'text-text-primary'): Column<KVRow>[] {
  return [
    { key: 'label', label: '', resizable: false, render: (v) => <span className="text-body text-text-primary">{v as string}</span> },
    { key: 'value', label: '', resizable: false, render: (v, row) => <span className={`text-body ${valueClassName(row)}`}>{v as string | number}</span> },
  ]
}

export function ScoreChip({ value }: { value: number }) {
  return <Chip label={String(value)} variant={scoreVariant(value)} />
}

/** Flat "How to improve your health score" table — one row per recommendation, default-sorted by affected pages. */
export function healthImprovementColumns({ showAffected = true }: { showAffected?: boolean } = {}): Column<HealthImprovementRow>[] {
  return [
    { key: 'title', label: 'Recommendations', render: (v) => <span className="text-body text-text-primary group-hover/row:text-text-action">{v as string}</span> },
    { key: 'metric', label: 'Metric', width: 160, render: (v) => <span className="text-body text-text-secondary">{v as string}</span> },
    { key: 'score', label: 'Current score', width: 110, resizable: false, render: (v) => <ScoreChip value={v as number} /> },
    {
      key: 'impact',
      label: 'Potential impact',
      width: 140,
      resizable: false,
      render: (v) => <span className="text-body text-text-primary">+{v as number} points</span>,
    },
    ...(showAffected
      ? [
          {
            key: 'affectedLabel' as const,
            label: 'Affected pages',
            width: 140,
            sortable: true,
            render: (v: unknown) => <span className="text-body text-text-secondary">{v as string}</span>,
          },
        ]
      : []),
  ]
}

export function technicalCheckColumns(): Column<TechnicalCheckRow>[] {
  return [
    {
      key: 'label',
      label: '',
      resizable: false,
      render: (v, row) => (
        <span className="flex items-center gap-xs text-body text-text-primary">
          {v as string}
          <InfoTooltip text={row.tooltip} />
        </span>
      ),
    },
    {
      key: 'checked',
      label: '',
      resizable: false,
      render: () => (
        <span className="flex size-4 items-center justify-center rounded-full bg-chip-success-text">
          <Icon name="check" size={12} className="text-white" />
        </span>
      ),
    },
  ]
}
