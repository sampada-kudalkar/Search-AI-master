import { useState } from 'react'
import {
  Tabs,
  CardHeader,
  CardTabs,
  ChartCard,
  SummaryCard,
  DataTable,
  TrendLineChart,
  CompetitorRankingCard,
  Chip,
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SegmentedControl,
  AiIcon,
  SentimentSwotGrid,
  SentimentComparisonMatrix,
  CitationSentimentDrawer,
  CompetitorSentimentDrawer,
  type Tab,
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
  SENTIMENT_BY_CITATION,
  SENTIMENT_BY_LOCATION,
  PROMPT_SENTIMENT_BREAKDOWN,
  SENTIMENT_BY_THEME_AND_PROMPT,
  SENTIMENT_COMPETITORS,
  SENTIMENT_BY_COMPETITOR,
  SENTIMENT_MATRIX_TRAITS,
  SENTIMENT_MATRIX_COMPETITORS,
  SENTIMENT_COMPARISON_MATRIX,
  SENTIMENT_RANK_BY_THEME,
  SENTIMENT_RANK_BY_LOCATION,
  type SentimentSwotPlatform,
  type SentimentImprovementRow,
  type SentimentCitationRow,
  type SentimentLocationRow,
  type SentimentThemeRow,
  type SentimentPromptSubRow,
  type SentimentCompetitorRow,
} from '../data/sentimentReportData'

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand', label: 'Brand' },
  { id: 'prompt', label: 'Prompt' },
  { id: 'competitors', label: 'Competitors' },
]

function SentimentPercent({ value }: { value: number }) {
  return (
    <span className={value >= 80 ? 'text-chip-success-text' : 'text-text-primary'}>{value}%</span>
  )
}

function SentimentScoreStat({ score, delta, label }: { score: number; delta: string; label: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-sm">
        <span className="text-[32px] leading-10 tracking-[-0.64px] text-text-primary">{score}%</span>
        <span className="text-small text-chip-success-text">+{delta}</span>
      </div>
      <p className="mt-[4px] text-body text-text-secondary">{label}</p>
    </div>
  )
}

// ── Location dropdown (private, inline in title) ─────────────────────────────

const SWOT_LOCATIONS = ['All locations', ...SENTIMENT_BY_LOCATION.map((l) => l.location)]

