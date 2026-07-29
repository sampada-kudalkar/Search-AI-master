import { useState } from 'react'
import { CardHeader, Chip, DataTable, Icon, MetricTiles, type Column, type ChipVariant } from '../components'
import { DOMAIN_HEALTH_ROWS, type DomainHealthRow } from '../data/domainHealthData'
import { DomainHealthDomainScreen } from './DomainHealthDomainScreen'

function scoreVariant(value: number): ChipVariant {
  if (value >= 80) return 'success'
  if (value >= 50) return 'warning'
  return 'danger'
}

function ScoreChip({ value }: { value: number }) {
  return <Chip label={String(value)} variant={scoreVariant(value)} />
}

const COLUMNS: Column<DomainHealthRow>[] = [
  {
    key: 'domain',
    label: 'URL',
    width: 280,
    render: (_value, row) => (
      <div className="flex flex-col gap-[2px]">
        <span className="text-body text-text-primary">{row.domain}</span>
        <span className="text-small text-text-tertiary">{row.pageCount} pages</span>
      </div>
    ),
  },
  { key: 'health', label: 'Health', render: (v) => <ScoreChip value={v as number} /> },
  { key: 'aiReadiness', label: 'AI readiness', render: (v) => <ScoreChip value={v as number} /> },
  { key: 'discoverability', label: 'Discoverability', render: (v) => <ScoreChip value={v as number} /> },
  { key: 'freshness', label: 'Freshness', render: (v) => <ScoreChip value={v as number} /> },
  { key: 'aiAccessibility', label: 'AI accessibility', render: (v) => <ScoreChip value={v as number} /> },
  { key: 'recommendations', label: 'Recommendations' },
]

export function DomainHealthReportScreen() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  if (selectedDomain) {
    return <DomainHealthDomainScreen domain={selectedDomain} onBack={() => setSelectedDomain(null)} />
  }

  return (
    <div className="flex flex-1 min-h-0 min-w-0 flex-col">
      <div className="flex h-[64px] shrink-0 items-center gap-sm bg-surface px-2xl py-sm">
        <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">Domain health</p>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-xl px-2xl py-xl">
          <MetricTiles
            metrics={[
              { id: 'urls', value: 10, label: 'URLs crawled' },
              { id: 'pages', value: 248, label: 'Pages crawled' },
              { id: 'indexable', value: 214, label: 'Indexable' },
              { id: 'issues', value: 18, label: 'Issues found' },
              { id: 'warnings', value: 16, label: 'Warnings' },
            ]}
          />
          <div className="rounded-md border border-border bg-surface">
            <div className="px-2xl pb-lg pt-2xl">
              <CardHeader
                title="Website health"
                subtitle="Crawl results grouped by website"
                toolbar={
                  <button
                    type="button"
                    aria-label="Search"
                    className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
                  >
                    <Icon name="search" size={20} />
                  </button>
                }
              />
            </div>
            <div className="px-2xl">
              <DataTable
                columns={COLUMNS}
                data={DOMAIN_HEALTH_ROWS}
                onRowClick={(row) => setSelectedDomain(row.domain)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
