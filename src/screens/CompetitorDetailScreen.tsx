import { useState } from 'react'
import { Icon, TopNav, SummaryStats, DateRangeSelector, CitationShareCard, AveragePositionCard, VisibilityRankingCard } from '../components'
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
}: {
  initialCompetitor: CompetitorRowData
  onBack: () => void
}) {
  const [selected] = useState<CompetitorRowData>(initialCompetitor)
  const DATE_RANGE_OPTIONS = ['Dec 2026', 'Nov 2026', 'Oct 2026', 'Last 3 months', 'Last 6 months']
  const [dateRange, setDateRange] = useState('Dec 2026')

  const detail = COMPETITOR_DETAILS[selected.name]

  const summaryStats = detail
    ? [
        {
          id: 'citation-share',
          label: 'Citation share',
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
          id: 'visibility-score',
          label: 'Visibility score',
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
          id: 'rank',
          label: 'Rank',
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
          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              You vs {selected.name}
            </p>
            <p className="text-[12px] leading-[18px] text-text-secondary whitespace-nowrap">
              See how {selected.name} is mentioned in AI-generated answers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-sm shrink-0">
          <DateRangeSelector
            value={dateRange}
            options={DATE_RANGE_OPTIONS}
            onChange={setDateRange}
          />
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="more_vert" size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-[#f5f5f5]">
      <div className="flex flex-col gap-xl px-2xl py-xl">
        {!detail ? (
          <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
            No detail data available for {selected.name}
          </div>
        ) : (
          <>
            {/* Card 1 — Summary */}
            <SummaryStats title="Summary" stats={summaryStats} />

            {/* Card 2 — Citation share */}
            <CitationShareCard rows={COMPETITOR_BRAND_DATA} selectedCompetitor={selected} />

            {/* Card 3 — Visibility across themes */}
            <VisibilityAcrossThemesCard
              rows={COMPETITOR_BRAND_DATA}
              selectedCompetitor={selected}
            />

            {/* Card 4 — Theme visibility */}
            {false && <ThemeVisibilityCard />}

            {/* Card 5 — Share of voice */}
            <ShareOfVoiceCard selectedCompetitor={selected} />

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
