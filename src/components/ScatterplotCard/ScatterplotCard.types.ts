import type { ByLocationDot, CompetitorSeries, RankingPlatform } from '../../data/competitorData'

export interface ScatterplotCardProps {
  /** All dots to render — filtered by caller for platform/geo */
  dots: ByLocationDot[]
  /** Grouped competitor series: up to 4 branded + optional local bucket */
  competitorSeries: CompetitorSeries[]
  /** Currently selected platform — drives the tab highlight */
  activePlatform: RankingPlatform
  /** Called when the user switches platform tabs */
  onPlatformChange: (platform: RankingPlatform) => void
/** Called when user clicks a dot — brand === 'you' for self, competitor name otherwise */
  onDotClick?: (dot: ByLocationDot) => void
}
