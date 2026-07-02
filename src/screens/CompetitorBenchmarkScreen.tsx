import { useState, useRef, useEffect, type ReactNode } from 'react'

type ChartMetric = 'Visibility score' | 'Citation share' | 'Rank'
const CHART_METRICS: ChartMetric[] = ['Visibility score', 'Citation share', 'Rank']
import { Icon, CompetitorRankingCard, CompetitorSelector, InfoTooltip } from '../components'
import { CardTabs } from '../components/CardTabs/CardTabs'
import { CompetitorMetricsCard } from '../components/CompetitorMetricsCard'
import { ChartCard } from '../components/charts/ChartCard'
import { ChartCardButton } from '../components/charts/ChartCardButton'
import { TrendLineChart, type SeriesConfig } from '../components/charts/TrendLineChart'
import {
  COMPETITORS,
  COMPETITOR_BRAND_DATA,
  DEFAULT_SELECTED,
  REPORT_DATE,
  PLATFORMS,
  TREND_DATA,
  TREND_SERIES_COLORS,
  PROMPT_RANKING_DATA,
  getBrandDots,
  type CompetitorRowData,
  type Platform,
  type RankingPlatform,
} from '../data/competitorData'
import { BrandScatterplotCard } from '../components/BrandScatterplotCard/BrandScatterplotCard'

const SERIES_KEYS = ['comp1', 'comp2', 'comp3', 'comp4', 'comp5'] as const

const MORE_MENU_ITEMS = [
  'Manage competitors',
  'Download',
  'Email',
  'Schedule',
] as const

export function CompetitorBenchmarkScreen({
  onCompetitorClick,
  onManageCompetitors,
}: {
  onCompetitorClick?: (row: CompetitorRowData) => void
  onManageCompetitors?: () => void
}): JSX.Element {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)
  const [trendPlatform, setTrendPlatform] = useState<Platform>('ChatGPT')
  const [scatterPlatform, setScatterPlatform] = useState<RankingPlatform>('ChatGPT')
  const [moreMenu, setMoreMenu] = useState<{ top: number; left: number } | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
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
          className="flex items-center gap-[2px] text-[#1976D2]"
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

  const trendSeries: SeriesConfig[] = [
    { key: 'you', label: 'You', color: TREND_SERIES_COLORS['you'] },
    ...SERIES_KEYS.slice(0, selected.length).map((key, i) => ({
      key,
      label: selected[i],
      color: TREND_SERIES_COLORS[key],
    })),
  ]

  return (
    <div className="flex flex-col bg-white h-full w-full overflow-y-auto">
      {/* Page header */}
      <div className="flex h-16 shrink-0 items-center gap-sm px-2xl">
        {/* Title */}
        <div className="flex flex-1 items-center gap-sm">
          <span className="text-h3 text-text-primary">Brand</span>
          <InfoTooltip text="See how you are performing against your competitors in AI-generated answers" />
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-sm">
          {/* Month selector — static display */}
          <button
            type="button"
            aria-label="Select report month"
            className="flex items-center gap-sm rounded-sm border border-border bg-surface px-md py-sm text-body text-text-primary hover:bg-surface-hover"
          >
            {REPORT_DATE}
            <Icon name="expand_more" size={20} className="text-text-icon" />
          </button>

          {/* More options */}
          <button
            ref={moreButtonRef}
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setMoreMenu(moreMenu ? null : { top: r.bottom + 4, left: r.right - 216 })
            }}
          >
            <Icon name="more_vert" size={20} className="text-text-icon" />
          </button>
          {moreMenu && (
            <>
              <div className="fixed inset-0 z-[105]" onClick={() => setMoreMenu(null)} />
              <div
                className="fixed z-[110] min-w-[216px] rounded-sm border border-border bg-surface py-xs shadow-dropdown"
                style={{ top: moreMenu.top, left: moreMenu.left }}
              >
                {MORE_MENU_ITEMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="block w-full px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover"
                    onClick={() => {
                      setMoreMenu(null)
                      if (item === 'Manage competitors') onManageCompetitors?.()
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Filter */}
          <button
            type="button"
            aria-label="Filter"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="filter_list" size={20} className="text-text-icon" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-xl px-2xl pb-2xl">
        <CompetitorSelector
          competitors={COMPETITORS}
          selected={selected}
          onChange={setSelected}
        />

        <BrandScatterplotCard
          dots={getBrandDots(scatterPlatform, selected)}
          activePlatform={scatterPlatform}
          onPlatformChange={setScatterPlatform}
        />

        <CompetitorMetricsCard
          rows={COMPETITOR_BRAND_DATA.filter(
            (r) => r.isYou || selected.includes(r.name)
          )}
          onRowClick={onCompetitorClick}
          pageContext="brand"
        />

        <CompetitorRankingCard rows={PROMPT_RANKING_DATA} />

        {/* Trend chart card */}
        <ChartCard
          title={chartTitle}
          subtitle="Shows how often your brand appears in AI-generated answers across AI sites"
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
          {/* Legend */}
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
