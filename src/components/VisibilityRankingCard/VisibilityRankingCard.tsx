import { useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { Icon } from '../Icon/Icon'
import {
  LOCATION_RANKING_DATA,
  RANKING_PLATFORMS,
  type LocationRankingRow,
  type RankingCompetitor,
  type RankingPlatform,
} from '../../data/competitorData'
import type { Column } from '../DataTable/DataTable.types'
import { DataTable } from '../DataTable/DataTable'

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_TABS = RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))

// ── Competitor name chip ──────────────────────────────────────────────────────

function CompetitorChip({ competitor }: { competitor: RankingCompetitor }) {
  if (competitor.isYou) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#0f7195] px-[8px] py-[3px] text-[12px] leading-[16px] text-white whitespace-nowrap">
        {competitor.name}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-sm bg-[#eaeaea] px-[8px] py-[3px] text-[12px] leading-[16px] text-[#555] whitespace-nowrap">
      {competitor.name}
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VisibilityRankingCard() {
  const [tab, setTab] = useState<RankingPlatform>('ChatGPT')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Townsville']))

  const rows = LOCATION_RANKING_DATA[tab]

  function toggleExpanded(location: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(location)) {
        next.delete(location)
      } else {
        next.add(location)
      }
      return next
    })
  }

  const columns: Column<LocationRankingRow>[] = [
    {
      key: 'location',
      label: 'Locations',
      width: 260,
      render: (_val, row) => (
        <button
          onClick={() => toggleExpanded(row.location)}
          className="flex items-center gap-[6px] text-[13px] text-text-primary"
        >
          <Icon
            name={expanded.has(row.location) ? 'expand_less' : 'expand_more'}
            size={16}
            className="shrink-0 text-text-icon"
          />
          {row.location}
        </button>
      ),
    },
    {
      key: 'rank1',
      label: 'Rank 1',
      width: 180,
      render: (_val, row) =>
        expanded.has(row.location) ? <CompetitorChip competitor={row.rank1} /> : null,
    },
    {
      key: 'rank2',
      label: 'Rank 2',
      width: 180,
      render: (_val, row) =>
        expanded.has(row.location) ? <CompetitorChip competitor={row.rank2} /> : null,
    },
    {
      key: 'rank3',
      label: 'Rank 3',
      width: 180,
      render: (_val, row) =>
        expanded.has(row.location) ? <CompetitorChip competitor={row.rank3} /> : null,
    },
    {
      key: 'rank4',
      label: 'Rank 4',
      width: 180,
      render: (_val, row) =>
        expanded.has(row.location) ? <CompetitorChip competitor={row.rank4} /> : null,
    },
    {
      key: 'rank5',
      label: 'Rank 5',
      width: 180,
      render: (_val, row) =>
        expanded.has(row.location) ? <CompetitorChip competitor={row.rank5} /> : null,
    },
  ]

  const toolbar = (
    <>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="search" size={20} />
      </button>
      <button className="relative flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface hover:bg-surface-hover">
        <Icon name="auto_awesome" size={16} className="text-[#6834b7]" />
      </button>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="more_vert" size={20} />
      </button>
    </>
  )

  return (
    <div className="flex flex-col bg-surface rounded-md shadow-[0px_2px_12px_1px_rgba(33,33,33,0.06)] overflow-hidden">
      {/* Header */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="text-[18px] leading-[26px] text-text-secondary">
              How is your visibility ranking against your competitors
            </span>
          }
          subtitle="Understand how your brand compares to competitors by theme and ranking position across AI platforms"
          toolbar={toolbar}
        />
      </div>

      {/* Tabs + table — 24px horizontal inset */}
      <div className="px-[24px]">
        <CardTabs
          tabs={PLATFORM_TABS}
          activeTab={tab}
          onChange={(id) => setTab(id as RankingPlatform)}
        />

        <div className="border-t border-border pb-xl">
          <DataTable columns={columns} data={rows} rowHeight={56} />
        </div>
      </div>
    </div>
  )
}
