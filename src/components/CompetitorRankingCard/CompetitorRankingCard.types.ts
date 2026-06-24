import type { RankingEntry, PromptRankingRow } from '../../data/competitorData'

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
}

export interface CompetitorRankingCardProps {
  rows: PromptRankingRow[]
}
