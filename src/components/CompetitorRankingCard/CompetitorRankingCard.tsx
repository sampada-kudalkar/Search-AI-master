import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import {
  TREND_PLATFORMS,
  RANKING_PLATFORMS,
  type TrendPlatform,
  type RankingPlatform,
  type ByLocationTableRow,
  type Quadrant,
} from '../../data/competitorData'
import type { CompetitorRankingCardProps, FlatRankingRow, RankingEntry } from './CompetitorRankingCard.types'

// ── Shared rank cell (avatar + text) ─────────────────────────────────────────

function RankCell({ entry }: { entry?: RankingEntry | { name: string; isYou?: boolean } }) {
  if (!entry) return <span className="text-small text-text-tertiary">—</span>
  if (entry.isYou) {
    return (
      <div className="inline-flex items-center rounded-full bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white px-[8px] py-[4px]">
        <span className="text-small text-white leading-[16px]">You</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-[8px]">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chip-neutral-bg text-small text-text-secondary">
        {entry.name.charAt(0).toUpperCase()}
      </span>
      <span className="text-[13px] text-text-primary truncate">{entry.name}</span>
    </div>
  )
}

// ── Performance chip (locations mode only) ────────────────────────────────────

const PERFORMANCE_STYLES: Record<Quadrant, string> = {
  leading:         'text-chip-success-text',
  lagging:         'text-chip-danger-text',
  emerging:        'text-text-tertiary',
  underperforming: 'text-chip-warning-text',
}

const PERFORMANCE_LABELS: Record<Quadrant, string> = {
  leading: 'Leading',
  lagging: 'Lagging',
  emerging: 'Emerging',
  underperforming: 'Underperforming',
}

function PerformanceChip({ value }: { value: Quadrant }) {
  return (
    <span className={`text-small ${PERFORMANCE_STYLES[value]}`}>
      {PERFORMANCE_LABELS[value]}
    </span>
  )
}

// ── Themes mode columns ───────────────────────────────────────────────────────

function buildThemeColumns(
  expandedIds: Set<string>,
  onToggle: (id: string) => void,
): Column<FlatRankingRow>[] {
  return [
    {
      key: 'prompt',
      label: 'Themes and prompts',
      width: 321,
      render: (_val, row) => {
        if (row._isHeader) {
          const isExpanded = expandedIds.has(row._id as string)
          return (
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(row._id as string)
                }}
                className="flex items-center justify-center rounded-sm hover:bg-surface-hover"
              >
                <Icon
                  name={isExpanded ? 'expand_less' : 'expand_more'}
                  size={16}
                  className="text-text-icon"
                />
              </button>
              <span className="text-[13px] text-text-primary">{row.prompt as string}</span>
            </div>
          )
        }
        return (
          <span className="pl-[24px] text-small text-text-tertiary italic">
            {row.prompt as string}
          </span>
        )
      },
    },
    {
      key: 'rank1',
      label: 'Rank 1',
      width: 148,
      render: (_val, row) =>
        row._isHeader ? <RankCell entry={row.rank1 as RankingEntry | undefined} /> : null,
    },
    {
      key: 'rank2',
      label: 'Rank 2',
      width: 148,
      render: (_val, row) =>
        row._isHeader ? <RankCell entry={row.rank2 as RankingEntry | undefined} /> : null,
    },
    {
      key: 'rank3',
      label: 'Rank 3',
      width: 148,
      render: (_val, row) =>
        row._isHeader ? <RankCell entry={row.rank3 as RankingEntry | undefined} /> : null,
    },
    {
      key: 'rank4',
      label: 'Rank 4',
      width: 148,
      render: (_val, row) =>
        row._isHeader ? <RankCell entry={row.rank4 as RankingEntry | undefined} /> : null,
    },
    {
      key: 'rank5',
      label: 'Rank 5',
      width: 148,
      render: (_val, row) =>
        row._isHeader ? <RankCell entry={row.rank5 as RankingEntry | undefined} /> : null,
    },
  ]
}

// ── Locations mode columns ────────────────────────────────────────────────────

