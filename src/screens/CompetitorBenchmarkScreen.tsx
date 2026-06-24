import { useState, useRef, useEffect } from 'react'
import { Icon, CompetitorRankingCard } from '../components'
import { CardTabs } from '../components/CardTabs/CardTabs'
import { CompetitorMetricsCard } from '../components/CompetitorMetricsCard'
import { ChartCard } from '../components/charts/ChartCard'
import { ChartCardButton } from '../components/charts/ChartCardButton'
import { TrendLineChart, type SeriesConfig } from '../components/charts/TrendLineChart'
import {
  COMPETITORS,
  COMPETITOR_BRAND_DATA,
  DEFAULT_SELECTED,
  REPORT_DATE,
  PLATFORMS,
  TREND_DATA,
  TREND_SERIES_COLORS,
  PROMPT_RANKING_DATA,
  type Competitor,
  type CompetitorRowData,
  type Platform,
} from '../data/competitorData'

const SERIES_KEYS = ['comp1', 'comp2', 'comp3', 'comp4', 'comp5'] as const

export function CompetitorBenchmarkScreen({
  onCompetitorClick,
}: {
  onCompetitorClick?: (row: CompetitorRowData) => void
}): JSX.Element {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)
  const [trendPlatform, setTrendPlatform] = useState<Platform>('ChatGPT')

  const trendSeries: SeriesConfig[] = [
    { key: 'you', label: 'You', color: TREND_SERIES_COLORS['you'] },
    ...SERIES_KEYS.slice(0, selected.length).map((key, i) => ({
      key,
      label: selected[i],
      color: TREND_SERIES_COLORS[key],
    })),
  ]

  return (
    <div className="flex flex-col bg-[#f5f5f5] h-full w-full overflow-y-auto">
      {/* Page header */}
      <div className="flex h-16 shrink-0 items-center gap-sm px-2xl">
        {/* Title */}
        <div className="flex flex-1 items-center gap-sm">
          <span className="text-h3 text-text-primary">Competitor benchmarking by brand</span>
          <Icon name="info" size={20} className="text-text-icon" />
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-sm">
          {/* Month selector — static display */}
          <button
            type="button"
            aria-label="Select report month"
            className="flex items-center gap-sm rounded-sm border border-border bg-surface px-md py-sm text-body text-text-primary hover:bg-surface-hover"
          >
            {REPORT_DATE}
            <Icon name="expand_more" size={20} className="text-text-icon" />
          </button>

          {/* More options */}
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="more_vert" size={20} className="text-text-icon" />
          </button>

          {/* Filter */}
          <button
            type="button"
            aria-label="Filter"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="tune" size={20} className="text-text-icon" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-xl px-2xl pb-2xl">
        <CompetitorSelector
          competitors={COMPETITORS}
          selected={selected}
          onChange={setSelected}
        />
        <CompetitorMetricsCard
          rows={COMPETITOR_BRAND_DATA.filter(
            (r) => r.isYou || selected.includes(r.name)
          )}
          onRowClick={onCompetitorClick}
        />

        <CompetitorRankingCard rows={PROMPT_RANKING_DATA} />

        {/* Trend chart card */}
        <ChartCard
          title="How are your key Search AI metrics compared to competitors"
          subtitle="Track how your Search AI metrics like visibility, citation share and ranking changes against competitors"
          toolbar={<ChartCardButton icon="auto_awesome" label="AI insights" iconClassName="text-[#6834b7]" />}
          showActions
        >
          <CardTabs
            tabs={PLATFORMS.map((p) => ({ id: p, label: p }))}
            activeTab={trendPlatform}
            onChange={(id) => setTrendPlatform(id as Platform)}
          />
          <div className="mt-xl">
            <TrendLineChart
              data={TREND_DATA[trendPlatform as keyof typeof TREND_DATA]}
              series={trendSeries}
              height={300}
              yDomain={[0, 100]}
              yTickFormatter={(v) => `${v}%`}
            />
          </div>
          {/* Legend */}
          <div className="mt-xl flex flex-wrap items-center gap-xl">
            {trendSeries.map((s) => (
              <div key={s.key} className="flex items-center gap-xs">
                <span
                  className="inline-block size-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[12px] text-text-secondary">{s.label}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

function CompetitorSelector({
  competitors,
  selected,
  onChange,
}: {
  competitors: Competitor[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function removeChip(name: string) {
    onChange(selected.filter((s) => s !== name))
  }

  function toggleItem(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name))
    } else {
      onChange([...selected, name])
    }
  }

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Card */}
      <div className="bg-surface rounded-md border border-border p-xl w-full">
        <p className="text-small text-text-secondary mb-xs">Competitor</p>

        {/* Chip input row */}
        <div className="flex items-center gap-sm rounded-sm border border-border min-h-9 px-sm py-xs">
          {/* Chips */}
          <div className="flex flex-1 flex-wrap gap-xs">
            {selected.map((name) => (
              <span
                key={name}
                className="flex items-center gap-xs rounded-sm bg-chip-neutral-bg px-sm py-xs text-small text-text-primary"
              >
                {name}
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => removeChip(name)}
                  className="flex items-center rounded-sm"
                >
                  <Icon name="close" size={16} className="text-text-icon" />
                </button>
              </span>
            ))}
          </div>

          {/* Toggle chevron */}
          <button
            type="button"
            aria-label={open ? 'Close competitor list' : 'Open competitor list'}
            onClick={() => {
              setOpen((o) => !o)
              setQuery('')
            }}
            className="flex shrink-0 items-center rounded-sm"
          >
            <Icon
              name={open ? 'expand_less' : 'expand_more'}
              size={20}
              className="text-text-icon"
            />
          </button>
        </div>
      </div>

      {/* Dropdown panel — rendered in Task 4 */}
      {open && (
        <CompetitorDropdown
          competitors={filtered}
          selected={selected}
          query={query}
          onQueryChange={setQuery}
          onToggle={toggleItem}
        />
      )}
    </div>
  )
}

