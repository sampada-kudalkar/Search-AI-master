import type { SummaryCardStat } from '../SummaryCard/SummaryCard.types'

export interface SentimentAiSiteLocationRow extends Record<string, unknown> {
  id: string
  location: string
  sentiment: number
  chatgpt: number
  gemini: number
  perplexity: number
  claude: number
  googleAiMode: number
  grok: number
}

export interface SentimentAiSiteSectionProps {
  scoreTitle: string
  scoreValue: string
  breakdownSubtitle: string
  breakdownStats: SummaryCardStat[]
  tableTitle: string
  tableSubtitle: string
  rows: SentimentAiSiteLocationRow[]
  /** Set false to omit the table card, e.g. when it's rendered elsewhere on the page. */
  showTable?: boolean
}

export interface SentimentAiSiteTableProps {
  tableTitle: string
  tableSubtitle: string
  rows: SentimentAiSiteLocationRow[]
}
