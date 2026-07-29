import { useState } from 'react'
import {
  DataTable,
  DetailCard,
  DomainHealthScoreHeader,
  HealthBreakdownCard,
  HealthBreakdownTableCard,
  Icon,
  MetricTiles,
  ScoreBreakdownDrawer,
  type BreakdownMetricKey,
  type Column,
} from '../components'
import {
  PAGE_AI_BOT_ROWS,
  PAGE_CONTENT_ROWS,
  PAGE_SCORE_BREAKDOWN,
  PAGE_TECH_CHECKLIST,
  getDomainScores,
} from '../data/domainHealthData'
import {
  METRIC_KEY_LABELS,
  getBreakdownColumns,
  getDrawerHighlights,
  getDrawerSections,
  getPageHealthImprovements,
} from '../data/domainHealthDataV2'

interface KVRow extends Record<string, unknown> {
  label: string
  value: string | number
}

function kvColumns(valueClassName: (row: KVRow) => string = () => 'text-text-primary'): Column<KVRow>[] {
  return [
    { key: 'label', label: '', resizable: false, render: (v) => <span className="text-body text-[#444]">{v as string}</span> },
    { key: 'value', label: '', resizable: false, render: (v, row) => <span className={`text-body ${valueClassName(row)}`}>{v as string | number}</span> },
  ]
}

const scoreColumns: Column<KVRow>[] = [
  { key: 'label', label: '', resizable: false, render: (v) => <span className="text-body text-[#444]">{v as string}</span> },
  {
    key: 'value',
    label: '',
    resizable: false,
    render: (v) => (
      <div className="flex items-center gap-sm">
        <div className="h-[6px] w-[140px] overflow-hidden rounded-full bg-surface-l2">
          <div className="h-full bg-primary" style={{ width: `${v}%` }} />
        </div>
        <span className="w-10 text-right text-body text-text-primary">{v as number}%</span>
      </div>
    ),
  },
]

interface CheckRow extends Record<string, unknown> {
  label: string
  checked: true
}

const checkColumns: Column<CheckRow>[] = [
  { key: 'label', label: '', resizable: false, render: (v) => <span className="text-body text-[#444]">{v as string}</span> },
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

export function DomainHealthPageDetailScreen({
  domain,
  path,
  onBack,
}: {
  domain: string
  path: string
  onBack: () => void
}) {
  const [breakdownMetric, setBreakdownMetric] = useState<BreakdownMetricKey | null>(null)

  const scores = getDomainScores(domain)
  const healthAvg = scores ? Math.round((scores.ai + scores.disc + scores.fresh) / 3) : null
  const improvements = getPageHealthImprovements(domain, path)
  const breakdownColumns = getBreakdownColumns(domain, path)
  const activeColumn = breakdownColumns.find((c) => c.key === breakdownMetric) ?? null

  return (
    <div className="flex flex-1 min-h-0 min-w-0 flex-col">
      <div className="flex h-[64px] shrink-0 items-center gap-sm bg-surface px-2xl py-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">{path}</p>
        <a href={`https://${domain}${path}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-text-action">
          <Icon name="open_in_new" size={18} />
        </a>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-lg px-2xl py-xl">
          <DomainHealthScoreHeader healthAvg={healthAvg} breakdown={scores ? { ai: scores.ai, disc: scores.disc, fresh: scores.fresh } : { ai: null, disc: null, fresh: null }} />

          <MetricTiles
            metrics={[
              { id: 'issues', value: 3, label: 'Issues found' },
              { id: 'http', value: 200, label: 'HTTP status' },
              { id: 'load', value: '1.2s', label: 'Load time' },
              { id: 'crawled', value: '42 days ago', label: 'Last crawled' },
            ]}
          />

          <HealthBreakdownCard columns={breakdownColumns} onSeeBreakdown={setBreakdownMetric} />

          <HealthBreakdownTableCard columns={breakdownColumns} onSeeBreakdown={setBreakdownMetric} />

          <div className="grid grid-cols-2 gap-lg">
            <DetailCard title="AI bot access">
              <DataTable
                columns={kvColumns(() => 'text-chip-warning-text')}
                data={PAGE_AI_BOT_ROWS.map((row) => ({ label: row.name, value: row.status }))}
                showHeader={false}
                rowHeight={44}
              />
            </DetailCard>
            <DetailCard title="Score breakdown">
              <DataTable columns={scoreColumns} data={PAGE_SCORE_BREAKDOWN} showHeader={false} rowHeight={44} />
            </DetailCard>
            <DetailCard title="Content">
              <DataTable columns={kvColumns()} data={PAGE_CONTENT_ROWS} showHeader={false} rowHeight={44} />
            </DetailCard>
            <DetailCard title="Technical">
              <DataTable
                columns={checkColumns}
                data={PAGE_TECH_CHECKLIST.map((label) => ({ label, checked: true as const }))}
                showHeader={false}
                rowHeight={44}
              />
            </DetailCard>
          </div>
        </div>
      </div>

      <ScoreBreakdownDrawer
        open={breakdownMetric !== null}
        onClose={() => setBreakdownMetric(null)}
        metricName={breakdownMetric ? METRIC_KEY_LABELS[breakdownMetric] : ''}
        score={activeColumn?.score ?? null}
        highlights={getDrawerHighlights(breakdownMetric, activeColumn?.score ?? null)}
        sections={getDrawerSections(breakdownMetric, domain, path, improvements)}
        scope="page"
      />
    </div>
  )
}
