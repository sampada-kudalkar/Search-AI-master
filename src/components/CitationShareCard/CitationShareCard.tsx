import { useRef, useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { TrendLineChart } from '../charts/TrendLineChart'
import { DataTable } from '../DataTable/DataTable'
import { DateRangeSelector } from '../DateRangeSelector/DateRangeSelector'
import { SegmentedControl } from '../SegmentedControl/SegmentedControl'
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { chartColors } from '../charts/chartColors'
import type { Platform, CompetitorRowData } from '../../data/competitorData'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CitationShareCardProps {
  themes?: string[]
  rows?: CompetitorRowData[]
  selectedCompetitor?: CompetitorRowData
}

// ── Static seed data ─────────────────────────────────────────────────────────

const DEFAULT_THEMES = ['All themes', 'Dental care', 'Oral health', 'Insurance', 'Implants']

// Citation share trend data for 12 months, per platform
const CITATION_TREND: Record<Platform, { label: string; you: number; comp1: number; comp2: number; comp3: number; comp4: number; comp5: number }[]> = {
  // ChatGPT: real data from citation seed (Apr–Jun 2026, roll-up across all 6 locations).
  // comp1 (Bowen Dental) = real seed values ("Bowendental"). comp2–comp5 = /* random */
  ChatGPT: [
    { label: 'Apr', you: 12.00, comp1: 0.00,  comp2: 3.10 /* random */, comp3: 1.80 /* random */, comp4: 2.40 /* random */, comp5: 1.50 /* random */ },
    { label: 'May', you: 9.00,  comp1: 4.00,  comp2: 3.50 /* random */, comp3: 2.10 /* random */, comp4: 2.20 /* random */, comp5: 1.90 /* random */ },
    { label: 'Jun', you: 10.47, comp1: 2.33,  comp2: 3.80 /* random */, comp3: 1.95 /* random */, comp4: 2.60 /* random */, comp5: 2.10 /* random */ },
  ],
  Gemini: [
    { label: 'Jan', you: 5.2, comp1: 3.1, comp2: 2.2, comp3: 1.5, comp4: 3.8, comp5: 7.0 },
    { label: 'Feb', you: 5.6, comp1: 3.4, comp2: 2.5, comp3: 1.6, comp4: 3.6, comp5: 6.8 },
    { label: 'Mar', you: 6.0, comp1: 3.6, comp2: 2.6, comp3: 1.8, comp4: 3.4, comp5: 6.5 },
    { label: 'Apr', you: 6.3, comp1: 3.7, comp2: 2.7, comp3: 1.9, comp4: 3.2, comp5: 6.2 },
    { label: 'May', you: 6.8, comp1: 3.9, comp2: 2.9, comp3: 2.0, comp4: 3.1, comp5: 6.0 },
    { label: 'Jun', you: 7.1, comp1: 4.1, comp2: 2.8, comp3: 1.9, comp4: 3.0, comp5: 5.9 },
    { label: 'Jul', you: 7.4, comp1: 4.2, comp2: 2.7, comp3: 1.8, comp4: 3.2, comp5: 5.7 },
    { label: 'Aug', you: 7.8, comp1: 4.0, comp2: 2.9, comp3: 1.9, comp4: 3.5, comp5: 5.5 },
    { label: 'Sep', you: 8.0, comp1: 4.1, comp2: 2.8, comp3: 2.0, comp4: 3.3, comp5: 5.3 },
    { label: 'Oct', you: 8.2, comp1: 4.3, comp2: 3.0, comp3: 2.1, comp4: 3.1, comp5: 5.2 },
    { label: 'Nov', you: 8.5, comp1: 4.2, comp2: 2.9, comp3: 2.0, comp4: 3.0, comp5: 5.0 },
    { label: 'Dec', you: 8.78, comp1: 4.39, comp2: 2.93, comp3: 1.95, comp4: 0.80, comp5: 1.95 },
  ],
  Perplexity: [
    { label: 'Jan', you: 5.8, comp1: 2.1, comp2: 1.8, comp3: 1.4, comp4: 2.5, comp5: 6.2 },
    { label: 'Feb', you: 5.6, comp1: 2.0, comp2: 1.9, comp3: 1.5, comp4: 2.3, comp5: 6.0 },
    { label: 'Mar', you: 5.4, comp1: 1.9, comp2: 2.0, comp3: 1.6, comp4: 2.2, comp5: 5.8 },
    { label: 'Apr', you: 5.2, comp1: 1.8, comp2: 2.1, comp3: 1.5, comp4: 2.0, comp5: 5.5 },
    { label: 'May', you: 5.0, comp1: 1.9, comp2: 2.2, comp3: 1.4, comp4: 1.9, comp5: 5.3 },
    { label: 'Jun', you: 4.8, comp1: 1.8, comp2: 2.0, comp3: 1.5, comp4: 1.8, comp5: 5.1 },
    { label: 'Jul', you: 4.6, comp1: 1.7, comp2: 1.9, comp3: 1.4, comp4: 2.0, comp5: 4.9 },
    { label: 'Aug', you: 4.5, comp1: 1.8, comp2: 2.1, comp3: 1.5, comp4: 2.1, comp5: 4.7 },
    { label: 'Sep', you: 4.4, comp1: 1.9, comp2: 2.0, comp3: 1.4, comp4: 1.9, comp5: 4.5 },
    { label: 'Oct', you: 4.3, comp1: 1.8, comp2: 1.9, comp3: 1.3, comp4: 1.8, comp5: 4.3 },
    { label: 'Nov', you: 4.2, comp1: 1.7, comp2: 2.0, comp3: 1.4, comp4: 1.7, comp5: 4.1 },
    { label: 'Dec', you: 4.40, comp1: 1.83, comp2: 2.20, comp3: 1.40, comp4: 1.10, comp5: 0.90 },
  ],
}

const SERIES_COLORS = [
  chartColors.categorical[0],  // You — green
  chartColors.categorical[1],  // comp1 — orange
  chartColors.categorical[2],  // comp2 — red
  chartColors.categorical[3],  // comp3 — purple
  chartColors.categorical[4],  // comp4 — blue
  chartColors.categorical[5],  // comp5 — cyan
]

const COMPETITOR_NAMES = [
  'You',
  'Bowen Dental',
  'Innisfail Dentists',
  'Deeragun Dental',
  'Absolutely Dental',
  'Serenity Dental CQ',
]

const TREND_SERIES = COMPETITOR_NAMES.map((name, i) => ({
  key: i === 0 ? 'you' : `comp${i}`,
  label: name,
  color: SERIES_COLORS[i] ?? '#888',
}))

// ── Platform tabs ─────────────────────────────────────────────────────────────

const PLATFORM_TABS: { id: Platform; label: string }[] = [
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
]

// ── Table columns ─────────────────────────────────────────────────────────────

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
        className="flex items-center gap-[4px] text-primary text-[18px] leading-[26px] hover:underline"
      >
        {selected}
        <Icon name="expand_more" size={16} className="text-primary" />
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

export function CitationShareCard({ themes = DEFAULT_THEMES, rows, selectedCompetitor }: CitationShareCardProps) {
  const [platform, setPlatform] = useState<Platform>('ChatGPT')
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [metric, setMetric] = useState<'share' | 'count'>('share')
  const [dateRange, setDateRange] = useState('Last 12 months')

  const trendData = CITATION_TREND[platform]

  const tableData: CompetitorRowData[] = rows ?? []

  // Compute citation rank per row for the active platform (highest share = rank 1)
  const rankMap = new Map<string, number>()
  ;[...tableData]
    .sort((a, b) => (b.metrics[platform]?.citationShare ?? 0) - (a.metrics[platform]?.citationShare ?? 0))
    .forEach((row, i) => rankMap.set(row.name, i + 1))

  // Table columns
  const tableColumns = [
    {
      key: 'name' as const,
      label: '',
      width: 400,
      render: (_: unknown, row: CompetitorRowData) => (
        <div className="flex items-center gap-sm">
          {row.domain && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${row.domain}&sz=20`}
              alt=""
              className="w-[20px] h-[20px] rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <span className="text-body text-text-primary">{row.name}</span>
          {row.isYou && (
            <span className="shrink-0 px-[8px] py-[2px] rounded-full text-small text-white bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white">
              You
            </span>
          )}
          {!row.isYou && selectedCompetitor?.name === row.name && (
            <span className="shrink-0 px-[8px] py-[4px] rounded-[4px] text-small text-[#555] bg-[#eaeaea]">
              Selected
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'isYou' as const,
      label: 'Citation rank',
      width: 160,
      sortable: true,
      render: (_: unknown, row: CompetitorRowData) => (
        <span className="text-body text-text-primary">#{rankMap.get(row.name) ?? '—'}</span>
      ),
    },
    {
      key: 'domain' as const,
      label: 'Average citation share',
      width: 220,
      render: (_: unknown, row: CompetitorRowData) => {
        const m = row.metrics[platform]
        if (!m) return <span className="text-text-tertiary text-small">—</span>
        return (
          <span className="text-body text-text-primary">
            {m.citationShare.toFixed(2)}%{' '}
            <span className={m.citationDelta >= 0 ? 'text-chip-success-text' : 'text-chip-danger-text'}>
              {m.citationDelta >= 0 ? '+' : ''}{m.citationDelta.toFixed(2)}%
            </span>
          </span>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col bg-surface rounded-md shadow-[0px_2px_12px_1px_rgba(33,33,33,0.06)]">
      {/* ── Header ── */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What is your citation share compared to your competitors for
              <ThemeDropdown
                themes={themes}
                selected={selectedTheme}
                onChange={setSelectedTheme}
              />
            </span>
          }
          subtitle="Track how your content is cited relative to your competitors in answers provided by AI sites overtime"
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
          onChange={(id) => setPlatform(id as Platform)}
        />
      </div>

      {/* ── Trend chart ── */}
      <div className="px-xl pt-lg pb-sm">
        <TrendLineChart
          data={trendData}
          series={TREND_SERIES}
          height={320}
          yDomain={[0, 'auto']}
          yTickFormatter={(v) => `${v}%`}
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-lg gap-y-xs mt-sm px-xs">
          {TREND_SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-xs">
              <span
                className="inline-block w-[16px] h-[2px] rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-small text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {tableData.length > 0 && (
        <div className="px-xl pb-xl pt-lg">
          <DataTable
            columns={tableColumns}
            data={tableData}
            rowHeight={56}
          />
        </div>
      )}
    </div>
  )
}
