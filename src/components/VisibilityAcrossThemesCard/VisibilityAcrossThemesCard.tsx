import { useRef, useState } from 'react'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { TrendLineChart } from '../charts/TrendLineChart'
import { DataTable } from '../DataTable/DataTable'
import { Icon } from '../Icon/Icon'
import { COMPETITOR_BRAND_DATA, type Platform, type CompetitorRowData } from '../../data/competitorData'
import type { Column } from '../DataTable/DataTable.types'
import aiSummaryIcon from '../../assets/ai-summary.svg'

// ── Types ────────────────────────────────────────────────────────────────────

export interface VisibilityAcrossThemesCardProps {
  themes?: string[]
  rows?: CompetitorRowData[]
  selectedCompetitor?: CompetitorRowData
  pageContext?: 'brand' | 'location'
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_THEMES = ['All themes', 'Dental care', 'Oral health', 'Insurance', 'Implants']

const PLATFORM_TABS = [
  { id: 'ChatGPT' as Platform, label: 'ChatGPT' },
  { id: 'Gemini' as Platform, label: 'Gemini' },
  { id: 'Perplexity' as Platform, label: 'Perplexity' },
  { id: 'all' as const, label: 'All sites' },
]

type Tab = Platform | 'all'

// Series colors — one per competitor (You, Bowen, Innisfail, Deeragun, Absolutely, Serenity)
const SERIES_COLORS = [
  '#1976d2', // You — blue
  '#f5a623', // comp1 — orange
  '#e056c7', // comp2 — pink
  '#f5b301', // comp3 — yellow
  '#de1b0c', // comp4 — red
  '#4cae3d', // comp5 — green
]

// ── Visibility trend data (calibrated to COMPETITOR_BRAND_DATA scores) ────────
// Each platform's 12 monthly points trend toward the endpoint values in
// COMPETITOR_BRAND_DATA so the chart and table tell a coherent story.
// You:   ChatGPT≈51%, Gemini≈67%, Perplexity≈68%
// comp1 (Bowen):      ChatGPT≈10%, Gemini≈16%, Perplexity≈9%
// comp2 (Innisfail):  ChatGPT≈5%,  Gemini≈2%,  Perplexity≈4%
// comp3 (Deeragun):   ChatGPT≈2%,  Gemini≈11%, Perplexity≈4%
// comp4 (Absolutely): ChatGPT≈10%, Gemini≈1%,  Perplexity≈8%
// comp5 (Serenity):   ChatGPT≈3%,  Gemini≈3%,  Perplexity≈2%

type VPoint = { label: string; you: number; comp1: number; comp2: number; comp3: number; comp4: number; comp5: number }

const VISIBILITY_TREND: Record<Platform, VPoint[]> = {
  ChatGPT: [
    { label: 'Jan', you: 44.0, comp1: 7.5, comp2: 3.2, comp3: 1.2, comp4: 6.8, comp5: 1.8 },
    { label: 'Feb', you: 45.2, comp1: 7.8, comp2: 3.0, comp3: 1.1, comp4: 7.2, comp5: 2.0 },
    { label: 'Mar', you: 46.1, comp1: 8.1, comp2: 3.5, comp3: 1.3, comp4: 7.8, comp5: 1.9 },
    { label: 'Apr', you: 47.0, comp1: 8.4, comp2: 3.8, comp3: 1.5, comp4: 8.1, comp5: 2.1 },
    { label: 'May', you: 47.8, comp1: 8.6, comp2: 4.0, comp3: 1.4, comp4: 8.4, comp5: 2.2 },
    { label: 'Jun', you: 48.5, comp1: 8.9, comp2: 4.2, comp3: 1.6, comp4: 8.8, comp5: 2.0 },
    { label: 'Jul', you: 49.1, comp1: 9.1, comp2: 4.4, comp3: 1.7, comp4: 9.0, comp5: 2.3 },
    { label: 'Aug', you: 49.6, comp1: 9.3, comp2: 4.5, comp3: 1.8, comp4: 9.3, comp5: 2.4 },
    { label: 'Sep', you: 50.0, comp1: 9.5, comp2: 4.6, comp3: 1.7, comp4: 9.5, comp5: 2.3 },
    { label: 'Oct', you: 50.4, comp1: 9.7, comp2: 4.7, comp3: 1.8, comp4: 9.6, comp5: 2.4 },
    { label: 'Nov', you: 51.0, comp1: 9.9, comp2: 4.8, comp3: 1.9, comp4: 9.7, comp5: 2.5 },
    { label: 'Dec', you: 51.3, comp1: 10.0, comp2: 4.9, comp3: 1.8, comp4: 9.8, comp5: 2.5 },
  ],
  Gemini: [
    { label: 'Jan', you: 58.0, comp1: 12.0, comp2: 1.8, comp3: 7.5, comp4: 1.2, comp5: 2.8 },
    { label: 'Feb', you: 59.2, comp1: 12.4, comp2: 1.7, comp3: 7.9, comp4: 1.1, comp5: 2.9 },
    { label: 'Mar', you: 60.1, comp1: 12.8, comp2: 2.0, comp3: 8.3, comp4: 1.3, comp5: 3.0 },
    { label: 'Apr', you: 61.0, comp1: 13.2, comp2: 1.9, comp3: 8.7, comp4: 1.2, comp5: 3.1 },
    { label: 'May', you: 62.0, comp1: 13.6, comp2: 2.1, comp3: 9.0, comp4: 1.3, comp5: 3.2 },
    { label: 'Jun', you: 63.0, comp1: 14.0, comp2: 2.0, comp3: 9.4, comp4: 1.4, comp5: 3.2 },
    { label: 'Jul', you: 63.8, comp1: 14.4, comp2: 2.1, comp3: 9.8, comp4: 1.3, comp5: 3.3 },
    { label: 'Aug', you: 64.5, comp1: 14.8, comp2: 2.2, comp3: 10.1, comp4: 1.4, comp5: 3.3 },
    { label: 'Sep', you: 65.2, comp1: 15.1, comp2: 2.2, comp3: 10.3, comp4: 1.4, comp5: 3.4 },
    { label: 'Oct', you: 65.8, comp1: 15.3, comp2: 2.3, comp3: 10.5, comp4: 1.3, comp5: 3.4 },
    { label: 'Nov', you: 66.3, comp1: 15.5, comp2: 2.3, comp3: 10.6, comp4: 1.4, comp5: 3.4 },
    { label: 'Dec', you: 66.8, comp1: 15.6, comp2: 2.3, comp3: 10.7, comp4: 1.4, comp5: 3.4 },
  ],
  Perplexity: [
    { label: 'Jan', you: 59.5, comp1: 7.0, comp2: 2.8, comp3: 3.2, comp4: 5.8, comp5: 1.2 },
    { label: 'Feb', you: 60.5, comp1: 7.2, comp2: 2.7, comp3: 3.3, comp4: 6.0, comp5: 1.3 },
    { label: 'Mar', you: 61.3, comp1: 7.5, comp2: 2.9, comp3: 3.4, comp4: 6.3, comp5: 1.2 },
    { label: 'Apr', you: 62.1, comp1: 7.7, comp2: 3.0, comp3: 3.5, comp4: 6.6, comp5: 1.3 },
    { label: 'May', you: 63.0, comp1: 7.9, comp2: 3.1, comp3: 3.6, comp4: 6.9, comp5: 1.4 },
    { label: 'Jun', you: 63.8, comp1: 8.1, comp2: 3.2, comp3: 3.7, comp4: 7.1, comp5: 1.4 },
    { label: 'Jul', you: 64.5, comp1: 8.3, comp2: 3.3, comp3: 3.8, comp4: 7.3, comp5: 1.4 },
    { label: 'Aug', you: 65.2, comp1: 8.5, comp2: 3.4, comp3: 3.9, comp4: 7.5, comp5: 1.5 },
    { label: 'Sep', you: 65.8, comp1: 8.7, comp2: 3.4, comp3: 4.0, comp4: 7.6, comp5: 1.5 },
    { label: 'Oct', you: 66.4, comp1: 8.9, comp2: 3.5, comp3: 4.1, comp4: 7.8, comp5: 1.5 },
    { label: 'Nov', you: 67.0, comp1: 9.1, comp2: 3.5, comp3: 4.2, comp4: 7.9, comp5: 1.5 },
    { label: 'Dec', you: 67.7, comp1: 9.3, comp2: 3.5, comp3: 4.4, comp4: 8.0, comp5: 1.5 },
  ],
}

// "All sites" = average of ChatGPT + Gemini + Perplexity per data point
const ALL_SITES_TREND: VPoint[] = VISIBILITY_TREND['ChatGPT'].map((pt, i) => {
  const gpt  = VISIBILITY_TREND['ChatGPT'][i]!
  const gem  = VISIBILITY_TREND['Gemini'][i]!
  const perp = VISIBILITY_TREND['Perplexity'][i]!
  const avg = (a: number, b: number, c: number) => Math.round(((a + b + c) / 3) * 10) / 10
  return {
    label: pt.label,
    you:   avg(gpt.you,   gem.you,   perp.you),
    comp1: avg(gpt.comp1, gem.comp1, perp.comp1),
    comp2: avg(gpt.comp2, gem.comp2, perp.comp2),
    comp3: avg(gpt.comp3, gem.comp3, perp.comp3),
    comp4: avg(gpt.comp4, gem.comp4, perp.comp4),
    comp5: avg(gpt.comp5, gem.comp5, perp.comp5),
  }
})

// Series configs — one per competitor in COMPETITOR_BRAND_DATA order
const COMPETITOR_NAMES = COMPETITOR_BRAND_DATA.map((r) => r.name)
const TREND_SERIES = COMPETITOR_NAMES.map((name, i) => ({
  key: i === 0 ? 'you' : `comp${i}`,
  label: name,
  color: SERIES_COLORS[i] ?? '#888',
}))

// ── Inline table row type ─────────────────────────────────────────────────────

interface VisibilityRow extends Record<string, unknown> {
  name: string
  isYou: boolean
  isSelected: boolean
  visibilityScore: number
  visibilityDelta: number
}

// ── ThemeDropdown ─────────────────────────────────────────────────────────────

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
                {t === selected
                  ? <Icon name="check" size={16} className="text-primary shrink-0" />
                  : <span className="w-[16px] shrink-0" />
                }
                {t}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Table column definitions ──────────────────────────────────────────────────

const VISIBILITY_SCORE_TOOLTIP = {
  brand: 'See how frequently you are mentioned in AI-generated answers compared to competitors',
  location: 'See how frequently your location is mentioned in AI-generated answers compared to competitors',
}

function buildVisibilityCols(pageContext: 'brand' | 'location'): Column<VisibilityRow>[] {
  return [
    {
      key: 'name',
      label: 'Competitors',
      width: 280,
      sortable: true,
      render: (_v, row) => (
        <div className="flex items-center gap-sm">
          <span className="text-body text-text-primary truncate">{row.name}</span>
          {row.isYou && (
            <span className="shrink-0 px-[8px] py-[2px] rounded-full text-small text-white bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'visibilityScore',
      label: (
        <div className="flex items-center gap-xs">
          <span>Visibility score</span>
          <InfoTooltip text={VISIBILITY_SCORE_TOOLTIP[pageContext]} />
        </div>
      ),
      sortable: true,
      render: (_v, row) => {
        const sign = row.visibilityDelta >= 0 ? '+' : ''
        return (
          <div className="flex items-center gap-[8px]">
            <span className="text-[13px] text-text-primary">{row.visibilityScore.toFixed(1)}%</span>
            <span className="text-[12px] text-text-tertiary">{sign}{row.visibilityDelta.toFixed(1)}%</span>
          </div>
        )
      },
    },
  ]
}

// ── Main component ────────────────────────────────────────────────────────────

export function VisibilityAcrossThemesCard({
  themes = DEFAULT_THEMES,
  rows,
  selectedCompetitor,
  pageContext = 'brand',
}: VisibilityAcrossThemesCardProps) {
  const [tab, setTab] = useState<Tab>('ChatGPT')
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const visibilityCols = buildVisibilityCols(pageContext)

  const allTableData: CompetitorRowData[] = rows ?? COMPETITOR_BRAND_DATA
  const tableData: CompetitorRowData[] = selectedCompetitor
    ? allTableData.filter((r) => r.isYou || r.name === selectedCompetitor.name)
    : allTableData

  const trendData = tab === 'all' ? ALL_SITES_TREND : VISIBILITY_TREND[tab]
  const activeSeries = selectedCompetitor
    ? TREND_SERIES.filter((s) => s.key === 'you' || s.label === selectedCompetitor.name)
    : TREND_SERIES

  const visibilityRows: VisibilityRow[] = tableData.map((row) => {
    let score = 0
    let delta = 0

    if (tab === 'all') {
      const platforms: Platform[] = ['ChatGPT', 'Gemini', 'Perplexity']
      const available = platforms.map((p) => row.metrics[p]).filter(Boolean)
      if (available.length > 0) {
        score = available.reduce((sum, m) => sum + (m?.visibilityScore ?? 0), 0) / available.length
        delta = available.reduce((sum, m) => sum + (m?.visibilityDelta ?? 0), 0) / available.length
      }
    } else {
      const m = row.metrics[tab]
      score = m?.visibilityScore ?? 0
      delta = m?.visibilityDelta ?? 0
    }

    return {
      name: row.name,
      isYou: row.isYou ?? false,
      isSelected: selectedCompetitor?.name === row.name && !(row.isYou ?? false),
      visibilityScore: score,
      visibilityDelta: delta,
    }
  })

  return (
    <div className="flex flex-col bg-surface rounded-md border border-border overflow-hidden">
      {/* ── Header ── */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              How is your visibility across AI sites for
              <ThemeDropdown
                themes={themes}
                selected={selectedTheme}
                onChange={setSelectedTheme}
              />
              relative to competitors
            </span>
          }
          subtitle="Track how your visibility score performing relative to your competitors in answers provided by AI sites overtime"
          toolbar={
            <div className="flex items-center gap-sm">
              <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                <img src={aiSummaryIcon} alt="" width={16} height={16} />
              </button>
              <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                <Icon name="more_vert" size={16} className="text-text-icon" />
              </button>
            </div>
          }
        />
      </div>

      {/* ── Tabs + chart + table — 24px horizontal inset ── */}
      <div className="px-[24px]">
        <CardTabs
          tabs={PLATFORM_TABS.map((t) => ({ id: t.id, label: t.label }))}
          activeTab={tab}
          onChange={(id) => setTab(id as Tab)}
        />

        {/* ── Trend chart ── */}
        <div className="pt-lg pb-sm">
          <TrendLineChart
            data={trendData}
            series={activeSeries}
            height={280}
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
        <div className="mt-lg">
          <DataTable<VisibilityRow>
            columns={visibilityCols}
            data={visibilityRows}
            rowHeight={56}
          />
        </div>
      </div>
    </div>
  )
}
