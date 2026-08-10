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
  VISIBILITY_SUMMARY,
  VISIBILITY_TREND,
  BRAND_VISIBILITY_TREND,
  type VisibilityPlatform,
} from '../data/visibilityReportData'
import { THEME_NAMES } from '../data/themesData'
import { BY_LOCATION_DATA, RANKING_PLATFORMS } from '../data/competitorData'

const VISIBILITY_MONTHS = [
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
]

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
    options: ['All brands', 'Aspendental', 'Clear choice', 'Wellness now'].map((b) => ({ value: b, label: b })),
  },
]

const PLATFORM_TABS_WITH_ALL: { id: VisibilityPlatform; label: string }[] = [
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

export function VisibilityReportScreen() {
  const [selectedMonth, setSelectedMonth] = useState(VISIBILITY_MONTHS[0])
  const [visibilityView, setVisibilityView] = useState<'location' | 'brand'>('location')
  const [filterOpen, setFilterOpen] = useState(false)
  const [trendPlatform, setTrendPlatform] = useState<VisibilityPlatform>('ChatGPT')
  const [trendTheme, setTrendTheme] = useState(THEME_NAMES[0])
  const [trendMetric, setTrendMetric] = useState<'share' | 'count'>('share')
  const [trendDateRange, setTrendDateRange] = useState('Last 3 months')
  const [brandTrendPlatform, setBrandTrendPlatform] = useState<VisibilityPlatform>('ChatGPT')
  const [brandTrendTheme, setBrandTrendTheme] = useState(THEME_NAMES[0])
  const [brandTrendMetric, setBrandTrendMetric] = useState<'share' | 'count'>('share')
  const [brandTrendDateRange, setBrandTrendDateRange] = useState('Last 3 months')

  const filterFields = visibilityView === 'brand' ? BRAND_FILTER_FIELDS : LOCATION_FILTER_FIELDS

  const summaryStats = [
    {
      id: 'overall',
      value: `${VISIBILITY_SUMMARY.overall.value}%`,
      label: 'Visibility score',
      delta: `${Math.abs(VISIBILITY_SUMMARY.overall.growth)}%`,
      trend: VISIBILITY_SUMMARY.overall.growth >= 0 ? ('up' as const) : ('down' as const),
    },
    {
      id: 'chatgpt',
      value: `${VISIBILITY_SUMMARY.chatgpt.value}%`,
      label: 'ChatGPT',
      delta: `${Math.abs(VISIBILITY_SUMMARY.chatgpt.growth)}%`,
      trend: VISIBILITY_SUMMARY.chatgpt.growth >= 0 ? ('up' as const) : ('down' as const),
    },
    {
      id: 'gemini',
      value: `${VISIBILITY_SUMMARY.gemini.value}%`,
      label: 'Gemini',
      delta: `${Math.abs(VISIBILITY_SUMMARY.gemini.growth)}%`,
      trend: VISIBILITY_SUMMARY.gemini.growth >= 0 ? ('up' as const) : ('down' as const),
    },
    {
      id: 'perplexity',
      value: `${VISIBILITY_SUMMARY.perplexity.value}%`,
      label: 'Perplexity',
      delta: `${Math.abs(VISIBILITY_SUMMARY.perplexity.growth)}%`,
      trend: VISIBILITY_SUMMARY.perplexity.growth >= 0 ? ('up' as const) : ('down' as const),
    },
  ]

  const trendSeriesKey = trendPlatform === 'All' ? 'overallVisibility' : trendPlatform.toLowerCase()
  const trendSeries = trendPlatform === 'All'
    ? [
        { key: 'overallVisibility', label: 'Overall', color: chartColors.categorical[0] },
        { key: 'chatgpt', label: 'ChatGPT', color: chartColors.categorical[1] },
        { key: 'gemini', label: 'Gemini', color: chartColors.categorical[2] },
        { key: 'perplexity', label: 'Perplexity', color: chartColors.categorical[3] },
      ]
    : [{ key: trendSeriesKey, label: trendPlatform, color: chartColors.categorical[0] }]

  const DATE_RANGE_MONTHS: Record<string, number> = {
    'Last 3 months': 3,
    'Last 6 months': 6,
    'Last 12 months': 12,
    'Last 24 months': 24,
  }
  const visibleTrend = VISIBILITY_TREND.slice(-Math.min(DATE_RANGE_MONTHS[trendDateRange], VISIBILITY_TREND.length))

  const brandTrendSeries = [
    { key: `aspendental${brandTrendMetric === 'share' ? 'Share' : 'Count'}`, label: 'Aspendental',  color: chartColors.categorical[0] },
    { key: `fleurChoice${brandTrendMetric === 'share' ? 'Share' : 'Count'}`, label: 'Fleur Choice', color: chartColors.categorical[1] },
    { key: `wellYesNow${brandTrendMetric  === 'share' ? 'Share' : 'Count'}`, label: 'WellYesNow',   color: chartColors.categorical[2] },
  ]
  const brandTrendData    = BRAND_VISIBILITY_TREND[brandTrendPlatform]
  const visibleBrandTrend = brandTrendData.slice(-Math.min(DATE_RANGE_MONTHS[brandTrendDateRange], brandTrendData.length))

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Page header */}
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Visibility
            </p>
            <InfoTooltip text="See how frequently your locations are mentioned in AI-generated answers compared to competitors." />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <DateRangeSelector
              value={selectedMonth}
              options={VISIBILITY_MONTHS}
              onChange={setSelectedMonth}
            />
            <SegmentedControl
              options={[
                { value: 'location', label: 'By location' },
                { value: 'brand', label: 'By brand' },
              ]}
              value={visibilityView}
              onChange={(v) => setVisibilityView(v as 'location' | 'brand')}
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
              subtitle="Percentage of AI risk: the responses that mention your location and the responses that mention your location"
              stats={summaryStats}
            />

            {/* 2a. Location trend chart */}
            {visibilityView === 'location' && (
              <ChartCard
                title={
                  <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                    How frequently is your business visible on AI sites for
                    <ThemeDropdown themes={THEME_NAMES} selected={trendTheme} onChange={setTrendTheme} />
                  </span>
                }
                subtitle="Track how often your location appears in AI-generated answers across AI sites."
                toolbar={
                  <div className="flex items-center gap-sm">
                    <SegmentedControl
                      options={[
                        { value: 'share', label: 'Share' },
                        { value: 'count', label: 'Count' },
                      ]}
                      value={trendMetric}
                      onChange={(v) => setTrendMetric(v as 'share' | 'count')}
                    />
                    <DateRangeSelector
                      value={trendDateRange}
                      options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                      onChange={setTrendDateRange}
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
                    activeTab={trendPlatform}
                    onChange={(id) => setTrendPlatform(id as VisibilityPlatform)}
                  />
                </div>
                <TrendLineChart
                  data={visibleTrend}
                  series={trendSeries}
                  height={280}
                  yTickFormatter={(v) => `${v}%`}
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
            )}

            {/* 2b. Brand trend chart */}
            {visibilityView === 'brand' && (
              <ChartCard
                title={
                  <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                    How frequently are your brands visible? for
                    <ThemeDropdown themes={THEME_NAMES} selected={brandTrendTheme} onChange={setBrandTrendTheme} />
                  </span>
                }
                subtitle="Track how often your brands appear."
                toolbar={
                  <div className="flex items-center gap-sm">
                    <SegmentedControl
                      options={[
                        { value: 'share', label: 'Share' },
                        { value: 'count', label: 'Count' },
                      ]}
                      value={brandTrendMetric}
                      onChange={(v) => setBrandTrendMetric(v as 'share' | 'count')}
                    />
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
                    onChange={(id) => setBrandTrendPlatform(id as VisibilityPlatform)}
                  />
                </div>
                <TrendLineChart
                  data={visibleBrandTrend}
                  series={brandTrendSeries}
                  height={280}
                  yTickFormatter={(v) => (brandTrendMetric === 'share' ? `${v}%` : String(v))}
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
