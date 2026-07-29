import { useState } from 'react'
import {
  Chip,
  DataTable,
  DetailCard,
  DomainHealthScoreHeader,
  HealthBreakdownCard,
  HealthBreakdownTableCard,
  HealthScoreTrendCard,
  Icon,
  MetricTiles,
  ScoreBreakdownDrawer,
  type BreakdownMetricKey,
  type Column,
  type ChipVariant,
} from '../components'
import {
  DOMAIN_ISSUES_WARNINGS,
  DOMAIN_TECH_DETAILS,
  HEALTH_TREND_SERIES,
  getDomainHealthTrend,
  getDomainPagesPadded,
  getDomainScores,
  getRecommendationsForDomain,
  impactTier,
  seededScore,
  type DomainHealthRecommendation,
} from '../data/domainHealthData'
import {
  METRIC_KEY_LABELS,
  getBreakdownColumns,
  getDomainHealthImprovements,
  getDrawerHighlights,
  getDrawerSections,
} from '../data/domainHealthDataV2'
import { DomainHealthPageDetailScreen } from './DomainHealthPageDetailScreen'
import { DomainHealthRecommendationScreen } from './DomainHealthRecommendationScreen'

function scoreVariant(value: number): ChipVariant {
  if (value >= 80) return 'success'
  if (value >= 50) return 'warning'
  return 'danger'
}

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

