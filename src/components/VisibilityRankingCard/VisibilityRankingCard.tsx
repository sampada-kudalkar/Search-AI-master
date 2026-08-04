import { useRef, useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { Icon } from '../Icon/Icon'
import { SummarizeIcon } from '../SummarizeIcon/SummarizeIcon'
import { getInitials } from '../../utils/competitorAvatar'
import {
  PROMPT_RANKING_DATA,
  COMPETITORS,
  RANKING_PLATFORMS,
  type PromptRankingRow,
  type RankingEntry,
  type RankingPlatform,
} from '../../data/competitorData'
import { SENTIMENT_BY_LOCATION } from '../../data/sentimentReportData'
import type { Column } from '../DataTable/DataTable.types'
import { DataTable } from '../DataTable/DataTable'

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_TABS = RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))
const RANK_COUNT = 10

const LOCATION_OPTIONS = ['all locations', ...SENTIMENT_BY_LOCATION.map((l) => l.location)]

// Ranking avatar palette — blue / green / red, cycling deterministically by name
const RANK_AVATAR_COLORS = ['bg-[#DAEAFB] text-[#1C78D3]', 'bg-[#DCF1D9] text-[#52B143]', 'bg-[#FDE3E1] text-[#F65D51]']

function getRankAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff
  return RANK_AVATAR_COLORS[hash % RANK_AVATAR_COLORS.length]!
}

// ── Location dropdown (inline in title) ───────────────────────────────────────

function LocationDropdown({
  selected,
  onChange,
}: {
  selected: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-flex items-center">
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
            {LOCATION_OPTIONS.map((l) => (
              <button
                key={l}
                onClick={() => { onChange(l); setOpen(false) }}
                className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                  l === selected ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {l === selected
                  ? <Icon name="check" size={16} className="text-primary shrink-0" />
                  : <span className="w-[16px] shrink-0" />
                }
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface FlatRow extends Record<string, unknown> {
  _id: string
  _isHeader: boolean
  prompt: string
}

// Pads a ranking list out to RANK_COUNT unique entries using the wider
// competitor pool, deterministically seeded by row id so results are stable.
function padRankings(entries: RankingEntry[], seed: string): RankingEntry[] {
  if (entries.length >= RANK_COUNT) return entries.slice(0, RANK_COUNT)
  const used = new Set(entries.map((e) => e.name))
  const pool = COMPETITORS.filter((c) => !used.has(c.name))
  if (pool.length === 0) return entries
  let offset = 0
  for (let i = 0; i < seed.length; i++) offset += seed.charCodeAt(i)
  const padded = [...entries]
  let idx = offset % pool.length
  while (padded.length < RANK_COUNT && padded.length - entries.length < pool.length) {
    padded.push({ name: pool[idx % pool.length]!.name })
    idx++
  }
  return padded
}

// ── Rank avatar cell ──────────────────────────────────────────────────────────

function AvatarCell({ entry }: { entry?: RankingEntry }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  if (!entry) return <span className="text-small text-text-tertiary">—</span>

  if (entry.isYou) {
    return (
      <div className="inline-flex items-center rounded-full border border-white bg-gradient-to-b from-[#0f7195] to-[#094459] px-[8px] py-[4px]">
        <span className="text-small leading-[16px] text-white">You</span>
      </div>
    )
  }

  function show() {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ x: r.left + r.width / 2, y: r.bottom + 8 })
  }

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        className={`flex size-6 shrink-0 cursor-default items-center justify-center rounded-full ${getRankAvatarColor(entry.name)} text-[10px]`}
      >
        {getInitials(entry.name)}
      </span>
      {pos && (
        <div
          className="pointer-events-none fixed z-[120] -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#1c1c1c] px-sm py-xs text-small text-white"
          style={{ left: pos.x, top: pos.y }}
        >
          {entry.name}
        </div>
      )}
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VisibilityRankingCard() {
  const [tab, setTab] = useState<RankingPlatform>('ChatGPT')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [location, setLocation] = useState(LOCATION_OPTIONS[0]!)

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flatRows: FlatRow[] = []
  for (const theme of PROMPT_RANKING_DATA) {
    const ranks = theme.rankings[tab] ?? []
    const rankFields = Object.fromEntries(
      Array.from({ length: RANK_COUNT }, (_, i) => [`rank${i + 1}`, padRankings(ranks, theme.id)[i]]),
    )
    flatRows.push({ _id: theme.id, _isHeader: true, prompt: theme.prompt, ...rankFields })

    if (expandedIds.has(theme.id)) {
      for (const child of (theme.prompts ?? []) as PromptRankingRow[]) {
        const childRanks = child.rankings[tab] ?? []
        const childRankFields = Object.fromEntries(
          Array.from({ length: RANK_COUNT }, (_, i) => [`rank${i + 1}`, padRankings(childRanks, child.id)[i]]),
        )
        flatRows.push({ _id: child.id, _isHeader: false, prompt: child.prompt, ...childRankFields })
      }
    }
  }

  const columns: Column<FlatRow>[] = [
    {
      key: 'prompt',
      label: 'Themes and prompts',
      width: 260,
      render: (_val, row) =>
        row._isHeader ? (
          <button
            type="button"
            onClick={() => toggleExpanded(row._id)}
            className="flex items-center gap-[6px] text-[13px] text-text-primary"
          >
            <Icon
              name={expandedIds.has(row._id) ? 'expand_less' : 'expand_more'}
              size={16}
              className="shrink-0 text-text-icon"
            />
            {row.prompt}
          </button>
        ) : (
          <span className="pl-[24px] text-[13px] text-text-primary">{row.prompt}</span>
        ),
    },
    ...Array.from({ length: RANK_COUNT }, (_, i) => {
      const key = `rank${i + 1}`
      return {
        key,
        label: `Rank ${i + 1}`,
        width: 72,
        render: (_val: unknown, row: FlatRow) => <AvatarCell entry={row[key] as RankingEntry | undefined} />,
      }
    }),
  ]

  const toolbar = (
    <>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="search" size={20} />
      </button>
      <button className="relative flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface hover:bg-surface-hover">
        <SummarizeIcon size={16} />
      </button>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="more_vert" size={20} />
      </button>
    </>
  )

  return (
    <div className="flex flex-col rounded-md border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What is your sentiment ranking compared to competitors across
              <LocationDropdown selected={location} onChange={setLocation} />
              ?
            </span>
          }
          subtitle="Analyze your positive sentiment vs your competitors across all locations across AI sites."
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
          <DataTable columns={columns} data={flatRows} rowHeight={56} rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')} />
        </div>
      </div>
    </div>
  )
}
