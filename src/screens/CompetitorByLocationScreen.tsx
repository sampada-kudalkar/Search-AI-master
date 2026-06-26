import { useState, useMemo } from 'react'
import { ScatterplotCard, CompetitorRankingCard } from '../components'
import { FilterPanel } from '../components/FilterPanel/FilterPanel'
import { Icon } from '../components/Icon/Icon'
import {
  BY_LOCATION_DATA,
  BY_LOCATION_COMPETITORS,
  RANKING_PLATFORMS,
  type RankingPlatform,
  type ByLocationDot,
  type ByLocationTableRow,
} from '../data/competitorData'

const ALL_LOCATIONS = Array.from(
  new Set(
    RANKING_PLATFORMS.flatMap((p) =>
      BY_LOCATION_DATA[p].tableRows.map((r) => r.location)
    )
  )
).sort()

const FILTER_FIELDS = [
  {
    id: 'location',
    label: 'Location',
    options: ALL_LOCATIONS.map((l) => ({ value: l, label: l })),
    multi: true,
  },
]

export function CompetitorByLocationScreen({
  onViewComparison,
}: {
  onViewComparison?: (locationName: string) => void
}) {
  const [platform, setPlatform] = useState<RankingPlatform>('ChatGPT')
  const [competitors] = useState<string[]>([...BY_LOCATION_COMPETITORS])
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({})

  const selectedLocations = filterSelections['location'] ?? []

  const filteredDots: ByLocationDot[] = useMemo(() => {
    const dots = BY_LOCATION_DATA[platform].dots
    if (!selectedLocations.length) return dots
    return dots.filter((d) => selectedLocations.includes(d.locationName))
  }, [platform, selectedLocations])

  const filteredByPlatform = useMemo((): Record<RankingPlatform, ByLocationTableRow[]> => {
    return Object.fromEntries(
      RANKING_PLATFORMS.map((p) => [
        p,
        selectedLocations.length
          ? BY_LOCATION_DATA[p].tableRows.filter((r) => selectedLocations.includes(r.location))
          : BY_LOCATION_DATA[p].tableRows,
      ])
    ) as Record<RankingPlatform, ByLocationTableRow[]>
  }, [selectedLocations])

  const visibleDots = filteredDots.filter(
    (d) => d.brand === 'you' || competitors.includes(d.brand)
  )

  return (
    <div className="flex h-full w-full">
      {/* Scrollable main area */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#f5f5f5]">

        {/* Sticky header — title bar only */}
        <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-sm px-2xl bg-surface border-b border-border">
          <span className="flex-1 text-h3 text-text-primary">
            Competitor benchmarking by locations
          </span>
          <Icon name="info" size={20} className="text-text-icon" />
          <div className="flex items-center gap-sm ml-lg">
            <button className="flex size-[36px] items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover">
              <Icon name="more_vert" size={20} className="text-text-icon" />
            </button>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex size-[36px] items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
            >
              <Icon name="filter_list" size={20} className="text-text-icon" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex flex-col gap-xl px-2xl py-xl">
          <ScatterplotCard
            dots={visibleDots}
            competitors={competitors}
            activePlatform={platform}
            onPlatformChange={setPlatform}
            onViewComparison={(loc) => onViewComparison?.(loc)}
          />
          <CompetitorRankingCard mode="locations" data={filteredByPlatform} />
        </div>
      </div>

      {/* Filter panel — inline right side */}
      <FilterPanel
        open={filterOpen}
        fields={FILTER_FIELDS}
        selections={filterSelections}
        onSelectionsChange={setFilterSelections}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  )
}
