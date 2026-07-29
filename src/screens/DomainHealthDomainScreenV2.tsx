import { useState } from 'react'
import {
  CardHeader,
  DataTable,
  DateRangeSelector,
  DomainHealthScoreHeaderV2,
  HealthBreakdownSummaryCard,
  HealthScoreTrendCard,
  Icon,
  MetricTiles,
  MoreMenu,
  ScoreBreakdownDrawer,
  type BreakdownMetricKey,
  type Column,
} from '../components'
import {
  HEALTH_TREND_SERIES,
  getDomainHealthTrend,
  getDomainPagesPadded,
  getDomainScores,
  type DomainHealthRecommendation,
} from '../data/domainHealthData'
import {
  DOMAIN_HEALTH_MONTH_OPTIONS,
  HEALTH_METRIC_TOOLTIPS,
  METRIC_KEY_LABELS,
  getBreakdownColumns,
  getDomainHealthImprovements,
  getDrawerHighlights,
  getDrawerSections,
  getPageIssues,
  getPageScores,
  getStatTiles,
  isPageInSitemap,
} from '../data/domainHealthDataV2'
import { ScoreChip, healthImprovementColumns, headerWithTooltip } from './domainHealthV2Columns'
import { DomainHealthPageDetailScreenV2 } from './DomainHealthPageDetailScreenV2'
import { DomainHealthRecommendationScreen } from './DomainHealthRecommendationScreen'

export function DomainHealthDomainScreenV2({ domain, onBack }: { domain: string; onBack: () => void }) {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [selectedRec, setSelectedRec] = useState<DomainHealthRecommendation | null>(null)
  const [breakdownMetric, setBreakdownMetric] = useState<BreakdownMetricKey | null>(null)
  const [month, setMonth] = useState(DOMAIN_HEALTH_MONTH_OPTIONS[0])

  const pages = getDomainPagesPadded(domain)
  const scores = getDomainScores(domain)
  const healthAvg = scores ? Math.round((scores.ai + scores.disc + scores.fresh) / 3) : null
  const improvements = getDomainHealthImprovements(domain)
  const breakdownColumns = getBreakdownColumns(domain)
  const activeColumn = breakdownColumns.find((c) => c.key === breakdownMetric) ?? null

  if (selectedRec) {
    return <DomainHealthRecommendationScreen recommendation={selectedRec} onBack={() => setSelectedRec(null)} />
  }

  if (selectedPage) {
    return (
      <DomainHealthPageDetailScreenV2
        domain={domain}
        path={selectedPage}
        onBack={() => setSelectedPage(null)}
      />
    )
  }

  interface PageRow extends Record<string, unknown> {
    path: string
    health: number
    ai: number
    disc: number
    fresh: number
    inSitemap: boolean
    issues: number
  }

  const pageRows: PageRow[] = pages.map((path) => {
    const s = getPageScores(domain, path)
    return {
      path,
      health: s.health,
      ai: s.ai,
      disc: s.disc,
      fresh: s.fresh,
      inSitemap: isPageInSitemap(domain, path),
      issues: getPageIssues(domain, path).length,
    }
  })

  const pageColumns: Column<PageRow>[] = [
    { key: 'path', label: 'Page' },
    { key: 'health', label: headerWithTooltip('Health score', HEALTH_METRIC_TOOLTIPS.health), render: (v) => <ScoreChip value={v as number} /> },
    { key: 'ai', label: headerWithTooltip('AI readiness', HEALTH_METRIC_TOOLTIPS.aiReadiness), render: (v) => <ScoreChip value={v as number} /> },
    { key: 'disc', label: headerWithTooltip('Discoverability', HEALTH_METRIC_TOOLTIPS.discoverability), render: (v) => <ScoreChip value={v as number} /> },
    { key: 'fresh', label: headerWithTooltip('Freshness', HEALTH_METRIC_TOOLTIPS.freshness), render: (v) => <ScoreChip value={v as number} /> },
    {
      key: 'inSitemap',
      label: headerWithTooltip('Site map', "Whether this page is listed in the domain's sitemap."),
      render: (v) => (
        <Icon
          name={v ? 'check_circle' : 'cancel'}
          size={16}
          fill
          className={v ? 'text-chip-success-text' : 'text-chip-danger-text'}
        />
      ),
    },
    { key: 'issues', label: headerWithTooltip('Issues', HEALTH_METRIC_TOOLTIPS.issues) },
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
        <div className="flex flex-1 min-w-0 items-center gap-sm">
          <p className="truncate text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">{domain}</p>
          <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center text-text-action">
            <Icon name="open_in_new" size={18} />
          </a>
        </div>
        <div className="flex shrink-0 items-center gap-sm">
          <DateRangeSelector value={month} options={DOMAIN_HEALTH_MONTH_OPTIONS} onChange={setMonth} />
          <MoreMenu />
        </div>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-lg px-2xl py-xl">
          <DomainHealthScoreHeaderV2
            healthAvg={healthAvg}
            breakdown={scores ? { ai: scores.ai, disc: scores.disc, fresh: scores.fresh } : { ai: null, disc: null, fresh: null }}
          />

          <MetricTiles metrics={getStatTiles(domain)} />

          <HealthBreakdownSummaryCard columns={breakdownColumns} onSeeBreakdown={setBreakdownMetric} />

          <div className="rounded-md border border-border bg-surface">
            <div className="px-2xl pb-lg pt-2xl">
              <CardHeader
                title="How to improve your health score"
                subtitle="Improve your domain health with AI-powered recommendations"
                toolbar={<MoreMenu />}
              />
            </div>
            <div className="px-2xl pb-xl">
              <DataTable
                columns={healthImprovementColumns()}
                data={improvements}
                autoRowHeight
                rowHeight={62}
                maxVisibleRows={5}
                rowMenuItems={[{ label: 'View recommendation', onClick: (row) => setSelectedRec(row.recommendation) }]}
              />
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface">
            <div className="px-2xl pb-lg pt-2xl">
              <CardHeader
                title="What is the health score of your pages?"
                subtitle="Track the health score of every page in your domain and find opportunities to improve."
                toolbar={<MoreMenu />}
              />
            </div>
            <div className="px-2xl pb-xl">
              <DataTable
                columns={pageColumns}
                data={pageRows}
                onRowClick={(row) => setSelectedPage(row.path)}
                rowHeight={44}
                maxVisibleRows={8}
                rowMenuItems={[
                  { label: 'View details', onClick: (row) => setSelectedPage(row.path) },
                  { label: 'View page', onClick: (row) => window.open(`https://${domain}${row.path}`, '_blank') },
                ]}
              />
            </div>
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
