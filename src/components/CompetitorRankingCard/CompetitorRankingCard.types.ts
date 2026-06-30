import type { RankingEntry, PromptRankingRow, ByLocationTableRow, RankingPlatform, TrendPlatform } from '../../data/competitorData'

export type { RankingEntry }

export interface FlatRankingRow extends Record<string, unknown> {
  _id: string
  _isHeader: boolean
  _parentId?: string
  prompt: string
  rank1?: RankingEntry
  rank2?: RankingEntry
  rank3?: RankingEntry
  rank4?: RankingEntry
  rank5?: RankingEntry
  date?: string
  location?: string
  aiResponse?: Partial<Record<TrendPlatform, string>>
}

export type CompetitorRankingCardProps =
  | { mode?: 'themes'; rows: PromptRankingRow[] }
  | { mode: 'locations'; data: Record<RankingPlatform, ByLocationTableRow[]>; onLocationRowClick?: (row: ByLocationTableRow) => void }
