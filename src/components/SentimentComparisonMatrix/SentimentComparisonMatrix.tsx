import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { Icon } from '../Icon/Icon'
import type {
  SentimentComparisonMatrixProps,
  SentimentMatrixRow,
} from './SentimentComparisonMatrix.types'

export function SentimentComparisonMatrix({ traits, competitors, values }: SentimentComparisonMatrixProps) {
  const rows: SentimentMatrixRow[] = traits.map((trait, i) => ({
    _id: `trait-${i}`,
    trait,
    ...Object.fromEntries(competitors.map((c) => [c.name, values[trait]?.[c.name] ?? false])),
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
      render: (v: unknown) =>
        v ? (
          <Icon name="check_circle" size={20} className="text-chip-success-text" />
        ) : (
          <span className="text-text-tertiary">—</span>
        ),
    })),
  ]

  return <DataTable<SentimentMatrixRow> columns={columns} data={rows} rowHeight={44} />
}
