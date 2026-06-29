import { useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { TrendLineChart } from '../charts/TrendLineChart'
import { DataTable } from '../DataTable/DataTable'
import { DateRangeSelector } from '../DateRangeSelector/DateRangeSelector'
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import {
  TREND_DATA,
  TREND_SERIES_COLORS,
  type TrendPlatform,
  type CompetitorRowData,
} from '../../data/competitorData'
import type { Column } from '../DataTable/DataTable.types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AveragePositionCardProps {
  rows?: CompetitorRowData[]
  selectedCompetitor?: CompetitorRowData
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PLATFORM_TABS: { id: TrendPlatform; label: string }[] = [
  { id: 'ChatGPT',    label: 'ChatGPT' },
  { id: 'Gemini',     label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
  { id: 'Grok',       label: 'All sites' },
]

const SERIES_KEYS = ['you', 'comp1', 'comp2', 'comp3', 'comp4', 'comp5'] as const

const COMPETITOR_NAMES = [
  'My Family Dental',
  'Bowen Dental',
  'Deeragun Dental',
  'Innisfail Dentists',
  'Serenity Dental CQ',
  'Absolutely Dental @ Kirwan Plaza',
]

const TREND_SERIES = SERIES_KEYS.map((key, i) => ({
  key,
  label: COMPETITOR_NAMES[i] ?? key,
  color: TREND_SERIES_COLORS[key] ?? '#888',
}))

// Mock average position table data per platform — rank values 0–5
interface AvgPositionRow extends Record<string, unknown> {
  name: string
  isYou?: boolean
  avgPosition: number
}

const TABLE_DATA: Record<TrendPlatform, AvgPositionRow[]> = {
  ChatGPT: [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.2 },
    { name: 'Bowen Dental',                              avgPosition: 2.4 },
    { name: 'Deeragun Dental',                           avgPosition: 3.1 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.7 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.2 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.8 },
  ],
  Gemini: [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.4 },
    { name: 'Bowen Dental',                              avgPosition: 2.1 },
    { name: 'Deeragun Dental',                           avgPosition: 3.3 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.9 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.4 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.7 },
  ],
  Perplexity: [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.1 },
    { name: 'Bowen Dental',                              avgPosition: 2.6 },
    { name: 'Deeragun Dental',                           avgPosition: 2.9 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.5 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.1 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.6 },
  ],
  'Google AI mode': [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.3 },
    { name: 'Bowen Dental',                              avgPosition: 2.2 },
    { name: 'Deeragun Dental',                           avgPosition: 3.0 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.8 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.3 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.9 },
  ],
  'Google AI Overviews': [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.5 },
    { name: 'Bowen Dental',                              avgPosition: 2.3 },
    { name: 'Deeragun Dental',                           avgPosition: 3.2 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.6 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.0 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.5 },
  ],
  Grok: [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.2 },
    { name: 'Bowen Dental',                              avgPosition: 2.5 },
    { name: 'Deeragun Dental',                           avgPosition: 3.1 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.7 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.2 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.8 },
  ],
  Claude: [
    { name: 'My Family Dental',               isYou: true, avgPosition: 1.3 },
    { name: 'Bowen Dental',                              avgPosition: 2.4 },
    { name: 'Deeragun Dental',                           avgPosition: 3.0 },
    { name: 'Innisfail Dentists',                        avgPosition: 3.8 },
    { name: 'Serenity Dental CQ',                        avgPosition: 4.1 },
    { name: 'Absolutely Dental @ Kirwan Plaza',          avgPosition: 4.7 },
  ],
}

// ── Table columns ──────────────────────────────────────────────────────────────

const AVG_RANK_TOOLTIP = 'See the average rank of your brand in AI-generated answers. For example, if your brand is usually listed first, average position will be close to one. A lower average position means your brand is more likely mentioned at the top.'

