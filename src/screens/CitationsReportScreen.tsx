import { useRef, useState } from 'react'
import {
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SummaryCard,
  ChartCard,
  CardTabs,
  SegmentedControl,
  AiIcon,
  TrendLineChart,
  DataTable,
  chartColors,
  CompetitorRankingCard,
  FilterPanel,
  type Column,
  type TrendPoint,
  type FilterField,
} from '../components'
import {
  CITATION_SUMMARY,
  CITATION_TREND,
  BRAND_CITATION_TREND,
  CITATION_COMPARISON,
  CITATION_RANKING,
  SOURCE_TYPES,
  TOP_CITATION_SOURCES,
  CITED_PAGES,
  WATCHED_PAGES,
  buildCitationTrend,
  type CitationComparisonRow,
  type CitationPlatform,
} from '../data/citationReportData'
import { THEME_NAMES } from '../data/themesData'
import { BY_LOCATION_DATA, RANKING_PLATFORMS, type PromptRankingRow } from '../data/competitorData'

const ALL_LOCATIONS = Array.from(
  new Set(
    RANKING_PLATFORMS.flatMap((p) =>
      BY_LOCATION_DATA[p].tableRows.map((r) => r.location)
    )
  )
).sort()

const RANKING_LOCATIONS = ['All locations', ...ALL_LOCATIONS]
const RANKING_BRANDS = ['All brands', 'Aspendental', 'Clear choice', 'Wellness now']

const LOCATION_FILTER_FIELDS: FilterField[] = [
  { id: 'location', label: 'Location', multi: true, options: ALL_LOCATIONS.map((l) => ({ value: l, label: l })) },
]

const BRAND_FILTER_FIELDS: FilterField[] = [
  {
    id: 'brand',
    label: 'Brand',
    multi: false,
    options: RANKING_BRANDS.map((b) => ({ value: b, label: b })),
  },
]

const PLATFORM_TABS: { id: CitationPlatform; label: string }[] = [
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
]

const PLATFORM_TABS_WITH_ALL: { id: CitationPlatform; label: string }[] = [
  ...PLATFORM_TABS,
  { id: 'All', label: 'All sites' },
]

const CITED_THEMES = THEME_NAMES

const DATE_RANGE_MONTHS: Record<string, number> = {
  'Last 3 months': 3,
  'Last 6 months': 6,
  'Last 12 months': 12,
  'Last 24 months': 24,
}

interface ThemeDropdownProps {
  themes: string[]
  selected: string
  onChange: (t: string) => void
}

