import { useState, useEffect, useRef } from 'react'
import { PromptDetailModal } from '../PromptDetailModal/PromptDetailModal'
import { getInitials, getCompetitorColor } from '../../utils/competitorAvatar'

function ArrowDiagonalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="crc-arrow-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="29" height="29">
        <rect y="14.1426" width="20" height="20" transform="rotate(-45 0 14.1426)" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#crc-arrow-mask)">
        <path d="M17.3016 11.8668L10.6067 18.5617C10.4813 18.6871 10.334 18.7498 10.1648 18.7498C9.99557 18.7498 9.84825 18.6871 9.72285 18.5617C9.59744 18.4363 9.53475 18.289 9.53476 18.1198C9.53476 17.9506 9.59746 17.8033 9.72286 17.6778L16.4177 10.983L12.5376 10.983C12.3624 10.983 12.2166 10.9237 12.1003 10.8051C11.9839 10.6865 11.9227 10.5388 11.9167 10.362C11.9167 10.1792 11.9745 10.027 12.0901 9.90536C12.2056 9.78373 12.3548 9.72291 12.5376 9.72292L17.816 9.72293C17.9263 9.72293 18.0234 9.74219 18.1072 9.78072C18.1911 9.81923 18.2685 9.874 18.3395 9.94502C18.4106 10.016 18.4653 10.0935 18.5038 10.1773C18.5424 10.2612 18.5616 10.3583 18.5616 10.4685L18.5616 15.7469C18.5616 15.9222 18.5008 16.0695 18.3792 16.1888C18.2576 16.3082 18.1054 16.3679 17.9225 16.3679C17.7458 16.3618 17.5981 16.3025 17.4795 16.19C17.3609 16.0774 17.3016 15.9297 17.3016 15.7469L17.3016 11.8668Z" fill="#303030"/>
      </g>
    </svg>
  )
}
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import {
  RANKING_PLATFORMS,
  type RankingPlatform,
  type ByLocationTableRow,
  type PromptRankingRow,
} from '../../data/competitorData'

type Metric = 'Visibility score' | 'Citation share' | 'Rank'
const METRICS: Metric[] = ['Visibility score', 'Citation share', 'Rank']
import type { CompetitorRankingCardProps, FlatRankingRow, RankingEntry } from './CompetitorRankingCard.types'

// ── Shared rank cell (avatar + text) ─────────────────────────────────────────

function RankCell({ entry, avatarOnly = false }: { entry?: RankingEntry | { name: string; isYou?: boolean }; avatarOnly?: boolean }) {
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
      <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${getCompetitorColor(entry.name)} text-[10px] font-medium text-white`}>
        {getInitials(entry.name)}
      </span>
      {!avatarOnly && <span className="text-[13px] text-text-primary truncate">{entry.name}</span>}
    </div>
  )
}

// ── Themes mode columns ───────────────────────────────────────────────────────

function buildThemeColumns(
  expandedIds: Set<string>,
  onToggle: (id: string) => void,
  onPromptClick: (row: FlatRankingRow) => void,
  rankCount: number,
  avatarOnly: boolean,
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
          <button
            type="button"
            onClick={() => onPromptClick(row)}
            className="pl-[24px] text-[13px] text-text-primary hover:text-[#1976D2] text-left w-full"
          >
            {row.prompt as string}
          </button>
        )
      },
    },
    ...Array.from({ length: rankCount }, (_, i) => {
      const key = `rank${i + 1}`
      return {
        key,
        label: `Rank ${i + 1}`,
        width: 148,
        render: (_val: unknown, row: FlatRankingRow) => (
          <RankCell entry={row[key] as RankingEntry | undefined} avatarOnly={avatarOnly} />
        ),
      }
    }),
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
      <AiIcon size={16} />
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

  const [locMetric, setLocMetric] = useState<Metric>('Visibility score')
  const [locMetricOpen, setLocMetricOpen] = useState(false)
  const locMetricRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!locMetricOpen) return
    function handleOutside(e: MouseEvent) {
      if (locMetricRef.current && !locMetricRef.current.contains(e.target as Node)) {
        setLocMetricOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [locMetricOpen])

  if (isLocations) {
    const rows = props.data[activeLocationPlatform]
    const onLocationRowClick = props.mode === 'locations' ? props.onLocationRowClick : undefined
    return (
      <div className="w-full rounded-md border border-border bg-surface overflow-hidden">
        <div className="px-[20px] py-[16px]">
          <CardHeader
            title={
              <span className="flex flex-wrap items-center gap-xs leading-[24px]">
                How are your locations ranking vs competitors for{' '}
                <span ref={locMetricRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setLocMetricOpen((v) => !v)}
                    className="flex items-center gap-[2px] text-[#1976D2]"
                  >
                    {locMetric}
                    <Icon name="expand_more" size={16} />
                  </button>
                  {locMetricOpen && (
                    <div className="absolute left-0 top-full z-50 mt-xs min-w-[160px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
                      {METRICS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => { setLocMetric(m); setLocMetricOpen(false) }}
                          className={`block w-full px-md py-sm text-left text-body hover:bg-surface-hover ${m === locMetric ? 'text-primary' : 'text-text-primary'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              </span>
            }
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
            onRowClick={onLocationRowClick}
            rowAction={onLocationRowClick ? {
              iconElement: <ArrowDiagonalIcon />,
              label: 'View comparison',
              onClick: (row) => onLocationRowClick(row),
            } : undefined}
          />
        </div>
      </div>
    )
  }

  // ── Themes mode (default) ──
  return (
    <ThemesCard
      rows={props.rows}
      rankCount={props.rankCount}
      avatarOnly={props.avatarOnly}
      title={props.title}
      subtitle={props.subtitle}
      platformTabsProp={props.platformTabs}
      activePlatformProp={props.activePlatform}
      onPlatformChangeProp={props.onPlatformChange}
    />
  )
}

