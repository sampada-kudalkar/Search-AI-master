import { useEffect, useRef, useState } from 'react'
import { Icon, TopNav, SummaryStats } from '../components'
import { ChartCard } from '../components/charts/ChartCard'
import { TrendLineChart, type SeriesConfig } from '../components/charts/TrendLineChart'
import { DonutChart } from '../components/charts/DonutChart'
import { DataTable } from '../components/DataTable/DataTable'
import type { Column } from '../components/DataTable/DataTable.types'
import { CardHeader } from '../components/CardHeader/CardHeader'
import {
  COMPETITOR_BRAND_DATA,
  COMPETITOR_DETAILS,
  type CompetitorRowData,
  type CompetitorLocationRow,
  type CompetitorPlatformCitationRow,
  type CompetitorThemeRow,
  type CompetitorShareRow,
} from '../data/competitorData'

// ── Column definitions ────────────────────────────────────────────────────────

const LOCATION_COLS: Column<CompetitorLocationRow>[] = [
  {
    key: 'location',
    label: 'Location',
    width: 220,
    render: (_v, row) =>
      row.isYou ? (
        <div className="inline-flex items-center rounded-full bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white px-[8px] py-[4px]">
          <span className="text-small text-white leading-[16px]">You</span>
        </div>
      ) : (
        <span className="text-body text-text-primary truncate">{row.location as string}</span>
      ),
  },
  {
    key: 'visibilityScore',
    label: 'Visibility score',
    sortable: true,
    render: (_v, row) => {
      const sign = (row.visibilityDelta as number) >= 0 ? '+' : ''
      const color = (row.visibilityDelta as number) >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
      return (
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] text-text-primary">{(row.visibilityScore as number).toFixed(1)}%</span>
          <span className={`text-[13px] ${color}`}>{sign}{Math.abs(row.visibilityDelta as number).toFixed(1)}%</span>
        </div>
      )
    },
  },
  {
    key: 'rank',
    label: 'Rank',
    sortable: true,
    render: (_v, row) => <span className="text-[13px] text-text-primary">{row.rank as number}</span>,
  },
  {
    key: 'citationShare',
    label: 'Citation share',
    sortable: true,
    render: (_v, row) => {
      const sign = (row.citationDelta as number) >= 0 ? '+' : ''
      const color = (row.citationDelta as number) >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
      return (
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] text-text-primary">{(row.citationShare as number).toFixed(1)}%</span>
          <span className={`text-[13px] ${color}`}>{sign}{Math.abs(row.citationDelta as number).toFixed(1)}%</span>
        </div>
      )
    },
  },
]

const CITATION_PLATFORM_COLS: Column<CompetitorPlatformCitationRow>[] = [
  {
    key: 'platform',
    label: 'Platform',
    width: 180,
    render: (_v, row) => (
      <div className="flex items-center gap-sm">
        <span className="inline-block size-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color as string }} />
        <span className="text-body text-text-primary truncate">{row.platform as string}</span>
      </div>
    ),
  },
  {
    key: 'citations',
    label: 'Citations',
    sortable: true,
    render: (_v, row) => <span className="text-[13px] text-text-primary">{row.citations as number}</span>,
  },
  {
    key: 'percentage',
    label: 'Share',
    sortable: true,
    render: (_v, row) => <span className="text-[13px] text-text-primary">{(row.percentage as number).toFixed(1)}%</span>,
  },
  {
    key: 'trend',
    label: 'Trend',
    sortable: true,
    render: (_v, row) => {
      const t = row.trend as number
      const sign = t >= 0 ? '+' : ''
      const color = t >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
      return <span className={`text-[13px] ${color}`}>{sign}{t.toFixed(1)}%</span>
    },
  },
]

const THEME_COLS = (competitorName: string): Column<CompetitorThemeRow>[] => [
  {
    key: 'theme',
    label: 'Theme',
    width: 200,
    render: (_v, row) => <span className="text-body text-text-primary truncate">{row.theme as string}</span>,
  },
  {
    key: 'youVisibility',
    label: 'Your visibility',
    sortable: true,
    render: (_v, row) => {
      const sign = (row.youDelta as number) >= 0 ? '+' : ''
      const color = (row.youDelta as number) >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
      return (
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] text-text-primary">{(row.youVisibility as number).toFixed(1)}%</span>
          <span className={`text-[13px] ${color}`}>{sign}{Math.abs(row.youDelta as number).toFixed(1)}%</span>
        </div>
      )
    },
  },
  {
    key: 'competitorVisibility',
    label: competitorName,
    sortable: true,
    render: (_v, row) => {
      const sign = (row.competitorDelta as number) >= 0 ? '+' : ''
      const color = (row.competitorDelta as number) >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
      return (
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] text-text-primary">{(row.competitorVisibility as number).toFixed(1)}%</span>
          <span className={`text-[13px] ${color}`}>{sign}{Math.abs(row.competitorDelta as number).toFixed(1)}%</span>
        </div>
      )
    },
  },
  {
    key: 'gap',
    label: 'Gap',
    sortable: true,
    render: (_v, row) => {
      const g = row.gap as number
      const color = g >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
      return <span className={`text-[13px] ${color}`}>{g >= 0 ? '+' : ''}{g.toFixed(1)}%</span>
    },
  },
]