function LocationDropdown({ selected, onChange }: { selected: string; onChange: (v: string) => void }) {
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
            {SWOT_LOCATIONS.map((l) => (
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

// ── Overview tab ──────────────────────────────────────────────────────────────

function SentimentOverviewTab({ onOpenCitation }: { onOpenCitation: (row: SentimentCitationRow) => void }) {
  const [swotPlatform, setSwotPlatform] = useState<SentimentSwotPlatform>('ChatGPT')
  const [swotLocation, setSwotLocation] = useState('All locations')

  const improvementColumns: Column<SentimentImprovementRow>[] = [
    { key: 'aiSite', label: 'AI site', width: 160 },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'summary', label: 'Summary', width: 480 },
  ]

  const citationColumns: Column<SentimentCitationRow>[] = [
    { key: 'webPage', label: 'Web page', width: 260 },
    { key: 'category', label: 'Category', width: 140 },
    { key: 'positiveSentiment', label: 'Positive sentiment', width: 140, render: (v) => <SentimentPercent value={v as number} /> },
    {
      key: 'strengths',
      label: 'Strengths',
      width: 220,
      render: (v) => (
        <div className="flex flex-wrap gap-xs">
          {(v as string[]).map((s) => <Chip key={s} label={s} variant="success" />)}
        </div>
      ),
    },
    {
      key: 'weaknesses',
      label: 'Weaknesses',
      width: 220,
      render: (v) => (
        <div className="flex flex-wrap gap-xs">
          {(v as string[]).map((w) => <Chip key={w} label={w} variant="danger" />)}
        </div>
      ),
    },
    { key: 'claimOccurrence', label: 'Claim occurrence', width: 140 },
  ]

  const locationColumns: Column<SentimentLocationRow>[] = [
    { key: 'location', label: 'Location', width: 220 },
    { key: 'sentiment', label: 'Sentiment', width: 140, render: (v) => <SentimentPercent value={v as number} /> },
    {
      key: 'delta',
      label: 'Change',
      width: 140,
      render: (v) => {
        const n = v as number
        return <span className={n >= 0 ? 'text-chip-success-text' : 'text-chip-danger-text'}>{n >= 0 ? '+' : ''}{n}%</span>
      },
    },
  ]

  const [trendRange, setTrendRange] = useState('Last 3 months')

  return (
    <>
      <div className="grid grid-cols-4 gap-lg">
        <div className="rounded-md border border-border bg-surface px-2xl py-xl">
          <div className="mb-md text-body text-text-primary">Sentiment score</div>
          <SentimentScoreStat score={SENTIMENT_SUMMARY.overall.score} delta={SENTIMENT_SUMMARY.overall.delta} label="Your sentiment score" />
        </div>
        <div className="col-span-3 rounded-md border border-border bg-surface px-2xl py-xl">
          <div className="mb-md text-body text-text-primary">Sentiment score consists of</div>
          <div className="flex gap-[100px]">
            <SentimentScoreStat score={SENTIMENT_SUMMARY.brand.score} delta={SENTIMENT_SUMMARY.brand.delta} label="Brand sentiment" />
            <SentimentScoreStat score={SENTIMENT_SUMMARY.prompt.score} delta={SENTIMENT_SUMMARY.prompt.delta} label="Prompt sentiment" />
          </div>
        </div>
      </div>

      <ChartCard
        title="What is your sentiment score over time?"
        subtitle="Track your positive sentiment across AI sites over time."
        toolbar={
          <div className="flex items-center gap-sm">
            <DateRangeSelector
              value={trendRange}
              options={['Last 3 months', 'Last 6 months', 'Last 12 months']}
              onChange={setTrendRange}
            />
            <button
              type="button"
              className="flex h-[32px] w-[32px] items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
            >
              <AiIcon size={16} />
            </button>
          </div>
        }
      >
        <TrendLineChart data={SENTIMENT_TREND} series={SENTIMENT_TREND_SERIES} />
        <div className="mt-sm flex flex-wrap items-center gap-xl px-xs">
          {SENTIMENT_TREND_SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-xs">
              <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[12px] text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      <SummaryCard
        title="Sentiment breakdown by AI site"
        subtitle="The percentage of positive sentiment across each AI site"
        stats={SENTIMENT_BY_AI_SITE.map((m) => ({ id: m.id, value: String(m.value), label: m.label }))}
      />

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="What is the sentiment and areas for improvement across AI sites" />
        <DataTable<SentimentImprovementRow> columns={improvementColumns} data={SENTIMENT_IMPROVEMENT_AREAS} autoRowHeight />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What are your strengths and weaknesses across AI sites for
              <LocationDropdown selected={swotLocation} onChange={setSwotLocation} />
            </span>
          }
          subtitle="Track AI-identified strengths and opportunities and take prioritized actions to improve."
        />
        <CardTabs
          tabs={SENTIMENT_SWOT_PLATFORMS.map((p) => ({ id: p, label: p }))}
          activeTab={swotPlatform}
          onChange={(id) => setSwotPlatform(id as SentimentSwotPlatform)}
        />
        <SentimentSwotGrid {...SENTIMENT_SWOT[swotPlatform]} />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Sentiment breakdown by citation" />
        <DataTable<SentimentCitationRow>
          columns={citationColumns}
          data={SENTIMENT_BY_CITATION}
          autoRowHeight
          onRowClick={onOpenCitation}
        />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Sentiment breakdown by location" />
        <DataTable<SentimentLocationRow> columns={locationColumns} data={SENTIMENT_BY_LOCATION} />
      </div>
    </>
  )
}

// ── Brand tab ─────────────────────────────────────────────────────────────────

function SentimentBrandTab() {
  return (
    <>
      <SummaryCard
        title="Brand sentiment"
        stats={[{ id: 'score', value: `${SENTIMENT_SUMMARY.brand.score}%`, label: `+${SENTIMENT_SUMMARY.brand.delta} vs last period` }]}
      />
      <SummaryCard
        title="Brand sentiment breakdown"
        subtitle="The percentage of positive brand sentiment across each AI site"
        stats={BRAND_SENTIMENT_BY_AI_SITE.map((m) => ({ id: m.id, value: String(m.value), label: m.label }))}
      />
    </>
  )
}

// ── Prompt tab ────────────────────────────────────────────────────────────────

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

function SentimentPromptTab() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flatRows: PromptFlatRow[] = []
  for (const theme of SENTIMENT_BY_THEME_AND_PROMPT as SentimentThemeRow[]) {
    flatRows.push({
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
        flatRows.push({
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

  const columns: Column<PromptFlatRow>[] = [
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
              toggle(row._id)
            }}
            className="flex items-center gap-sm"
          >
            <Icon name={expandedIds.has(row._id) ? 'expand_less' : 'expand_more'} size={16} className="text-text-icon" />
            <span className="text-[13px] text-text-primary">{row.theme}</span>
          </button>
        ) : (
          <span className="pl-[32px] text-small text-text-tertiary italic">{row.theme}</span>
        ),
    },
    { key: 'locations', label: 'Locations', width: 120 },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'chatgpt', label: 'ChatGPT', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'gemini', label: 'Gemini', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'perplexity', label: 'Perplexity', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
  ]

  return (
    <>
      <SummaryCard
        title="Prompt sentiment"
        stats={[
          { id: 'score', value: `${SENTIMENT_SUMMARY.prompt.score}%`, label: `+${SENTIMENT_SUMMARY.prompt.delta} vs last period` },
          { id: 'positive', value: `${PROMPT_SENTIMENT_BREAKDOWN.positive}%`, label: 'Positive' },
          { id: 'neutral', value: `${PROMPT_SENTIMENT_BREAKDOWN.neutral}%`, label: 'Neutral' },
          { id: 'negative', value: `${PROMPT_SENTIMENT_BREAKDOWN.negative}%`, label: 'Negative' },
        ]}
      />

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Sentiment by theme and prompt" />
        <DataTable<PromptFlatRow>
          columns={columns}
          data={flatRows}
          rowHeight={48}
          rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')}
        />
      </div>
    </>
  )
}

// ── Competitors tab ───────────────────────────────────────────────────────────

function SentimentCompetitorsTab({ onOpenCompetitor }: { onOpenCompetitor: (row: SentimentCompetitorRow) => void }) {
  const [competitorLocation, setCompetitorLocation] = useState('All locations')

  const competitorColumns: Column<SentimentCompetitorRow>[] = [
    {
      key: 'name',
      label: 'Competitor',
      width: 220,
      render: (v, row) => (
        <span className="flex items-center gap-sm">
          <span className="text-text-primary">{v as string}</span>
          {row.isYou && (
            <span className="shrink-0 rounded-full border border-white bg-gradient-to-b from-[#0f7195] to-[#094459] px-[8px] py-[2px] text-small text-white">
              You
            </span>
          )}
        </span>
      ),
    },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
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

  return (
    <>
      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Sentiment across competitors" />
        <div className="flex flex-wrap items-center gap-md">
          {SENTIMENT_COMPETITORS.map((c, i) => (
            <div key={c.name} className="flex items-center gap-md">
              {i > 0 && <span className="text-small text-text-tertiary">vs</span>}
              <div className="flex items-center gap-xs rounded-sm border border-border px-lg py-sm">
                <span className="text-body text-text-primary">{c.isYou ? 'You' : c.name}</span>
                <SentimentPercent value={c.sentiment} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What are your strengths and weaknesses compared to your competitors for
              <LocationDropdown selected={competitorLocation} onChange={setCompetitorLocation} />?
            </span>
          }
          subtitle="Analyze your strengths and weaknesses versus your competitors across answers generated by AI sites."
        />
        <DataTable<SentimentCompetitorRow>
          columns={competitorColumns}
          data={SENTIMENT_BY_COMPETITOR}
          autoRowHeight
          onRowClick={onOpenCompetitor}
        />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Competitive strengths and weakness matrix" />
        <SentimentComparisonMatrix
          traits={SENTIMENT_MATRIX_TRAITS}
          competitors={SENTIMENT_MATRIX_COMPETITORS}
          values={SENTIMENT_COMPARISON_MATRIX}
        />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Sentiment rank across themes and prompts" />
        <CompetitorRankingCard rows={SENTIMENT_RANK_BY_THEME} rankCount={5} avatarOnly />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader title="Sentiment rank across locations" />
        <CompetitorRankingCard mode="locations" data={SENTIMENT_RANK_BY_LOCATION} />
      </div>
    </>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

const MONTH_OPTIONS = ['Jun 2026', 'May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026', 'Jan 2026']

export function SentimentReportScreen() {
  const [activeTab, setActiveTab] = useState('overview')
  const [citationRow, setCitationRow] = useState<SentimentCitationRow | null>(null)
  const [competitorRow, setCompetitorRow] = useState<SentimentCompetitorRow | null>(null)
  const [month, setMonth] = useState(MONTH_OPTIONS[0])
  const [scopeView, setScopeView] = useState<'location' | 'brand'>('location')

  return (
    <div className="flex flex-1 flex-col min-h-0 min-w-0">
      <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
        <div className="flex flex-1 min-w-0 items-center gap-sm">
          <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
            Sentiment
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

      <div className="px-2xl pt-lg">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-xl px-2xl py-xl">
          {activeTab === 'overview' ? (
            <SentimentOverviewTab onOpenCitation={setCitationRow} />
          ) : activeTab === 'brand' ? (
            <SentimentBrandTab />
          ) : activeTab === 'prompt' ? (
            <SentimentPromptTab />
          ) : (
            <SentimentCompetitorsTab onOpenCompetitor={setCompetitorRow} />
          )}
        </div>
      </div>

      <CitationSentimentDrawer open={!!citationRow} row={citationRow} onClose={() => setCitationRow(null)} />
      <CompetitorSentimentDrawer open={!!competitorRow} row={competitorRow} onClose={() => setCompetitorRow(null)} />
    </div>
  )
}
