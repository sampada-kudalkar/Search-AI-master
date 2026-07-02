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
  type Column,
} from '../components'
import {
  CITATION_SUMMARY,
  CITATION_TREND,
  CITATION_COMPARISON,
  CITATION_RANKING,
  SOURCE_TYPES,
  TOP_CITATION_SOURCES,
  CITED_PAGES,
  WATCHED_PAGES,
  type CitationPlatform,
} from '../data/citationReportData'
import { THEME_NAMES } from '../data/themesData'

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
  const [comparisonPlatform, setComparisonPlatform] = useState<CitationPlatform>('ChatGPT')
  const [rankingPlatform, setRankingPlatform] = useState<CitationPlatform>('ChatGPT')
  const [sourcesPlatform, setSourcesPlatform] = useState<CitationPlatform>('ChatGPT')
  const [pagesPlatform, setPagesPlatform] = useState<CitationPlatform>('ChatGPT')
  const [watchedPlatform, setWatchedPlatform] = useState<CitationPlatform>('ChatGPT')

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

  const comparisonRows = CITATION_COMPARISON[comparisonPlatform]
  const comparisonColumns: Column<(typeof comparisonRows)[number]>[] = [
    {
      key: 'timeRange',
      label: 'Time range',
      width: 140,
      sortable: true,
    },
    {
      key: 'sourceName',
      label: 'Source name',
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
    { key: 'citationRank', label: 'Citation rank', width: 140, sortable: true },
    { key: 'avgCitationShare', label: 'Avg citation share', width: 160, sortable: true, render: (v) => `${v}%` },
    { key: 'totalCitations', label: 'Total citations', width: 140, render: (v) => (v == null ? '—' : String(v)) },
  ]

  const rankingTableRows = CITATION_RANKING[rankingPlatform].map((row) => {
    const rankFields = Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [`rank${i + 1}`, row.ranks[i] ?? '—'])
    )
    return { theme: row.theme, ...rankFields } as { theme: string } & Record<`rank${number}`, string>
  })
  const rankingColumns: Column<(typeof rankingTableRows)[number]>[] = [
    { key: 'theme', label: 'Theme', width: 200 },
    ...Array.from({ length: 10 }, (_, i) => ({
      key: `rank${i + 1}` as const,
      label: `Rank ${i + 1}`,
      width: 160,
    })),
  ]

  const sourceTypeSeries = [
    { key: 'avgShare', label: 'Your website / competitor / other', color: chartColors.categorical[0] },
  ]
  const sourceTypeColumns: Column<(typeof SOURCE_TYPES)[number]>[] = [
    { key: 'timeRange', label: 'Time range', width: 120, sortable: true },
    { key: 'sourceType', label: 'Source type', width: 160 },
    { key: 'avgShare', label: 'Avg citation share', width: 160, render: (v) => `${v}%` },
    { key: 'avgCount', label: 'Avg citation count', width: 160 },
    { key: 'chatgptShare', label: 'ChatGPT share', width: 140, render: (v) => `${v}%` },
    { key: 'geminiShare', label: 'Gemini share', width: 140, render: (v) => `${v}%` },
    { key: 'perplexityShare', label: 'Perplexity share', width: 150, render: (v) => `${v}%` },
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
    <div className="flex flex-1 flex-col min-h-0">
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
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="more_vert" size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-xl px-2xl py-xl">
          {/* 1. Summary */}
          <SummaryCard
            title="Citation share"
            subtitle="The percentage of all citations that come from your locations' website"
            stats={summaryStats}
          />

          {/* 2. How often cited trend */}
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

          {/* 3. Citation share vs competitors */}
          <ChartCard
            title="What is your citation share compared to your competitors for all themes"
            subtitle="Compare how frequently your business and competitors are cited in AI answers for the same themes"
          >
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={comparisonPlatform}
                onChange={(id) => setComparisonPlatform(id as CitationPlatform)}
              />
            </div>
            <DataTable columns={comparisonColumns} data={comparisonRows} rowHeight={56} />
          </ChartCard>

          {/* 4. Citation ranking by theme */}
          <ChartCard
            title="How are your citations performing against your competitors for all locations"
            subtitle="Track how well your website ranks among top citation domains for each theme"
          >
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={rankingPlatform}
                onChange={(id) => setRankingPlatform(id as CitationPlatform)}
              />
            </div>
            <DataTable columns={rankingColumns} data={rankingTableRows} rowHeight={56} />
          </ChartCard>

          {/* 5. Popular source types */}
          <ChartCard title="What are the most popular source types for all themes" subtitle="Track how your source citation mix changes over time">
            <TrendLineChart
              data={SOURCE_TYPES.filter((r) => r.sourceType === 'Competitor' || r.sourceType === 'Other').map((r) => ({ label: `${r.timeRange} · ${r.sourceType}`, ...r }))}
              series={sourceTypeSeries}
              height={220}
              yTickFormatter={(v) => `${v}%`}
            />
            <div className="mt-lg">
              <DataTable columns={sourceTypeColumns} data={SOURCE_TYPES} rowHeight={48} />
            </div>
          </ChartCard>

          {/* 6. What sources do AI sites use */}
          <ChartCard title="What sources do AI sites use to generate answers for all themes" subtitle="Explore the specific sources that are frequently used by AI sites to generate answers">
            <div className="mb-lg">
              <CardTabs
                tabs={PLATFORM_TABS_WITH_ALL}
                activeTab={sourcesPlatform}
                onChange={(id) => setSourcesPlatform(id as CitationPlatform)}
              />
            </div>
            <DataTable columns={topSourcesColumns} data={topSourcesRows} rowHeight={48} />
          </ChartCard>

          {/* 7. Most commonly cited pages */}
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

          {/* 8. Watched pages */}
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
  )
}
