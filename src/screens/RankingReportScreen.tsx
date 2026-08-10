import { useRef, useState } from 'react'
import {
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SummaryCard,
  ChartCard,
  CardTabs,
  SegmentedControl,
  SummarizeIcon,
  TrendLineChart,
  FilterPanel,
  chartColors,
  type FilterField,
} from '../components'
import {
  RANKING_SUMMARY,
  BRAND_RANKING_TREND,
  type RankingReportPlatform,
} from '../data/rankingReportData'
import { THEME_NAMES } from '../data/themesData'
import { BY_LOCATION_DATA, RANKING_PLATFORMS } from '../data/competitorData'

const RANKING_MONTHS = [
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
]

const DATE_RANGE_MONTHS: Record<string, number> = {
  'Last 3 months': 3,
  'Last 6 months': 6,
  'Last 12 months': 12,
  'Last 24 months': 24,
}

const ALL_LOCATIONS = Array.from(
  new Set(
    RANKING_PLATFORMS.flatMap((p) =>
      BY_LOCATION_DATA[p].tableRows.map((r) => r.location)
    )
  )
).sort()

const LOCATION_FILTER_FIELDS: FilterField[] = [
  { id: 'location', label: 'Location', multi: true, options: ALL_LOCATIONS.map((l) => ({ value: l, label: l })) },
]

const BRAND_FILTER_FIELDS: FilterField[] = [
  {
    id: 'brand',
    label: 'Brand',
    multi: false,
    options: ['All brands', 'Aspendental', 'Fleur Choice', 'WellYesNow'].map((b) => ({ value: b, label: b })),
  },
]

const PLATFORM_TABS_WITH_ALL: { id: RankingReportPlatform; label: string }[] = [
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
  { id: 'All', label: 'All sites' },
]

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

function HeaderMoreMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="More options"
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
      >
        <Icon name="more_vert" size={20} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-[110] mt-xs min-w-[168px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
            {['Download', 'Email', 'Schedule'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function RankingReportScreen() {
  const [selectedMonth, setSelectedMonth] = useState(RANKING_MONTHS[0])
  const [rankingView, setRankingView] = useState<'location' | 'brand'>('location')
  const [filterOpen, setFilterOpen] = useState(false)
  const [brandTrendPlatform, setBrandTrendPlatform] = useState<RankingReportPlatform>('ChatGPT')
  const [brandTrendTheme, setBrandTrendTheme] = useState(THEME_NAMES[0])
  const [brandTrendDateRange, setBrandTrendDateRange] = useState('Last 3 months')

  const filterFields = rankingView === 'brand' ? BRAND_FILTER_FIELDS : LOCATION_FILTER_FIELDS

  const summaryStats = [
    { id: 'overall',    value: String(RANKING_SUMMARY.overall.value),    label: 'Avg rank' },
    { id: 'chatgpt',    value: String(RANKING_SUMMARY.chatgpt.value),    label: 'ChatGPT' },
    { id: 'gemini',     value: String(RANKING_SUMMARY.gemini.value),     label: 'Gemini' },
    { id: 'perplexity', value: String(RANKING_SUMMARY.perplexity.value), label: 'Perplexity' },
  ]

  const brandTrendSeries = [
    { key: 'aspendentalRank', label: 'Aspendental',  color: chartColors.categorical[0] },
    { key: 'fleurChoiceRank', label: 'Fleur Choice', color: chartColors.categorical[1] },
    { key: 'wellYesNowRank',  label: 'WellYesNow',   color: chartColors.categorical[2] },
  ]
  const brandTrendData    = BRAND_RANKING_TREND[brandTrendPlatform]
  const visibleBrandTrend = brandTrendData.slice(-Math.min(DATE_RANGE_MONTHS[brandTrendDateRange], brandTrendData.length))

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Page header */}
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Ranking
            </p>
            <InfoTooltip text="See how your brands rank in AI-generated answers compared to competitors." />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <DateRangeSelector
              value={selectedMonth}
              options={RANKING_MONTHS}
              onChange={setSelectedMonth}
            />
            <SegmentedControl
              options={[
                { value: 'location', label: 'By location' },
                { value: 'brand', label: 'By brand' },
              ]}
              value={rankingView}
              onChange={(v) => setRankingView(v as 'location' | 'brand')}
            />
            <HeaderMoreMenu />
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
            {/* 1. Summary KPI card */}
            <SummaryCard
              title="Summary"
              subtitle="Your ranking across AI sites."
              stats={summaryStats}
            />

            {/* 2a. Location view placeholder */}
            {rankingView === 'location' && (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-border bg-surface text-body text-text-secondary">
                Location ranking breakdown coming soon
              </div>
            )}

            {/* 2b. Brand trend chart */}
            {rankingView === 'brand' && (
              <ChartCard
                title={
                  <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                    How do your brands rank for
                    <ThemeDropdown themes={THEME_NAMES} selected={brandTrendTheme} onChange={setBrandTrendTheme} />
                  </span>
                }
                subtitle="See how your brands are ranking in answers generated by AI sites over time."
                toolbar={
                  <div className="flex items-center gap-sm">
                    <DateRangeSelector
                      value={brandTrendDateRange}
                      options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                      onChange={setBrandTrendDateRange}
                    />
                    <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                      <SummarizeIcon size={16} />
                    </button>
                  </div>
                }
              >
                <div className="mb-lg">
                  <CardTabs
                    tabs={PLATFORM_TABS_WITH_ALL}
                    activeTab={brandTrendPlatform}
                    onChange={(id) => setBrandTrendPlatform(id as RankingReportPlatform)}
                  />
                </div>
                <TrendLineChart
                  data={visibleBrandTrend}
                  series={brandTrendSeries}
                  height={280}
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
          </div>
        </div>
      </div>

      <FilterPanel
        open={filterOpen}
        fields={filterFields}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  )
}
