import { useState } from 'react'
import {
  Tabs,
  CardHeader,
  CardTabs,
  ChartCard,
  DataTable,
  TrendLineChart,
  Chip,
  Icon,
  InfoTooltip,
  DateRangeSelector,
  SegmentedControl,
  SummarizeIcon,
  SentimentSwotGrid,
  SentimentComparisonMatrix,
  SentimentAiSiteSection,
  CitationSentimentDrawer,
  CompetitorSentimentDrawer,
  MostMentionedTraitsCard,
  type Tab,
  type Column,
} from '../components'
import {
  SENTIMENT_SUMMARY,
  SENTIMENT_TREND,
  SENTIMENT_TREND_SERIES,
  SENTIMENT_TREND_ALL_LOCATIONS,
  SENTIMENT_TREND_BY_BRAND,
  SENTIMENT_TREND_BY_BRAND_SERIES,
  BRAND_SENTIMENT_BY_AI_SITE_TILES,
  PROMPT_SENTIMENT_BY_AI_SITE_TILES,
  SENTIMENT_SWOT_PLATFORMS,
  SENTIMENT_SWOT,
  SENTIMENT_IMPROVEMENT_AREAS,
  SENTIMENT_BY_CITATION,
  SENTIMENT_BY_LOCATION,
  PROMPT_SENTIMENT_BY_LOCATION,
  SENTIMENT_BY_THEME_AND_PROMPT,
  SENTIMENT_COMPETITORS,
  SENTIMENT_BY_COMPETITOR,
  SENTIMENT_MATRIX_TRAITS,
  SENTIMENT_MATRIX_COMPETITORS,
  SENTIMENT_COMPARISON_MATRIX,
  SENTIMENT_TRAITS,
  SENTIMENT_NEGATIVE_DRIVERS,
  type SentimentSwotPlatform,
  type SentimentImprovementRow,
  type SentimentCitationRow,
  type SentimentLocationRow,
  type SentimentThemeRow,
  type SentimentPromptSubRow,
  type SentimentCompetitorRow,
  type SentimentNegativeDriverRow,
} from '../data/sentimentReportData'