function ThemesCard({
  rows,
  rankCount = 5,
  avatarOnly = false,
  title,
  subtitle,
  platformTabsProp,
  activePlatformProp,
  onPlatformChangeProp,
}: {
  rows: import('../../data/competitorData').PromptRankingRow[]
  rankCount?: number
  avatarOnly?: boolean
  title?: import('react').ReactNode
  subtitle?: string
  platformTabsProp?: { id: string; label: string }[]
  activePlatformProp?: string
  onPlatformChangeProp?: (id: string) => void
}) {
  const [internalPlatform, setInternalPlatform] = useState<RankingPlatform>('ChatGPT')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [metric, setMetric] = useState<Metric>('Visibility score')
  const [selectedPrompt, setSelectedPrompt] = useState<FlatRankingRow | null>(null)
  const [metricOpen, setMetricOpen] = useState(false)
  const metricRef = useRef<HTMLSpanElement>(null)

  const isControlled = platformTabsProp != null && activePlatformProp != null && onPlatformChangeProp != null
  const platformTabs = platformTabsProp ?? RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))
  const activePlatform = isControlled ? (activePlatformProp as string) : internalPlatform
  const setActivePlatform: (id: string) => void = isControlled
    ? (onPlatformChangeProp as (id: string) => void)
    : (id) => setInternalPlatform(id as RankingPlatform)

  useEffect(() => {
    if (!metricOpen) return
    function handleOutside(e: MouseEvent) {
      if (metricRef.current && !metricRef.current.contains(e.target as Node)) {
        setMetricOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [metricOpen])

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
    const ranks = row.rankings[activePlatform as RankingPlatform] ?? []
    const rankFields = Object.fromEntries(
      Array.from({ length: rankCount }, (_, i) => [`rank${i + 1}`, ranks[i]])
    )
    flatRows.push({
      _id: row.id,
      _isHeader: true,
      prompt: row.prompt,
      ...rankFields,
    })
    if (expandedIds.has(row.id)) {
      const childPrompts = (row.prompts as PromptRankingRow[] | undefined) ?? []
      for (const child of childPrompts) {
        const childRanks = (child.rankings as Record<string, RankingEntry[]>)[activePlatform] ?? []
        const childRankFields = Object.fromEntries(
          Array.from({ length: rankCount }, (_, i) => [`rank${i + 1}`, childRanks[i]])
        )
        flatRows.push({
          _id: `${row.id}-${child.id as string}`,
          _isHeader: false,
          _parentId: row.id,
          prompt: child.prompt as string,
          ...childRankFields,
          date: child.date as string | undefined,
          location: child.location as string | undefined,
          aiResponse: child.aiResponse as FlatRankingRow['aiResponse'],
        })
      }
    }
  }

  const columns = buildThemeColumns(expandedIds, toggleExpand, setSelectedPrompt, rankCount, avatarOnly)

  return (
    <div className="w-full rounded-md border border-border bg-surface overflow-hidden">
      <div className="px-[20px] py-[16px]">
        <CardHeader
          title={
            title ?? (
              <span className="flex flex-wrap items-center gap-xs leading-[24px]">
                How are you ranking vs competitors for{' '}
                <span ref={metricRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMetricOpen((v) => !v)}
                    className="flex items-center gap-[2px] text-[#1976D2]"
                  >
                    {metric}
                    <Icon name="expand_more" size={16} />
                  </button>
                  {metricOpen && (
                    <div className="absolute left-0 top-full z-50 mt-xs min-w-[160px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
                      {METRICS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => { setMetric(m); setMetricOpen(false) }}
                          className={`block w-full px-md py-sm text-left text-body hover:bg-surface-hover ${m === metric ? 'text-primary' : 'text-text-primary'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              </span>
            )
          }
          subtitle={subtitle ?? 'Shows how often your brand appears in answers generated by AI sites compared to your competitors'}
          toolbar={
            <>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-hover"
                title="Summarize"
              >
                <AiIcon size={16} />
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
          onChange={(id) => setActivePlatform(id)}
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
      <PromptDetailModal
        open={selectedPrompt !== null}
        prompt={selectedPrompt}
        platform={activePlatform as RankingPlatform}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  )
}
