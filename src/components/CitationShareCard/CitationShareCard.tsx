import { useMemo, useRef, useState } from 'react'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { TrendLineChart, type SeriesConfig } from '../charts/TrendLineChart'
import { DataTable } from '../DataTable/DataTable'
import { DateRangeSelector } from '../DateRangeSelector/DateRangeSelector'
import { SegmentedControl } from '../SegmentedControl/SegmentedControl'
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { chartColors } from '../charts/chartColors'
import type { CompetitorRowData } from '../../data/competitorData'
import { THEME_NAMES } from '../../data/themesData'
import { CITATION_COMPARISON, buildCitationTrend, type CitationComparisonRow, type CitationPlatform } from '../../data/citationReportData'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CitationShareCardProps {
  themes?: string[]
  rows?: CompetitorRowData[]
  selectedCompetitor?: CompetitorRowData
  pageContext?: 'brand' | 'location'
}

// ── Static seed data ─────────────────────────────────────────────────────────

const DEFAULT_THEMES = THEME_NAMES

// ── Platform tabs ─────────────────────────────────────────────────────────────

const PLATFORM_TABS: { id: CitationPlatform; label: string }[] = [
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
  { id: 'All', label: 'All' },
]

// ── ThemeDropdown (private, inline in title) ──────────────────────────────────

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
        className="flex items-center gap-[4px] text-[#1976D2] text-[18px] leading-[26px]"
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

// ── Main component ────────────────────────────────────────────────────────────

export function CitationShareCard({ themes = DEFAULT_THEMES, pageContext = 'brand' }: CitationShareCardProps) {
  const [platform, setPlatform] = useState<CitationPlatform>('ChatGPT')
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [metric, setMetric] = useState<'share' | 'count'>('share')
  const [dateRange, setDateRange] = useState('Last 12 months')

  const { points: trendData, series: trendSeriesMeta } = useMemo(() => buildCitationTrend(platform), [platform])
  const activeSeries: SeriesConfig[] = trendSeriesMeta.map((s, i) => ({
    key: s.key,
    label: s.isYou ? 'You' : s.label,
    color: chartColors.categorical[i] ?? '#888',
  }))

  const comparisonRows = CITATION_COMPARISON[platform]

  // Rank rows within each month by avgCitationShare descending (1 = highest share).
  const rankByRow = new Map<CitationComparisonRow, number>()
  const rowsByMonth = new Map<string, CitationComparisonRow[]>()
  comparisonRows.forEach((row) => {
    const list = rowsByMonth.get(row.timeRange) ?? []
    list.push(row)
    rowsByMonth.set(row.timeRange, list)
  })
  rowsByMonth.forEach((monthRows) => {
    ;[...monthRows]
      .sort((a, b) => b.avgCitationShare - a.avgCitationShare)
      .forEach((row, i) => {
        if (row.avgCitationShare > 0) rankByRow.set(row, i + 1)
      })
  })

  const citationRankTooltip = pageContext === 'location'
    ? "See your location's position compared to others based on how often your website is cited in AI-generated answers"
    : "See your brand's position compared to competitor based on how often your website is cited in AI-generated answers"
  const avgCitationShareTooltip = 'See the percentage of all citations that come from your website. This helps you analyse how often your content is being used as a source in AI generated answers'

  // Table columns
  const tableColumns = [
    {
      key: 'timeRange' as const,
      label: 'Time range',
      width: 120,
      render: (_: unknown, row: CitationComparisonRow) => (
        <span className="text-body text-text-primary">{row.timeRange}</span>
      ),
    },
    {
      key: 'sourceName' as const,
      label: 'Source',
      width: 320,
      render: (_: unknown, row: CitationComparisonRow) => (
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
      key: 'citationRank' as const,
      label: (
        <div className="flex items-center gap-xs">
          <span>Citation rank</span>
          <InfoTooltip text={citationRankTooltip} />
        </div>
      ),
      width: 160,
      sortable: true,
      render: (_: unknown, row: CitationComparisonRow) => {
        const rank = rankByRow.get(row)
        return <span className="text-body text-text-primary">{rank ? `#${rank}` : '—'}</span>
      },
    },
    {
      key: 'avgCitationShare' as const,
      label: (
        <div className="flex items-center gap-xs">
          <span>Avg citation share</span>
          <InfoTooltip text={avgCitationShareTooltip} />
        </div>
      ),
      width: 220,
      sortable: true,
      render: (_: unknown, row: CitationComparisonRow) => (
        <span className="text-body text-text-primary">{row.avgCitationShare.toFixed(2)}%</span>
      ),
    },
    {
      key: 'totalCitations' as const,
      label: 'Total citations',
      width: 160,
      sortable: true,
      render: (_: unknown, row: CitationComparisonRow) => (
        <span className="text-body text-text-primary">{row.totalCitations != null ? row.totalCitations : '—'}</span>
      ),
    },
  ]

  return (
    <div className="flex flex-col bg-surface rounded-md border border-border">
      {/* ── Header ── */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What is your citation share compared to your competitor for
              <ThemeDropdown
                themes={themes}
                selected={selectedTheme}
                onChange={setSelectedTheme}
              />
            </span>
          }
          subtitle="Track how your content is cited relative to your competitor in answers provided by AI sites overtime"
          toolbar={
            <div className="flex items-center gap-sm">
              <SegmentedControl
                options={[
                  { value: 'share', label: 'Share' },
                  { value: 'count', label: 'Count' },
                ]}
                value={metric}
                onChange={(v) => setMetric(v as 'share' | 'count')}
              />
              <DateRangeSelector
                value={dateRange}
                options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                onChange={setDateRange}
              />
              <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                <AiIcon size={16} />
              </button>
              <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                <Icon name="more_vert" size={16} className="text-text-icon" />
              </button>
            </div>
          }
        />
      </div>

      {/* ── Platform tabs ── */}
      <div className="px-xl">
        <CardTabs
          tabs={PLATFORM_TABS.map((t) => ({ id: t.id, label: t.label }))}
          activeTab={platform}
          onChange={(id) => setPlatform(id as CitationPlatform)}
        />
      </div>

      {/* ── Trend chart ── */}
      <div className="px-xl pt-lg pb-sm">
        <TrendLineChart
          data={trendData}
          series={activeSeries}
          height={320}
          yDomain={[0, 'auto']}
          yTickFormatter={(v) => `${v}%`}
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-xl mt-sm px-xs">
          {activeSeries.map((s) => (
            <div key={s.key} className="flex items-center gap-xs">
              <span
                className="inline-block size-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[12px] text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {comparisonRows.length > 0 && (
        <div className="px-xl pb-xl pt-lg">
          <DataTable
            columns={tableColumns}
            data={comparisonRows}
            rowHeight={56}
          />
        </div>
      )}
    </div>
  )
}