function CompetitorDropdown({
  competitors,
  selected,
  query,
  onQueryChange,
  onToggle,
}: {
  competitors: Competitor[]
  selected: string[]
  query: string
  onQueryChange: (q: string) => void
  onToggle: (name: string) => void
}) {
  return (
    <div className="absolute left-0 top-full z-50 mt-xs w-[630px] rounded-sm bg-surface p-xl shadow-dropdown">
      {/* Search input */}
      <div className="flex h-9 items-center gap-sm rounded-sm border border-primary px-sm">
        <Icon name="search" size={16} className="text-text-tertiary shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for competitors"
          className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-tertiary outline-none"
        />
      </div>

      {/* Competitor rows — max 5 visible, rest scrollable */}
      <div className="mt-xl max-h-[280px] overflow-y-auto flex flex-col gap-xl pr-xs">
        {competitors.map((c) => {
          const isChecked = selected.includes(c.name)
          const atLimit = selected.length >= 5
          const isDisabled = !isChecked && atLimit
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => { if (!isDisabled) onToggle(c.name) }}
              className="flex items-center gap-sm w-full text-left rounded-sm px-xs hover:bg-surface-hover"
            >
              {/* Avatar */}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-chip-neutral-bg text-small text-text-secondary">
                {c.name.charAt(0).toUpperCase()}
              </span>

              {/* Name + hint */}
              <span className="flex flex-1 flex-col">
                <span className="text-small text-text-primary">{c.name}</span>
                <span className="text-small text-text-tertiary">{c.hint}</span>
              </span>

              {/* Checkbox — only this is disabled when limit reached */}
              {isChecked ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary">
                  <Icon name="check" size={16} className="text-white" />
                </span>
              ) : (
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-sm border ${isDisabled ? 'border-control-disabled bg-surface opacity-50 cursor-not-allowed' : 'border-control-border'}`}
                  title={isDisabled ? 'Only 5 competitors can be added. Please remove one to add another.' : undefined}
                />
              )}
            </button>
          )
        })}

        {competitors.length === 0 && (
          <p className="text-body text-text-tertiary text-center py-sm">No competitors found</p>
        )}
      </div>
    </div>
  )
}