const LOCATION_COLUMNS: Column<ByLocationTableRow>[] = [
  {
    key: 'location',
    label: 'Locations',
    width: 200,
    sortable: true,
  },
  {
    key: 'performance',
    label: 'Performance',
    width: 160,
    sortable: true,
    render: (val) => <PerformanceChip value={val as Quadrant} />,
  },
  {
    key: 'rank1',
    label: 'Rank 1',
    width: 148,
    render: (val) => <RankCell entry={val as { name: string; isYou?: boolean }} />,
  },
  {
    key: 'rank2',
    label: 'Rank 2',
    width: 148,
    render: (val) => <RankCell entry={val as { name: string; isYou?: boolean }} />,
  },
  {
    key: 'rank3',
    label: 'Rank 3',
    width: 148,
    render: (val) => <RankCell entry={val as { name: string; isYou?: boolean }} />,
  },
  {
    key: 'rank4',
    label: 'Rank 4',
    width: 148,
    render: (val) => <RankCell entry={val as { name: string; isYou?: boolean }} />,
  },
  {
    key: 'rank5',
    label: 'Rank 5',
    width: 148,
    render: (val) => <RankCell entry={val as { name: string; isYou?: boolean }} />,
  },
]

// ── Shared toolbar ────────────────────────────────────────────────────────────

const TOOLBAR = (
  <>
    <button
      type="button"
      className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-hover"
      title="Search"
    >
      <Icon name="search" size={16} className="text-text-icon" />
    </button>
    <button
      type="button"
      className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-hover"
      title="Summarize"
    >
      <Icon name="auto_awesome" size={16} className="text-[#6834b7]" />
    </button>
    <button
      type="button"
      className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-hover"
      title="More options"
    >
      <Icon name="more_vert" size={16} className="text-text-icon" />
    </button>
  </>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function CompetitorRankingCard(props: CompetitorRankingCardProps) {
  const isLocations = props.mode === 'locations'

  // ── Locations mode ──
  const [activeLocationPlatform, setActiveLocationPlatform] = useState<RankingPlatform>('ChatGPT')
  const locationPlatformTabs = RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))

  if (isLocations) {
    const rows = props.data[activeLocationPlatform]
    return (
      <div className="w-full rounded-md border border-border bg-surface overflow-hidden">
        <div className="px-[20px] py-[16px]">
          <CardHeader
            title="How are you ranking vs competitors for visibility score"
            subtitle="Discover locations where your visibility has the highest impact across AI platforms"
            toolbar={TOOLBAR}
          />
        </div>
        <div className="px-[24px]">
          <CardTabs
            tabs={locationPlatformTabs}
            activeTab={activeLocationPlatform}
            onChange={(id) => setActiveLocationPlatform(id as RankingPlatform)}
          />
        </div>
        <div className="px-2xl pb-2xl">
          <DataTable<ByLocationTableRow>
            columns={LOCATION_COLUMNS}
            data={rows}
            rowHeight={56}
          />
        </div>
      </div>
    )
  }

  // ── Themes mode (default) ──
  return <ThemesCard rows={props.rows} />
}

function ThemesCard({ rows }: { rows: import('../../data/competitorData').PromptRankingRow[] }) {
  const [activePlatform, setActivePlatform] = useState<TrendPlatform>('ChatGPT')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const platformTabs = TREND_PLATFORMS.map((p) => ({ id: p, label: p }))

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flatRows: FlatRankingRow[] = []
  for (const row of rows) {
    const ranks = row.rankings[activePlatform] ?? []
    flatRows.push({
      _id: row.id,
      _isHeader: true,
      prompt: row.prompt,
      rank1: ranks[0],
      rank2: ranks[1],
      rank3: ranks[2],
      rank4: ranks[3],
      rank5: ranks[4],
    })
    if (expandedIds.has(row.id)) {
      flatRows.push({
        _id: `${row.id}-detail`,
        _isHeader: false,
        _parentId: row.id,
        prompt: 'Detailed breakdown coming soon',
      })
    }
  }

  const columns = buildThemeColumns(expandedIds, toggleExpand)

  return (
    <div className="w-full rounded-md border border-border bg-surface overflow-hidden">
      <div className="px-[20px] py-[16px]">
        <CardHeader
          title="How are you ranking compared to competitors for Visibility score"
          subtitle="Shows how often your brand appears in AI-generated answers compared to your competitors across AI sites"
          toolbar={
            <>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-hover"
                title="Summarize"
              >
                <Icon name="auto_awesome" size={16} className="text-[#6834b7]" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-hover"
                title="More options"
              >
                <Icon name="more_vert" size={16} className="text-text-icon" />
              </button>
            </>
          }
        />
      </div>
      <div className="px-[24px]">
        <CardTabs
          tabs={platformTabs}
          activeTab={activePlatform}
          onChange={(id) => setActivePlatform(id as TrendPlatform)}
        />
      </div>
      <div className="px-2xl pb-2xl">
        <DataTable<FlatRankingRow>
          columns={columns}
          data={flatRows}
          rowHeight={68}
          rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')}
        />
      </div>
    </div>
  )
}
