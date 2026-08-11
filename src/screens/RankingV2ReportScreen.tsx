import { useRef, useState } from 'react'
import {
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SummaryCard,
  CardHeader,
  CardTabs,
  DataTable,
  FilterPanel,
  ThemesInsightBanner,
  StackedBarChart,
  SegmentedControl,
  chartColors,
  type Column,
  type FilterField,
} from '../components'
import {
  RANKING_V2_DATA,
  RANKING_V2_THEME_SCORES,
  THEME_RANK_DISTRIBUTION,
  LOCATION_THEME_RANK,
  type RankingV2Platform,
  type LocationThemeRankRow,
} from '../data/rankingV2ReportData'
import { LocationThemeRankingDetailScreen } from './LocationThemeRankingDetailScreen'
import {
  PLATFORM_TABS,
  EmptyPlatformState,
  buildSummaryStats,
  buildUnderstandingStats,
  RANKING_V2_RANK_BY_PLATFORM_COLUMNS,
  RANKING_V2_SIGNAL_COLUMNS,
  RANKING_V2_COMPETITOR_COLUMNS,
  buildCompetitorRows,
  flattenThemeScores,
  buildThemeScoreColumns,
} from './rankingV2Shared'

const RANKING_V2_MONTHS = [
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
]

const FILTER_FIELDS: FilterField[] = [
  {
    id: 'location',
    label: 'Location',
    multi: true,
    options: LOCATION_THEME_RANK.map((r) => ({ value: r.location, label: r.location })),
  },
]

const RANK_LEGEND = [
  { key: 'rank1_3', label: 'Rank 1-3', color: chartColors.resolved },
  { key: 'rank4_10', label: 'Rank 4-10', color: chartColors.escalated },
  { key: 'rank10Plus', label: 'Rank 10+', color: chartColors.unresolved },
  { key: 'notTracked', label: 'Not tracked', color: chartColors.unresponded },
]

