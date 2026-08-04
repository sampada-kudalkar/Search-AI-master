import { useState } from 'react'
import {
  CardHeader,
  CardTabs,
  ChartCard,
  SummaryCard,
  DataTable,
  TrendLineChart,
  CompetitorRankingCard,
  COMPETITOR_RANKING_TOOLBAR,
  AI_SUMMARY_TOOLBAR,
  Chip,
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SegmentedControl,
  SentimentSwotGrid,
  SentimentComparisonMatrix,
  CompetitorSentimentDrawer,
  CitationSentimentDrawer,
  VisibilityRankingCard,
  type Column,
} from '../components'
import {
  SENTIMENT_SUMMARY,
  SENTIMENT_TREND,
  SENTIMENT_TREND_SERIES,
  SENTIMENT_BY_AI_SITE,
  BRAND_SENTIMENT_BY_AI_SITE,
  SENTIMENT_SWOT_PLATFORMS,
  SENTIMENT_SWOT,
  SENTIMENT_IMPROVEMENT_AREAS,
  SENTIMENT_BY_LOCATION,
  SENTIMENT_BY_THEME_AND_PROMPT,
  SENTIMENT_COMPETITORS,
  SENTIMENT_BY_COMPETITOR,
  SENTIMENT_MATRIX_TRAITS,
  SENTIMENT_MATRIX_COMPETITORS,
  SENTIMENT_COMPARISON_MATRIX,
  SENTIMENT_RANK_BY_THEME,
  SENTIMENT_RANK_BY_LOCATION,
  SENTIMENT_NEGATIVE_DRIVERS,
  type SentimentSwotPlatform,
  type SentimentImprovementRow,
  type SentimentLocationRow,
  type SentimentThemeRow,
  type SentimentPromptSubRow,
  type SentimentCompetitorRow,
  type SentimentNegativeDriverRow,
} from '../data/sentimentReportData'

function SentimentText({ value }: { value: number }) {
  return <span className="text-[#212121]">{value}%</span>
}

function SentimentScoreStat({ score, delta, label }: { score: number; delta: string; label: string }) {
  const isPositive = !delta.trim().startsWith('-')
  return (
    <div>
      <div className="flex items-baseline gap-sm">
        <span className="text-[32px] leading-10 tracking-[-0.64px] text-[#212121]">{score}%</span>
        <span className={`text-small ${isPositive ? 'text-chip-success-text' : 'text-chip-danger-text'}`}>
          {isPositive ? '+' : ''}{delta}
        </span>
      </div>
      <p className="mt-[4px] text-body text-[#212121]">{label}</p>
    </div>
  )
}

// ── Breakdown by location table (shared by cards 7 & 9) ────────────────────────

function LocationBreakdownTable() {
  const columns: Column<SentimentLocationRow>[] = [
    { key: 'location', label: 'Location', width: 200 },
    { key: 'sentiment', label: 'Sentiment score', width: 140, render: (v) => <SentimentText value={v as number} /> },
    { key: 'chatgpt', label: 'ChatGPT', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'gemini', label: 'Gemini', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'perplexity', label: 'Perplexity', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'googleAiMode', label: 'Google AI Mode', width: 140, render: (v) => <SentimentText value={v as number} /> },
    { key: 'grok', label: 'Grok', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'claude', label: 'Claude', width: 120, render: (v) => <SentimentText value={v as number} /> },
  ]
  return <DataTable<SentimentLocationRow> columns={columns} data={SENTIMENT_BY_LOCATION} />
}

// ── Location dropdown (private, inline in title) ─────────────────────────────

const SWOT_LOCATIONS = ['All locations', ...SENTIMENT_BY_LOCATION.map((l) => l.location)]
const THEME_LOCATIONS = ['all locations', ...SENTIMENT_BY_LOCATION.map((l) => l.location)]

