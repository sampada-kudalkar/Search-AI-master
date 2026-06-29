import { useState } from 'react'

function ArrowDiagonalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="cmc-arrow-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="29" height="29">
        <rect y="14.1426" width="20" height="20" transform="rotate(-45 0 14.1426)" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#cmc-arrow-mask)">
        <path d="M17.3016 11.8668L10.6067 18.5617C10.4813 18.6871 10.334 18.7498 10.1648 18.7498C9.99557 18.7498 9.84825 18.6871 9.72285 18.5617C9.59744 18.4363 9.53475 18.289 9.53476 18.1198C9.53476 17.9506 9.59746 17.8033 9.72286 17.6778L16.4177 10.983L12.5376 10.983C12.3624 10.983 12.2166 10.9237 12.1003 10.8051C11.9839 10.6865 11.9227 10.5388 11.9167 10.362C11.9167 10.1792 11.9745 10.027 12.0901 9.90536C12.2056 9.78373 12.3548 9.72291 12.5376 9.72292L17.816 9.72293C17.9263 9.72293 18.0234 9.74219 18.1072 9.78072C18.1911 9.81923 18.2685 9.874 18.3395 9.94502C18.4106 10.016 18.4653 10.0935 18.5038 10.1773C18.5424 10.2612 18.5616 10.3583 18.5616 10.4685L18.5616 15.7469C18.5616 15.9222 18.5008 16.0695 18.3792 16.1888C18.2576 16.3082 18.1054 16.3679 17.9225 16.3679C17.7458 16.3618 17.5981 16.3025 17.4795 16.19C17.3609 16.0774 17.3016 15.9297 17.3016 15.7469L17.3016 11.8668Z" fill="#303030"/>
      </g>
    </svg>
  )
}
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { CompetitorMetricsCardProps } from './CompetitorMetricsCard.types'
import { PLATFORMS, Platform, CompetitorRowData } from '../../data/competitorData'

const PLATFORM_TABS = PLATFORMS.map((p) => ({ id: p, label: p }))

function buildColumns(activeTab: Platform, selectedCompetitor?: import('../../data/competitorData').CompetitorRowData): Column<CompetitorRowData>[] {
  return [
    {
      key: 'name',
      label: 'Competitors',
      width: 260,
      render: (_val, row) => (
        <div className="flex items-center gap-sm">
          {row.isYou ? (
            <span className="shrink-0 px-[8px] py-[2px] rounded-full text-small text-white bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white">
              You
            </span>
          ) : (
            <>
              <span className="text-body text-text-primary truncate">{row.name}</span>
              {selectedCompetitor?.name === row.name && (
                <span className="shrink-0 px-[8px] py-[4px] rounded-[4px] text-small text-[#555] bg-[#eaeaea]">
                  Selected
                </span>
              )}
            </>
          )}
        </div>
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

export function CompetitorMetricsCard({ rows, onRowClick, selectedCompetitor }: CompetitorMetricsCardProps) {
  const [activeTab, setActiveTab] = useState<Platform>('ChatGPT')
  const columns = buildColumns(activeTab, selectedCompetitor)

  return (
    <div className="w-full rounded-md border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="px-[20px] py-[16px]">
        <CardHeader
          title="How are your Search AI metrics performing compared to competitors"
          subtitle="Track how your Search AI metrics like visibility, citation share and rank against competitors"
          toolbar={
            <>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-l2"
                title="Summarize"
              >
                <AiIcon size={16} />
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
          rowHeight={56}
          rowAction={{
            iconElement: <ArrowDiagonalIcon />,
            label: 'View comparison',
            onClick: (row) => onRowClick?.(row),
            visible: (row) => !row.isYou,
          }}
        />
      </div>
    </div>
  )
}
