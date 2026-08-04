import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import type {
  SentimentComparisonMatrixProps,
  SentimentMatrixRow,
} from './SentimentComparisonMatrix.types'

function scoreColorClass(score: number): string {
  if (score >= 80) return 'border-chip-success-text text-chip-success-text'
  if (score >= 50) return 'border-chip-warning-text text-chip-warning-text'
  return 'border-chip-danger-text text-chip-danger-text'
}

function SentimentScoreBadge({ score }: { score: number | undefined }) {
  if (score === undefined) return <span className="text-text-tertiary">—</span>
  return (
    <span className={`inline-flex min-w-[44px] items-center justify-center rounded-sm border px-sm py-xs text-small ${scoreColorClass(score)}`}>
      {score}
    </span>
  )
}

export function SentimentComparisonMatrix({ traits, competitors, values }: SentimentComparisonMatrixProps) {
  const rows: SentimentMatrixRow[] = traits.map((trait, i) => ({
    _id: `trait-${i}`,
    trait,
    ...Object.fromEntries(competitors.map((c) => [c.name, values[trait]?.[c.name]])),
  }))

  const columns: Column<SentimentMatrixRow>[] = [
    {
      key: 'trait',
      label: 'Trait',
      width: 260,
      render: (v) => <span className="text-body text-text-primary">{v as string}</span>,
    },
    ...competitors.map((c) => ({
      key: c.name as keyof SentimentMatrixRow,
      label: c.isYou ? 'You' : c.name,
      width: 140,
      render: (v: unknown) => <SentimentScoreBadge score={v as number | undefined} />,
    })),
  ]

  return <DataTable<SentimentMatrixRow> columns={columns} data={rows} autoRowHeight />
}
