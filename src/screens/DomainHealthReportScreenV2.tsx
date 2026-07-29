import { useState } from 'react'
import { CardHeader, DataTable, DateRangeSelector, MetricTiles, MoreMenu, type Column } from '../components'
import {
  DOMAIN_HEALTH_MONTH_OPTIONS,
  DOMAIN_HEALTH_ROWS_V2,
  HEALTH_METRIC_TOOLTIPS,
  getListSummary,
  type DomainHealthRowV2,
} from '../data/domainHealthDataV2'
import { ScoreChip, headerWithTooltip } from './domainHealthV2Columns'
import { DomainHealthDomainScreenV2 } from './DomainHealthDomainScreenV2'

const COLUMNS: Column<DomainHealthRowV2>[] = [
  {
    key: 'domain',
    label: headerWithTooltip('Domain', 'The website domain being tracked.'),
    width: 280,
    render: (_value, row) => (
      <div className="flex flex-col gap-[2px]">
        <span className="truncate text-body text-text-primary group-hover/row:text-text-action">{row.domain}</span>
        <span className="text-small text-text-tertiary">{row.pageCount} pages</span>
      </div>
    ),
  },
  { key: 'health', label: headerWithTooltip('Health score', HEALTH_METRIC_TOOLTIPS.health), render: (v) => <ScoreChip value={v as number} /> },
  { key: 'aiReadiness', label: headerWithTooltip('AI readiness', HEALTH_METRIC_TOOLTIPS.aiReadiness), render: (v) => <ScoreChip value={v as number} /> },
  { key: 'discoverability', label: headerWithTooltip('Discoverability', HEALTH_METRIC_TOOLTIPS.discoverability), render: (v) => <ScoreChip value={v as number} /> },
  { key: 'freshness', label: headerWithTooltip('Freshness', HEALTH_METRIC_TOOLTIPS.freshness), render: (v) => <ScoreChip value={v as number} /> },
  {
    key: 'recommendations',
    label: headerWithTooltip(
      'Recommendations',
      'Personalized recommendations to help you fix issues affecting your website. Completing these recommendations can improve your domain health score over time.',
    ),
  },
]

export function DomainHealthReportScreenV2() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [month, setMonth] = useState(DOMAIN_HEALTH_MONTH_OPTIONS[0])

  if (selectedDomain) {
    return <DomainHealthDomainScreenV2 domain={selectedDomain} onBack={() => setSelectedDomain(null)} />
  }

  const summary = getListSummary()

  return (
    <div className="flex flex-1 min-h-0 min-w-0 flex-col">
      <div className="flex h-[64px] shrink-0 items-center justify-between gap-sm bg-surface px-2xl py-sm">
        <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">Domain health V2</p>
        <div className="flex items-center gap-sm">
          <DateRangeSelector value={month} options={DOMAIN_HEALTH_MONTH_OPTIONS} onChange={setMonth} />
          <MoreMenu />
        </div>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-xl px-2xl py-xl">
          <MetricTiles
            metrics={[
              {
                id: 'urls',
                value: summary.urls,
                label: 'Domains',
                info: true,
                tooltip: 'The domains currently being tracked to measure your overall domain health score',
              },
              {
                id: 'health',
                value: summary.health,
                label: 'Health score',
                info: true,
                tooltip: HEALTH_METRIC_TOOLTIPS.health,
              },
              {
                id: 'ai',
                value: summary.aiReadiness,
                label: 'AI readiness',
                info: true,
                tooltip: HEALTH_METRIC_TOOLTIPS.aiReadiness,
              },
              {
                id: 'disc',
                value: summary.discoverability,
                label: 'Discoverability',
                info: true,
                tooltip: HEALTH_METRIC_TOOLTIPS.discoverability,
              },
              {
                id: 'fresh',
                value: summary.freshness,
                label: 'Freshness',
                info: true,
                tooltip: HEALTH_METRIC_TOOLTIPS.freshness,
              },
              {
                id: 'issues',
                value: summary.issuesFound,
                label: 'Issues found',
                info: true,
                tooltip: HEALTH_METRIC_TOOLTIPS.issues,
              },
            ]}
          />
          <div className="rounded-md border border-border bg-surface">
            <div className="px-2xl pb-lg pt-2xl">
              <CardHeader
                title="What is your domain health score?"
                subtitle="Track how well AI assistants can find, understand, and cite your website. Your domain health score reflects your site's overall readiness for AI search."
              />
            </div>
            <div className="px-2xl">
              <DataTable
                columns={COLUMNS}
                data={DOMAIN_HEALTH_ROWS_V2}
                onRowClick={(row) => setSelectedDomain(row.domain)}
                rowMenuItems={[
                  { label: 'View details', onClick: (row) => setSelectedDomain(row.domain) },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
