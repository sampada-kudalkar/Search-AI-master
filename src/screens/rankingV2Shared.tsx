import { Icon, type Column } from '../components'
import {
  RANKING_V2_PLATFORMS,
  RANKING_V2_SUMMARY,
  type RankingV2Data,
  type RankingV2PlatformSummary,
  type RankingV2Signal,
  type RankingV2Competitor,
  type RankingV2ThemeRow,
} from '../data/rankingV2ReportData'

export const PLATFORM_TABS = RANKING_V2_PLATFORMS.map((p) => ({ id: p, label: p === 'All' ? 'All sites' : p }))

export const INFLUENCE_ICON: Record<RankingV2Signal['influence'], { icon: string; label: string }> = {
  HIGH: { icon: 'arrow_upward', label: 'High' },
  MEDIUM: { icon: 'remove', label: 'Medium' },
  LOW: { icon: 'arrow_downward', label: 'Low' },
}

export function EmptyPlatformState({ label }: { label: string }) {
  return (
    <div className="flex h-[140px] flex-col items-center justify-center gap-xs rounded-md border border-border bg-surface text-center">
      <p className="text-body text-text-primary">No {label} yet</p>
      <p className="text-small text-text-secondary">
        Data appears once your prompts have run for this platform.
      </p>
    </div>
  )
}

export function average(nums: number[]): number {
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

export function buildSummaryStats() {
  return [
    { id: 'avg-rank', value: String(RANKING_V2_SUMMARY.avgRank), label: 'Your avg rank', delta: RANKING_V2_SUMMARY.delta, trend: 'up' as const },
  ]
}

export function buildUnderstandingStats(data: RankingV2Data) {
  return [
    { id: 'perception', value: String(data.perception.score), label: 'Perception', delta: '5%', trend: 'up' as const, tooltip: 'How favorably AI describes your business.' },
    { id: 'alignment', value: String(data.queryAlignment.score), label: 'Alignment', delta: '3%', trend: 'up' as const, tooltip: 'How closely your business matches what the query is asking for.' },
    { id: 'confidence', value: '85', label: 'Confidence', delta: '2%', trend: 'up' as const, tooltip: 'How much data AI had to base this analysis on.' },
  ]
}

export const RANKING_V2_RANK_BY_PLATFORM_COLUMNS: Column<RankingV2PlatformSummary>[] = [
  { key: 'platform', label: 'AI site', width: 160 },
  { key: 'rank', label: 'Rank', width: 100 },
  { key: 'summary', label: 'Summary' },
]

export const RANKING_V2_SIGNAL_COLUMNS: Column<RankingV2Signal>[] = [
  { key: 'name', label: 'Signal' },
  { key: 'category', label: 'Category', width: 140 },
  {
    key: 'influence',
    label: 'Influence',
    width: 140,
    render: (_v, row) => (
      <span className="flex items-center gap-xs text-body text-text-primary">
        <Icon name={INFLUENCE_ICON[row.influence].icon} size={16} className="text-text-icon" />
        {INFLUENCE_ICON[row.influence].label}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: 140,
    render: (_v, row) => (
      <span className="flex items-center gap-xs text-body text-text-primary">
        <Icon name="check_circle" size={16} className="text-chip-success-text" fill />
        {row.status === 'VERIFIED' ? 'Verified' : 'Unverified'}
      </span>
    ),
  },
]

export interface RankingV2CompetitorRow extends Record<string, unknown> {
  _id: string
  name: string
  yourRank: number | string
  theirRank: number | string
  topSignals: string
}

export function buildCompetitorRows(data: RankingV2Data): RankingV2CompetitorRow[] {
  return data.competitors.map((c: RankingV2Competitor) => ({
    _id: c.name,
    name: c.name,
    yourRank: data.rank,
    theirRank: c.rank,
    topSignals: c.topSignals.join(', '),
  }))
}

export const RANKING_V2_COMPETITOR_COLUMNS: Column<RankingV2CompetitorRow>[] = [
  { key: 'name', label: 'Competitor' },
  { key: 'yourRank', label: 'Your rank', width: 120 },
  { key: 'theirRank', label: 'Their rank', width: 120 },
  {
    key: 'topSignals',
    label: 'Top signals',
    render: (_v, row) => <span className="text-body text-text-primary">{row.topSignals}</span>,
  },
]

export interface FlatThemeScoreRow extends Record<string, unknown> {
  _id: string
  _isHeader: boolean
  _themeName: string
  name: string
  promptCount?: number
  perception: number
  alignment: number
  confidence: number
}

export function flattenThemeScores(themes: RankingV2ThemeRow[], expanded: Set<string>): FlatThemeScoreRow[] {
  const rows: FlatThemeScoreRow[] = []
  for (const theme of themes) {
    rows.push({
      _id: theme.theme,
      _isHeader: true,
      _themeName: theme.theme,
      name: theme.theme,
      promptCount: theme.prompts.length,
      perception: average(theme.prompts.map((p) => p.perception)),
      alignment: average(theme.prompts.map((p) => p.alignment)),
      confidence: average(theme.prompts.map((p) => p.confidence)),
    })
    if (expanded.has(theme.theme)) {
      theme.prompts.forEach((prompt, i) => {
        rows.push({
          _id: `${theme.theme}-${i}`,
          _isHeader: false,
          _themeName: theme.theme,
          name: prompt.text,
          perception: prompt.perception,
          alignment: prompt.alignment,
          confidence: prompt.confidence,
        })
      })
    }
  }
  return rows
}

export function buildThemeScoreColumns(
  expandedThemes: Set<string>,
  toggleTheme: (themeName: string) => void,
): Column<FlatThemeScoreRow>[] {
  return [
    {
      key: 'name',
      label: 'Themes and prompts',
      width: 320,
      render: (_val, row) => {
        if (row._isHeader) {
          const isExpanded = expandedThemes.has(row._themeName)
          return (
            <button
              type="button"
              onClick={() => toggleTheme(row._themeName)}
              className="flex w-full items-center gap-sm text-left"
            >
              <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-body text-text-primary">{row.name}</span>
                <span className="text-small text-text-tertiary">{row.promptCount} prompts</span>
              </div>
            </button>
          )
        }
        return <span className="block truncate pl-[24px] text-body text-text-primary">{row.name}</span>
      },
    },
    { key: 'perception', label: 'Perception', width: 140 },
    { key: 'alignment', label: 'Alignment', width: 140 },
    { key: 'confidence', label: 'Confidence', width: 140 },
  ]
}