function ComingSoonState({ label }: { label: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-md border border-border bg-surface text-body text-text-secondary">
      {label}
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

interface ScopeDropdownProps {
  prefix: string
  options: string[]
  selected: string
  onChange: (v: string) => void
}

function ScopeDropdown({ prefix, options, selected, onChange }: ScopeDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
      {prefix}
      <span ref={ref} className="relative inline-flex items-center">
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
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false) }}
                  className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                    opt === selected ? 'text-primary' : 'text-text-primary'
                  }`}
                >
                  {opt === selected && <Icon name="check" size={16} className="text-primary shrink-0" />}
                  {opt !== selected && <span className="w-[16px] shrink-0" />}
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </span>
    </span>
  )
}

export function RankingV2ReportScreen() {
  const [selectedMonth, setSelectedMonth] = useState(RANKING_V2_MONTHS[0])
  const [filterOpen, setFilterOpen] = useState(false)
  const [rankingV2View, setRankingV2View] = useState<'location' | 'brand'>('location')
  const [rankBySiteLocation, setRankBySiteLocation] = useState('all locations')
  const [signalsLocation, setSignalsLocation] = useState('all locations')
  const [themesLocation, setThemesLocation] = useState('all locations')
  const [competitorsLocation, setCompetitorsLocation] = useState('all locations')
  const [scorePlatform, setScorePlatform] = useState<RankingV2Platform>('ChatGPT')
  const [signalsPlatform, setSignalsPlatform] = useState<RankingV2Platform>('ChatGPT')
  const [competitorsPlatform, setCompetitorsPlatform] = useState<RankingV2Platform>('ChatGPT')
  const [themesPlatform, setThemesPlatform] = useState<RankingV2Platform>('ChatGPT')
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set())
  const [selectedLocation, setSelectedLocation] = useState<LocationThemeRankRow | null>(null)

  const chatgptData = RANKING_V2_DATA.ChatGPT!

  const summaryStats = buildSummaryStats()
  const understandingStats = buildUnderstandingStats(chatgptData)

  function toggleTheme(themeName: string) {
    setExpandedThemes((prev) => {
      const next = new Set(prev)
      if (next.has(themeName)) next.delete(themeName)
      else next.add(themeName)
      return next
    })
  }

  const themeScoreRows = flattenThemeScores(RANKING_V2_THEME_SCORES, expandedThemes)
  const themeScoreColumns = buildThemeScoreColumns(expandedThemes, toggleTheme)

  const unverifiedCount = chatgptData.recognizedSignals.filter((s) => s.status !== 'VERIFIED').length

  const competitorRows = buildCompetitorRows(chatgptData)

  const themeChartData = THEME_RANK_DISTRIBUTION.map((t) => ({
    theme: t.theme,
    rank1_3: t.rank1_3,
    rank4_10: t.rank4_10,
    rank10Plus: t.rank10Plus,
    notTracked: t.notTracked,
  }))

  const themeTableColumns: Column<(typeof THEME_RANK_DISTRIBUTION)[number]>[] = [
    { key: 'theme', label: 'Theme' },
    { key: 'rank1_3', label: 'Rank 1-3', width: 140, render: (v) => (Number(v) > 0 ? String(v) : '—') },
    { key: 'rank4_10', label: 'Rank 4-10', width: 140, render: (v) => (Number(v) > 0 ? String(v) : '—') },
    { key: 'rank10Plus', label: 'Rank 10+', width: 140, render: (v) => (Number(v) > 0 ? String(v) : '—') },
  ]

  const locationTableColumns: Column<LocationThemeRankRow>[] = [
    { key: 'location', label: 'Location' },
    { key: 'rank1_3', label: 'Rank 1-3', width: 140, render: (v) => (Number(v) > 0 ? String(v) : '—') },
    { key: 'rank4_10', label: 'Rank 4-10', width: 140, render: (v) => (Number(v) > 0 ? String(v) : '—') },
    { key: 'rank10Plus', label: 'Rank 10+', width: 140, render: (v) => (Number(v) > 0 ? String(v) : '—') },
  ]

  if (selectedLocation) {
    return <LocationThemeRankingDetailScreen location={selectedLocation} onBack={() => setSelectedLocation(null)} />
  }

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Page header */}
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Ranking
            </p>
            <InfoTooltip text="See how AI platforms rank and describe your business compared to competitors." />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <DateRangeSelector value={selectedMonth} options={RANKING_V2_MONTHS} onChange={setSelectedMonth} />
            <SegmentedControl
              options={[
                { value: 'location', label: 'By location' },
                { value: 'brand', label: 'By brand' },
              ]}
              value={rankingV2View}
              onChange={(v) => setRankingV2View(v as 'location' | 'brand')}
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
          {rankingV2View === 'brand' ? (
            <div className="px-2xl py-xl">
              <ComingSoonState label="Ranking analysis by brand coming soon" />
            </div>
          ) : (
          <div className="flex flex-col gap-xl px-2xl py-xl">
            {/* Insight banner */}
            <ThemesInsightBanner
              text="Rankings reflect your position in AI results. Rankings may change due to this update, not a drop in performance."
              linkLabel="Learn more"
            />

            {/* Average rank + Understanding your rank */}
            <div className="flex gap-lg">
              <div className="w-[280px] shrink-0">
                <SummaryCard title="Average rank" stats={summaryStats} />
              </div>
              <div className="flex-1 min-w-0">
                <SummaryCard title="Understanding your rank" stats={understandingStats} />
              </div>
            </div>

            {/* What is your rank by AI site */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader
                title={
                  <ScopeDropdown
                    prefix="What is your rank by AI site across"
                    options={['all locations', ...LOCATION_THEME_RANK.map((r) => r.location)]}
                    selected={rankBySiteLocation}
                    onChange={setRankBySiteLocation}
                  />
                }
                subtitle="Your ranking position in answers generated by AI sites"
              />
              <div className="mt-lg">
                <DataTable columns={RANKING_V2_RANK_BY_PLATFORM_COLUMNS} data={chatgptData.rankByPlatform} />
              </div>
            </div>

            {/* What is your ranking analysis across all locations */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader
                title={
                  <ScopeDropdown
                    prefix="What is your ranking analysis across"
                    options={['all locations', ...LOCATION_THEME_RANK.map((r) => r.location)]}
                    selected={themesLocation}
                    onChange={setThemesLocation}
                  />
                }
                subtitle="How AI platforms score and evaluate your locations in answers generated by AI sites"
              />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={scorePlatform} onChange={(id) => setScorePlatform(id as RankingV2Platform)} />
              </div>
              {scorePlatform === 'ChatGPT' ? (
                <DataTable
                  columns={themeScoreColumns}
                  data={themeScoreRows}
                  autoRowHeight
                  rowMenuItems={[
                    {
                      label: 'View response',
                      visible: (row) => !row._isHeader,
                      onClick: () => {},
                    },
                    {
                      label: 'View citations',
                      visible: (row) => !row._isHeader,
                      onClick: () => {},
                    },
                  ]}
                />
              ) : (
                <EmptyPlatformState label="ranking data" />
              )}
            </div>

            {/* What are your top signals that contribute to your ranking */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader
                title={
                  <ScopeDropdown
                    prefix="What are your top signals that contribute to your ranking across"
                    options={['all locations', ...LOCATION_THEME_RANK.map((r) => r.location)]}
                    selected={signalsLocation}
                    onChange={setSignalsLocation}
                  />
                }
                subtitle="Signals AI sites detect when your business appears in AI-generated answers"
              />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={signalsPlatform} onChange={(id) => setSignalsPlatform(id as RankingV2Platform)} />
              </div>
              {signalsPlatform === 'ChatGPT' ? (
                <>
                  <DataTable columns={RANKING_V2_SIGNAL_COLUMNS} data={chatgptData.recognizedSignals} />
                  <p className="mt-md text-small text-text-secondary">
                    {chatgptData.recognizedSignals.length} signals detected &middot; {unverifiedCount} unverified
                  </p>
                </>
              ) : (
                <EmptyPlatformState label="signal data" />
              )}
            </div>

            {/* How are you performing against your competitors */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader
                title={
                  <ScopeDropdown
                    prefix="How are you performing against your competitors for"
                    options={['all locations', ...LOCATION_THEME_RANK.map((r) => r.location)]}
                    selected={competitorsLocation}
                    onChange={setCompetitorsLocation}
                  />
                }
                subtitle="Your rank vs. competitors and their top ranking signals"
              />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={competitorsPlatform} onChange={(id) => setCompetitorsPlatform(id as RankingV2Platform)} />
              </div>
              {competitorsPlatform === 'ChatGPT' ? (
                <DataTable columns={RANKING_V2_COMPETITOR_COLUMNS} data={competitorRows} autoRowHeight />
              ) : (
                <EmptyPlatformState label="competitor data" />
              )}
            </div>

            {/* How do your locations rank per theme */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="How do your locations rank per theme" subtitle="For each theme, see how many locations fall into each rank group" />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={themesPlatform} onChange={(id) => setThemesPlatform(id as RankingV2Platform)} />
              </div>
              {themesPlatform === 'ChatGPT' ? (
                <>
                  <div className="flex flex-wrap items-center gap-lg mb-md">
                    {RANK_LEGEND.map((l) => (
                      <div key={l.key} className="flex items-center gap-xs">
                        <span className="inline-block size-3 rounded-full" style={{ backgroundColor: l.color }} />
                        <span className="text-small text-text-secondary">{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <StackedBarChart
                    data={themeChartData}
                    xKey="theme"
                    height={260}
                    hideLegend
                    series={RANK_LEGEND.map((l) => ({ key: l.key, label: l.label, color: l.color }))}
                  />
                  <div className="mt-lg">
                    <DataTable columns={themeTableColumns} data={THEME_RANK_DISTRIBUTION} />
                  </div>
                </>
              ) : (
                <EmptyPlatformState label="theme ranking data" />
              )}
            </div>

            {/* How many themes are your locations ranking */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="How many themes are your locations ranking" subtitle="Themes in which your locations appear, organized by ranking group" />
              <div className="mt-lg">
                <DataTable
                  columns={locationTableColumns}
                  data={LOCATION_THEME_RANK}
                  onRowClick={(row) => setSelectedLocation(row)}
                  rowMenuItems={[
                    { label: 'View details', onClick: (row) => setSelectedLocation(row) },
                    { label: 'View themes', onClick: (row) => setSelectedLocation(row) },
                  ]}
                />
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      <FilterPanel open={filterOpen} fields={FILTER_FIELDS} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