function LocationDropdown({
  selected,
  onChange,
  options = SWOT_LOCATIONS,
}: {
  selected: string
  onChange: (v: string) => void
  options?: string[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[4px] text-[#1976D2] text-[18px] leading-[26px]"
      >
        {selected}
        <Icon name="expand_more" size={16} className="text-[#1976D2]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-[4px] z-20 min-w-[180px] bg-surface rounded-sm border border-border shadow-dropdown py-xs">
            {options.map((l) => (
              <button
                key={l}
                onClick={() => { onChange(l); setOpen(false) }}
                className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                  l === selected ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {l === selected && <Icon name="check" size={16} className="text-primary shrink-0" />}
                {l !== selected && <span className="w-[16px] shrink-0" />}
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

const MONTH_OPTIONS = ['Jun 2026', 'May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026', 'Jan 2026']

interface PromptFlatRow extends Record<string, unknown> {
  _id: string
  _isHeader: boolean
  theme: string
  locations: number
  sentiment: number
  chatgpt: number
  gemini: number
  perplexity: number
}

export function SentimentV2ReportScreen() {
  const [competitorRow, setCompetitorRow] = useState<SentimentCompetitorRow | null>(null)
  const [negativeDriverRow, setNegativeDriverRow] = useState<SentimentNegativeDriverRow | null>(null)
  const [month, setMonth] = useState(MONTH_OPTIONS[0])
  const [scopeView, setScopeView] = useState<'location' | 'brand'>('location')
  const [swotPlatform, setSwotPlatform] = useState<SentimentSwotPlatform>('ChatGPT')
  const [swotLocation, setSwotLocation] = useState('All locations')
  const [themeLocation, setThemeLocation] = useState('all locations')
  const [rankingLocation, setRankingLocation] = useState('all locations')
  const [competitorLocation, setCompetitorLocation] = useState('all locations')
  const [trendRange, setTrendRange] = useState('Last 3 months')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleTheme(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const improvementColumns: Column<SentimentImprovementRow>[] = [
    { key: 'aiSite', label: 'AI site', width: 160 },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'summary', label: 'Summary', width: 480 },
  ]

  const themeFlatRows: PromptFlatRow[] = []
  for (const theme of SENTIMENT_BY_THEME_AND_PROMPT as SentimentThemeRow[]) {
    themeFlatRows.push({
      _id: theme._id,
      _isHeader: true,
      theme: theme.theme,
      locations: theme.locations,
      sentiment: theme.sentiment,
      chatgpt: theme.chatgpt,
      gemini: theme.gemini,
      perplexity: theme.perplexity,
    })
    if (expandedIds.has(theme._id)) {
      for (const p of theme.prompts as SentimentPromptSubRow[]) {
        themeFlatRows.push({
          _id: p._id,
          _isHeader: false,
          theme: p.prompt,
          locations: p.locations,
          sentiment: p.sentiment,
          chatgpt: p.chatgpt,
          gemini: p.gemini,
          perplexity: p.perplexity,
        })
      }
    }
  }

  const themeColumns: Column<PromptFlatRow>[] = [
    {
      key: 'theme',
      label: 'Themes',
      width: 320,
      render: (_v, row) =>
        row._isHeader ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleTheme(row._id)
            }}
            className="flex items-center gap-sm"
          >
            <Icon name={expandedIds.has(row._id) ? 'expand_less' : 'expand_more'} size={16} className="text-text-icon" />
            <span className="text-[13px] text-[#212121]">{row.theme}</span>
          </button>
        ) : (
          <span className="pl-[32px] text-small text-[#555555]">{row.theme}</span>
        ),
    },
    { key: 'sentiment', label: 'Avg sentiment', width: 140, render: (v) => <SentimentText value={v as number} /> },
    { key: 'chatgpt', label: 'ChatGPT', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'gemini', label: 'Gemini', width: 120, render: (v) => <SentimentText value={v as number} /> },
    { key: 'perplexity', label: 'Perplexity', width: 120, render: (v) => <SentimentText value={v as number} /> },
  ]

  const competitorColumns: Column<SentimentCompetitorRow>[] = [
    {
      key: 'name',
      label: 'Competitor',
      width: 220,
      render: (v, row) => (
        <span className="flex items-center gap-sm">
          <span className="text-[#212121]">{v as string}</span>
          {row.isYou && (
            <span className="shrink-0 rounded-full border border-white bg-gradient-to-b from-[#0f7195] to-[#094459] px-[8px] py-[2px] text-small text-white">
              You
            </span>
          )}
        </span>
      ),
    },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentText value={v as number} /> },
    {
      key: 'strengths',
      label: 'Strengths',
      width: 240,
      render: (v) => (
        <div className="flex flex-wrap gap-xs">
          {(v as string[]).map((s) => <Chip key={s} label={s} variant="success" />)}
        </div>
      ),
    },
    {
      key: 'weaknesses',
      label: 'Weaknesses',
      width: 240,
      render: (v) => (
        <div className="flex flex-wrap gap-xs">
          {(v as string[]).map((w) => <Chip key={w} label={w} variant="danger" />)}
        </div>
      ),
    },
  ]

  const negativeDriverColumns: Column<SentimentNegativeDriverRow>[] = [
    { key: 'webPage', label: 'Webpage', render: (v) => <span className="truncate text-[#212121]">{v as string}</span> },
    {
      key: 'negativeClaim',
      label: 'Negative claim',
      render: (_, row) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[#212121]">{row.negativeClaim}</span>
          <span className="text-small text-text-tertiary">{row.claimDetail}</span>
        </div>
      ),
    },
    {
      key: 'claimOccurrence',
      label: (
        <span className="flex items-center gap-xs">
          Claim occurrence
          <InfoTooltip text="Frequency of this claim among responses that have sentiment for your brand" />
        </span>
      ),
      width: 160,
      render: (v) => <span className="text-[#212121]">{v as number}%</span>,
    },
    { key: 'citationShare', label: 'Citation share', width: 140, render: (v) => <span className="text-[#212121]">{v as number}%</span> },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentText value={v as number} /> },
  ]

  return (
    <div className="flex flex-1 flex-col min-h-0 min-w-0">
      <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
        <div className="flex flex-1 min-w-0 items-center gap-sm">
          <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-[#212121] whitespace-nowrap">
            Sentiment V2
          </p>
          <InfoTooltip text="See how AI sites perceive your brand's sentiment compared to competitors" />
        </div>
        <div className="flex items-center gap-sm shrink-0">
          <DateRangeSelector value={month} options={MONTH_OPTIONS} onChange={setMonth} />
          <SegmentedControl
            options={[
              { value: 'location', label: 'By location' },
              { value: 'brand', label: 'By brand' },
            ]}
            value={scopeView}
            onChange={(v) => setScopeView(v as 'location' | 'brand')}
          />
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="more_vert" size={20} />
          </button>
          <button
            type="button"
            aria-label="Filter"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="filter_list" size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-xl px-2xl py-xl">
          {/* 1. Sentiment score */}
          <div className="flex gap-lg">
            <div className="flex-1 rounded-md border border-border bg-surface px-2xl py-xl">
              <div className="mb-md flex items-center justify-between">
                <span className="text-body text-[#212121]">Sentiment score</span>
              </div>
              <SentimentScoreStat score={SENTIMENT_SUMMARY.overall.score} delta={SENTIMENT_SUMMARY.overall.delta} label="Your score" />
            </div>
            <div className="flex-1 rounded-md border border-border bg-surface px-2xl py-xl">
              <div className="mb-md flex items-center justify-between">
                <span className="text-body text-[#212121]">Sentiment score consists of</span>
              </div>
              <div className="flex gap-[100px]">
                <SentimentScoreStat score={SENTIMENT_SUMMARY.brand.score} delta={SENTIMENT_SUMMARY.brand.delta} label="Brand sentiment" />
                <SentimentScoreStat score={SENTIMENT_SUMMARY.prompt.score} delta={SENTIMENT_SUMMARY.prompt.delta} label="Prompt sentiment" />
              </div>
            </div>
          </div>

          {/* 2. Sentiment score over time */}
          <ChartCard
            title="What is your sentiment score over time"
            subtitle="Track your positive sentiment across AI sites over time"
            toolbar={
              <div className="flex items-center gap-sm">
                <DateRangeSelector
                  value={trendRange}
                  options={['Last 3 months', 'Last 6 months', 'Last 12 months']}
                  onChange={setTrendRange}
                />
                {AI_SUMMARY_TOOLBAR}
              </div>
            }
          >
            <TrendLineChart data={SENTIMENT_TREND} series={SENTIMENT_TREND_SERIES} />
            <div className="mt-sm flex flex-wrap items-center gap-xl px-xs">
              {SENTIMENT_TREND_SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-xs">
                  <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] text-[#212121]">{s.label}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* 3. Sentiment score breakdown by site */}
          <SummaryCard
            title="What is sentiment score breakdown by site"
            subtitle="Analyze the percentage of positive sentiment across AI sites"
            stats={SENTIMENT_BY_AI_SITE.map((m) => ({ id: m.id, value: String(m.value), label: m.label, delta: m.delta, trend: m.trend }))}
          />

          {/* 4. Sentiment across sites — hidden for now, kept for future use */}
          {false && (
            <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="Sentiment across sites" toolbar={AI_SUMMARY_TOOLBAR} />
              <DataTable<SentimentImprovementRow> columns={improvementColumns} data={SENTIMENT_IMPROVEMENT_AREAS} autoRowHeight />
            </div>
          )}

          {/* 5. Sentiment by theme and prompts across all locations */}
          <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title={
                <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
                  What is your sentiment by theme and prompts across
                  <LocationDropdown selected={themeLocation} onChange={setThemeLocation} options={THEME_LOCATIONS} />
                </span>
              }
              subtitle="Track your positive sentiment in answers generated by AI sites"
              toolbar={AI_SUMMARY_TOOLBAR}
            />
            <DataTable<PromptFlatRow>
              columns={themeColumns}
              data={themeFlatRows}
              autoRowHeight
              rowClassName={(row) => (row._isHeader ? '' : 'bg-[#FAFAFA]')}
            />
          </div>

          {/* 5c. Top negative sentiment drivers */}
          <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title="What are your top negative sentiment drivers?"
              subtitle="Web pages most frequently cited for top negative claims across AI sites."
            />
            <DataTable<SentimentNegativeDriverRow>
              columns={negativeDriverColumns}
              data={SENTIMENT_NEGATIVE_DRIVERS}
              autoRowHeight
              onRowClick={setNegativeDriverRow}
            />
          </div>

          {/* 6. Strengths and weaknesses */}
          <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title={
                <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
                  What are your strengths and weaknesses across AI sites for
                  <LocationDropdown selected={swotLocation} onChange={setSwotLocation} />
                </span>
              }
              subtitle="Track AI-identified strengths and opportunities and take prioritized actions to improve"
              toolbar={AI_SUMMARY_TOOLBAR}
            />
            <CardTabs
              tabs={SENTIMENT_SWOT_PLATFORMS.map((p) => ({ id: p, label: p }))}
              activeTab={swotPlatform}
              onChange={(id) => setSwotPlatform(id as SentimentSwotPlatform)}
            />
            <SentimentSwotGrid {...SENTIMENT_SWOT[swotPlatform]} />
          </div>

          {/* 7. Breakdown by location — hidden for now, kept for future use */}
          {false && (
            <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="Breakdown by location" toolbar={AI_SUMMARY_TOOLBAR} />
              <LocationBreakdownTable />
            </div>
          )}

          {/* 8. How are you ranking against competitors across all locations — hidden, superseded by VisibilityRankingCard above */}
          {false && (
            <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
              <CardHeader
                title={
                  <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
                    How are you ranking against competitors across
                    <LocationDropdown selected={rankingLocation} onChange={setRankingLocation} options={THEME_LOCATIONS} />
                  </span>
                }
                subtitle="Analyze your positive sentiment versus your competitors across AI sites"
                toolbar={COMPETITOR_RANKING_TOOLBAR}
              />
              <CompetitorRankingCard mode="locations" data={SENTIMENT_RANK_BY_LOCATION} hideHeader />
            </div>
          )}

          {/* 9. Sentiment across locations — hidden for now, kept for future use */}
          {false && (
            <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="Sentiment across locations" toolbar={AI_SUMMARY_TOOLBAR} />
              <LocationBreakdownTable />
            </div>
          )}

          {/* 10. Brand sentiment — hidden for now, kept for future use */}
          {false && (
            <SummaryCard
              title="Brand sentiment"
              stats={[{ id: 'score', value: `${SENTIMENT_SUMMARY.brand.score}%`, label: `+${SENTIMENT_SUMMARY.brand.delta} vs last period` }]}
              toolbar={AI_SUMMARY_TOOLBAR}
            />
          )}

          {/* 11. Brand sentiment breakdown — hidden for now, kept for future use */}
          {false && (
            <SummaryCard
              title="Brand sentiment breakdown"
              subtitle="The percentage of positive brand sentiment across each AI site"
              stats={BRAND_SENTIMENT_BY_AI_SITE.map((m) => ({ id: m.id, value: String(m.value), label: m.label }))}
              toolbar={AI_SUMMARY_TOOLBAR}
            />
          )}

          {/* 12. Sentiment across competitors — hidden for now, kept for future use */}
          {false && (
            <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="Sentiment across competitors" toolbar={AI_SUMMARY_TOOLBAR} />
              <div className="flex flex-wrap items-center gap-md">
                {SENTIMENT_COMPETITORS.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-md">
                    {i > 0 && <span className="text-small text-[#212121]">vs</span>}
                    <div className="flex items-center gap-xs rounded-sm border border-border px-lg py-sm">
                      <span className="text-body text-[#212121]">{c.isYou ? 'You' : c.name}</span>
                      <SentimentText value={c.sentiment} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5b. Review — visibility ranking card (themes/prompts, 10 ranks, avatar-only) */}
          <VisibilityRankingCard />

          {/* 13. Sentiment breakdown by competitors */}
          <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title={
                <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
                  What are your strengths and weaknesses compared to your competitors for
                  <LocationDropdown selected={competitorLocation} onChange={setCompetitorLocation} options={THEME_LOCATIONS} />
                </span>
              }
              subtitle="Analyze your strengths and weaknesses versus your competitors across answers generated by AI sites"
              toolbar={AI_SUMMARY_TOOLBAR}
            />
            <DataTable<SentimentCompetitorRow>
              columns={competitorColumns}
              data={SENTIMENT_BY_COMPETITOR}
              autoRowHeight
              onRowClick={setCompetitorRow}
            />
          </div>

          {/* 14. Competitive strengths and weakness matrix */}
          <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title="What are your competitive strengths and weaknesses by strengths and traits?"
              subtitle="Analyzed across the traits: what are your strengths, how is your positive sentiment compared to competitors?"
              toolbar={AI_SUMMARY_TOOLBAR}
            />
            <SentimentComparisonMatrix
              traits={SENTIMENT_MATRIX_TRAITS}
              competitors={SENTIMENT_MATRIX_COMPETITORS}
              values={SENTIMENT_COMPARISON_MATRIX}
            />
          </div>

          {/* 15. Sentiment rank across themes and prompts — hidden for now, kept for future use */}
          {false && (
            <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
              <CardHeader title="Sentiment rank across themes and prompts" />
              <CompetitorRankingCard rows={SENTIMENT_RANK_BY_THEME} rankCount={5} avatarOnly />
            </div>
          )}
        </div>
      </div>

      <CompetitorSentimentDrawer open={!!competitorRow} row={competitorRow} onClose={() => setCompetitorRow(null)} />
      <CitationSentimentDrawer open={!!negativeDriverRow} row={negativeDriverRow} onClose={() => setNegativeDriverRow(null)} />
    </div>
  )
}
