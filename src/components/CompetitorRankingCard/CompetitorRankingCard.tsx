import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { TREND_PLATFORMS, type TrendPlatform } from '../../data/competitorData'
import type { CompetitorRankingCardProps, FlatRankingRow, RankingEntry } from './CompetitorRankingCard.types'

const PLATFORM_TABS = TREND_PLATFORMS.map((p) => ({ id: p, label: p }))

function RankCell({ entry }: { entry?: RankingEntry }) {
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

function buildColumns(
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

export function CompetitorRankingCard({ rows }: CompetitorRankingCardProps) {
  const [activePlatform, setActivePlatform] = useState<TrendPlatform>('ChatGPT')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
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

  const columns = buildColumns(expandedIds, toggleExpand)

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

      <CardTabs
        tabs={PLATFORM_TABS}
        activeTab={activePlatform}
        onChange={(id) => setActivePlatform(id as TrendPlatform)}
      />

      <div className="px-2xl pb-2xl">
        <DataTable<FlatRankingRow>
          columns={columns}
          data={flatRows}
          rowHeight={68}
          rowClassName={(row) =>
            row._isHeader ? '' : 'bg-surface-hover'
          }
        />
      </div>
    </div>
  )
}
