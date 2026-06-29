import { useState } from 'react'

function ArrowDiagonalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.7234 5.06704L4.02859 11.7619C3.90319 11.8873 3.75588 11.95 3.58666 11.95C3.41744 11.95 3.27013 11.8873 3.14472 11.7619C3.01932 11.6365 2.95662 11.4892 2.95663 11.32C2.95663 11.1508 3.01933 11.0034 3.14474 10.878L9.8396 4.18318L5.95952 4.18318C5.78426 4.18318 5.63846 4.12388 5.52213 4.00527C5.40579 3.88668 5.3446 3.73899 5.33855 3.56221C5.33856 3.3794 5.39635 3.22718 5.51193 3.10555C5.62751 2.98392 5.77671 2.92311 5.95952 2.92312L11.2379 2.92312C11.3482 2.92312 11.4453 2.94238 11.5291 2.98091C11.613 3.01943 11.6904 3.0742 11.7614 3.14521C11.8324 3.21623 11.8872 3.29366 11.9257 3.37751C11.9643 3.46137 11.9835 3.55845 11.9835 3.66874L11.9835 8.94711C11.9835 9.12236 11.9227 9.26967 11.8011 9.38904C11.6795 9.50839 11.5272 9.56807 11.3444 9.56808C11.1676 9.56203 11.02 9.50273 10.9013 9.39017C10.7827 9.2776 10.7234 9.12992 10.7234 8.94711L10.7234 5.06704Z" fill="currentColor"/>
    </svg>
  )
}
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { CompetitorMetricsCardProps } from './CompetitorMetricsCard.types'
import { PLATFORMS, Platform, CompetitorRowData } from '../../data/competitorData'

const PLATFORM_TABS = PLATFORMS.map((p) => ({ id: p, label: p }))

const VISIBILITY_TOOLTIP = {
  brand: 'See how frequently you are mentioned in AI-generated answers compared to competitors',
  location: 'See how frequently your location is mentioned in AI-generated answers compared to competitors',
}
const CITATION_SHARE_TOOLTIP = 'See the percentage of all citations that come from your website. This helps you analyse how often your content is being used as a source in AI generated answers'
const AVG_RANK_TOOLTIP = {
  brand: 'See the average rank of your brand in AI-generated answers. For example, if your brand is usually listed first, average position will be close to one. A lower average position means your brand is more likely mentioned at the top.',
  location: 'See the average rank of your location in AI-generated answers. For example, if your brand is usually listed first, average position will be close to one. A lower average position means your brand is more likely mentioned at the top.',
}

function ColHeader({ text, tooltip }: { text: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-xs">
      <span>{text}</span>
      <InfoTooltip text={tooltip} />
    </div>
  )
}

function buildColumns(activeTab: Platform, selectedCompetitor?: import('../../data/competitorData').CompetitorRowData, pageContext: 'brand' | 'location' = 'brand'): Column<CompetitorRowData>[] {
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
              <span className="text-body text-text-primary group-hover/row:text-text-action truncate">{row.name}</span>
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
      label: <ColHeader text="Visibility score" tooltip={VISIBILITY_TOOLTIP[pageContext]} />,
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
      label: <ColHeader text="Citation share" tooltip={CITATION_SHARE_TOOLTIP} />,
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
      label: <ColHeader text="Avg rank" tooltip={AVG_RANK_TOOLTIP[pageContext]} />,
      sortable: true,
      render: (_val, row) => {
        const m = row.metrics[activeTab]
        if (!m) return <span className="text-small text-text-tertiary">—</span>
        return <span className="text-[13px] text-text-primary">{m.avgRank}</span>
      },
    },
  ]
}

export function CompetitorMetricsCard({ rows, onRowClick, selectedCompetitor, pageContext = 'brand' }: CompetitorMetricsCardProps) {
  const [activeTab, setActiveTab] = useState<Platform>('ChatGPT')
  const columns = buildColumns(activeTab, selectedCompetitor, pageContext)

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
          onRowClick={(row) => { if (!row.isYou) onRowClick?.(row) }}
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