function ThemeDropdown({ themes, selected, onChange }: ThemeDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[4px] text-[#1976D2] text-[16px] leading-[24px]"
      >
        {selected}
        <Icon name="expand_more" size={16} className="text-[#1976D2]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-[4px] z-20 min-w-[180px] bg-surface rounded-sm border border-border shadow-dropdown py-xs">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => { onChange(t); setOpen(false) }}
                className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                  t === selected ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {t === selected && <Icon name="check" size={16} className="text-primary shrink-0" />}
                {t !== selected && <span className="w-[16px] shrink-0" />}
                {t}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function CitationsReportScreen() {
  const [dateRange, setDateRange] = useState('Last 3 months')
  const [citedTheme, setCitedTheme] = useState(CITED_THEMES[0])
  const [citedMetric, setCitedMetric] = useState<'share' | 'count'>('share')
  const [citedDateRange, setCitedDateRange] = useState('Last 3 months')
  const [brandCitedTheme, setBrandCitedTheme] = useState(CITED_THEMES[0])
  const [brandCitedPlatform, setBrandCitedPlatform] = useState<CitationPlatform>('ChatGPT')
  const [brandCitedMetric, setBrandCitedMetric] = useState<'share' | 'count'>('share')
  const [brandCitedDateRange, setBrandCitedDateRange] = useState('Last 3 months')
  const [comparisonPlatform, setComparisonPlatform] = useState<CitationPlatform>('ChatGPT')
  const [comparisonMetric, setComparisonMetric] = useState<'share' | 'count'>('share')
  const [comparisonDateRange, setComparisonDateRange] = useState('Last 3 months')
  const [rankingPlatform, setRankingPlatform] = useState<CitationPlatform>('ChatGPT')
  const [sourceTypeMetric, setSourceTypeMetric] = useState<'share' | 'count'>('share')
  const [sourceTypeDateRange, setSourceTypeDateRange] = useState('Last 3 months')
  const [sourcesPlatform, setSourcesPlatform] = useState<CitationPlatform>('ChatGPT')
  const [pagesPlatform, setPagesPlatform] = useState<CitationPlatform>('ChatGPT')
  const [watchedPlatform, setWatchedPlatform] = useState<CitationPlatform>('ChatGPT')
  const [citationView, setCitationView] = useState<'location' | 'brand'>('location')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({ brand: ['All brands'] })
  const [comparisonHeaderTheme, setComparisonHeaderTheme] = useState(CITED_THEMES[0])
  const [rankingScope, setRankingScope] = useState(RANKING_LOCATIONS[0])

  const filterFields = citationView === 'brand' ? BRAND_FILTER_FIELDS : LOCATION_FILTER_FIELDS

  const summaryStats = [
    { id: 'overall', value: `${CITATION_SUMMARY.overall}%`, label: 'Avg Citation share' },
    { id: 'chatgpt', value: `${CITATION_SUMMARY.chatgpt}%`, label: 'ChatGPT' },
    { id: 'gemini', value: `${CITATION_SUMMARY.gemini}%`, label: 'Gemini' },
    { id: 'perplexity', value: `${CITATION_SUMMARY.perplexity}%`, label: 'Perplexity' },
  ]

  const trendSeries = [
    { key: `overall${citedMetric === 'share' ? 'Share' : 'Count'}`, label: 'Overall', color: chartColors.categorical[0] },
    { key: `chatgpt${citedMetric === 'share' ? 'Share' : 'Count'}`, label: 'ChatGPT', color: chartColors.categorical[1] },
    { key: `gemini${citedMetric === 'share' ? 'Share' : 'Count'}`, label: 'Gemini', color: chartColors.categorical[2] },
    { key: `perplexity${citedMetric === 'share' ? 'Share' : 'Count'}`, label: 'Perplexity', color: chartColors.categorical[3] },
  ]

  const visibleTrend = CITATION_TREND.slice(-Math.min(DATE_RANGE_MONTHS[citedDateRange], CITATION_TREND.length))

  const brandTrendSeries = [
    { key: `aspendental${brandCitedMetric === 'share' ? 'Share' : 'Count'}`, label: 'Aspendental', color: chartColors.categorical[0] },
    { key: `clearChoice${brandCitedMetric === 'share' ? 'Share' : 'Count'}`, label: 'Clear choice', color: chartColors.categorical[1] },
    { key: `wellnessNow${brandCitedMetric === 'share' ? 'Share' : 'Count'}`, label: 'Wellness now', color: chartColors.categorical[2] },
  ]
  const brandTrendData = BRAND_CITATION_TREND[brandCitedPlatform]
  const visibleBrandTrend = brandTrendData.slice(-Math.min(DATE_RANGE_MONTHS[brandCitedDateRange], brandTrendData.length))

  const allComparisonRows = CITATION_COMPARISON[comparisonPlatform]
  const latestComparisonMonth = allComparisonRows[allComparisonRows.length - 1]?.timeRange
  const comparisonRows = allComparisonRows.filter((row) => row.timeRange === latestComparisonMonth)

  const { points: comparisonTrendData, series: comparisonTrendSeriesMeta } = buildCitationTrend(comparisonPlatform, comparisonMetric)
  const comparisonTrendSeries = comparisonTrendSeriesMeta.map((s, i) => ({
    key: s.key,
    label: s.isYou ? 'You' : s.label,
    color: chartColors.categorical[i] ?? '#888',
  }))

  // Rank rows within each month by the active metric descending (1 = highest).
  const comparisonMetricValue = (row: CitationComparisonRow) =>
    comparisonMetric === 'count' ? row.totalCitations ?? 0 : row.avgCitationShare
  const comparisonRankByRow = new Map<CitationComparisonRow, number>()
  const comparisonRowsByMonth = new Map<string, CitationComparisonRow[]>()
  comparisonRows.forEach((row) => {
    const list = comparisonRowsByMonth.get(row.timeRange) ?? []
    list.push(row)
    comparisonRowsByMonth.set(row.timeRange, list)
  })
  comparisonRowsByMonth.forEach((monthRows) => {
    ;[...monthRows]
      .sort((a, b) => comparisonMetricValue(b) - comparisonMetricValue(a))
      .forEach((row, i) => {
        if (comparisonMetricValue(row) > 0) comparisonRankByRow.set(row, i + 1)
      })
  })

  const comparisonColumns: Column<(typeof comparisonRows)[number]>[] = [
    {
      key: 'sourceName',
      label: 'Domain',
      width: 260,
      render: (_, row) => (
        <div className="flex items-center gap-sm">
          <span className="text-body text-text-primary">{row.sourceName}</span>
          {row.isYou && (
            <span className="shrink-0 px-[8px] py-[2px] rounded-full text-small text-white bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'citationRank',
      label: 'Citation rank',
      width: 140,
      sortable: true,
      render: (_, row) => {
        const rank = comparisonRankByRow.get(row)
        return rank ? `#${rank}` : '—'
      },
    },
    comparisonMetric === 'count'
      ? { key: 'totalCitations', label: 'Total citations', width: 160, sortable: true, render: (v) => (v == null ? '—' : String(v)) }
      : { key: 'avgCitationShare', label: 'Avg citation share', width: 160, sortable: true, render: (v) => `${v}%` },
  ]

  const YOUR_DOMAIN = 'myfamilydentalqld.com.au'
  const citationRankingRows = CITATION_RANKING[rankingPlatform].map((row, i) => ({
    id: `citation-theme-${i}`,
    prompt: row.theme,
    rankings: {
      [rankingPlatform]: row.ranks.map((domain) => ({ name: domain, isYou: domain === YOUR_DOMAIN })),
    },
  })) as unknown as PromptRankingRow[]

  const SOURCE_TYPE_NAMES = ['Your Website', 'Listing Site', 'Social', 'Competitor', 'Other'] as const
  const sourceTypeSeries = SOURCE_TYPE_NAMES.map((name, i) => ({
    key: name,
    label: name,
    color: chartColors.categorical[i] ?? '#888',
  }))
  const sourceTypeTrendData: TrendPoint[] = Array.from(new Set(SOURCE_TYPES.map((r) => r.timeRange))).map((timeRange) => {
    const point: TrendPoint = { label: timeRange }
    SOURCE_TYPE_NAMES.forEach((name) => {
      const row = SOURCE_TYPES.find((r) => r.timeRange === timeRange && r.sourceType === name)
      point[name] = row?.avgShare ?? 0
    })
    return point
  })
  const sourceTypeTableRows = SOURCE_TYPES.filter((r) => r.timeRange === 'Jun')
  const sourceTypeColumns: Column<(typeof SOURCE_TYPES)[number]>[] = [
    { key: 'sourceType', label: 'Source type', width: 160 },
    { key: 'avgShare', label: 'Avg citation share', width: 160, render: (v) => `${v}%` },
    { key: 'chatgptShare', label: 'ChatGPT', width: 140, render: (v) => `${v}%` },
    { key: 'geminiShare', label: 'Gemini', width: 140, render: (v) => `${v}%` },
    { key: 'perplexityShare', label: 'Perplexity', width: 150, render: (v) => `${v}%` },
  ]

  const topSourcesRows = TOP_CITATION_SOURCES[sourcesPlatform]
  const topSourcesColumns: Column<(typeof topSourcesRows)[number]>[] = [
    { key: 'source', label: 'Top citation source', width: 260, sortable: true },
    { key: 'sourceType', label: 'Source type', width: 160 },
    { key: 'uniquePages', label: 'Unique pages', width: 140, sortable: true },
    { key: 'shareOfVoice', label: 'AI share of voice', width: 160, render: (v) => `${v}%` },
  ]

  const citedPagesRows = CITED_PAGES[pagesPlatform]
  const citedPagesColumns: Column<(typeof citedPagesRows)[number]>[] = [
    { key: 'rank', label: 'Rank', width: 80, sortable: true },
    { key: 'page', label: 'Cited page', width: 420, render: (v) => <span className="truncate text-body text-text-action">{String(v)}</span> },
    { key: 'sourceType', label: 'Source type', width: 140 },
    { key: 'count', label: 'Count', width: 100, sortable: true },
    { key: 'citationShare', label: 'Citation share', width: 140, render: (v) => `${v}%` },
  ]

  const watchedRows = WATCHED_PAGES[watchedPlatform]

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Citations
            </p>
            <InfoTooltip text="See how your brand is cited by AI sites compared to competitors" />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <DateRangeSelector
              value={dateRange}
              options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
              onChange={setDateRange}
            />
            <SegmentedControl
              options={[
                { value: 'location', label: 'By location' },
                { value: 'brand', label: 'By brand' },
              ]}
              value={citationView}
              onChange={(v) => {
                const next = v as 'location' | 'brand'
                setCitationView(next)
                setRankingScope(next === 'brand' ? RANKING_BRANDS[0] : RANKING_LOCATIONS[0])
              }}
            />
            <button
              type="button"
              aria-label="More options"
              className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
            >
              <Icon name="more_vert" size={20} />
            </button>
            <button
              type="button"
              aria-label="Filter"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
            >
              <Icon name="filter_list" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
          <div className="flex flex-col gap-xl px-2xl py-xl">
          {/* 1. Summary */}
          <SummaryCard
            title="Citation share"
            subtitle={`The percentage of all citations that come from your ${citationView === 'brand' ? 'brands' : 'locations'}' website`}
            stats={summaryStats}
          />

          {/* 2. How often are your brands cited (By brand view only) */}
          {citationView === 'brand' && (
            <ChartCard
              title={
                <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                  How often are your brands cited by AI sites for
                  <ThemeDropdown themes={CITED_THEMES} selected={brandCitedTheme} onChange={setBrandCitedTheme} />
                </span>
              }
              subtitle="Track how your brand content is cited by AI sites over time."
              toolbar={
                <div className="flex items-center gap-sm">
                  <SegmentedControl
                    options={[
                      { value: 'share', label: 'Share' },
                      { value: 'count', label: 'Count' },
                    ]}
                    value={brandCitedMetric}
                    onChange={(v) => setBrandCitedMetric(v as 'share' | 'count')}
                  />
                  <DateRangeSelector
                    value={brandCitedDateRange}
                    options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                    onChange={setBrandCitedDateRange}
                  />
                  <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                    <AiIcon size={16} />
                  </button>
                </div>
              }
            >
              <div className="mb-lg">
                <CardTabs
                  tabs={PLATFORM_TABS_WITH_ALL}
                  activeTab={brandCitedPlatform}
                  onChange={(id) => setBrandCitedPlatform(id as CitationPlatform)}
                />
              </div>
              <TrendLineChart
                data={visibleBrandTrend}
                series={brandTrendSeries}
                height={280}
                yTickFormatter={(v) => (brandCitedMetric === 'share' ? `${v}%` : String(v))}
              />
              <div className="flex flex-wrap items-center gap-xl mt-sm px-xs">
                {brandTrendSeries.map((s) => (
                  <div key={s.key} className="flex items-center gap-xs">
                    <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[12px] text-text-secondary">{s.label}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* 3. How often cited trend */}
          <ChartCard
            title={
              <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                How often are you cited by AI sites for
                <ThemeDropdown themes={CITED_THEMES} selected={citedTheme} onChange={setCitedTheme} />
              </span>
            }
            subtitle="Track how your content is cited by AI sites overtime"
            toolbar={
              <div className="flex items-center gap-sm">
                <SegmentedControl
                  options={[
                    { value: 'share', label: 'Share' },
                    { value: 'count', label: 'Count' },
                  ]}
                  value={citedMetric}
                  onChange={(v) => setCitedMetric(v as 'share' | 'count')}
                />
                <DateRangeSelector
                  value={citedDateRange}
                  options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                  onChange={setCitedDateRange}
                />
                <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                  <AiIcon size={16} />
                </button>
              </div>
            }
          >
            <TrendLineChart
              data={visibleTrend}
              series={trendSeries}
              height={280}
              yTickFormatter={(v) => (citedMetric === 'share' ? `${v}%` : String(v))}
            />
            <div className="flex flex-wrap items-center gap-xl mt-sm px-xs">
              {trendSeries.map((s) => (
                <div key={s.key} className="flex items-center gap-xs">
                  <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] text-text-secondary">{s.label}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* 4. Citation share vs competitors */}
          <ChartCard
            title={
              <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                What is your citation share compared to your competitors for
                <ThemeDropdown themes={CITED_THEMES} selected={comparisonHeaderTheme} onChange={setComparisonHeaderTheme} />
              </span>
            }
            subtitle="Compare how frequently your business and competitors are cited in AI answers for the same themes"
            toolbar={
              <div className="flex items-center gap-sm">
                <SegmentedControl
                  options={[
                    { value: 'share', label: 'Share' },
                    { value: 'count', label: 'Count' },
                  ]}
                  value={comparisonMetric}
                  onChange={(v) => setComparisonMetric(v as 'share' | 'count')}
                />
                <DateRangeSelector
                  value={comparisonDateRange}
                  options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                  onChange={setComparisonDateRange}
                />
                <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                  <AiIcon size={16} />
                </button>
              </div>
            }
          >
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={comparisonPlatform}
                onChange={(id) => setComparisonPlatform(id as CitationPlatform)}
              />
            </div>
            <TrendLineChart
              data={comparisonTrendData}
              series={comparisonTrendSeries}
              height={280}
              yTickFormatter={(v) => (comparisonMetric === 'count' ? String(v) : `${v}%`)}
            />
            <div className="flex flex-wrap items-center gap-xl mt-sm mb-lg px-xs">
              {comparisonTrendSeries.map((s) => (
                <div key={s.key} className="flex items-center gap-xs">
                  <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] text-text-secondary">{s.label}</span>
                </div>
              ))}
            </div>
            <DataTable columns={comparisonColumns} data={comparisonRows} rowHeight={56} />
          </ChartCard>

          {/* 5. Citation ranking by theme */}
          <CompetitorRankingCard
            rows={citationRankingRows}
            rankCount={10}
            avatarOnly
            title={
              <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                How are your citations performing against your competitors for
                <ThemeDropdown
                  themes={citationView === 'brand' ? RANKING_BRANDS : RANKING_LOCATIONS}
                  selected={rankingScope}
                  onChange={setRankingScope}
                />
              </span>
            }
            subtitle="Track how well your website ranks among top citation domains for each theme"
            platformTabs={PLATFORM_TABS_WITH_ALL}
            activePlatform={rankingPlatform}
            onPlatformChange={(id) => setRankingPlatform(id as CitationPlatform)}
          />

          {/* 6. Popular source types */}
          <ChartCard
            title="What are the most popular source types for all themes"
            subtitle="Track how your source citation mix changes over time"
            toolbar={
              <div className="flex items-center gap-sm">
                <SegmentedControl
                  options={[
                    { value: 'share', label: 'Share' },
                    { value: 'count', label: 'Count' },
                  ]}
                  value={sourceTypeMetric}
                  onChange={(v) => setSourceTypeMetric(v as 'share' | 'count')}
                />
                <DateRangeSelector
                  value={sourceTypeDateRange}
                  options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                  onChange={setSourceTypeDateRange}
                />
                <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                  <AiIcon size={16} />
                </button>
              </div>
            }
          >
            <TrendLineChart
              data={sourceTypeTrendData}
              series={sourceTypeSeries}
              height={220}
              yTickFormatter={(v) => `${v}%`}
            />
            <div className="mt-lg">
              <DataTable columns={sourceTypeColumns} data={sourceTypeTableRows} rowHeight={48} />
            </div>
          </ChartCard>

          {/* 7. What sources do AI sites use */}
          <ChartCard title="What sources do AI sites use to generate answers for all themes" subtitle="Explore the specific sources that are frequently used by AI sites to generate answers">
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={sourcesPlatform}
                onChange={(id) => setSourcesPlatform(id as CitationPlatform)}
              />
            </div>
            <DataTable columns={topSourcesColumns} data={topSourcesRows} rowHeight={48} maxVisibleRows={5} />
          </ChartCard>

          {/* 8. Most commonly cited pages */}
          <ChartCard title="Which pages are most commonly cited by AI for all themes" subtitle="See which pages AI sites rely on most when generating answers for your tracked themes">
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={pagesPlatform}
                onChange={(id) => setPagesPlatform(id as CitationPlatform)}
              />
            </div>
            <DataTable columns={citedPagesColumns} data={citedPagesRows} rowHeight={48} />
          </ChartCard>

          {/* 9. Watched pages */}
          <ChartCard title="Watched pages" subtitle="Pages you are tracking for citation changes">
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={watchedPlatform}
                onChange={(id) => setWatchedPlatform(id as CitationPlatform)}
              />
            </div>
            <DataTable columns={citedPagesColumns} data={watchedRows} rowHeight={48} />
          </ChartCard>
          </div>
        </div>
      </div>

      <FilterPanel
        open={filterOpen}
        fields={filterFields}
        selections={filterSelections}
        onSelectionsChange={setFilterSelections}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  )
}
