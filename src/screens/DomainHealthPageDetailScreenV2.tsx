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
} from '../components'
import {
  METRIC_KEY_LABELS,
  DOMAIN_HEALTH_MONTH_OPTIONS,
  getBreakdownColumns,
  getDrawerHighlights,
  getDrawerSections,
  getPageHealthImprovements,
  getPageScores,
  getPageStatTiles,
} from '../data/domainHealthDataV2'
import {
  HEALTH_TREND_SERIES,
  getDomainHealthTrend,
  type DomainHealthRecommendation,
} from '../data/domainHealthData'
import { healthImprovementColumns } from './domainHealthV2Columns'
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
  const [breakdownMetric, setBreakdownMetric] = useState<BreakdownMetricKey | null>(null)
  const [month, setMonth] = useState(DOMAIN_HEALTH_MONTH_OPTIONS[0])

  const scores = getPageScores(domain, path)
  const healthAvg = Math.round((scores.ai + scores.disc + scores.fresh) / 3)
  const improvements = getPageHealthImprovements(domain, path)
  const breakdownColumns = getBreakdownColumns(domain, path)
  const activeColumn = breakdownColumns.find((c) => c.key === breakdownMetric) ?? null

  if (selectedRec) {
    return <DomainHealthRecommendationScreen recommendation={selectedRec} onBack={() => setSelectedRec(null)} />
  }

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

          <MetricTiles metrics={getPageStatTiles(domain, path)} />

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
                columns={healthImprovementColumns({ showAffected: false })}
                data={improvements}
                autoRowHeight
                rowHeight={62}
                maxVisibleRows={5}
                rowMenuItems={[{ label: 'View recommendation', onClick: (row) => setSelectedRec(row.recommendation) }]}
              />
            </div>
          </div>

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
