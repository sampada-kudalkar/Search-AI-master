import type { ReactNode } from 'react'
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
  rank6?: RankingEntry
  rank7?: RankingEntry
  rank8?: RankingEntry
  rank9?: RankingEntry
  rank10?: RankingEntry
  date?: string
  location?: string
  aiResponse?: Partial<Record<TrendPlatform, string>>
}

export interface PlatformTab {
  id: string
  label: string
}

export type CompetitorRankingCardProps =
  | {
      mode?: 'themes'
      rows: PromptRankingRow[]
      rankCount?: number
      avatarOnly?: boolean
      title?: ReactNode
      subtitle?: string
      platformTabs?: PlatformTab[]
      activePlatform?: string
      onPlatformChange?: (id: string) => void
    }
  | { mode: 'locations'; data: Record<RankingPlatform, ByLocationTableRow[]>; onLocationRowClick?: (row: ByLocationTableRow) => void }
