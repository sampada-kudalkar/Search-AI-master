import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { ChartTooltip } from '../charts/ChartTooltip'
import { DataTable } from '../DataTable/DataTable'
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import {
  SHARE_OF_VOICE_DATA,
  SOV_PLATFORMS,
  type ShareOfVoicePlatform,
  type SovRow,
} from '../../data/competitorData'
import type { Column } from '../DataTable/DataTable.types'

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_TABS = SOV_PLATFORMS.map((p) => ({ id: p, label: p }))

// ── Custom pie label (rank number inside slice) ───────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieSliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) {
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontFamily="Roboto, sans-serif"
    >
      {index + 1}
    </text>
  )
}

// ── Delta cell ────────────────────────────────────────────────────────────────

function DeltaCell({ value, delta }: { value: string | number; delta: number }) {
  return (
    <span className="flex items-center gap-[8px] text-[13px] text-text-primary">
      {value}
      <span className="text-chip-success-text">{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface ShareOfVoiceCardProps {
  selectedCompetitor?: { name: string }
}

export function ShareOfVoiceCard({ selectedCompetitor }: ShareOfVoiceCardProps) {
  const [tab, setTab] = useState<ShareOfVoicePlatform>('ChatGPT')

  const allRows = SHARE_OF_VOICE_DATA[tab]
  const rows = selectedCompetitor
    ? allRows.filter((r) => r.isYou || r.name === selectedCompetitor.name)
    : allRows

  // ── Table columns — first col ~40%, remaining cols fill equally ────────────
  // With tableLayout:fixed + width:100%, pixel ratios determine % distribution.
  // 400 : 250 : 250 : 100 ≈ 40% : 25% : 25% : 10%

  const columns: Column<SovRow>[] = [
    {
      key: 'name',
      label: (
        <span className="flex items-center gap-[4px]">
          Competitors
          <InfoTooltip text="Brands being tracked and compared against your own in AI-generated responses" />
        </span>
      ),
      width: 400,
      render: (_val, row) => (
        <span className="flex items-center gap-[8px]">
          <span className="text-[12px] text-text-primary truncate">{row.name}</span>
          {row.isYou && (
            <span className="shrink-0 px-[8px] py-[2px] rounded-full text-small text-white bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white">
              You
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'rank',
      label: (
        <span className="flex items-center gap-[4px]">
          Rank
          <InfoTooltip text="Position of each brand in AI-generated responses, where rank 1 means most frequently mentioned" />
        </span>
      ),
      width: 250,
      render: (_val, row) => <DeltaCell value={row.rank} delta={row.rankDelta} />,
    },
    {
      key: 'sov',
      label: (
        <span className="flex items-center gap-[4px]">
          Share of voice
          <InfoTooltip text="Your brand's share of all brand mentions across responses that mention any brand" />
        </span>
      ),
      width: 250,
      render: (_val, row) => <DeltaCell value={`${row.sov}%`} delta={row.sovDelta} />,
    },
  ]

  // ── Toolbar ────────────────────────────────────────────────────────────────

  const toolbar = (
    <>
      <button className="flex h-[36px] items-center gap-[8px] rounded-sm border border-border-selected bg-surface pl-[12px] pr-[8px] py-[8px] text-[14px] leading-[20px] text-text-secondary hover:bg-surface-hover">
        <Icon name="pie_chart" size={20} className="text-text-icon" />
        <Icon name="expand_more" size={20} className="text-text-icon" />
      </button>
      <button className="relative flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface hover:bg-surface-hover">
        <AiIcon size={16} />
      </button>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="more_vert" size={20} />
      </button>
    </>
  )

  return (
    <div className="flex flex-col bg-surface rounded-md border border-border overflow-hidden">
      {/* Header */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="text-[18px] leading-[26px] text-text-secondary">
              What is your share of voice compared to your competitors
            </span>
          }
          subtitle="Track your mentions in AI-generated answers in relation to competitors"
          toolbar={toolbar}
        />
      </div>

      {/* Tabs + chart + table — 24px horizontal inset */}
      <div className="px-[24px]">
        <CardTabs
          tabs={PLATFORM_TABS}
          activeTab={tab}
          onChange={(id) => setTab(id as ShareOfVoicePlatform)}
        />

        {/* Donut chart + legend */}
        <div className="flex flex-col items-center gap-[12px] pt-lg pb-sm">
          <div className="w-full" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rows}
                  dataKey="sov"
                  nameKey="name"
                  innerRadius="42%"
                  outerRadius="80%"
                  paddingAngle={1}
                  stroke="none"
                  isAnimationActive={false}
                  labelLine={false}
                  label={PieSliceLabel}
                >
                  {rows.map((row) => (
                    <Cell key={row.name} fill={row.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const entry = payload[0]
                    const d = entry.payload as SovRow
                    return (
                      <ChartTooltip
                        label={d.name}
                        items={[{ color: d.color, label: 'Share of voice', value: d.sov }]}
                        accentColor={d.color}
                      />
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-lg gap-y-xs">
            {rows.map((row) => (
              <span key={row.name} className="flex items-center gap-[4px]">
                <span
                  className="shrink-0 size-[12px] rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-[12px] leading-[18px] text-text-secondary whitespace-nowrap">
                  {row.name}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border-t border-border">
          <DataTable columns={columns} data={rows} />
        </div>
      </div>
    </div>
  )
}
