import type { ByLocationDot, RankingPlatform } from '../../data/competitorData'

export interface ScatterplotCardProps {
  /** All dots to render — filtered by caller for platform/geo */
  dots: ByLocationDot[]
  /** Ordered list of active competitor names (up to 5) */
  competitors: string[]
  /** Currently selected platform — drives the tab highlight */
  activePlatform: RankingPlatform
  /** Called when the user switches platform tabs */
  onPlatformChange: (platform: RankingPlatform) => void
  /** Called when user clicks "View detailed comparison" in the tooltip */
  onViewComparison: (locationName: string) => void
}