export function DomainHealthDomainScreen({ domain, onBack }: { domain: string; onBack: () => void }) {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [selectedRec, setSelectedRec] = useState<DomainHealthRecommendation | null>(null)
  const [breakdownMetric, setBreakdownMetric] = useState<BreakdownMetricKey | null>(null)

  const pages = getDomainPagesPadded(domain)
  const scores = getDomainScores(domain)
  const healthAvg = scores ? Math.round((scores.ai + scores.disc + scores.fresh) / 3) : null
  const tech = DOMAIN_TECH_DETAILS[domain]
  const recommendations = getRecommendationsForDomain(domain, pages.length)
  const improvements = getDomainHealthImprovements(domain)
  const breakdownColumns = getBreakdownColumns(domain)
  const activeColumn = breakdownColumns.find((c) => c.key === breakdownMetric) ?? null

  if (selectedPage) {
    return (
      <DomainHealthPageDetailScreen
        domain={domain}
        path={selectedPage}
        onBack={() => setSelectedPage(null)}
      />
    )
  }

  if (selectedRec) {
    return <DomainHealthRecommendationScreen recommendation={selectedRec} onBack={() => setSelectedRec(null)} />
  }

  interface PageRow extends Record<string, unknown> {
    path: string
    health: number
    ai: number
    disc: number
    fresh: number
  }

  const pageRows: PageRow[] = pages.map((path) => ({
    path,
    health: seededScore(domain + path + 'h'),
    ai: seededScore(domain + path + 'a'),
    disc: seededScore(domain + path + 'd'),
    fresh: seededScore(domain + path + 'f'),
  }))

  const pageColumns: Column<PageRow>[] = [
    { key: 'path', label: 'Page' },
    { key: 'health', label: 'Health', render: (v) => <Chip label={String(v)} variant={scoreVariant(v as number)} /> },
    { key: 'ai', label: 'AI readiness', render: (v) => <Chip label={String(v)} variant={scoreVariant(v as number)} /> },
    { key: 'disc', label: 'Discoverability', render: (v) => <Chip label={String(v)} variant={scoreVariant(v as number)} /> },
    { key: 'fresh', label: 'Freshness', render: (v) => <Chip label={String(v)} variant={scoreVariant(v as number)} /> },
  ]

  const recColumns: Column<DomainHealthRecommendation>[] = [
    { key: 'title', label: 'Recommendations' },
    { key: 'affected', label: 'Affected pages' },
    {
      key: 'impact',
      label: 'Impact',
      render: (_v, row) => <Chip label={`+${row.impact} ${row.metric}`} variant={impactTier(row.impact)} />,
    },
  ]

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
        <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">{domain}</p>
        <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-text-action">
          <Icon name="open_in_new" size={18} />
        </a>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-lg px-2xl py-xl">
          <DomainHealthScoreHeader healthAvg={healthAvg} breakdown={scores ? { ai: scores.ai, disc: scores.disc, fresh: scores.fresh } : { ai: null, disc: null, fresh: null }} />

          <MetricTiles
            metrics={[
              { id: 'pages', value: pages.length, label: 'Pages crawled' },
              { id: 'indexable', value: Math.max(0, pages.length - 1), label: 'Indexable' },
              { id: 'issues', value: 3, label: 'Issues found' },
              { id: 'warnings', value: 2, label: 'Warnings' },
            ]}
          />

          <HealthBreakdownCard columns={breakdownColumns} onSeeBreakdown={setBreakdownMetric} />

          <HealthBreakdownTableCard columns={breakdownColumns} onSeeBreakdown={setBreakdownMetric} />

          <div className="flex items-center justify-between gap-lg rounded-md border border-[#e6e3f7] bg-[#f5f4fc] px-xl py-lg">
            <div className="flex min-w-0 flex-1 flex-col gap-xs">
              <div className="flex items-center gap-xs text-small text-ai-brand">
                <Icon name="auto_awesome" size={16} />
                AI recommendations
              </div>
              <div className="text-body text-text-primary">AI tools may not be finding your business accurately</div>
              <div className="text-small text-text-secondary">
                {Math.max(1, Math.round(recommendations.length * 0.35))} high-impact fixes can change that. {recommendations.length} fixes in total.
              </div>
            </div>
            <button
              type="button"
              className="h-9 shrink-0 whitespace-nowrap rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
            >
              View recommendations
            </button>
          </div>

          <HealthScoreTrendCard
            data={getDomainHealthTrend(domain, {
              health: healthAvg ?? 70,
              ai: scores?.ai ?? 70,
              disc: scores?.disc ?? 70,
              fresh: scores?.fresh ?? 70,
            })}
            series={HEALTH_TREND_SERIES}
          />

          <DetailCard title="Pages">
            <DataTable
              columns={pageColumns}
              data={pageRows}
              onRowClick={(row) => setSelectedPage(row.path)}
              rowHeight={44}
            />
          </DetailCard>

          <DetailCard title="Recommendations">
            <DataTable
              columns={recColumns}
              data={recommendations}
              onRowClick={(row) => setSelectedRec(row)}
              rowHeight={44}
            />
          </DetailCard>

          <div className="grid grid-cols-2 gap-lg">
            <DetailCard title="Crawlability">
              <DataTable
                columns={kvColumns()}
                data={[
                  { label: 'Pages in sitemap', value: tech.sitemap },
                  { label: 'Sitemap coverage', value: tech.coverage },
                  { label: 'Robots.txt health score', value: tech.robots },
                  { label: 'Crawler-friendly score', value: tech.crawler },
                  { label: 'Conflicting directives', value: tech.conflicts },
                ]}
                showHeader={false}
                rowHeight={44}
              />
            </DetailCard>
            <DetailCard title="Blocked folders">
              <DataTable
                columns={kvColumns()}
                data={
                  tech.blocked.length
                    ? tech.blocked.map((folder) => ({ label: folder, value: 'Disallowed' }))
                    : [{ label: 'No blocked folders found', value: '' }]
                }
                showHeader={false}
                rowHeight={44}
              />
            </DetailCard>
            <DetailCard title="Site-wide technical health">
              <DataTable
                columns={kvColumns()}
                data={[
                  { label: 'Canonical tags', value: tech.canon },
                  { label: 'Redirects', value: tech.redir },
                  { label: 'Duplicate content', value: tech.dup },
                ]}
                showHeader={false}
                rowHeight={44}
              />
            </DetailCard>
            <DetailCard title="Issues & warnings">
              <DataTable
                columns={kvColumns((row) => (row.value === 'Issue' ? 'text-chip-danger-text' : 'text-chip-warning-text'))}
                data={DOMAIN_ISSUES_WARNINGS.map((row) => ({ label: row.label, value: row.type }))}
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
        sections={getDrawerSections(breakdownMetric, domain, undefined, improvements)}
        scope="domain"
      />
    </div>
  )
}
