import { useState } from 'react'
import {
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SummaryCard,
  CardHeader,
  CardTabs,
  DataTable,
  Chip,
  FilterPanel,
  ThemesInsightBanner,
  StackedBarChart,
  chartColors,
  type Column,
  type FilterField,
} from '../components'
import {
  RANKING_V2_PLATFORMS,
  RANKING_V2_DATA,
  RANKING_V2_SUMMARY,
  RANKING_V2_BRAND_NAME,
  THEME_RANK_DISTRIBUTION,
  LOCATION_THEME_RANK,
  type RankingV2Platform,
  type RankingV2PlatformSummary,
  type RankingV2Signal,
  type RankingV2Competitor,
  type LocationThemeRankRow,
} from '../data/rankingV2ReportData'

const RANKING_V2_MONTHS = [
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
]

const PLATFORM_TABS = RANKING_V2_PLATFORMS.map((p) => ({ id: p, label: p === 'All' ? 'All sites' : p }))

const FILTER_FIELDS: FilterField[] = [
  {
    id: 'location',
    label: 'Location',
    multi: true,
    options: LOCATION_THEME_RANK.map((r) => ({ value: r.location, label: r.location })),
  },
]

const INFLUENCE_ICON: Record<RankingV2Signal['influence'], { icon: string; label: string }> = {
  HIGH: { icon: 'arrow_upward', label: 'High' },
  MEDIUM: { icon: 'remove', label: 'Medium' },
  LOW: { icon: 'arrow_downward', label: 'Low' },
}

const RANK_LEGEND = [
  { key: 'rank1_3', label: 'Rank 1-3', color: chartColors.resolved },
  { key: 'rank4_10', label: 'Rank 4-10', color: chartColors.escalated },
  { key: 'rank10Plus', label: 'Rank 10+', color: chartColors.unresolved },
  { key: 'notTracked', label: 'Not tracked', color: chartColors.unresponded },
]

