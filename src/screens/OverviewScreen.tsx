import { useRef, useState } from 'react'
import {
  Icon,
  InfoTooltip,
  SummaryCard,
  CardHeader,
  CardTabs,
  DataTable,
  SegmentedControl,
  SummarizeIcon,
  type Column,
} from '../components'
import {
  OVERVIEW_KPI_LOCATIONS,
  OVERVIEW_KPI_BRAND,
  OVERVIEW_THEMES_PERFORMANCE_LOCATIONS,
  OVERVIEW_THEMES_PERFORMANCE_BRAND,
  type OverviewPlatform,
  type OverviewThemeRow,
} from '../data/overviewData'
import { THEME_LOCATIONS, THEME_BRANDS } from '../data/themeDrawerData'

const PLATFORM_TABS: { id: OverviewPlatform; label: string }[] = [
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
  { id: 'All', label: 'All sites' },
]

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
  options: string[]
  selected: string
  onChange: (v: string) => void
}

function ScopeDropdown({ options, selected, onChange }: ScopeDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
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
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false) }}
                className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                  o === selected ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {o === selected && <Icon name="check" size={16} className="text-primary shrink-0" />}
                {o !== selected && <span className="w-[16px] shrink-0" />}
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ScoreChip({ score }: { score: number }) {
  const isPositive = score >= 50
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-sm py-xs text-small ${
        isPositive
          ? 'border-chip-success-text text-chip-success-text'
          : 'border-chip-danger-text text-chip-danger-text'
      }`}
    >
      {score}
    </span>
  )
}

interface ThemesPerformanceFlatRow extends OverviewThemeRow, Record<string, unknown> {
  _isHeader: boolean
}

function buildColumns(
  expandedIds: Set<string>,
  onToggle: (id: string) => void,
): Column<ThemesPerformanceFlatRow>[] {
  return [
    {
      key: 'theme',
      label: 'Themes',
      width: 280,
      sortable: true,
      render: (_val, row) => {
        if (row._isHeader) {
          const isExpanded = expandedIds.has(row._id)
          const hasPrompts = !!row.prompts?.length
          return (
            <div className="flex items-center gap-[8px]">
              {hasPrompts ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(row._id)
                  }}
                  className="flex items-center justify-center rounded-sm hover:bg-surface-hover"
                >
                  <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={16} className="text-text-icon" />
                </button>
              ) : (
                <span className="w-[16px] shrink-0" />
              )}
              <span className="text-[13px] text-text-primary">{row.theme}</span>
            </div>
          )
        }
        return <span className="pl-[32px] text-small text-text-tertiary italic">{row.theme}</span>
      },
    },
    {
      key: 'searchAiScore',
      label: 'Search AI score',
      width: 150,
      sortable: true,
      render: (val) => <ScoreChip score={val as number} />,
    },
    {
      key: 'visibilityScore',
      label: 'Visibility score',
      width: 140,
      sortable: true,
      render: (val) => <span className="text-[13px] text-text-primary">{val as number}%</span>,
    },
    {
      key: 'citationShare',
      label: 'Citation share',
      width: 140,
      sortable: true,
      render: (val) => <span className="text-[13px] text-text-primary">{val as number}%</span>,
    },
    {
      key: 'rank',
      label: 'Rank',
      width: 100,
      sortable: true,
      render: (val) => <span className="text-[13px] text-text-primary">{val as number}</span>,
    },
    {
      key: 'sentimentScore',
      label: 'Sentiment score',
      width: 140,
      sortable: true,
      render: (val) => <span className="text-[13px] text-text-primary">{val as number}%</span>,
    },
  ]
}

interface ThemesPerformanceCardProps {
  view: 'location' | 'brand'
  scope: string
  onScopeChange: (v: string) => void
}

function ThemesPerformanceCard({ view, scope, onScopeChange }: ThemesPerformanceCardProps) {
  const [platform, setPlatform] = useState<OverviewPlatform>('ChatGPT')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const rows = (view === 'brand' ? OVERVIEW_THEMES_PERFORMANCE_BRAND : OVERVIEW_THEMES_PERFORMANCE_LOCATIONS)[platform]

  const flatRows: ThemesPerformanceFlatRow[] = []
  for (const row of rows) {
    flatRows.push({ ...row, _isHeader: true })
    if (expandedIds.has(row._id) && row.prompts) {
      for (const p of row.prompts) {
        flatRows.push({ ...p, _isHeader: false })
      }
    }
  }

  const columns = buildColumns(expandedIds, toggleExpand)
  const scopeOptions = view === 'brand'
    ? ['All brands', ...THEME_BRANDS.map((b) => b.label)]
    : ['All locations', ...THEME_LOCATIONS.map((l) => l.label)]

  const toolbar = (
    <>
      <button type="button" className="flex items-center justify-center rounded-sm border border-border-selected bg-surface p-[8px] hover:bg-surface-hover" title="Search">
        <Icon name="search" size={20} className="text-text-icon" />
      </button>
      <button type="button" className="flex items-center justify-center rounded-sm border border-border-selected bg-surface p-[8px] hover:bg-surface-hover" title="Summarize">
        <SummarizeIcon size={16} />
      </button>
      <button type="button" className="flex items-center justify-center rounded-sm border border-border-selected bg-surface p-[8px] hover:bg-surface-hover" title="More options">
        <Icon name="more_vert" size={20} className="text-text-icon" />
      </button>
    </>
  )

  return (
    <div className="flex flex-col bg-surface rounded-md shadow-[0px_2px_12px_1px_rgba(33,33,33,0.06)] overflow-hidden">
      <div className="px-[20px] py-[16px]">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
              How are your themes & prompts performing across
              <ScopeDropdown options={scopeOptions} selected={scope} onChange={onScopeChange} />
            </span>
          }
          subtitle={`Discover themes and prompts that are appearing in answers across AI sites for your ${view === 'brand' ? 'brands' : 'locations'}.`}
          toolbar={toolbar}
        />
      </div>
      <div className="px-[24px]">
        <CardTabs tabs={PLATFORM_TABS} activeTab={platform} onChange={(id) => setPlatform(id as OverviewPlatform)} />
      </div>
      <div className="px-[24px]">
        <DataTable<ThemesPerformanceFlatRow>
          columns={columns}
          data={flatRows}
          rowHeight={56}
          rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')}
        />
      </div>
    </div>
  )
}

export function OverviewScreen() {
  const [view, setView] = useState<'location' | 'brand'>('location')
  const [locationScope, setLocationScope] = useState('All locations')
  const [brandScope, setBrandScope] = useState('All brands')

  const kpi = view === 'brand' ? OVERVIEW_KPI_BRAND : OVERVIEW_KPI_LOCATIONS

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Page header */}
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Overview
            </p>
            <InfoTooltip text="See a summary of your Search AI performance across locations or brands." />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <SegmentedControl
              options={[
                { value: 'location', label: 'By location' },
                { value: 'brand', label: 'By brand' },
              ]}
              value={view}
              onChange={(v) => setView(v as 'location' | 'brand')}
            />
            <HeaderMoreMenu />
            <button
              type="button"
              aria-label="Filter"
              className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
            >
              <Icon name="filter_list" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
          <div className="flex flex-col gap-xl px-2xl py-xl">
            <div className="flex gap-xl">
              <div className="flex-1">
                <SummaryCard
                  title="Search AI score"
                  titleTooltip="Your overall Search AI score, weighted across visibility, citation share, rank, and sentiment."
                  stats={[
                    {
                      id: 'score',
                      value: `${kpi.searchAiScore.value}%`,
                      label: 'Your score',
                      delta: `${Math.abs(kpi.searchAiScore.delta)}%`,
                      trend: kpi.searchAiScore.delta >= 0 ? 'up' : 'down',
                    },
                  ]}
                />
              </div>
              <div className="flex-[2]">
                <SummaryCard
                  title="Understanding Search AI score"
                  titleTooltip="The four components that make up your Search AI score."
                  stats={[
                    {
                      id: 'visibility',
                      value: `${kpi.visibilityScore.value}%`,
                      label: 'Visibility score',
                      delta: `${Math.abs(kpi.visibilityScore.delta)}%`,
                      trend: kpi.visibilityScore.delta >= 0 ? 'up' : 'down',
                    },
                    {
                      id: 'citation',
                      value: `${kpi.citationShare.value}%`,
                      label: 'Citation share',
                      delta: `${Math.abs(kpi.citationShare.delta)}%`,
                      trend: kpi.citationShare.delta >= 0 ? 'up' : 'down',
                    },
                    {
                      id: 'rank',
                      value: `${kpi.avgRank.value}`,
                      label: 'Avg rank',
                      delta: `${Math.abs(kpi.avgRank.delta)}`,
                      trend: kpi.avgRank.delta >= 0 ? 'up' : 'down',
                    },
                    {
                      id: 'sentiment',
                      value: `${kpi.sentimentScore.value}%`,
                      label: 'Sentiment score',
                      delta: `${Math.abs(kpi.sentimentScore.delta)}%`,
                      trend: kpi.sentimentScore.delta >= 0 ? 'up' : 'down',
                    },
                  ]}
                />
              </div>
            </div>

            <ThemesPerformanceCard
              view={view}
              scope={view === 'brand' ? brandScope : locationScope}
              onScopeChange={view === 'brand' ? setBrandScope : setLocationScope}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
