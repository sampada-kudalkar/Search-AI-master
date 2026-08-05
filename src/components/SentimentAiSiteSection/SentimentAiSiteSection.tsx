import { CardHeader } from '../CardHeader/CardHeader'
import { DataTable } from '../DataTable/DataTable'
import { SummaryCard } from '../SummaryCard/SummaryCard'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import type { Column } from '../DataTable/DataTable.types'
import type { SentimentAiSiteLocationRow, SentimentAiSiteSectionProps, SentimentAiSiteTableProps } from './SentimentAiSiteSection.types'

function SentimentPercent({ value }: { value: number }) {
  return <span className={value >= 80 ? 'text-chip-success-text' : 'text-text-primary'}>{value}%</span>
}

function othersValue(row: SentimentAiSiteLocationRow): number {
  return Math.round((row.googleAiMode + row.grok) / 2)
}

function tableColumns(): Column<SentimentAiSiteLocationRow>[] {
  return [
    { key: 'location', label: 'Locations', width: 220 },
    { key: 'sentiment', label: 'Average sentiment', width: 140, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'chatgpt', label: 'ChatGPT', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'gemini', label: 'Gemini', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'perplexity', label: 'Perplexity', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'claude', label: 'Claude', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    {
      key: 'googleAiMode',
      label: 'Others',
      width: 120,
      render: (_v, row) => (
        <span className="flex items-center gap-xs">
          <SentimentPercent value={othersValue(row)} />
          <InfoTooltip text={`Google AI Mode: ${row.googleAiMode}%\nGrok: ${row.grok}%`} />
        </span>
      ),
    },
  ]
}

export function SentimentAiSiteTable({ tableTitle, tableSubtitle, rows }: SentimentAiSiteTableProps) {
  return (
    <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
      <CardHeader title={tableTitle} subtitle={tableSubtitle} />
      <DataTable<SentimentAiSiteLocationRow> columns={tableColumns()} data={rows} />
    </div>
  )
}

export function SentimentAiSiteSection({
  scoreTitle,
  scoreValue,
  breakdownSubtitle,
  breakdownStats,
  tableTitle,
  tableSubtitle,
  rows,
  showTable = true,
}: SentimentAiSiteSectionProps) {
  return (
    <>
      <div className="flex gap-lg">
        <div className="w-1/5 shrink-0">
          <SummaryCard title={scoreTitle} stats={[{ id: 'score', value: scoreValue, label: 'Your score' }]} />
        </div>
        <div className="flex-1">
          <SummaryCard title={`${scoreTitle} breakdown`} titleTooltip={breakdownSubtitle} stats={breakdownStats} />
        </div>
      </div>

      {showTable && <SentimentAiSiteTable tableTitle={tableTitle} tableSubtitle={tableSubtitle} rows={rows} />}
    </>
  )
}
