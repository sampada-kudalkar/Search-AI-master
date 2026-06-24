import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { CompetitorMetricsCardProps } from './CompetitorMetricsCard.types'
import { PLATFORMS, Platform, CompetitorRowData } from '../../data/competitorData'

const PLATFORM_TABS = PLATFORMS.map((p) => ({ id: p, label: p }))

function buildColumns(activeTab: Platform): Column<CompetitorRowData>[] {
  return [
    {
      key: 'name',
      label: 'Competitors',
      width: 260,
      render: (_val, row) =>
        row.isYou ? (
          <div className="inline-flex items-center rounded-full bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white px-[8px] py-[4px]">
            <span className="text-small text-white leading-[16px]">You</span>
          </div>
        ) : (
          <span className="text-body text-text-primary truncate">{row.name}</span>
        ),
    },
    {
      key: 'metrics',
      label: 'Visibility score',
      sortable: true,
      render: (_val, row) => {
        const m = row.metrics[activeTab]
        if (!m) return <span className="text-small text-text-tertiary">—</span>
        const sign = m.visibilityDelta >= 0 ? '+' : ''
        const deltaColor = m.visibilityDelta >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
        return (
          <div className="flex items-center gap-[8px]">
            <span className="text-[13px] text-text-primary">{m.visibilityScore.toFixed(1)}%</span>
            <span className={`text-[13px] ${deltaColor}`}>{sign}{Math.abs(m.visibilityDelta).toFixed(1)}%</span>
          </div>
        )
      },
    },
    {
      key: 'metrics',
      label: 'Citation share',
      sortable: true,
      render: (_val, row) => {
        const m = row.metrics[activeTab]
        if (!m) return <span className="text-small text-text-tertiary">—</span>
        const sign = m.citationDelta >= 0 ? '+' : ''
        const deltaColor = m.citationDelta >= 0 ? 'text-[#377e2c]' : 'text-[#c0392b]'
        return (
          <div className="flex items-center gap-[8px]">
            <span className="text-[13px] text-text-primary">{m.citationShare.toFixed(1)}%</span>
            <span className={`text-[13px] ${deltaColor}`}>{sign}{Math.abs(m.citationDelta).toFixed(1)}%</span>
          </div>
        )
      },
    },
    {
      key: 'metrics',
      label: 'Avg rank',
      sortable: true,
      render: (_val, row) => {
        const m = row.metrics[activeTab]
        if (!m) return <span className="text-small text-text-tertiary">—</span>
        return <span className="text-[13px] text-text-primary">{m.avgRank}</span>
      },
    },
  ]
}

export function CompetitorMetricsCard({ rows, onRowClick }: CompetitorMetricsCardProps) {
  const [activeTab, setActiveTab] = useState<Platform>('ChatGPT')
  const columns = buildColumns(activeTab)

  return (
    <div className="w-full rounded-md border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="px-[20px] py-[16px]">
        <CardHeader
          title="How are your key Search AI metrics compared to competitors"
          subtitle="Track how your Search AI metrics like visibility, citation share and ranking changes against competitors"
          toolbar={
            <>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-l2"
                title="Summarize"
              >
                <Icon name="auto_awesome" size={16} className="text-[#6834b7]" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-l2"
                title="More options"
              >
                <Icon name="more_vert" size={16} className="text-text-icon" />
              </button>
            </>
          }
        />
      </div>

      {/* Tabs */}
      <div className="px-[18px]">
        <CardTabs
          tabs={PLATFORM_TABS}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as Platform)}
        />
      </div>

      {/* Table */}
      <div className="px-2xl pb-2xl">
        <DataTable<CompetitorRowData>
          columns={columns}
          data={rows}
          rowHeight={68}
          rowAction={{
            icon: 'arrow_forward',
            label: 'View details',
            onClick: (row) => onRowClick?.(row),
            visible: (row) => !row.isYou,
          }}
        />
      </div>
    </div>
  )
}
