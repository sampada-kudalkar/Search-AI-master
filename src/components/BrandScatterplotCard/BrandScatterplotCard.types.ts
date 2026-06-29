import type { BrandDot, RankingPlatform } from '../../data/competitorData'

export interface BrandScatterplotCardProps {
  dots: BrandDot[]
  activePlatform: RankingPlatform
  onPlatformChange: (platform: RankingPlatform) => void
}