const SHARE_COLS = (competitorName: string): Column<CompetitorShareRow>[] => [
  {
    key: 'metric',
    label: 'Metric',
    width: 180,
    render: (_v, row) => <span className="text-body text-text-primary">{row.metric as string}</span>,
  },
  {
    key: 'you',
    label: 'You',
    render: (_v, row) => <span className="text-[13px] text-text-primary">{row.you as string}</span>,
  },
  {
    key: 'competitor',
    label: competitorName,
    render: (_v, row) => <span className="text-[13px] text-text-primary">{row.competitor as string}</span>,
  },
  {
    key: 'sharePercent',
    label: 'Your share',
    sortable: true,
    render: (_v, row) => {
      const pct = row.sharePercent as number
      return (
        <div className="flex items-center gap-sm">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-selected">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[13px] text-text-primary">{pct}%</span>
        </div>
      )
    },
  },
]

// ── Legend helper ─────────────────────────────────────────────────────────────

function Legend({ series }: { series: SeriesConfig[] }) {
  return (
    <div className="mt-lg flex flex-wrap items-center gap-xl">
      {series.map((s) => (
        <div key={s.key} className="flex items-center gap-xs">
          <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
          <span className="text-[12px] text-text-secondary">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function CompetitorDetailScreen({
  initialCompetitor,
  onBack,
}: {
  initialCompetitor: CompetitorRowData
  onBack: () => void
}) {
  const competitors = COMPETITOR_BRAND_DATA.filter((r) => !r.isYou)
  const [selected, setSelected] = useState<CompetitorRowData>(initialCompetitor)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const detail = COMPETITOR_DETAILS[selected.name]

  useEffect(() => {
    if (!dropdownOpen) return
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [dropdownOpen])

  const youCompSeries: SeriesConfig[] = [
    { key: 'you', label: 'You', color: '#1976d2' },
    { key: 'competitor', label: selected.name, color: '#7c4dff' },
  ]

  const summaryStats = detail
    ? [
        {
          id: 'citation-share',
          value: `${detail.summary.youCitationShare.toFixed(1)}%`,
          delta: `${Math.abs(detail.summary.youCitationDelta).toFixed(1)}%`,
          trend: detail.summary.youCitationDelta >= 0 ? ('up' as const) : ('down' as const),
          label: `Citation share · competitor ${detail.summary.citationShare.toFixed(1)}%`,
        },
        {
          id: 'visibility-score',
          value: `${detail.summary.youVisibilityScore.toFixed(1)}%`,
          delta: `${Math.abs(detail.summary.youVisibilityDelta).toFixed(1)}%`,
          trend: detail.summary.youVisibilityDelta >= 0 ? ('up' as const) : ('down' as const),
          label: `Visibility score · competitor ${detail.summary.visibilityScore.toFixed(1)}%`,
        },
        {
          id: 'rank',
          value: String(detail.summary.youRank),
          label: `Your rank · competitor rank ${detail.summary.rank}`,
        },
        {
          id: 'rank-delta',
          value: String(detail.summary.rank - detail.summary.youRank),
          delta: String(Math.abs(detail.summary.rank - detail.summary.youRank)),
          trend: detail.summary.rank > detail.summary.youRank ? ('up' as const) : ('down' as const),
          label: 'Rank difference',
        },
      ]
    : []

  return (
    <div className="flex h-full flex-col">
      <TopNav initials="S" />

      {/* Breadcrumb + competitor switcher */}
      <div className="flex shrink-0 items-center gap-xs border-b border-border bg-surface px-2xl py-md">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-xs rounded-sm px-xs py-xs text-body text-text-action hover:bg-surface-hover"
        >
          <Icon name="arrow_back" size={16} className="text-text-action" />
          Competitor benchmarking by brand
        </button>
        <Icon name="chevron_right" size={16} className="text-text-icon" />

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-xs rounded-sm px-xs py-xs text-body text-text-primary hover:bg-surface-hover"
          >
            {selected.name}
            <Icon name="expand_more" size={16} className="text-text-icon" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-xs min-w-[240px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
              {competitors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => { setSelected(c); setDropdownOpen(false) }}
                  className="flex w-full items-center px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover"
                >
                  {c.name === selected.name
                    ? <Icon name="check" size={16} className="mr-sm text-primary shrink-0" />
                    : <span className="mr-sm w-4 shrink-0" />}
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-1 flex-col gap-xl overflow-y-auto bg-[#f5f5f5] px-2xl py-xl">
        {!detail ? (
          <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
            No detail data available for {selected.name}
          </div>
        ) : (
          <>
            {/* Card 1 — Summary */}
            <SummaryStats title="Summary" stats={summaryStats} />

            {/* Card 2 — Visibility ranking trend */}
            <ChartCard
              title="How is your visibility ranking against your competitors"
              subtitle={`Track how your average rank compares to ${selected.name} across AI platforms`}
              showActions
            >
              <div className="mt-lg">
                <TrendLineChart
                  data={detail.rankTrend}
                  series={youCompSeries}
                  height={240}
                  yDomain={[1, 14]}
                  yTickFormatter={(v) => `#${v}`}
                />
              </div>
              <Legend series={youCompSeries} />
            </ChartCard>

            {/* Card 3 — Locations visibility */}
            <ChartCard
              title="How visible are your locations for all themes"
              subtitle="Track how prominently your locations appear in AI-generated answers across themes"
              showActions
            >
              <div className="mt-lg">
                <TrendLineChart
                  data={detail.locationVisibilityTrend}
                  series={youCompSeries}
                  height={240}
                  yDomain={[0, 100]}
                  yTickFormatter={(v) => `${v}%`}
                />
              </div>
              <Legend series={youCompSeries} />
              <div className="mt-xl border-t border-border pt-xl">
                <DataTable<CompetitorLocationRow>
                  columns={LOCATION_COLS}
                  data={detail.locations}
                  rowHeight={68}
                />
              </div>
            </ChartCard>

            {/* Card 4 — Location leaderboard (side-by-side) */}
            <div className="rounded-md border border-border bg-surface overflow-hidden">
              <div className="px-[20px] py-[16px]">
                <CardHeader
                  title="Location leaderboard by category"
                  subtitle="Bottom performing locations"
                />
              </div>
              <div className="flex gap-xl px-2xl pb-2xl">
                <div className="w-2/5 shrink-0">
                  <TrendLineChart
                    data={detail.locationVisibilityTrend}
                    series={youCompSeries}
                    height={260}
                    yDomain={[0, 100]}
                    yTickFormatter={(v) => `${v}%`}
                  />
                  <Legend series={youCompSeries} />
                </div>
                <div className="flex-1 min-w-0">
                  <DataTable<CompetitorLocationRow>
                    columns={LOCATION_COLS}
                    data={detail.locations}
                    rowHeight={60}
                  />
                </div>
              </div>
            </div>

            {/* Card 5 — Citation by platform (side-by-side) */}
            <ChartCard
              title="Track how your content is cited by AI sites overtime"
              subtitle="See how citation share is distributed across AI platforms and directories"
              showActions
            >
              <div className="mt-lg flex gap-xl">
                <div className="w-[260px] shrink-0">
                  <DonutChart
                    data={detail.citationByPlatform}
                    centerValue={`${detail.summary.youCitationShare.toFixed(0)}%`}
                    centerLabel="citation share"
                    height={260}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <DataTable<CompetitorPlatformCitationRow>
                    columns={CITATION_PLATFORM_COLS}
                    data={detail.citationByPlatformRows}
                    rowHeight={56}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Card 6 — Theme visibility */}
            <ChartCard
              title="Which themes have the strongest visibility for you vs competitor"
              subtitle="Discover themes where you have the highest visibility across AI platforms"
              showActions
            >
              <div className="mt-lg">
                <TrendLineChart
                  data={detail.themeTrend}
                  series={youCompSeries}
                  height={240}
                  yDomain={[0, 100]}
                  yTickFormatter={(v) => `${v}%`}
                />
              </div>
              <Legend series={youCompSeries} />
              <div className="mt-xl border-t border-border pt-xl">
                <DataTable<CompetitorThemeRow>
                  columns={THEME_COLS(selected.name)}
                  data={detail.themes}
                  rowHeight={60}
                />
              </div>
            </ChartCard>

            {/* Card 7 — Share of voice */}
            <div className="rounded-md border border-border bg-surface overflow-hidden">
              <div className="px-[20px] py-[16px]">
                <CardHeader
                  title="What are your share of voice compared to your competitors"
                  subtitle="See how your key metrics stack up against this competitor"
                />
              </div>
              <div className="px-2xl pb-2xl">
                <DataTable<CompetitorShareRow>
                  columns={SHARE_COLS(selected.name)}
                  data={detail.shareOfVoice}
                  rowHeight={60}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
