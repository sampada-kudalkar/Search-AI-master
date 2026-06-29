import { useState, useMemo, useRef } from 'react'
import { ScatterplotCard, CompetitorRankingCard, InfoTooltip } from '../components'
import { FilterPanel } from '../components/FilterPanel/FilterPanel'
import { Icon } from '../components/Icon/Icon'
import {
  BY_LOCATION_DATA,
  RANKING_PLATFORMS,
  groupCompetitorSeries,
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

const MORE_MENU_ITEMS = [
  'Manage competitors',
  'Download',
  'Email',
  'Schedule',
] as const

const FILTER_FIELDS = [
  {
    id: 'location',
    label: 'Location',
    options: ALL_LOCATIONS.map((l) => ({ value: l, label: l })),
    multi: true,
  },
]

export function CompetitorByLocationScreen({
  locationName = 'Location',
  onLocationClick,
  onManageCompetitors,
  onDotClick,
}: {
  locationName?: string
  onLocationClick?: (row: ByLocationTableRow) => void
  onManageCompetitors?: () => void
  onDotClick?: (dot: ByLocationDot) => void
}) {
  const [platform, setPlatform] = useState<RankingPlatform>('ChatGPT')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({})
  const [moreMenu, setMoreMenu] = useState<{ top: number; left: number } | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)

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

  const competitorSeries = useMemo(
    () => groupCompetitorSeries(filteredDots),
    [filteredDots]
  )

  const visibleDots = useMemo(() => {
    const competitorBrands = new Set(
      competitorSeries.flatMap((s) => s.dots.map((d) => d.brand))
    )
    return filteredDots.filter((d) => d.brand === 'you' || competitorBrands.has(d.brand))
  }, [filteredDots, competitorSeries])

  return (
    <div className="flex h-full w-full">
      {/* Scrollable main area */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">

        {/* Sticky header — title bar only */}
        <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-sm px-2xl bg-surface">
          <div className="flex flex-1 items-center gap-sm">
            <span className="text-h3 text-text-primary">{locationName}</span>
            <InfoTooltip text="See how your locations are performing against your competitors in AI-generated answers" />
          </div>
          <div className="flex items-center gap-sm ml-lg">
            <button
              ref={moreButtonRef}
              type="button"
              aria-label="More options"
              className="flex size-[36px] items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setMoreMenu(moreMenu ? null : { top: r.bottom + 4, left: r.right - 216 })
              }}
            >
              <Icon name="more_vert" size={20} className="text-text-icon" />
            </button>
            {moreMenu && (
              <>
                <div className="fixed inset-0 z-[105]" onClick={() => setMoreMenu(null)} />
                <div
                  className="fixed z-[110] min-w-[216px] rounded-sm border border-border bg-surface py-xs shadow-dropdown"
                  style={{ top: moreMenu.top, left: moreMenu.left }}
                >
                  {MORE_MENU_ITEMS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="block w-full px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover"
                      onClick={() => {
                        setMoreMenu(null)
                        if (item === 'Manage competitors') onManageCompetitors?.()
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
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
            competitorSeries={competitorSeries}
            activePlatform={platform}
            onPlatformChange={setPlatform}
            onDotClick={onDotClick}
          />
          <CompetitorRankingCard mode="locations" data={filteredByPlatform} onLocationRowClick={onLocationClick} />
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
