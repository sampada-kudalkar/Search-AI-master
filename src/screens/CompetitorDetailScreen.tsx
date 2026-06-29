import { useState, useRef } from 'react'
import { Icon, TopNav, SummaryStats, DateRangeSelector, CitationShareCard, AveragePositionCard, VisibilityRankingCard, InfoTooltip } from '../components'
import { VisibilityAcrossThemesCard } from '../components/VisibilityAcrossThemesCard/VisibilityAcrossThemesCard'
import { ShareOfVoiceCard } from '../components/ShareOfVoiceCard/ShareOfVoiceCard'
import { ThemeVisibilityCard } from '../components/ThemeVisibilityCard/ThemeVisibilityCard'
import {
  COMPETITOR_DETAILS,
  COMPETITOR_BRAND_DATA,
  type CompetitorRowData,
} from '../data/competitorData'

// ── Main screen ───────────────────────────────────────────────────────────────

export function CompetitorDetailScreen({
  initialCompetitor,
  onBack,
  pageContext = 'brand',
}: {
  initialCompetitor: CompetitorRowData
  onBack: () => void
  pageContext?: 'brand' | 'location'
}) {
  const [selected] = useState<CompetitorRowData>(initialCompetitor)
  const DATE_RANGE_OPTIONS = ['Dec 2026', 'Nov 2026', 'Oct 2026', 'Last 3 months', 'Last 6 months']
  const [dateRange, setDateRange] = useState('Dec 2026')
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const [moreMenu, setMoreMenu] = useState<{ top: number; left: number } | null>(null)
  const MORE_MENU_ITEMS = ['Download', 'Email', 'Schedule'] as const

  const detail = COMPETITOR_DETAILS[selected.name]

  const visibilityTooltip = pageContext === 'location'
    ? 'See how frequently your location is mentioned in AI-generated answers compared to competitors'
    : 'See how frequently you are mentioned in AI-generated answers compared to competitors'
  const avgRankTooltip = pageContext === 'location'
    ? 'See the average rank of your location in AI-generated answers. For example, if your brand is usually listed first, average position will be close to one. A lower average position means your brand is more likely mentioned at the top.'
    : 'See the average rank of your brand in AI-generated answers. For example, if your brand is usually listed first, average position will be close to one. A lower average position means your brand is more likely mentioned at the top.'
  const citationShareTooltip = 'See the percentage of all citations that come from your website. This helps you analyse how often your content is being used as a source in AI generated answers'

  const summaryStats = detail
    ? [
        {
          id: 'visibility-score',
          label: 'Visibility score',
          tooltip: visibilityTooltip,
          youValue: `${detail.summary.youVisibilityScore.toFixed(1)}%`,
          competitors: [
            {
              value: `${detail.summary.visibilityScore.toFixed(1)}%`,
              name: selected.name,
              delta: `${Math.abs(detail.summary.youVisibilityDelta).toFixed(1)}%`,
              trend: detail.summary.youVisibilityDelta >= 0 ? ('up' as const) : ('down' as const),
            },
          ],
        },
        {
          id: 'citation-share',
          label: 'Citation share',
          tooltip: citationShareTooltip,
          youValue: `${detail.summary.youCitationShare.toFixed(1)}%`,
          competitors: [
            {
              value: `${detail.summary.citationShare.toFixed(1)}%`,
              name: selected.name,
              delta: `${Math.abs(detail.summary.youCitationDelta).toFixed(1)}%`,
              trend: detail.summary.youCitationDelta >= 0 ? ('up' as const) : ('down' as const),
            },
          ],
        },
        {
          id: 'avg-rank',
          label: 'Avg rank',
          tooltip: avgRankTooltip,
          youValue: String(detail.summary.youRank),
          competitors: [
            {
              value: String(detail.summary.rank),
              name: selected.name,
            },
          ],
        },
      ]
    : []

  return (
    <div className="flex h-full flex-col min-h-0">
      <TopNav initials="S" />

      {/* Page header — Figma node 614-13069 */}
      <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
        <div className="flex flex-1 min-w-0 items-center gap-sm">
          <button
            type="button"
            onClick={onBack}
            className="flex size-9 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <Icon name="arrow_back" size={20} />
          </button>
          <div className="flex items-center gap-xs">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              You vs {selected.name}
            </p>
            <InfoTooltip text={`See how ${selected.name} is mentioned in AI-generated answers`} />
          </div>
        </div>
        <div className="flex items-center gap-sm shrink-0">
          <DateRangeSelector
            value={dateRange}
            options={DATE_RANGE_OPTIONS}
            onChange={setDateRange}
          />
          <button
            ref={moreButtonRef}
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setMoreMenu(moreMenu ? null : { top: r.bottom + 4, left: r.right - 216 })
            }}
          >
            <Icon name="more_vert" size={20} />
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
                    onClick={() => setMoreMenu(null)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
      <div className="flex flex-col gap-xl px-2xl py-xl">
        {!detail ? (
          <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
            No detail data available for {selected.name}
          </div>
        ) : (
          <>
            {/* Card 1 — Summary */}
            <SummaryStats title="Summary" stats={summaryStats} />

            {/* Card 2 — Visibility across themes */}
            <VisibilityAcrossThemesCard
              rows={COMPETITOR_BRAND_DATA}
              selectedCompetitor={selected}
              pageContext={pageContext}
            />

            {/* Card 3 — Theme visibility */}
            {false && <ThemeVisibilityCard />}

            {/* Card 4 — Share of voice */}
            <ShareOfVoiceCard selectedCompetitor={selected} />

            {/* Card 5 — Citation share */}
            <CitationShareCard rows={COMPETITOR_BRAND_DATA} selectedCompetitor={selected} pageContext={pageContext} />

            {/* Card 6 — Average position */}
            <AveragePositionCard selectedCompetitor={selected} />

            {/* Card 7 — Visibility ranking by location */}
            {false && <VisibilityRankingCard />}
          </>
        )}
      </div>
      </div>
    </div>
  )
}