function buildTableColumns(_selectedCompetitor?: CompetitorRowData): Column<AvgPositionRow>[] {
  return [
    {
      key: 'name',
      label: 'Competitors',
      width: 200,
      render: (_: unknown, row: AvgPositionRow) => (
        <div className="flex items-center gap-sm">
          <span className="text-body text-text-primary">{row.name}</span>
          {row.isYou && (
            <span className="shrink-0 px-[8px] py-[2px] rounded-full text-small text-white bg-gradient-to-b from-[#0f7195] to-[#094459] border border-white">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'avgPosition',
      label: (
        <div className="flex items-center gap-xs">
          <span>Avg rank</span>
          <InfoTooltip text={AVG_RANK_TOOLTIP} />
        </div>
      ),
      width: 200,
      sortable: true,
      render: (_: unknown, row: AvgPositionRow) => (
        <span className="text-body text-text-primary">
          {row.avgPosition.toFixed(1)}
        </span>
      ),
    },
  ]
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AveragePositionCard({ rows: _rows, selectedCompetitor }: AveragePositionCardProps) {
  const [platform, setPlatform] = useState<TrendPlatform>('ChatGPT')
  const [dateRange, setDateRange] = useState('Last 12 months')

  const trendData = TREND_DATA[platform]
  const allTableData = TABLE_DATA[platform] ?? TABLE_DATA['ChatGPT']
  const tableData = selectedCompetitor
    ? allTableData.filter((r) => r.isYou || r.name === selectedCompetitor.name)
    : allTableData
  const tableColumns = buildTableColumns(selectedCompetitor)
  const activeSeries = selectedCompetitor
    ? TREND_SERIES.filter((s) => s.key === 'you' || s.label === selectedCompetitor.name)
    : TREND_SERIES

  return (
    <div className="flex flex-col bg-surface rounded-md border border-border">
      {/* ── Header (full width) ── */}
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What is your average position compared to competitors for
              <button className="flex items-center gap-[4px] text-[#1976D2] text-[18px] leading-[26px]">
                all themes
                <Icon name="expand_more" size={16} className="text-[#1976D2]" />
              </button>
            </span>
          }
          subtitle="Track the average position of your brand across AI platforms relative to your competitors"
          toolbar={
            <div className="flex items-center gap-sm">
              <DateRangeSelector
                value={dateRange}
                options={['Last 3 months', 'Last 6 months', 'Last 12 months', 'Last 24 months']}
                onChange={setDateRange}
              />
              <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                <AiIcon size={16} />
              </button>
              <button className="flex items-center justify-center w-[32px] h-[32px] rounded-sm border border-border bg-surface hover:bg-surface-hover">
                <Icon name="more_vert" size={16} className="text-text-icon" />
              </button>
            </div>
          }
        />
      </div>

      {/* ── Tabs + Chart + Table (24px side padding) ── */}
      <div className="px-2xl pb-2xl">
        {/* Platform tabs */}
        <CardTabs
          tabs={PLATFORM_TABS.map((t) => ({ id: t.id, label: t.label }))}
          activeTab={platform}
          onChange={(id) => setPlatform(id as TrendPlatform)}
        />

        {/* Trend chart — rank axis 0–5 */}
        <div className="pt-lg">
          <TrendLineChart
            data={trendData.map((pt) => ({
              ...pt,
              you:   +(pt.you   / 20).toFixed(2),
              comp1: +(pt.comp1 / 20).toFixed(2),
              comp2: +(pt.comp2 / 20).toFixed(2),
              comp3: +(pt.comp3 / 20).toFixed(2),
              comp4: +(pt.comp4 / 20).toFixed(2),
              comp5: +(pt.comp5 / 20).toFixed(2),
            }))}
            series={activeSeries}
            height={320}
            yDomain={[0, 5]}
            yTickFormatter={(v) => String(v)}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-xl mt-sm px-xs">
          {activeSeries.map((s) => (
            <div key={s.key} className="flex items-center gap-xs">
              <span
                className="inline-block size-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[12px] text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="mt-lg">
          <DataTable
            columns={tableColumns}
            data={tableData}
            rowHeight={56}
          />
        </div>
      </div>
    </div>
  )
}
