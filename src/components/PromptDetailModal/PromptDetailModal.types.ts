import type { FlatRankingRow } from '../CompetitorRankingCard/CompetitorRankingCard.types'
import type { RankingPlatform } from '../../data/competitorData'

export interface PromptDetailModalProps {
  open: boolean
  prompt: FlatRankingRow | null
  platform: RankingPlatform
  onClose: () => void
}
