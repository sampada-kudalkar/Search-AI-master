import { useState, useRef, useEffect, type ReactNode } from 'react'

type ChartMetric = 'Visibility score' | 'Citation share' | 'Rank'
const CHART_METRICS: ChartMetric[] = ['Visibility score', 'Citation share', 'Rank']
import { Icon, CompetitorRankingCard } from '../components'
import { CardTabs } from '../components/CardTabs/CardTabs'
import { CompetitorMetricsCard } from '../components/CompetitorMetricsCard'
import { ChartCard } from '../components/charts/ChartCard'
import { ChartCardButton } from '../components/charts/ChartCardButton'
import { TrendLineChart, type SeriesConfig } from '../components/charts/TrendLineChart'
import { CompetitorDetailScreen } from './CompetitorDetailScreen'
import {
  COMPETITOR_BRAND_DATA,
  DEFAULT_SELECTED,
  REPORT_DATE,
  PLATFORMS,
  TREND_DATA,
  TREND_SERIES_COLORS,
  PROMPT_RANKING_DATA,
  type ByLocationTableRow,
  type CompetitorRowData,
  type Platform,
} from '../data/competitorData'

const SERIES_KEYS = ['comp1', 'comp2', 'comp3', 'comp4', 'comp5'] as const

export function CompetitorByLocationDetailScreen({
  location,
  onBack,
}: {
  location: ByLocationTableRow
  onBack: () => void
}) {
  const [trendPlatform, setTrendPlatform] = useState<Platform>('ChatGPT')
  const [competitorDetail, setCompetitorDetail] = useState<CompetitorRowData | null>(null)
  const [chartMetric, setChartMetric] = useState<ChartMetric>('Visibility score')
  const [chartMetricOpen, setChartMetricOpen] = useState(false)
  const chartMetricRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!chartMetricOpen) return
    function handleOutside(e: MouseEvent) {
      if (chartMetricRef.current && !chartMetricRef.current.contains(e.target as Node)) {
        setChartMetricOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [chartMetricOpen])

  const chartTitle: ReactNode = (
    <span className="flex flex-wrap items-center gap-xs leading-[24px]">
      How are you performing against competitors overtime for{' '}
      <span ref={chartMetricRef} className="relative">
        <button
          type="button"
          onClick={() => setChartMetricOpen((v) => !v)}
          className="flex items-center gap-[2px] text-[#2563eb] hover:underline"
        >
          {chartMetric}
          <Icon name="expand_more" size={16} />
        </button>
        {chartMetricOpen && (
          <div className="absolute left-0 top-full z-50 mt-xs min-w-[160px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
            {CHART_METRICS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setChartMetric(m); setChartMetricOpen(false) }}
                className={`block w-full px-md py-sm text-left text-body hover:bg-surface-hover ${m === chartMetric ? 'text-primary' : 'text-text-primary'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </span>
    </span>
  )

  if (competitorDetail) {
    return (
      <CompetitorDetailScreen
        initialCompetitor={competitorDetail}
        onBack={() => setCompetitorDetail(null)}
      />
    )
  }

  const trendSeries: SeriesConfig[] = [
    { key: 'you', label: 'You', color: TREND_SERIES_COLORS['you'] },
    ...SERIES_KEYS.slice(0, DEFAULT_SELECTED.length).map((key, i) => ({
      key,
      label: DEFAULT_SELECTED[i],
      color: TREND_SERIES_COLORS[key],
    })),
  ]

  return (
    <div className="flex flex-col bg-white h-full w-full overflow-y-auto">
      {/* Page header */}
      <div className="flex h-16 shrink-0 items-center gap-sm px-2xl">
        {/* Back button + title */}
        <div className="flex flex-1 items-center gap-sm">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex size-9 items-center justify-center rounded-sm hover:bg-surface-hover"
          >
            <Icon name="arrow_back" size={20} className="text-text-icon" />
          </button>
          <span className="text-h3 text-text-primary">
            Benchmarking for {location.location}
          </span>
          <Icon name="info" size={20} className="text-text-icon" />
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-sm">
          <button
            type="button"
            aria-label="Select report month"
            className="flex items-center gap-sm rounded-sm border border-border bg-surface px-md py-sm text-body text-text-primary hover:bg-surface-hover"
          >
            {REPORT_DATE}
            <Icon name="expand_more" size={20} className="text-text-icon" />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="more_vert" size={20} className="text-text-icon" />
          </button>
          <button
            type="button"
            aria-label="Filter"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="tune" size={20} className="text-text-icon" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-xl px-2xl pb-2xl">
        <CompetitorMetricsCard
          rows={COMPETITOR_BRAND_DATA.filter(
            (r) => r.isYou || DEFAULT_SELECTED.includes(r.name)
          )}
          onRowClick={setCompetitorDetail}
        />

        <CompetitorRankingCard rows={PROMPT_RANKING_DATA} />

        {/* Trend chart card */}
        <ChartCard
          title={chartTitle}
          subtitle="Shows how often your location appears in AI-generated answers across AI sites"
          toolbar={<ChartCardButton icon="auto_awesome" label="AI insights" iconClassName="text-[#6834b7]" />}
          showActions
        >
          <CardTabs
            tabs={PLATFORMS.map((p) => ({ id: p, label: p }))}
            activeTab={trendPlatform}
            onChange={(id) => setTrendPlatform(id as Platform)}
          />
          <div className="mt-xl">
            <TrendLineChart
              data={TREND_DATA[trendPlatform as keyof typeof TREND_DATA]}
              series={trendSeries}
              height={300}
              yDomain={[0, 100]}
              yTickFormatter={(v) => `${v}%`}
            />
          </div>
          <div className="mt-xl flex flex-wrap items-center gap-xl">
            {trendSeries.map((s) => (
              <div key={s.key} className="flex items-center gap-xs">
                <span
                  className="inline-block size-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[12px] text-text-secondary">{s.label}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