const TABS: Tab[] = [
  { id: 'existing-report', label: 'Existing report' },
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

const SWOT_LOCATIONS = ['all locations', ...SENTIMENT_BY_LOCATION.map((l) => l.location)]

function LocationDropdown({
  selected,
  onChange,
}: {
  selected: string
  onChange: (v: string) => void
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

// ── Existing report tab ─────────────────────────────────────────────────────

function SentimentExistingReportTab({ scopeView }: { scopeView: 'location' | 'brand' }) {
  const [trendRange, setTrendRange] = useState('Last 3 months')

  const isBrand = scopeView === 'brand'

  return (
    <ChartCard
      title={
        isBrand
          ? 'What is your sentiment score over time for all brands?'
          : 'What is your sentiment score over time across all locations?'
      }
      subtitle={
        isBrand
          ? 'Track sentiment score across all your brands over time.'
          : 'Track sentiment score across all your locations over time.'
      }
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
            <SummarizeIcon size={16} />
          </button>
        </div>
      }
    >
      {isBrand ? (
        <>
          <TrendLineChart data={SENTIMENT_TREND_BY_BRAND} series={SENTIMENT_TREND_BY_BRAND_SERIES} />
          <div className="mt-sm flex flex-wrap items-center gap-xl px-xs">
            {SENTIMENT_TREND_BY_BRAND_SERIES.map((s) => (
              <div key={s.key} className="flex items-center gap-xs">
                <span className="inline-block size-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[12px] text-text-secondary">{s.label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <TrendLineChart data={SENTIMENT_TREND_ALL_LOCATIONS} />
      )}
    </ChartCard>
  )
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function SentimentOverviewTab() {
  const improvementColumns: Column<SentimentImprovementRow>[] = [
    { key: 'aiSite', label: 'AI site', width: 160 },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'summary', label: 'Summary', width: 480 },
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
              <SummarizeIcon size={16} />
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

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader
          title="What is your sentiment score across AI sites?"
          subtitle="Analyze your sentiment score and find areas for improvement."
        />
        <DataTable<SentimentImprovementRow> columns={improvementColumns} data={SENTIMENT_IMPROVEMENT_AREAS} autoRowHeight />
      </div>

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader
          title="Sentiment breakdown by location"
          subtitle="Analyze how your sentiment score across all locations in answers generated by AI sites."
        />
        <DataTable<SentimentLocationRow> columns={locationColumns} data={SENTIMENT_BY_LOCATION} />
      </div>
    </>
  )
}

// ── Brand tab ─────────────────────────────────────────────────────────────────

function SentimentBrandTab({
  onOpenCitation,
  onOpenNegativeDriver,
}: {
  onOpenCitation: (row: SentimentCitationRow) => void
  onOpenNegativeDriver: (row: SentimentNegativeDriverRow) => void
}) {
  const [swotPlatform, setSwotPlatform] = useState<SentimentSwotPlatform>('ChatGPT')
  const [swotLocation, setSwotLocation] = useState('all locations')

  const negativeDriverColumns: Column<SentimentNegativeDriverRow>[] = [
    { key: 'webPage', label: 'Webpage', render: (v) => <span className="truncate text-text-primary">{v as string}</span> },
    {
      key: 'negativeClaim',
      label: 'Negative claim',
      render: (_, row) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-text-primary">{row.negativeClaim}</span>
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
      render: (v) => <span className="text-text-primary">{v as number}%</span>,
    },
    { key: 'citationShare', label: 'Citation share', width: 140, render: (v) => <span className="text-text-primary">{v as number}%</span> },
    { key: 'sentiment', label: 'Sentiment', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
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

  return (
    <>
      <SentimentAiSiteSection
        scoreTitle="Brand sentiment"
        scoreValue={`${SENTIMENT_SUMMARY.brand.score}%`}
        breakdownSubtitle="The percentage of positive brand sentiment across AI sites"
        breakdownStats={BRAND_SENTIMENT_BY_AI_SITE_TILES}
        tableTitle="What is the sentiment across AI sites for all locations?"
        tableSubtitle="Analyze your positive sentiment occurrences in answers generated by AI sites for all locations."
        rows={SENTIMENT_BY_LOCATION}
        showTable={false}
      />

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
        <CardHeader
          title="What are your top negative sentiment drivers"
          subtitle="Web pages most frequently cited for top negative claims across AI sites."
        />
        <DataTable<SentimentNegativeDriverRow>
          columns={negativeDriverColumns}
          data={SENTIMENT_NEGATIVE_DRIVERS}
          autoRowHeight
          onRowClick={onOpenNegativeDriver}
        />
      </div>

      <MostMentionedTraitsCard rows={SENTIMENT_TRAITS} />

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader
          title="What is your sentiment breakdown by citation?"
          subtitle="Analyze your sentiment across web pages that are cited in answers generated by AI sites."
        />
        <DataTable<SentimentCitationRow>
          columns={citationColumns}
          data={SENTIMENT_BY_CITATION}
          autoRowHeight
          onRowClick={onOpenCitation}
        />
      </div>
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
  const [themeLocation, setThemeLocation] = useState('all locations')

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
          <span className="pl-[32px] text-small text-[#555555]">{row.theme}</span>
        ),
    },
    { key: 'sentiment', label: 'Avg sentiment', width: 140, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'chatgpt', label: 'ChatGPT', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'gemini', label: 'Gemini', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
    { key: 'perplexity', label: 'Perplexity', width: 120, render: (v) => <SentimentPercent value={v as number} /> },
  ]

  return (
    <>
      <SentimentAiSiteSection
        scoreTitle="Prompt sentiment"
        scoreValue={`${SENTIMENT_SUMMARY.prompt.score}%`}
        breakdownSubtitle="The percentage of positive prompt sentiment across AI sites"
        breakdownStats={PROMPT_SENTIMENT_BY_AI_SITE_TILES}
        tableTitle="What is the sentiment across AI sites for all locations?"
        tableSubtitle="Analyze your sentiment scores and positive sentiment occurrences in answers generated by AI sites for all locations."
        rows={PROMPT_SENTIMENT_BY_LOCATION}
        showTable={false}
      />

      <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
        <CardHeader
          title={
            <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
              What is your sentiment by theme and prompts across
              <LocationDropdown selected={themeLocation} onChange={setThemeLocation} />
            </span>
          }
          subtitle="Track your positive sentiment in answers generated by AI sites."
        />
        <DataTable<PromptFlatRow>
          columns={columns}
          data={flatRows}
          autoRowHeight
          rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')}
        />
      </div>
    </>
  )
}

// ── Competitors tab ───────────────────────────────────────────────────────────

function SentimentCompetitorsTab({ onOpenCompetitor }: { onOpenCompetitor: (row: SentimentCompetitorRow) => void }) {
  const [competitorLocation, setCompetitorLocation] = useState('all locations')

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
        <CardHeader title="What are your competitive strengths and weaknesses by traits?" />
        <SentimentComparisonMatrix
          traits={SENTIMENT_MATRIX_TRAITS}
          competitors={SENTIMENT_MATRIX_COMPETITORS}
          values={SENTIMENT_COMPARISON_MATRIX}
        />
      </div>
    </>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

const MONTH_OPTIONS = ['Jun 2026', 'May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026', 'Jan 2026']

export function SentimentReportScreen() {
  const [activeTab, setActiveTab] = useState('overview')
  const [citationRow, setCitationRow] = useState<SentimentCitationRow | null>(null)
  const [negativeDriverRow, setNegativeDriverRow] = useState<SentimentNegativeDriverRow | null>(null)
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
          {activeTab === 'existing-report' ? (
            <SentimentExistingReportTab scopeView={scopeView} />
          ) : activeTab === 'overview' ? (
            <SentimentOverviewTab />
          ) : activeTab === 'brand' ? (
            <SentimentBrandTab onOpenCitation={setCitationRow} onOpenNegativeDriver={setNegativeDriverRow} />
          ) : activeTab === 'prompt' ? (
            <SentimentPromptTab />
          ) : (
            <SentimentCompetitorsTab onOpenCompetitor={setCompetitorRow} />
          )}
        </div>
      </div>

      <CitationSentimentDrawer open={!!citationRow} row={citationRow} onClose={() => setCitationRow(null)} />
      <CitationSentimentDrawer open={!!negativeDriverRow} row={negativeDriverRow} onClose={() => setNegativeDriverRow(null)} />
      <CompetitorSentimentDrawer open={!!competitorRow} row={competitorRow} onClose={() => setCompetitorRow(null)} />
    </div>
  )
}