function EmptyPlatformState({ label }: { label: string }) {
  return (
    <div className="flex h-[140px] flex-col items-center justify-center gap-xs rounded-md border border-border bg-surface text-center">
      <p className="text-body text-text-primary">No {label} yet</p>
      <p className="text-small text-text-secondary">
        Data appears once your prompts have run for this platform.
      </p>
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

interface ScoreRow extends Record<string, unknown> {
  score: string
  value: number
  label: string
  variant: 'success' | 'warning'
  summary: string
}

interface CompetitorFlatRow extends Record<string, unknown> {
  _id: string
  _isYou?: boolean
  _isExpanded?: boolean
  name: string
  yourRank: number | string
  theirRank: number | string
  gap: string
}

export function RankingV2ReportScreen() {
  const [selectedMonth, setSelectedMonth] = useState(RANKING_V2_MONTHS[0])
  const [filterOpen, setFilterOpen] = useState(false)
  const [scorePlatform, setScorePlatform] = useState<RankingV2Platform>('ChatGPT')
  const [signalsPlatform, setSignalsPlatform] = useState<RankingV2Platform>('ChatGPT')
  const [competitorsPlatform, setCompetitorsPlatform] = useState<RankingV2Platform>('ChatGPT')
  const [themesPlatform, setThemesPlatform] = useState<RankingV2Platform>('ChatGPT')
  const [expandedCompetitors, setExpandedCompetitors] = useState<Set<string>>(new Set())

  const chatgptData = RANKING_V2_DATA.ChatGPT!

  const summaryStats = [
    { id: 'avg-rank', value: String(RANKING_V2_SUMMARY.avgRank), label: 'Your avg rank', delta: RANKING_V2_SUMMARY.delta, trend: 'up' as const },
  ]

  const understandingStats = [
    { id: 'perception', value: String(chatgptData.perception.score), label: 'Perception', delta: '5%', trend: 'up' as const, tooltip: 'How favorably AI describes your business.' },
    { id: 'alignment', value: String(chatgptData.queryAlignment.score), label: 'Alignment', delta: '3%', trend: 'up' as const, tooltip: 'How closely your business matches what the query is asking for.' },
    { id: 'confidence', value: '85', label: 'Confidence', delta: '2%', trend: 'up' as const, tooltip: 'How much data AI had to base this analysis on.' },
  ]

  const rankByPlatformColumns: Column<RankingV2PlatformSummary>[] = [
    { key: 'platform', label: 'AI site', width: 160 },
    { key: 'rank', label: 'Rank', width: 100 },
    { key: 'summary', label: 'Summary' },
  ]

  const scoreColumns: Column<ScoreRow>[] = [
    { key: 'score', label: 'Score', width: 160 },
    {
      key: 'value',
      label: 'Value',
      width: 140,
      render: (_v, row) => (
        <div className="flex flex-col gap-xs">
          <span className="text-body text-text-primary">{row.value}</span>
          <Chip label={row.label} variant={row.variant} />
        </div>
      ),
    },
    { key: 'summary', label: 'Summary' },
  ]

  const scoreRows: ScoreRow[] = [
    {
      score: 'Perception',
      value: chatgptData.perception.score,
      label: chatgptData.perception.label,
      variant: 'success',
      summary: chatgptData.perception.summary,
    },
    {
      score: 'Alignment',
      value: chatgptData.queryAlignment.score,
      label: chatgptData.queryAlignment.label,
      variant: 'warning',
      summary: chatgptData.queryAlignment.summary,
    },
    {
      score: 'Confidence',
      value: 85,
      label: 'High',
      variant: 'success',
      summary: 'Analysis is based on sufficient data to produce a reliable score.',
    },
  ]

  const signalColumns: Column<RankingV2Signal>[] = [
    { key: 'name', label: 'Signal' },
    { key: 'category', label: 'Category', width: 140 },
    {
      key: 'influence',
      label: 'Influence',
      width: 140,
      render: (_v, row) => (
        <span className="flex items-center gap-xs text-body text-text-primary">
          <Icon name={INFLUENCE_ICON[row.influence].icon} size={16} className="text-text-icon" />
          {INFLUENCE_ICON[row.influence].label}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 140,
      render: (_v, row) => (
        <span className="flex items-center gap-xs text-body text-text-primary">
          <Icon name="check_circle" size={16} className="text-chip-success-text" fill />
          {row.status === 'VERIFIED' ? 'Verified' : 'Unverified'}
        </span>
      ),
    },
  ]

  const unverifiedCount = chatgptData.recognizedSignals.filter((s) => s.status !== 'VERIFIED').length

  function toggleCompetitor(id: string) {
    setExpandedCompetitors((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const competitorFlatRows: CompetitorFlatRow[] = [
    {
      _id: 'you',
      _isYou: true,
      name: RANKING_V2_BRAND_NAME,
      yourRank: chatgptData.rank,
      theirRank: '—',
      gap: '—',
    },
    ...chatgptData.competitors.flatMap((c: RankingV2Competitor) => {
      const missing = c.missingSignals[0]
      const row: CompetitorFlatRow = {
        _id: c.name,
        name: c.name,
        yourRank: chatgptData.rank,
        theirRank: c.rank,
        gap: missing ? `${missing.name} is a missing signal` : '—',
      }
      if (!expandedCompetitors.has(c.name) || !missing) return [row]
      return [
        row,
        {
          _id: `${c.name}-detail`,
          name: '',
          yourRank: '',
          theirRank: '',
          gap: missing.recommendation,
          _isExpanded: true,
        },
      ]
    }),
  ]

  const competitorColumns: Column<CompetitorFlatRow>[] = [
    {
      key: 'name',
      label: 'Competitor',
      render: (_v, row) => {
        if (row._isExpanded) return null
        return (
          <span className="flex items-center gap-sm text-body text-text-primary">
            {row.name}
            {row._isYou && <Chip label="You" variant="info" />}
          </span>
        )
      },
    },
    { key: 'yourRank', label: 'Your rank', width: 120 },
    { key: 'theirRank', label: 'Their rank', width: 120 },
    {
      key: 'gap',
      label: 'Gap',
      render: (_v, row) =>
        row._isExpanded ? (
          <span className="block pl-lg text-small text-text-secondary">{row.gap}</span>
        ) : (
          <span className="text-body text-text-primary">{row.gap}</span>
        ),
    },
  ]

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

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Page header */}
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Ranking analysis
            </p>
            <InfoTooltip text="See how AI platforms rank and describe your business compared to competitors." />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <DateRangeSelector value={selectedMonth} options={RANKING_V2_MONTHS} onChange={setSelectedMonth} />
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
              <CardHeader title="What is your rank by AI site" subtitle="Your ranking position across each AI platform" />
              <div className="mt-lg">
                <DataTable columns={rankByPlatformColumns} data={chatgptData.rankByPlatform} />
              </div>
            </div>

            {/* Why are you ranking here */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="Why are you ranking here" subtitle="How AI platforms score and evaluate your business" />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={scorePlatform} onChange={(id) => setScorePlatform(id as RankingV2Platform)} />
              </div>
              {scorePlatform === 'ChatGPT' ? (
                <DataTable columns={scoreColumns} data={scoreRows} autoRowHeight />
              ) : (
                <EmptyPlatformState label="ranking data" />
              )}
            </div>

            {/* What signals is AI picking up */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="What signals is AI picking up about your business" subtitle="Signals AI platforms detect when your business appears in results" />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={signalsPlatform} onChange={(id) => setSignalsPlatform(id as RankingV2Platform)} />
              </div>
              {signalsPlatform === 'ChatGPT' ? (
                <>
                  <DataTable columns={signalColumns} data={chatgptData.recognizedSignals} />
                  <p className="mt-md text-small text-text-secondary">
                    {chatgptData.recognizedSignals.length} signals detected &middot; {unverifiedCount} unverified
                  </p>
                </>
              ) : (
                <EmptyPlatformState label="signal data" />
              )}
            </div>

            {/* How are you performing against competitors */}
            <div className="rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="How are you performing against competitors" subtitle="Your rank vs. competitors and what is causing the gap" />
              <div className="mt-lg mb-lg">
                <CardTabs tabs={PLATFORM_TABS} activeTab={competitorsPlatform} onChange={(id) => setCompetitorsPlatform(id as RankingV2Platform)} />
              </div>
              {competitorsPlatform === 'ChatGPT' ? (
                <DataTable
                  columns={competitorColumns}
                  data={competitorFlatRows}
                  autoRowHeight
                  rowAction={{
                    icon: 'chevron_right',
                    label: 'View recommendation',
                    visible: (row) => !row._isYou && !row._isExpanded,
                    onClick: (row) => toggleCompetitor(row._id.replace('-detail', '')),
                  }}
                />
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
                <DataTable columns={locationTableColumns} data={LOCATION_THEME_RANK} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterPanel open={filterOpen} fields={FILTER_FIELDS} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
