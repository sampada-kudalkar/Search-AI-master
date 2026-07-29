import { useState } from 'react'
import {
  CardHeader,
  Chip,
  DataTable,
  DateRangeSelector,
  DomainHealthScoreHeaderV2,
  HealthScoreTrendCard,
  Icon,
  MetricTiles,
  MoreMenu,
  type Column,
} from '../components'
import {
  DOMAIN_HEALTH_MONTH_OPTIONS,
  HEALTH_METRIC_TOOLTIPS,
  getPageHealthImprovements,
  getPageIssues,
  getPageScores,
  type PageIssue,
} from '../data/domainHealthDataV2'
import {
  DOMAIN_TECH_DETAILS,
  HEALTH_TREND_SERIES,
  PAGE_AI_BOT_ROWS,
  getDomainHealthTrend,
  type DomainHealthRecommendation,
} from '../data/domainHealthData'
import { healthImprovementColumns, kvColumns } from './domainHealthV2Columns'
import { DomainHealthRecommendationScreen } from './DomainHealthRecommendationScreen'

export function DomainHealthPageDetailScreenV2({
  domain,
  path,
  onBack,
}: {
  domain: string
  path: string
  onBack: () => void
}) {
  const [selectedRec, setSelectedRec] = useState<DomainHealthRecommendation | null>(null)
  const [month, setMonth] = useState(DOMAIN_HEALTH_MONTH_OPTIONS[0])

  const scores = getPageScores(domain, path)
  const healthAvg = Math.round((scores.ai + scores.disc + scores.fresh) / 3)
  const issues = getPageIssues(domain, path)
  const tech = DOMAIN_TECH_DETAILS[domain]

  if (selectedRec) {
    return <DomainHealthRecommendationScreen recommendation={selectedRec} onBack={() => setSelectedRec(null)} />
  }

  const issueColumns: Column<PageIssue>[] = [
    { key: 'label', label: 'Issue' },
    {
      key: 'type',
      label: 'Type',
      render: (v) => <Chip label={v as string} variant={v === 'Issue' ? 'danger' : 'warning'} />,
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
        <div className="flex flex-1 min-w-0 items-center gap-sm">
          <p className="truncate text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">{path}</p>
          <a href={`https://${domain}${path}`} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center text-text-action">
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
            breakdown={{ ai: scores.ai, disc: scores.disc, fresh: scores.fresh }}
          />

          <MetricTiles
            metrics={[
              { id: 'issues', value: issues.length, label: 'Issues found', info: true, tooltip: HEALTH_METRIC_TOOLTIPS.issues },
              { id: 'http', value: 200, label: 'HTTP status' },
              { id: 'load', value: '1.2s', label: 'Load time' },
              { id: 'crawled', value: '42 days ago', label: 'Last crawled' },
            ]}
          />

          <HealthScoreTrendCard
            title="What is your health score over time?"
            subtitle="Track how your page's health score has changed over time"
            data={getDomainHealthTrend(domain + path, {
              health: healthAvg,
              ai: scores.ai,
              disc: scores.disc,
              fresh: scores.fresh,
            })}
            series={HEALTH_TREND_SERIES}
          />

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
                columns={healthImprovementColumns({ showAffected: false })}
                data={getPageHealthImprovements(domain, path)}
                autoRowHeight
                rowHeight={62}
                maxVisibleRows={5}
                rowMenuItems={[{ label: 'View recommendation', onClick: (row) => setSelectedRec(row.recommendation) }]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            <div className="rounded-md border border-border bg-surface">
              <div className="px-2xl pb-lg pt-2xl">
                <CardHeader title="Crawlability" />
              </div>
              <div className="px-2xl pb-xl">
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
              </div>
            </div>
            <div className="rounded-md border border-border bg-surface">
              <div className="px-2xl pb-lg pt-2xl">
                <CardHeader title="Blocked folders" />
              </div>
              <div className="px-2xl pb-xl">
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            <div className="rounded-md border border-border bg-surface">
              <div className="px-2xl pb-lg pt-2xl">
                <CardHeader title="Site-wide technical health" />
              </div>
              <div className="px-2xl pb-xl">
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
              </div>
            </div>
            <div className="rounded-md border border-border bg-surface">
              <div className="px-2xl pb-lg pt-2xl">
                <CardHeader title="AI bot access" />
              </div>
              <div className="px-2xl pb-xl">
                <DataTable
                  columns={kvColumns(() => 'text-chip-warning-text')}
                  data={PAGE_AI_BOT_ROWS.map((row) => ({ label: row.name, value: row.status }))}
                  showHeader={false}
                  rowHeight={44}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface">
            <div className="px-2xl pb-lg pt-2xl">
              <CardHeader title="Issues & warnings" />
            </div>
            <div className="px-2xl pb-xl">
              <DataTable
                columns={issueColumns}
                data={issues}
                rowHeight={44}
                rowAction={{
                  icon: 'lightbulb',
                  label: 'View recommendation',
                  onClick: (row) => setSelectedRec(row.recommendation),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
