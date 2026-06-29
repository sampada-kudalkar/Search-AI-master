export interface Competitor {
  name: string
  hint: string
}

export const PLATFORMS = ['ChatGPT', 'Gemini', 'Perplexity'] as const
export type Platform = typeof PLATFORMS[number]

export interface CompetitorPlatformMetrics {
  visibilityScore: number
  visibilityDelta: number
  citationShare: number
  citationDelta: number
  avgRank: number
}

export interface CompetitorRowData extends Record<string, unknown> {
  name: string
  isYou?: boolean
  domain?: string
  metrics: Partial<Record<Platform, CompetitorPlatformMetrics>>
}

export const BRAND_NAME = 'My Family Dental'
export const REPORT_DATE = 'Jun 2026'

export const COMPETITORS: Competitor[] = [
  { name: 'Bowen Dental',                      hint: 'Consistent #2 across all platforms' },
  { name: 'Deeragun Dental',                   hint: 'Strong on Gemini & Perplexity' },
  { name: 'Innisfail Dentists',                hint: 'Strong ChatGPT presence' },
  { name: 'Serenity Dental CQ',                hint: 'Multi-platform competitor' },
  { name: 'Absolutely Dental @ Kirwan Plaza',  hint: 'Townsville-area competitor' },
  { name: 'Dental Balance NQ',                 hint: 'NQ-based competitor' },
  { name: 'National Dental Care Townsville',   hint: 'National chain, local presence' },
  { name: 'Riverside Family Dental Innisfail', hint: 'Innisfail local competitor' },
  { name: 'CP Dental Emerald',                 hint: 'Emerald region' },
  { name: 'Central Highlands Dental',          hint: 'Emerald/Highlands region' },
  { name: 'Sundown Family Dental',             hint: 'ChatGPT visible' },
  { name: 'Aspire Dental',                     hint: 'Gemini visible' },
  { name: 'Hinchinbrook Dental Group',         hint: 'Ingham area' },
  { name: 'Dental On Bowen',                   hint: 'Bowen area' },
  { name: 'Allon4plus',                        hint: 'Implant specialist' },
  { name: 'Kirwan Dentist / Dental Implants Clinic', hint: 'Kirwan implants focus' },
]

export const DEFAULT_SELECTED: string[] = [
  'Bowen Dental',
  'Deeragun Dental',
  'Innisfail Dentists',
  'Serenity Dental CQ',
  'Absolutely Dental @ Kirwan Plaza',
]

// Competitor brand metrics data for the comparison table.
// "You" row values come from seed data sections 3a, 4a, 6a.
// Competitor visibility scores come from seed data sections 3e–3g (share of voice %).
// Citation share and avg rank for competitors are mock values consistent with visibility ranking order.
// --- Trend chart data ---

export type TrendPlatform =
  | 'ChatGPT'
  | 'Perplexity'
  | 'Gemini'
  | 'Claude'
  | 'Google AI mode'
  | 'Google AI Overviews'
  | 'Grok'

export const TREND_PLATFORMS: TrendPlatform[] = [
  'ChatGPT',
  'Perplexity',
  'Gemini',
  'Claude',
  'Google AI mode',
  'Google AI Overviews',
  'Grok',
]

export interface TrendSeriesPoint {
  label: string
  you: number
  comp1: number
  comp2: number
  comp3: number
  comp4: number
  comp5: number
  [key: string]: number | string
}

export const TREND_SERIES_COLORS: Record<string, string> = {
  you:   '#1976d2',
  comp1: '#7c4dff',
  comp2: '#e056c7',
  comp3: '#f5b301',
  comp4: '#de1b0c',
  comp5: '#4cae3d',
}

function shift(pts: TrendSeriesPoint[], delta: number): TrendSeriesPoint[] {
  return pts.map((p) => ({
    ...p,
    you:   Math.min(100, Math.max(0, p.you   + delta)),
    comp1: Math.min(100, Math.max(0, p.comp1 + delta - 2)),
    comp2: Math.min(100, Math.max(0, p.comp2 - delta + 1)),
    comp3: Math.min(100, Math.max(0, p.comp3 + delta + 3)),
    comp4: Math.min(100, Math.max(0, p.comp4 - delta)),
    comp5: Math.min(100, Math.max(0, p.comp5 + delta - 1)),
  }))
}

const chatGPTData: TrendSeriesPoint[] = [
  { label: 'Mar\n2025', you: 64, comp1: 29, comp2: 43, comp3: 24, comp4: 78, comp5: 92 },
  { label: 'Apr',       you: 63, comp1: 31, comp2: 39, comp3: 23, comp4: 79, comp5: 86 },
  { label: 'May',       you: 58, comp1: 33, comp2: 38, comp3: 24, comp4: 68, comp5: 85 },
  { label: 'Jun',       you: 66, comp1: 35, comp2: 37, comp3: 26, comp4: 68, comp5: 83 },
  { label: 'Jul',       you: 67, comp1: 33, comp2: 38, comp3: 28, comp4: 66, comp5: 84 },
  { label: 'Aug',       you: 62, comp1: 38, comp2: 40, comp3: 29, comp4: 68, comp5: 82 },
  { label: 'Sep',       you: 57, comp1: 40, comp2: 40, comp3: 31, comp4: 72, comp5: 80 },
  { label: 'Oct',       you: 52, comp1: 31, comp2: 38, comp3: 22, comp4: 65, comp5: 81 },
  { label: 'Nov',       you: 61, comp1: 35, comp2: 38, comp3: 33, comp4: 44, comp5: 80 },
  { label: 'Dec',       you: 65, comp1: 45, comp2: 37, comp3: 36, comp4: 37, comp5: 79 },
]

export const TREND_DATA: Record<TrendPlatform, TrendSeriesPoint[]> = {
  'ChatGPT':            chatGPTData,
  'Perplexity':         shift(chatGPTData,  5),
  'Gemini':             shift(chatGPTData,  8),
  'Claude':             shift(chatGPTData, -4),
  'Google AI mode':     shift(chatGPTData,  3),
  'Google AI Overviews':shift(chatGPTData, -7),
  'Grok':               shift(chatGPTData,  6),
}

// --- Prompt ranking data ---

export interface RankingEntry {
  name: string
  isYou?: boolean
}

export interface PromptRankingRow extends Record<string, unknown> {
  id: string
  prompt: string
  rankings: Record<TrendPlatform, RankingEntry[]>
  prompts?: PromptRankingRow[]
}

const YOU: RankingEntry = { name: BRAND_NAME, isYou: true }
const BOWEN: RankingEntry = { name: 'Bowen Dental' }
const DEERAGUN: RankingEntry = { name: 'Deeragun Dental' }
const INNISFAIL: RankingEntry = { name: 'Innisfail Dentists' }
const SERENITY: RankingEntry = { name: 'Serenity Dental CQ' }
const ABSOLUTELY: RankingEntry = { name: 'Absolutely Dental' }
const NDC: RankingEntry = { name: 'National Dental Care' }
const RIVERSIDE: RankingEntry = { name: 'Riverside Family Dental' }

function rankingsForAll(base: RankingEntry[][]): Record<TrendPlatform, RankingEntry[]> {
  const [gpt, perp, gem, claude, gmode, gaio, grok] = base
  return {
    'ChatGPT':             gpt,
    'Perplexity':          perp,
    'Gemini':              gem,
    'Claude':              claude,
    'Google AI mode':      gmode,
    'Google AI Overviews': gaio,
    'Grok':                grok,
  }
}

export const PROMPT_RANKING_DATA: PromptRankingRow[] = [
  {
    id: 'p1',
    prompt: 'Best dentist',
    rankings: rankingsForAll([
      [YOU,       BOWEN,     INNISFAIL,  SERENITY,   ABSOLUTELY],
      [BOWEN,     YOU,       DEERAGUN,   INNISFAIL,  SERENITY  ],
      [YOU,       DEERAGUN,  BOWEN,      ABSOLUTELY, NDC       ],
      [INNISFAIL, YOU,       SERENITY,   BOWEN,      DEERAGUN  ],
      [YOU,       ABSOLUTELY,BOWEN,      RIVERSIDE,  INNISFAIL ],
      [BOWEN,     INNISFAIL, YOU,        DEERAGUN,   SERENITY  ],
      [YOU,       SERENITY,  NDC,        BOWEN,      DEERAGUN  ],
    ]),
    prompts: [
      {
        id: 'p1-1',
        prompt: 'Who is the best dentist near me?',
        rankings: rankingsForAll([
          [YOU,       INNISFAIL, BOWEN,      DEERAGUN,   SERENITY  ],
          [BOWEN,     YOU,       INNISFAIL,  SERENITY,   ABSOLUTELY],
          [YOU,       BOWEN,     ABSOLUTELY, NDC,        DEERAGUN  ],
          [INNISFAIL, SERENITY,  YOU,        BOWEN,      DEERAGUN  ],
          [YOU,       BOWEN,     INNISFAIL,  ABSOLUTELY, RIVERSIDE ],
          [INNISFAIL, BOWEN,     YOU,        SERENITY,   DEERAGUN  ],
          [YOU,       NDC,       SERENITY,   BOWEN,      INNISFAIL ],
        ]),
      },
      {
        id: 'p1-2',
        prompt: 'Best rated dentist in my city',
        rankings: rankingsForAll([
          [BOWEN,     YOU,       SERENITY,   INNISFAIL,  ABSOLUTELY],
          [YOU,       DEERAGUN,  BOWEN,      SERENITY,   NDC       ],
          [DEERAGUN,  YOU,       INNISFAIL,  BOWEN,      SERENITY  ],
          [YOU,       BOWEN,     DEERAGUN,   INNISFAIL,  ABSOLUTELY],
          [ABSOLUTELY,BOWEN,     YOU,        SERENITY,   INNISFAIL ],
          [BOWEN,     YOU,       DEERAGUN,   INNISFAIL,  SERENITY  ],
          [SERENITY,  YOU,       BOWEN,      DEERAGUN,   NDC       ],
        ]),
      },
      {
        id: 'p1-3',
        prompt: 'Top dentist for families',
        rankings: rankingsForAll([
          [YOU,       SERENITY,  BOWEN,      NDC,        INNISFAIL ],
          [INNISFAIL, YOU,       BOWEN,      DEERAGUN,   SERENITY  ],
          [BOWEN,     INNISFAIL, YOU,        SERENITY,   ABSOLUTELY],
          [SERENITY,  YOU,       INNISFAIL,  BOWEN,      NDC       ],
          [YOU,       INNISFAIL, BOWEN,      DEERAGUN,   SERENITY  ],
          [BOWEN,     SERENITY,  YOU,        NDC,        DEERAGUN  ],
          [YOU,       BOWEN,     INNISFAIL,  SERENITY,   DEERAGUN  ],
        ]),
      },
    ],
  },
  {
    id: 'p2',
    prompt: 'Top 5 dentist near me',
    rankings: rankingsForAll([
      [BOWEN,     DEERAGUN,  INNISFAIL,  YOU,        SERENITY  ],
      [YOU,       BOWEN,     ABSOLUTELY, NDC,        RIVERSIDE ],
      [DEERAGUN,  YOU,       INNISFAIL,  SERENITY,   BOWEN     ],
      [BOWEN,     SERENITY,  YOU,        DEERAGUN,   ABSOLUTELY],
      [INNISFAIL, BOWEN,     DEERAGUN,   YOU,        NDC       ],
      [YOU,       DEERAGUN,  BOWEN,      SERENITY,   INNISFAIL ],
      [BOWEN,     YOU,       RIVERSIDE,  DEERAGUN,   SERENITY  ],
    ]),
    prompts: [
      {
        id: 'p2-1',
        prompt: 'List top 5 dentists near me',
        rankings: rankingsForAll([
          [DEERAGUN,  BOWEN,     YOU,        SERENITY,   INNISFAIL ],
          [YOU,       ABSOLUTELY,BOWEN,      NDC,        DEERAGUN  ],
          [BOWEN,     DEERAGUN,  YOU,        INNISFAIL,  SERENITY  ],
          [SERENITY,  BOWEN,     DEERAGUN,   YOU,        ABSOLUTELY],
          [BOWEN,     INNISFAIL, YOU,        DEERAGUN,   NDC       ],
          [DEERAGUN,  YOU,       SERENITY,   BOWEN,      INNISFAIL ],
          [YOU,       RIVERSIDE, BOWEN,      DEERAGUN,   SERENITY  ],
        ]),
      },
      {
        id: 'p2-2',
        prompt: 'Best dental practices in my area ranked',
        rankings: rankingsForAll([
          [INNISFAIL, BOWEN,     DEERAGUN,   YOU,        NDC       ],
          [BOWEN,     YOU,       NDC,        ABSOLUTELY, RIVERSIDE ],
          [YOU,       INNISFAIL, SERENITY,   DEERAGUN,   BOWEN     ],
          [BOWEN,     YOU,       SERENITY,   DEERAGUN,   ABSOLUTELY],
          [DEERAGUN,  BOWEN,     INNISFAIL,  NDC,        YOU       ],
          [YOU,       BOWEN,     DEERAGUN,   INNISFAIL,  SERENITY  ],
          [RIVERSIDE, BOWEN,     YOU,        SERENITY,   DEERAGUN  ],
        ]),
      },
    ],
  },
  {
    id: 'p3',
    prompt: 'Best dentist for teeth cleaning',
    rankings: rankingsForAll([
      [INNISFAIL, BOWEN,     YOU,        DEERAGUN,   NDC       ],
      [YOU,       INNISFAIL, SERENITY,   BOWEN,      ABSOLUTELY],
      [BOWEN,     YOU,       DEERAGUN,   RIVERSIDE,  INNISFAIL ],
      [SERENITY,  BOWEN,     INNISFAIL,  YOU,        NDC       ],
      [YOU,       SERENITY,  BOWEN,      DEERAGUN,   INNISFAIL ],
      [INNISFAIL, YOU,       BOWEN,      ABSOLUTELY, DEERAGUN  ],
      [DEERAGUN,  INNISFAIL, YOU,        BOWEN,      SERENITY  ],
    ]),
    prompts: [
      {
        id: 'p3-1',
        prompt: 'Who does the best teeth cleaning near me?',
        rankings: rankingsForAll([
          [BOWEN,     INNISFAIL, YOU,        NDC,        DEERAGUN  ],
          [INNISFAIL, YOU,       BOWEN,      SERENITY,   ABSOLUTELY],
          [YOU,       BOWEN,     RIVERSIDE,  DEERAGUN,   INNISFAIL ],
          [BOWEN,     SERENITY,  YOU,        INNISFAIL,  NDC       ],
          [SERENITY,  YOU,       DEERAGUN,   BOWEN,      INNISFAIL ],
          [YOU,       INNISFAIL, ABSOLUTELY, BOWEN,      DEERAGUN  ],
          [INNISFAIL, YOU,       BOWEN,      SERENITY,   DEERAGUN  ],
        ]),
      },
      {
        id: 'p3-2',
        prompt: 'Affordable teeth cleaning dentist',
        rankings: rankingsForAll([
          [YOU,       NDC,       BOWEN,      INNISFAIL,  DEERAGUN  ],
          [SERENITY,  INNISFAIL, YOU,        ABSOLUTELY, BOWEN     ],
          [DEERAGUN,  BOWEN,     YOU,        INNISFAIL,  RIVERSIDE ],
          [INNISFAIL, YOU,       SERENITY,   NDC,        BOWEN     ],
          [YOU,       BOWEN,     SERENITY,   INNISFAIL,  DEERAGUN  ],
          [BOWEN,     ABSOLUTELY,INNISFAIL,  YOU,        DEERAGUN  ],
          [YOU,       SERENITY,  DEERAGUN,   INNISFAIL,  BOWEN     ],
        ]),
      },
    ],
  },
  {
    id: 'p4',
    prompt: 'Sensitive teeth',
    rankings: rankingsForAll([
      [SERENITY,  YOU,       BOWEN,      ABSOLUTELY, DEERAGUN  ],
      [DEERAGUN,  SERENITY,  YOU,        BOWEN,      NDC       ],
      [YOU,       SERENITY,  INNISFAIL,  BOWEN,      ABSOLUTELY],
      [BOWEN,     YOU,       DEERAGUN,   SERENITY,   INNISFAIL ],
      [SERENITY,  NDC,       YOU,        BOWEN,      DEERAGUN  ],
      [YOU,       BOWEN,     SERENITY,   INNISFAIL,  ABSOLUTELY],
      [INNISFAIL, YOU,       BOWEN,      SERENITY,   DEERAGUN  ],
    ]),
    prompts: [
      {
        id: 'p4-1',
        prompt: 'Dentist for sensitive teeth near me',
        rankings: rankingsForAll([
          [YOU,       SERENITY,  ABSOLUTELY, BOWEN,      DEERAGUN  ],
          [SERENITY,  YOU,       BOWEN,      DEERAGUN,   NDC       ],
          [SERENITY,  INNISFAIL, YOU,        BOWEN,      ABSOLUTELY],
          [YOU,       DEERAGUN,  BOWEN,      SERENITY,   INNISFAIL ],
          [NDC,       SERENITY,  BOWEN,      YOU,        DEERAGUN  ],
          [BOWEN,     YOU,       INNISFAIL,  SERENITY,   ABSOLUTELY],
          [YOU,       BOWEN,     SERENITY,   INNISFAIL,  DEERAGUN  ],
        ]),
      },
      {
        id: 'p4-2',
        prompt: 'Best treatment for tooth sensitivity',
        rankings: rankingsForAll([
          [ABSOLUTELY,SERENITY,  YOU,        DEERAGUN,   BOWEN     ],
          [YOU,       DEERAGUN,  SERENITY,   NDC,        BOWEN     ],
          [INNISFAIL, YOU,       SERENITY,   ABSOLUTELY, BOWEN     ],
          [DEERAGUN,  BOWEN,     YOU,        INNISFAIL,  SERENITY  ],
          [SERENITY,  YOU,       NDC,        DEERAGUN,   BOWEN     ],
          [YOU,       SERENITY,  BOWEN,      ABSOLUTELY, INNISFAIL ],
          [BOWEN,     INNISFAIL, YOU,        DEERAGUN,   SERENITY  ],
        ]),
      },
    ],
  },
  {
    id: 'p5',
    prompt: 'Local dentist',
    rankings: rankingsForAll([
      [ABSOLUTELY,YOU,       BOWEN,      INNISFAIL,  RIVERSIDE ],
      [YOU,       ABSOLUTELY,DEERAGUN,   BOWEN,      SERENITY  ],
      [BOWEN,     INNISFAIL, YOU,        ABSOLUTELY, NDC       ],
      [YOU,       BOWEN,     ABSOLUTELY, SERENITY,   DEERAGUN  ],
      [DEERAGUN,  YOU,       INNISFAIL,  BOWEN,      ABSOLUTELY],
      [BOWEN,     SERENITY,  YOU,        DEERAGUN,   NDC       ],
      [YOU,       BOWEN,     ABSOLUTELY, INNISFAIL,  SERENITY  ],
    ]),
    prompts: [
      {
        id: 'p5-1',
        prompt: 'Find a local dentist accepting new patients',
        rankings: rankingsForAll([
          [YOU,       BOWEN,     ABSOLUTELY, RIVERSIDE,  INNISFAIL ],
          [ABSOLUTELY,YOU,       BOWEN,      DEERAGUN,   SERENITY  ],
          [INNISFAIL, BOWEN,     ABSOLUTELY, YOU,        NDC       ],
          [BOWEN,     YOU,       SERENITY,   ABSOLUTELY, DEERAGUN  ],
          [YOU,       DEERAGUN,  BOWEN,      INNISFAIL,  ABSOLUTELY],
          [SERENITY,  BOWEN,     DEERAGUN,   YOU,        NDC       ],
          [BOWEN,     ABSOLUTELY,YOU,        SERENITY,   INNISFAIL ],
        ]),
      },
      {
        id: 'p5-2',
        prompt: 'Local dental clinic with good reviews',
        rankings: rankingsForAll([
          [INNISFAIL, ABSOLUTELY,YOU,        BOWEN,      RIVERSIDE ],
          [YOU,       SERENITY,  ABSOLUTELY, DEERAGUN,   BOWEN     ],
          [ABSOLUTELY,YOU,       NDC,        INNISFAIL,  BOWEN     ],
          [SERENITY,  ABSOLUTELY,YOU,        DEERAGUN,   BOWEN     ],
          [BOWEN,     INNISFAIL, DEERAGUN,   ABSOLUTELY, YOU       ],
          [YOU,       DEERAGUN,  BOWEN,      SERENITY,   NDC       ],
          [ABSOLUTELY,YOU,       INNISFAIL,  BOWEN,      SERENITY  ],
        ]),
      },
    ],
  },
  {
    id: 'p6',
    prompt: 'Chipped tooth',
    rankings: rankingsForAll([
      [NDC,       BOWEN,     YOU,        SERENITY,   DEERAGUN  ],
      [YOU,       NDC,       BOWEN,      ABSOLUTELY, INNISFAIL ],
      [SERENITY,  YOU,       BOWEN,      NDC,        DEERAGUN  ],
      [BOWEN,     SERENITY,  NDC,        YOU,        INNISFAIL ],
      [YOU,       BOWEN,     SERENITY,   DEERAGUN,   NDC       ],
      [NDC,       YOU,       INNISFAIL,  BOWEN,      SERENITY  ],
      [BOWEN,     DEERAGUN,  YOU,        NDC,        SERENITY  ],
    ]),
    prompts: [
      {
        id: 'p6-1',
        prompt: 'Emergency dentist for chipped tooth',
        rankings: rankingsForAll([
          [BOWEN,     NDC,       YOU,        DEERAGUN,   SERENITY  ],
          [NDC,       YOU,       ABSOLUTELY, BOWEN,      INNISFAIL ],
          [YOU,       BOWEN,     SERENITY,   NDC,        DEERAGUN  ],
          [SERENITY,  NDC,       BOWEN,      YOU,        INNISFAIL ],
          [BOWEN,     YOU,       DEERAGUN,   SERENITY,   NDC       ],
          [YOU,       INNISFAIL, NDC,        BOWEN,      SERENITY  ],
          [DEERAGUN,  BOWEN,     NDC,        YOU,        SERENITY  ],
        ]),
      },
      {
        id: 'p6-2',
        prompt: 'How to fix a chipped tooth cost',
        rankings: rankingsForAll([
          [YOU,       SERENITY,  NDC,        BOWEN,      DEERAGUN  ],
          [BOWEN,     INNISFAIL, YOU,        NDC,        ABSOLUTELY],
          [NDC,       SERENITY,  YOU,        BOWEN,      DEERAGUN  ],
          [NDC,       BOWEN,     YOU,        SERENITY,   INNISFAIL ],
          [SERENITY,  BOWEN,     YOU,        NDC,        DEERAGUN  ],
          [INNISFAIL, NDC,       BOWEN,      YOU,        SERENITY  ],
          [YOU,       NDC,       BOWEN,      DEERAGUN,   SERENITY  ],
        ]),
      },
    ],
  },
]

// --- Competitor brand metrics ---

// --- Per-competitor detail data ---

export interface CompetitorPlatformCitationRow extends Record<string, unknown> {
  platform: string
  citations: number
  percentage: number
  trend: number
  color: string
}

export interface CompetitorThemeRow extends Record<string, unknown> {
  theme: string
  youVisibility: number
  youDelta: number
  competitorVisibility: number
  competitorDelta: number
  gap: number
}

export interface CompetitorShareRow extends Record<string, unknown> {
  metric: string
  you: string
  youRaw: number
  competitor: string
  competitorRaw: number
  sharePercent: number
}

export interface CompetitorDetailStat {
  citationShare: number
  citationDelta: number
  visibilityScore: number
  visibilityDelta: number
  rank: number
  youCitationShare: number
  youCitationDelta: number
  youVisibilityScore: number
  youVisibilityDelta: number
  youRank: number
}

export interface CompetitorLocationRow extends Record<string, unknown> {
  location: string
  citationShare: number
  citationDelta: number
  visibilityScore: number
  visibilityDelta: number
  rank: number
  isYou?: boolean
}

export interface CompetitorDetailTrendPoint {
  label: string
  you: number
  competitor: number
  [key: string]: number | string
}

export interface CompetitorDetail {
  competitorName: string
  summary: CompetitorDetailStat
  // Card 2 — visibility ranking trend
  rankTrend: CompetitorDetailTrendPoint[]
  // Card 3 — locations visibility (existing citationTrend/visibilityTrend keep Card 2 data)
  locationVisibilityTrend: CompetitorDetailTrendPoint[]
  locations: CompetitorLocationRow[]
  // Card 5 — citation by platform
  citationByPlatform: { name: string; value: number; color: string }[]
  citationByPlatformRows: CompetitorPlatformCitationRow[]
  // Card 6 — theme visibility
  themeTrend: CompetitorDetailTrendPoint[]
  themes: CompetitorThemeRow[]
  // Card 7 — share of voice
  shareOfVoice: CompetitorShareRow[]
}

const SHARED_CITATION_PLATFORMS = (youShare: number, compShare: number) => [
  { name: 'Google AI',       value: Math.round(youShare * 3.1), color: '#4285f4' },
  { name: 'ChatGPT',         value: Math.round(youShare * 2.4), color: '#10a37f' },
  { name: 'Perplexity',      value: Math.round(youShare * 1.8), color: '#20b2aa' },
  { name: 'Gemini',          value: Math.round(youShare * 1.5), color: '#fbbc04' },
  { name: 'DentalPlans.com', value: Math.round(compShare * 2.2), color: '#ea4335' },
  { name: 'Doctor.com',      value: Math.round(compShare * 1.6), color: '#7c4dff' },
  { name: 'HealthGrades',    value: Math.round(compShare * 1.2), color: '#e056c7' },
]

const SHARED_CITATION_ROWS = (youShare: number, compShare: number): CompetitorPlatformCitationRow[] => [
  { platform: 'Google AI',       citations: Math.round(youShare * 3.1),  percentage: 31.2, trend: 2.1,  color: '#4285f4' },
  { platform: 'ChatGPT',         citations: Math.round(youShare * 2.4),  percentage: 24.3, trend: 1.5,  color: '#10a37f' },
  { platform: 'Perplexity',      citations: Math.round(youShare * 1.8),  percentage: 18.1, trend: -0.8, color: '#20b2aa' },
  { platform: 'Gemini',          citations: Math.round(youShare * 1.5),  percentage: 14.9, trend: 0.6,  color: '#fbbc04' },
  { platform: 'DentalPlans.com', citations: Math.round(compShare * 2.2), percentage: 6.8,  trend: -1.2, color: '#ea4335' },
  { platform: 'Doctor.com',      citations: Math.round(compShare * 1.6), percentage: 4.7,  trend: 0.3,  color: '#7c4dff' },
]

const SHARED_THEMES = (youBase: number, compBase: number): CompetitorThemeRow[] => [
  { theme: 'Best dentist',          youVisibility: youBase,        youDelta: 3.2,  competitorVisibility: compBase,        competitorDelta: 1.1, gap: youBase - compBase },
  { theme: 'Family dentist',        youVisibility: youBase - 5.1,  youDelta: 2.1,  competitorVisibility: compBase - 1.2,  competitorDelta: 0.8, gap: (youBase - 5.1) - (compBase - 1.2) },
  { theme: 'Emergency dental',      youVisibility: youBase - 8.4,  youDelta: -1.3, competitorVisibility: compBase + 2.1,  competitorDelta: 2.4, gap: (youBase - 8.4) - (compBase + 2.1) },
  { theme: 'Teeth cleaning',        youVisibility: youBase + 2.3,  youDelta: 4.1,  competitorVisibility: compBase - 0.8,  competitorDelta: 0.2, gap: (youBase + 2.3) - (compBase - 0.8) },
  { theme: 'Sensitive teeth',       youVisibility: youBase - 3.7,  youDelta: 1.8,  competitorVisibility: compBase + 1.4,  competitorDelta: 1.6, gap: (youBase - 3.7) - (compBase + 1.4) },
  { theme: 'Dental implants',       youVisibility: youBase - 11.2, youDelta: -2.4, competitorVisibility: compBase - 3.1,  competitorDelta: -0.5, gap: (youBase - 11.2) - (compBase - 3.1) },
  { theme: 'Teeth whitening',       youVisibility: youBase + 4.5,  youDelta: 5.2,  competitorVisibility: compBase + 0.9,  competitorDelta: 0.7, gap: (youBase + 4.5) - (compBase + 0.9) },
]

const SHARED_THEME_TREND = (youBase: number, compBase: number): CompetitorDetailTrendPoint[] => [
  { label: 'Mar', you: youBase - 6, competitor: compBase - 3 },
  { label: 'Apr', you: youBase - 5, competitor: compBase - 2.5 },
  { label: 'May', you: youBase - 4, competitor: compBase - 2 },
  { label: 'Jun', you: youBase - 3, competitor: compBase - 1.5 },
  { label: 'Jul', you: youBase - 2, competitor: compBase - 1 },
  { label: 'Aug', you: youBase - 1, competitor: compBase - 0.5 },
  { label: 'Sep', you: youBase,     competitor: compBase },
  { label: 'Oct', you: youBase + 1, competitor: compBase + 0.5 },
  { label: 'Nov', you: youBase + 2, competitor: compBase + 1 },
  { label: 'Dec', you: youBase + 3, competitor: compBase + 1.5 },
]

const SHARED_SHARE_OF_VOICE = (_compName: string, youVis: number, compVis: number): CompetitorShareRow[] => [
  { metric: 'Visibility score', you: `${youVis.toFixed(1)}%`,  youRaw: youVis,  competitor: `${compVis.toFixed(1)}%`,                  competitorRaw: compVis,  sharePercent: Math.round(youVis / (youVis + compVis) * 100) },
  { metric: 'Citation share',   you: '10.5%',                  youRaw: 10.47,   competitor: `${(10.47 * compVis / youVis).toFixed(1)}%`, competitorRaw: 10.47 * compVis / youVis, sharePercent: Math.round(10.47 / (10.47 + 10.47 * compVis / youVis) * 100) },
  { metric: 'Avg rank',         you: '4',                      youRaw: 4,       competitor: String(Math.round(4 * youVis / compVis)),    competitorRaw: Math.round(4 * youVis / compVis), sharePercent: Math.round(compVis / youVis * 40) },
  { metric: 'Appearances',      you: '1,240',                  youRaw: 1240,    competitor: String(Math.round(1240 * compVis / youVis)), competitorRaw: Math.round(1240 * compVis / youVis), sharePercent: Math.round(youVis / (youVis + compVis) * 100) },
]

export const COMPETITOR_DETAILS: Record<string, CompetitorDetail> = {
  'Bowen Dental': {
    competitorName: 'Bowen Dental',
    summary: {
      citationShare: 2.33, citationDelta: 0.5,
      visibilityScore: 10.0, visibilityDelta: -2.2,
      rank: 5,
      youCitationShare: 10.47, youCitationDelta: 1.47,
      youVisibilityScore: 51.3, youVisibilityDelta: 5.0,
      youRank: 4,
    },
    rankTrend: [
      { label: 'Mar', you: 6, competitor: 7 },
      { label: 'Apr', you: 6, competitor: 7 },
      { label: 'May', you: 5, competitor: 6 },
      { label: 'Jun', you: 5, competitor: 6 },
      { label: 'Jul', you: 4, competitor: 6 },
      { label: 'Aug', you: 4, competitor: 5 },
      { label: 'Sep', you: 4, competitor: 5 },
      { label: 'Oct', you: 4, competitor: 5 },
      { label: 'Nov', you: 4, competitor: 5 },
      { label: 'Dec', you: 4, competitor: 5 },
    ],
    locationVisibilityTrend: [
      { label: 'Mar', you: 46.2, competitor: 11.8 },
      { label: 'Apr', you: 47.5, competitor: 12.1 },
      { label: 'May', you: 44.3, competitor: 11.5 },
      { label: 'Jun', you: 48.8, competitor: 12.4 },
      { label: 'Jul', you: 50.1, competitor: 11.9 },
      { label: 'Aug', you: 49.6, competitor: 12.7 },
      { label: 'Sep', you: 47.9, competitor: 11.4 },
      { label: 'Oct', you: 48.4, competitor: 10.8 },
      { label: 'Nov', you: 50.9, competitor: 10.5 },
      { label: 'Dec', you: 51.3, competitor: 10.0 },
    ],
    locations: [
      { location: BRAND_NAME,   isYou: true, citationShare: 10.47, citationDelta: 1.47,  visibilityScore: 51.3, visibilityDelta: 5.0,  rank: 4 },
      { location: 'Bowen',      citationShare: 2.33,  citationDelta: 0.50,  visibilityScore: 10.0, visibilityDelta: -2.2, rank: 5 },
      { location: 'Townsville', citationShare: 1.80,  citationDelta: 0.20,  visibilityScore: 8.4,  visibilityDelta: -1.1, rank: 6 },
      { location: 'Mackay',     citationShare: 0.90,  citationDelta: -0.10, visibilityScore: 5.2,  visibilityDelta: 0.3,  rank: 8 },
    ],
    citationByPlatform: SHARED_CITATION_PLATFORMS(10.47, 2.33),
    citationByPlatformRows: SHARED_CITATION_ROWS(10.47, 2.33),
    themeTrend: SHARED_THEME_TREND(51.3, 10.0),
    themes: SHARED_THEMES(51.3, 10.0),
    shareOfVoice: SHARED_SHARE_OF_VOICE('Bowen Dental', 51.3, 10.0),
  },
  'Innisfail Dentists': {
    competitorName: 'Innisfail Dentists',
    summary: {
      citationShare: 4.81, citationDelta: 0.9,
      visibilityScore: 4.9, visibilityDelta: 0.6,
      rank: 3,
      youCitationShare: 10.47, youCitationDelta: 1.47,
      youVisibilityScore: 51.3, youVisibilityDelta: 5.0,
      youRank: 4,
    },
    rankTrend: [
      { label: 'Mar', you: 6, competitor: 4 },
      { label: 'Apr', you: 6, competitor: 4 },
      { label: 'May', you: 5, competitor: 3 },
      { label: 'Jun', you: 5, competitor: 3 },
      { label: 'Jul', you: 4, competitor: 3 },
      { label: 'Aug', you: 4, competitor: 3 },
      { label: 'Sep', you: 4, competitor: 3 },
      { label: 'Oct', you: 4, competitor: 3 },
      { label: 'Nov', you: 4, competitor: 3 },
      { label: 'Dec', you: 4, competitor: 3 },
    ],
    locationVisibilityTrend: [
      { label: 'Mar', you: 46.2, competitor: 4.2 },
      { label: 'Apr', you: 47.5, competitor: 4.3 },
      { label: 'May', you: 44.3, competitor: 4.0 },
      { label: 'Jun', you: 48.8, competitor: 4.4 },
      { label: 'Jul', you: 50.1, competitor: 4.6 },
      { label: 'Aug', you: 49.6, competitor: 4.5 },
      { label: 'Sep', you: 47.9, competitor: 4.7 },
      { label: 'Oct', you: 48.4, competitor: 4.3 },
      { label: 'Nov', you: 50.9, competitor: 4.8 },
      { label: 'Dec', you: 51.3, competitor: 4.9 },
    ],
    locations: [
      { location: BRAND_NAME,  isYou: true, citationShare: 10.47, citationDelta: 1.47,  visibilityScore: 51.3, visibilityDelta: 5.0,  rank: 4 },
      { location: 'Innisfail', citationShare: 4.81,  citationDelta: 0.90,  visibilityScore: 4.9,  visibilityDelta: 0.6,  rank: 3 },
      { location: 'Cairns',    citationShare: 2.10,  citationDelta: 0.30,  visibilityScore: 3.1,  visibilityDelta: 0.2,  rank: 7 },
    ],
    citationByPlatform: SHARED_CITATION_PLATFORMS(10.47, 4.81),
    citationByPlatformRows: SHARED_CITATION_ROWS(10.47, 4.81),
    themeTrend: SHARED_THEME_TREND(51.3, 4.9),
    themes: SHARED_THEMES(51.3, 4.9),
    shareOfVoice: SHARED_SHARE_OF_VOICE('Innisfail Dentists', 51.3, 4.9),
  },
  'Deeragun Dental': {
    competitorName: 'Deeragun Dental',
    summary: {
      citationShare: 1.16, citationDelta: 0.1,
      visibilityScore: 1.8, visibilityDelta: 0.2,
      rank: 8,
      youCitationShare: 10.47, youCitationDelta: 1.47,
      youVisibilityScore: 51.3, youVisibilityDelta: 5.0,
      youRank: 4,
    },
    rankTrend: [
      { label: 'Mar', you: 6, competitor: 10 },
      { label: 'Apr', you: 6, competitor: 9 },
      { label: 'May', you: 5, competitor: 9 },
      { label: 'Jun', you: 5, competitor: 9 },
      { label: 'Jul', you: 4, competitor: 8 },
      { label: 'Aug', you: 4, competitor: 8 },
      { label: 'Sep', you: 4, competitor: 8 },
      { label: 'Oct', you: 4, competitor: 8 },
      { label: 'Nov', you: 4, competitor: 8 },
      { label: 'Dec', you: 4, competitor: 8 },
    ],
    locationVisibilityTrend: [
      { label: 'Mar', you: 46.2, competitor: 1.5 },
      { label: 'Apr', you: 47.5, competitor: 1.5 },
      { label: 'May', you: 44.3, competitor: 1.4 },
      { label: 'Jun', you: 48.8, competitor: 1.6 },
      { label: 'Jul', you: 50.1, competitor: 1.7 },
      { label: 'Aug', you: 49.6, competitor: 1.6 },
      { label: 'Sep', you: 47.9, competitor: 1.8 },
      { label: 'Oct', you: 48.4, competitor: 1.7 },
      { label: 'Nov', you: 50.9, competitor: 1.7 },
      { label: 'Dec', you: 51.3, competitor: 1.8 },
    ],
    locations: [
      { location: BRAND_NAME,  isYou: true, citationShare: 10.47, citationDelta: 1.47,  visibilityScore: 51.3, visibilityDelta: 5.0,  rank: 4 },
      { location: 'Deeragun',  citationShare: 1.16,  citationDelta: 0.10,  visibilityScore: 1.8,  visibilityDelta: 0.2,  rank: 8 },
    ],
    citationByPlatform: SHARED_CITATION_PLATFORMS(10.47, 1.16),
    citationByPlatformRows: SHARED_CITATION_ROWS(10.47, 1.16),
    themeTrend: SHARED_THEME_TREND(51.3, 1.8),
    themes: SHARED_THEMES(51.3, 1.8),
    shareOfVoice: SHARED_SHARE_OF_VOICE('Deeragun Dental', 51.3, 1.8),
  },
  'Absolutely Dental @ Kirwan Plaza': {
    competitorName: 'Absolutely Dental @ Kirwan Plaza',
    summary: {
      citationShare: 1.16, citationDelta: 0.1,
      visibilityScore: 9.8, visibilityDelta: 6.3,
      rank: 6,
      youCitationShare: 10.47, youCitationDelta: 1.47,
      youVisibilityScore: 51.3, youVisibilityDelta: 5.0,
      youRank: 4,
    },
    rankTrend: [
      { label: 'Mar', you: 6, competitor: 12 },
      { label: 'Apr', you: 6, competitor: 11 },
      { label: 'May', you: 5, competitor: 10 },
      { label: 'Jun', you: 5, competitor: 9 },
      { label: 'Jul', you: 4, competitor: 8 },
      { label: 'Aug', you: 4, competitor: 8 },
      { label: 'Sep', you: 4, competitor: 7 },
      { label: 'Oct', you: 4, competitor: 7 },
      { label: 'Nov', you: 4, competitor: 6 },
      { label: 'Dec', you: 4, competitor: 6 },
    ],
    locationVisibilityTrend: [
      { label: 'Mar', you: 46.2, competitor: 3.4 },
      { label: 'Apr', you: 47.5, competitor: 4.0 },
      { label: 'May', you: 44.3, competitor: 4.5 },
      { label: 'Jun', you: 48.8, competitor: 5.2 },
      { label: 'Jul', you: 50.1, competitor: 6.4 },
      { label: 'Aug', you: 49.6, competitor: 7.1 },
      { label: 'Sep', you: 47.9, competitor: 7.9 },
      { label: 'Oct', you: 48.4, competitor: 8.5 },
      { label: 'Nov', you: 50.9, competitor: 9.2 },
      { label: 'Dec', you: 51.3, competitor: 9.8 },
    ],
    locations: [
      { location: BRAND_NAME,     isYou: true, citationShare: 10.47, citationDelta: 1.47,  visibilityScore: 51.3, visibilityDelta: 5.0,  rank: 4 },
      { location: 'Kirwan Plaza', citationShare: 1.16, citationDelta: 0.10,  visibilityScore: 9.8,  visibilityDelta: 6.3,  rank: 6 },
      { location: 'Townsville',   citationShare: 0.50, citationDelta: -0.05, visibilityScore: 4.2,  visibilityDelta: 2.1,  rank: 9 },
    ],
    citationByPlatform: SHARED_CITATION_PLATFORMS(10.47, 1.16),
    citationByPlatformRows: SHARED_CITATION_ROWS(10.47, 1.16),
    themeTrend: SHARED_THEME_TREND(51.3, 9.8),
    themes: SHARED_THEMES(51.3, 9.8),
    shareOfVoice: SHARED_SHARE_OF_VOICE('Absolutely Dental @ Kirwan Plaza', 51.3, 9.8),
  },
  'Serenity Dental CQ': {
    competitorName: 'Serenity Dental CQ',
    summary: {
      citationShare: 2.33, citationDelta: 0.6,
      visibilityScore: 2.5, visibilityDelta: 1.8,
      rank: 7,
      youCitationShare: 10.47, youCitationDelta: 1.47,
      youVisibilityScore: 51.3, youVisibilityDelta: 5.0,
      youRank: 4,
    },
    rankTrend: [
      { label: 'Mar', you: 6, competitor: 9 },
      { label: 'Apr', you: 6, competitor: 9 },
      { label: 'May', you: 5, competitor: 8 },
      { label: 'Jun', you: 5, competitor: 8 },
      { label: 'Jul', you: 4, competitor: 8 },
      { label: 'Aug', you: 4, competitor: 7 },
      { label: 'Sep', you: 4, competitor: 7 },
      { label: 'Oct', you: 4, competitor: 7 },
      { label: 'Nov', you: 4, competitor: 7 },
      { label: 'Dec', you: 4, competitor: 7 },
    ],
    locationVisibilityTrend: [
      { label: 'Mar', you: 46.2, competitor: 0.7 },
      { label: 'Apr', you: 47.5, competitor: 0.8 },
      { label: 'May', you: 44.3, competitor: 1.0 },
      { label: 'Jun', you: 48.8, competitor: 1.2 },
      { label: 'Jul', you: 50.1, competitor: 1.4 },
      { label: 'Aug', you: 49.6, competitor: 1.6 },
      { label: 'Sep', you: 47.9, competitor: 1.9 },
      { label: 'Oct', you: 48.4, competitor: 2.1 },
      { label: 'Nov', you: 50.9, competitor: 2.3 },
      { label: 'Dec', you: 51.3, competitor: 2.5 },
    ],
    locations: [
      { location: BRAND_NAME,     isYou: true, citationShare: 10.47, citationDelta: 1.47,  visibilityScore: 51.3, visibilityDelta: 5.0,  rank: 4 },
      { location: 'Rockhampton',  citationShare: 2.33,  citationDelta: 0.60,  visibilityScore: 2.5,  visibilityDelta: 1.8,  rank: 7 },
      { location: 'Emerald',      citationShare: 1.10,  citationDelta: 0.20,  visibilityScore: 1.2,  visibilityDelta: 0.9,  rank: 10 },
    ],
    citationByPlatform: SHARED_CITATION_PLATFORMS(10.47, 2.33),
    citationByPlatformRows: SHARED_CITATION_ROWS(10.47, 2.33),
    themeTrend: SHARED_THEME_TREND(51.3, 2.5),
    themes: SHARED_THEMES(51.3, 2.5),
    shareOfVoice: SHARED_SHARE_OF_VOICE('Serenity Dental CQ', 51.3, 2.5),
  },
}

// ── Share of Voice card data ──────────────────────────────────────────────────

export type ShareOfVoicePlatform = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'Google AI mode' | 'Google AI Overviews'

export const SOV_PLATFORMS: ShareOfVoicePlatform[] = [
  'ChatGPT',
  'Gemini',
  'Perplexity',
  'Google AI mode',
  'Google AI Overviews',
]

export interface SovRow extends Record<string, unknown> {
  name: string
  isYou?: boolean
  rank: number
  rankDelta: number
  sov: number
  sovDelta: number
  color: string
}

function buildSovRows(platform: 'ChatGPT' | 'Gemini' | 'Perplexity', rankOffset = 0, sovOffset = 0): SovRow[] {
  const colorList = Object.values(TREND_SERIES_COLORS)
  const competitors: Array<{ name: string; isYou?: boolean; citationShare: number }> = [
    { name: 'My Family Dental', isYou: true,  citationShare: platform === 'ChatGPT' ? 10.47 : platform === 'Gemini' ? 8.78 : 4.40 },
    { name: 'Bowen Dental',     citationShare: platform === 'ChatGPT' ? 2.33 : platform === 'Gemini' ? 4.39 : 1.83 },
    { name: 'Innisfail Dentists', citationShare: platform === 'ChatGPT' ? 4.81 : platform === 'Gemini' ? 2.93 : 2.20 },
    { name: 'Deeragun Dental',  citationShare: platform === 'ChatGPT' ? 1.16 : platform === 'Gemini' ? 1.95 : 1.40 },
    { name: 'Absolutely Dental @ Kirwan Plaza', citationShare: platform === 'ChatGPT' ? 1.16 : platform === 'Gemini' ? 0.80 : 1.10 },
    { name: 'Serenity Dental CQ', citationShare: platform === 'ChatGPT' ? 2.33 : platform === 'Gemini' ? 1.95 : 0.90 },
  ]
  const sorted = [...competitors].sort((a, b) => b.citationShare - a.citationShare)
  return sorted.map((c, i) => ({
    name: c.name,
    isYou: c.isYou,
    rank: i + 1 + rankOffset,
    rankDelta: +(Math.max(0.1, 1.5 - i * 0.2 + sovOffset * 0.1).toFixed(1)),
    sov: +(Math.max(0.5, c.citationShare + sovOffset).toFixed(1)),
    sovDelta: +(Math.max(0.1, 1.2 - i * 0.15 + sovOffset * 0.05).toFixed(1)),
    color: colorList[i] ?? '#888',
  }))
}

export const SHARE_OF_VOICE_DATA: Record<ShareOfVoicePlatform, SovRow[]> = {
  'ChatGPT':              buildSovRows('ChatGPT',    0,    0),
  'Gemini':               buildSovRows('Gemini',     0,    1.2),
  'Perplexity':           buildSovRows('Perplexity', 0,   -0.8),
  'Google AI mode':       buildSovRows('ChatGPT',    0,    2.1),
  'Google AI Overviews':  buildSovRows('Gemini',     0,   -1.5),
}

export const COMPETITOR_BRAND_DATA: CompetitorRowData[] = [
  {
    name: BRAND_NAME,
    isYou: true,
    domain: 'myfamilydentalqld.com.au',
    metrics: {
      ChatGPT:    { visibilityScore: 51.3, visibilityDelta: 5.0,  citationShare: 10.47, citationDelta: 1.47,  avgRank: 4 },
      Gemini:     { visibilityScore: 66.8, visibilityDelta: 0.7,  citationShare: 8.78,  citationDelta: 2.78,  avgRank: 2 },
      Perplexity: { visibilityScore: 67.7, visibilityDelta: -8.4, citationShare: 4.40,  citationDelta: -1.62, avgRank: 3 },
    },
  },
  {
    name: 'Bowen Dental',
    domain: 'bowendental.com.au',
    metrics: {
      ChatGPT:    { visibilityScore: 10.0, visibilityDelta: -2.2, citationShare: 2.33, citationDelta: 0.5,  avgRank: 5 },
      Gemini:     { visibilityScore: 15.6, visibilityDelta: 1.2,  citationShare: 4.39, citationDelta: 0.8,  avgRank: 3 },
      Perplexity: { visibilityScore: 9.3,  visibilityDelta: -3.5, citationShare: 1.83, citationDelta: -0.3, avgRank: 4 },
    },
  },
  {
    name: 'Innisfail Dentists',
    domain: 'innisfaildentist.com.au',
    metrics: {
      ChatGPT:    { visibilityScore: 4.9,  visibilityDelta: 0.6,  citationShare: 4.81, citationDelta: 0.9,  avgRank: 3 },
      Gemini:     { visibilityScore: 2.3,  visibilityDelta: -0.4, citationShare: 2.93, citationDelta: 0.1,  avgRank: 6 },
      Perplexity: { visibilityScore: 3.5,  visibilityDelta: 1.3,  citationShare: 2.20, citationDelta: 0.4,  avgRank: 5 },
    },
  },
  {
    name: 'Deeragun Dental',
    domain: 'deeragundental.com.au',
    metrics: {
      ChatGPT:    { visibilityScore: 1.8,  visibilityDelta: 0.2,  citationShare: 1.16, citationDelta: 0.1,  avgRank: 8 },
      Gemini:     { visibilityScore: 10.7, visibilityDelta: 2.6,  citationShare: 1.95, citationDelta: 0.5,  avgRank: 4 },
      Perplexity: { visibilityScore: 4.4,  visibilityDelta: 0.9,  citationShare: 1.40, citationDelta: 0.2,  avgRank: 2 },
    },
  },
  {
    name: 'Absolutely Dental @ Kirwan Plaza',
    domain: 'absolutelydental.com.au',
    metrics: {
      ChatGPT:    { visibilityScore: 9.8,  visibilityDelta: 6.3,  citationShare: 1.16, citationDelta: 0.1,  avgRank: 6 },
      Gemini:     { visibilityScore: 1.4,  visibilityDelta: -0.4, citationShare: 0.80, citationDelta: 0.0,  avgRank: 9 },
      Perplexity: { visibilityScore: 8.0,  visibilityDelta: 5.7,  citationShare: 1.10, citationDelta: 0.3,  avgRank: 7 },
    },
  },
  {
    name: 'Serenity Dental CQ',
    domain: 'serenity-dental.com.au',
    metrics: {
      ChatGPT:    { visibilityScore: 2.5,  visibilityDelta: 1.8,  citationShare: 2.33, citationDelta: 0.6,  avgRank: 7 },
      Gemini:     { visibilityScore: 3.4,  visibilityDelta: 0.1,  citationShare: 1.95, citationDelta: 0.2,  avgRank: 5 },
      Perplexity: { visibilityScore: 1.5,  visibilityDelta: 0.3,  citationShare: 0.90, citationDelta: 0.1,  avgRank: 8 },
    },
  },
]

// ── Theme visibility card ────────────────────────────────────────────────────

export type ThemeVisibilityPlatform = 'ChatGPT' | 'Gemini' | 'Perplexity'
export const THEME_VISIBILITY_PLATFORMS: ThemeVisibilityPlatform[] = ['ChatGPT', 'Gemini', 'Perplexity']

export interface ThemeMetricPair {
  you: number
  competitor: number
}

export interface ThemeVisibilityPromptRow extends Record<string, unknown> {
  _id: string
  prompt: string
  avgVisibility: ThemeMetricPair
  chatgpt: ThemeMetricPair
  gemini: ThemeMetricPair
  perplexity: ThemeMetricPair
  claude: ThemeMetricPair
}

export interface ThemeVisibilityThemeRow extends Record<string, unknown> {
  _id: string
  theme: string
  avgVisibility: ThemeMetricPair
  chatgpt: ThemeMetricPair
  gemini: ThemeMetricPair
  perplexity: ThemeMetricPair
  claude: ThemeMetricPair
  prompts: ThemeVisibilityPromptRow[]
}

function makeMetric(you: number, competitor: number): ThemeMetricPair {
  return { you, competitor }
}

function makePrompts(themeId: string, prompts: string[], youBase: number, compBase: number): ThemeVisibilityPromptRow[] {
  return prompts.map((p, i) => ({
    _id: `${themeId}-p${i}`,
    prompt: p,
    avgVisibility: makeMetric(+(youBase - i * 2.1).toFixed(1), +(compBase - i * 1.3).toFixed(1)),
    chatgpt:       makeMetric(+(youBase - i * 1.8).toFixed(1), +(compBase - i * 1.0).toFixed(1)),
    gemini:        makeMetric(+(youBase - i * 2.3).toFixed(1), +(compBase - i * 1.5).toFixed(1)),
    perplexity:    makeMetric(+(youBase - i * 1.5).toFixed(1), +(compBase - i * 0.9).toFixed(1)),
    claude:        makeMetric(+(youBase - i * 2.6).toFixed(1), +(compBase - i * 1.7).toFixed(1)),
  }))
}

export const THEME_VISIBILITY_DATA: ThemeVisibilityThemeRow[] = [
  {
    _id: 'theme-1',
    theme: 'Best dentist',
    avgVisibility: makeMetric(51.3, 25.4),
    chatgpt:       makeMetric(48.2, 22.1),
    gemini:        makeMetric(53.1, 27.6),
    perplexity:    makeMetric(50.8, 24.9),
    claude:        makeMetric(52.4, 26.8),
    prompts: makePrompts('theme-1', [
      'Best dentist near me',
      'Best dentist in Townsville',
      'Best family dentist',
    ], 51.3, 25.4),
  },
  {
    _id: 'theme-2',
    theme: 'Root canal',
    avgVisibility: makeMetric(44.7, 18.2),
    chatgpt:       makeMetric(42.1, 16.3),
    gemini:        makeMetric(46.3, 19.8),
    perplexity:    makeMetric(44.0, 17.5),
    claude:        makeMetric(43.8, 18.9),
    prompts: makePrompts('theme-2', [
      'Root canal treatment near me',
      'Affordable root canal',
      'Emergency root canal',
    ], 44.7, 18.2),
  },
  {
    _id: 'theme-3',
    theme: 'Dental crown',
    avgVisibility: makeMetric(38.9, 14.6),
    chatgpt:       makeMetric(36.4, 12.9),
    gemini:        makeMetric(40.2, 15.8),
    perplexity:    makeMetric(38.1, 14.0),
    claude:        makeMetric(39.5, 15.3),
    prompts: makePrompts('theme-3', [
      'Dental crown cost',
      'Same day dental crown',
      'Porcelain dental crown',
    ], 38.9, 14.6),
  },
  {
    _id: 'theme-4',
    theme: 'Sensitive teeth',
    avgVisibility: makeMetric(33.2, 11.8),
    chatgpt:       makeMetric(30.7, 10.1),
    gemini:        makeMetric(35.0, 12.9),
    perplexity:    makeMetric(32.6, 11.3),
    claude:        makeMetric(34.1, 12.5),
    prompts: makePrompts('theme-4', [
      'Sensitive teeth treatment',
      'Sensitive teeth dentist',
      'Toothpaste for sensitive teeth',
    ], 33.2, 11.8),
  },
  {
    _id: 'theme-5',
    theme: 'Local dentist',
    avgVisibility: makeMetric(29.8, 9.4),
    chatgpt:       makeMetric(27.3, 7.9),
    gemini:        makeMetric(31.4, 10.6),
    perplexity:    makeMetric(29.2, 8.8),
    claude:        makeMetric(30.5, 10.1),
    prompts: makePrompts('theme-5', [
      'Local dentist open now',
      'Local dentist accepting new patients',
      'Affordable local dentist',
    ], 29.8, 9.4),
  },
  {
    _id: 'theme-6',
    theme: 'Chipped tooth',
    avgVisibility: makeMetric(24.1, 7.2),
    chatgpt:       makeMetric(21.8, 5.9),
    gemini:        makeMetric(25.7, 8.3),
    perplexity:    makeMetric(23.5, 6.8),
    claude:        makeMetric(24.9, 7.6),
    prompts: makePrompts('theme-6', [
      'Chipped tooth repair near me',
      'Emergency chipped tooth',
      'Fix chipped tooth cost',
    ], 24.1, 7.2),
  },
  {
    _id: 'theme-7',
    theme: 'Oral surgery',
    avgVisibility: makeMetric(19.6, 5.1),
    chatgpt:       makeMetric(17.4, 3.8),
    gemini:        makeMetric(21.0, 6.2),
    perplexity:    makeMetric(19.0, 4.7),
    claude:        makeMetric(20.3, 5.5),
    prompts: makePrompts('theme-7', [
      'Oral surgery near me',
      'Tooth extraction near me',
      'Wisdom tooth removal',
    ], 19.6, 5.1),
  },
]


// ── Visibility ranking by location ────────────────────────────────────────────

export interface RankingCompetitor {
  name: string
  isYou?: boolean
}

export interface LocationRankingRow extends Record<string, unknown> {
  location: string
  rank1: RankingCompetitor
  rank2: RankingCompetitor
  rank3: RankingCompetitor
  rank4: RankingCompetitor
  rank5: RankingCompetitor
}

export const RANKING_PLATFORMS = ['ChatGPT', 'Gemini', 'Perplexity'] as const
export type RankingPlatform = typeof RANKING_PLATFORMS[number]

const CHATGPT_RANKING_ROWS: LocationRankingRow[] = [
  { location: 'Townsville',  rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Bowen Dental' },     rank3: { name: 'Deeragun Dental' },    rank4: { name: 'Innisfail Dentists' }, rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Bowen',       rank1: { name: 'Bowen Dental' },                   rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Innisfail Dentists' }, rank4: { name: 'Deeragun Dental' },    rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Mackay',      rank1: { name: 'Deeragun Dental' },                rank2: { name: 'Bowen Dental' },     rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Innisfail Dentists' } },
  { location: 'Innisfail',   rank1: { name: 'Innisfail Dentists' },             rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Bowen Dental' },      rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Deeragun Dental' } },
  { location: 'Cairns',      rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Deeragun Dental' },  rank3: { name: 'Serenity Dental CQ' }, rank4: { name: 'Bowen Dental' },       rank5: { name: 'Innisfail Dentists' } },
]

const GEMINI_RANKING_ROWS: LocationRankingRow[] = [
  { location: 'Townsville',  rank1: { name: 'Deeragun Dental' },        rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Bowen Dental' },      rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Innisfail Dentists' } },
  { location: 'Bowen',       rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Bowen Dental' },      rank3: { name: 'Deeragun Dental' },    rank4: { name: 'Innisfail Dentists' }, rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Mackay',      rank1: { name: 'Innisfail Dentists' },     rank2: { name: 'Serenity Dental CQ' }, rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Deeragun Dental' },  rank5: { name: 'Bowen Dental' } },
  { location: 'Innisfail',   rank1: { name: 'Bowen Dental' },           rank2: { name: 'Deeragun Dental' },   rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Innisfail Dentists' }, rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Cairns',      rank1: { name: 'Serenity Dental CQ' },     rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Innisfail Dentists' }, rank4: { name: 'Bowen Dental' },   rank5: { name: 'Deeragun Dental' } },
]

const PERPLEXITY_RANKING_ROWS: LocationRankingRow[] = [
  { location: 'Townsville',  rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Innisfail Dentists' }, rank3: { name: 'Deeragun Dental' },   rank4: { name: 'Bowen Dental' },       rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Bowen',       rank1: { name: 'Bowen Dental' },                   rank2: { name: 'Serenity Dental CQ' }, rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Deeragun Dental' }, rank5: { name: 'Innisfail Dentists' } },
  { location: 'Mackay',      rank1: { name: 'Deeragun Dental' },                rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Innisfail Dentists' }, rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Bowen Dental' } },
  { location: 'Innisfail',   rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Bowen Dental' },      rank3: { name: 'Serenity Dental CQ' }, rank4: { name: 'Deeragun Dental' },    rank5: { name: 'Innisfail Dentists' } },
  { location: 'Cairns',      rank1: { name: 'Innisfail Dentists' },             rank2: { name: 'Deeragun Dental' },   rank3: { name: 'Bowen Dental' },       rank4: { name: 'My Family Dental', isYou: true }, rank5: { name: 'Serenity Dental CQ' } },
]

export const LOCATION_RANKING_DATA: Record<RankingPlatform, LocationRankingRow[]> = {
  ChatGPT:    CHATGPT_RANKING_ROWS,
  Gemini:     GEMINI_RANKING_ROWS,
  Perplexity: PERPLEXITY_RANKING_ROWS,
}

// ── By-location scatterplot ───────────────────────────────────────────────────

export type Quadrant = 'leading' | 'lagging' | 'emerging' | 'underperforming'

export interface ByLocationDot {
  locationName: string
  brand: string           // 'you' | competitor name
  visibilityScore: number // 0–100
  citationShare: number   // 0–100
  rank: number
  quadrant: Quadrant
}

export interface ByLocationTableRow extends Record<string, unknown> {
  location: string
  performance: Quadrant
  rank1: RankingCompetitor
  rank2: RankingCompetitor
  rank3: RankingCompetitor
  rank4: RankingCompetitor
  rank5: RankingCompetitor
}

export const BY_LOCATION_COMPETITORS = [
  'Deeragun Dental',
  'Hinchinbrook Dental Group',
  'Bowen Dental',
  'Serenity Dental CQ',
  'Absolutely Dental @ Kirwan Plaza',
] as const

// ── ChatGPT Jun 2026 ────────────────────────────────────────────────────────
// Location-centric: one dot per (competitor, location) pair where they operate.
// No filler dots. citationShare is independent of visibilityScore.

const BY_LOCATION_DOTS_CHATGPT: ByLocationDot[] = [
  // ── Bohle Plains ─────────────────────────────────────────────────────────
  { locationName: 'Bohle Plains', brand: 'you',                               visibilityScore: 100, citationShare: 82, rank: 1, quadrant: 'leading' },
  { locationName: 'Bohle Plains', brand: 'Deeragun Dental',                   visibilityScore: 48,  citationShare: 34, rank: 2, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Aspire Dental',                     visibilityScore: 62,  citationShare: 67, rank: 3, quadrant: 'leading' },
  { locationName: 'Bohle Plains', brand: 'National Dental Care Townsville',   visibilityScore: 38,  citationShare: 17, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Dental Balance NQ',                 visibilityScore: 22,  citationShare: 15, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'NQ Surgical Dentistry',             visibilityScore: 31,  citationShare: 33, rank: 6, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Dr. Eleri J Hunter',                visibilityScore: 18,  citationShare: 19, rank: 7, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'The Townsville Dental Centre',      visibilityScore: 14,  citationShare: 11, rank: 8, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Townsville Oral & Maxillofacial',   visibilityScore: 11,  citationShare: 12, rank: 9, quadrant: 'lagging' },

  // ── Ingham ───────────────────────────────────────────────────────────────
  { locationName: 'Ingham', brand: 'you',                           visibilityScore: 63, citationShare: 52, rank: 1, quadrant: 'leading' },
  { locationName: 'Ingham', brand: 'Hinchinbrook Dental Group',     visibilityScore: 40, citationShare: 28, rank: 2, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'The Hinchinbrook Dental Group', visibilityScore: 29, citationShare: 31, rank: 3, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'Ingham Health Services Dental', visibilityScore: 21, citationShare: 23, rank: 4, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: '1300 Smiles – Ingham',          visibilityScore: 17, citationShare:  8, rank: 5, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'SEAFORD DENTAL',                visibilityScore: 13, citationShare: 14, rank: 6, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'Bella Dental',                  visibilityScore: 11, citationShare: 12, rank: 7, quadrant: 'lagging' },

  // ── Emerald ──────────────────────────────────────────────────────────────
  { locationName: 'Emerald', brand: 'you',                        visibilityScore: 34, citationShare: 44, rank: 2, quadrant: 'underperforming' },
  { locationName: 'Emerald', brand: 'CP Dental Emerald',          visibilityScore: 72, citationShare: 78, rank: 1, quadrant: 'leading' },
  { locationName: 'Emerald', brand: 'Serenity Dental CQ',         visibilityScore: 29, citationShare: 21, rank: 3, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Central Highlands Dental',   visibilityScore: 24, citationShare: 26, rank: 4, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Meta Dental Haus',           visibilityScore: 18, citationShare: 13, rank: 5, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Hello My Dental',            visibilityScore: 14, citationShare: 15, rank: 6, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Serenity Dental CQ Emerald', visibilityScore: 12, citationShare:  9, rank: 7, quadrant: 'lagging' },

  // ── Bowen ────────────────────────────────────────────────────────────────
  { locationName: 'Bowen', brand: 'you',                   visibilityScore: 28, citationShare: 23, rank: 3, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Bowen Dental',          visibilityScore: 55, citationShare: 25, rank: 1, quadrant: 'emerging' },
  { locationName: 'Bowen', brand: 'Dental On Bowen',       visibilityScore: 46, citationShare: 21, rank: 2, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Serenity Dental CQ',    visibilityScore: 22, citationShare: 16, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Bowen Dental Pty Ltd',  visibilityScore: 19, citationShare: 14, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: "Kylie's Family Dental", visibilityScore: 14, citationShare: 11, rank: 6, quadrant: 'lagging' },

  // ── Innisfail ─────────────────────────────────────────────────────────────
  { locationName: 'Innisfail', brand: 'you',                               visibilityScore: 51, citationShare: 42, rank: 3, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Riverside Family Dental Innisfail', visibilityScore: 78, citationShare: 84, rank: 1, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Innisfail Dentists',                visibilityScore: 66, citationShare: 72, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Bowen Dental',                      visibilityScore: 24, citationShare: 11, rank: 4, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'Sundown Family Dental',             visibilityScore: 32, citationShare: 35, rank: 5, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'Tropical Coast Dental',             visibilityScore: 19, citationShare: 21, rank: 6, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'All On 4 Plus Townsville',          visibilityScore: 14, citationShare: 15, rank: 7, quadrant: 'lagging' },

  // ── Kirwan ────────────────────────────────────────────────────────────────
  { locationName: 'Kirwan', brand: 'you',                                     visibilityScore: 32, citationShare: 26, rank: 3, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Absolutely Dental @ Kirwan Plaza',        visibilityScore: 88, citationShare: 95, rank: 1, quadrant: 'leading' },
  { locationName: 'Kirwan', brand: 'National Dental Care Townsville',         visibilityScore: 61, citationShare: 28, rank: 2, quadrant: 'emerging' },
  { locationName: 'Kirwan', brand: 'Aspire Dental',                           visibilityScore: 45, citationShare: 49, rank: 4, quadrant: 'underperforming' },
  { locationName: 'Kirwan', brand: 'Deeragun Dental',                         visibilityScore: 38, citationShare: 27, rank: 5, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Dental Balance NQ',                       visibilityScore: 29, citationShare: 32, rank: 6, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Kirwan Dentist / Dental Implants Clinic', visibilityScore: 22, citationShare: 15, rank: 7, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: '1300SMILES Dentists Townsville City',     visibilityScore: 17, citationShare: 18, rank: 8, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Dental Precinct',                         visibilityScore: 13, citationShare: 14, rank: 9, quadrant: 'lagging' },
]

// ── Gemini Jun 2026 ──────────────────────────────────────────────────────────

const BY_LOCATION_DOTS_GEMINI: ByLocationDot[] = [
  // ── Bohle Plains ─────────────────────────────────────────────────────────
  { locationName: 'Bohle Plains', brand: 'you',                               visibilityScore: 93, citationShare: 76, rank: 1, quadrant: 'leading' },
  { locationName: 'Bohle Plains', brand: 'Deeragun Dental',                   visibilityScore: 52, citationShare: 37, rank: 2, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Aspire Dental',                     visibilityScore: 44, citationShare: 48, rank: 3, quadrant: 'underperforming' },
  { locationName: 'Bohle Plains', brand: 'National Dental Care Townsville',   visibilityScore: 35, citationShare: 16, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Dental Balance NQ',                 visibilityScore: 27, citationShare: 19, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'NQ Surgical Dentistry',             visibilityScore: 19, citationShare: 21, rank: 6, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Townsville Oral & Maxillofacial',   visibilityScore: 14, citationShare: 10, rank: 7, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Dr. Eleri J Hunter',                visibilityScore: 12, citationShare: 13, rank: 8, quadrant: 'lagging' },

  // ── Ingham ───────────────────────────────────────────────────────────────
  { locationName: 'Ingham', brand: 'you',                           visibilityScore: 97, citationShare: 79, rank: 1, quadrant: 'leading' },
  { locationName: 'Ingham', brand: 'Hinchinbrook Dental Group',     visibilityScore: 37, citationShare: 26, rank: 2, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'Ingham Health Services Dental', visibilityScore: 28, citationShare: 30, rank: 3, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'The Hinchinbrook Dental Group', visibilityScore: 22, citationShare: 15, rank: 4, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: '1300 Smiles – Ingham',          visibilityScore: 16, citationShare: 11, rank: 5, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'Bella Dental',                  visibilityScore: 12, citationShare: 13, rank: 6, quadrant: 'lagging' },

  // ── Emerald ──────────────────────────────────────────────────────────────
  { locationName: 'Emerald', brand: 'you',                        visibilityScore: 46, citationShare: 56, rank: 2, quadrant: 'underperforming' },
  { locationName: 'Emerald', brand: 'Serenity Dental CQ',         visibilityScore: 52, citationShare: 38, rank: 1, quadrant: 'emerging' },
  { locationName: 'Emerald', brand: 'CP Dental Emerald',          visibilityScore: 39, citationShare: 43, rank: 3, quadrant: 'underperforming' },
  { locationName: 'Emerald', brand: 'Central Highlands Dental',   visibilityScore: 28, citationShare: 20, rank: 4, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Meta Dental Haus',           visibilityScore: 21, citationShare: 23, rank: 5, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Hello My Dental',            visibilityScore: 16, citationShare: 11, rank: 6, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Serenity Dental CQ Emerald', visibilityScore: 11, citationShare: 12, rank: 7, quadrant: 'lagging' },

  // ── Bowen ────────────────────────────────────────────────────────────────
  { locationName: 'Bowen', brand: 'you',                   visibilityScore: 46, citationShare: 38, rank: 2, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Bowen Dental',          visibilityScore: 93, citationShare: 42, rank: 1, quadrant: 'leading' },
  { locationName: 'Bowen', brand: 'Dental On Bowen',       visibilityScore: 34, citationShare: 15, rank: 3, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Serenity Dental CQ',    visibilityScore: 18, citationShare: 13, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: "Kylie's Family Dental", visibilityScore: 13, citationShare: 14, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Bowen Dental Pty Ltd',  visibilityScore: 11, citationShare:  8, rank: 6, quadrant: 'lagging' },

  // ── Innisfail ─────────────────────────────────────────────────────────────
  { locationName: 'Innisfail', brand: 'you',                               visibilityScore: 67, citationShare: 55, rank: 1, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Riverside Family Dental Innisfail', visibilityScore: 58, citationShare: 63, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Innisfail Dentists',                visibilityScore: 49, citationShare: 53, rank: 3, quadrant: 'underperforming' },
  { locationName: 'Innisfail', brand: 'Sundown Family Dental',             visibilityScore: 36, citationShare: 39, rank: 4, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'Bowen Dental',                      visibilityScore: 21, citationShare:  9, rank: 5, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'Tropical Coast Dental',             visibilityScore: 17, citationShare: 18, rank: 6, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'All On 4 Plus Townsville',          visibilityScore: 12, citationShare: 13, rank: 7, quadrant: 'lagging' },

  // ── Kirwan ────────────────────────────────────────────────────────────────
  { locationName: 'Kirwan', brand: 'you',                                     visibilityScore: 52, citationShare: 43, rank: 1, quadrant: 'leading' },
  { locationName: 'Kirwan', brand: 'Absolutely Dental @ Kirwan Plaza',        visibilityScore: 74, citationShare: 82, rank: 2, quadrant: 'leading' },
  { locationName: 'Kirwan', brand: 'National Dental Care Townsville',         visibilityScore: 48, citationShare: 21, rank: 3, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Aspire Dental',                           visibilityScore: 38, citationShare: 41, rank: 4, quadrant: 'underperforming' },
  { locationName: 'Kirwan', brand: 'Deeragun Dental',                         visibilityScore: 29, citationShare: 20, rank: 5, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Dental Balance NQ',                       visibilityScore: 22, citationShare: 24, rank: 6, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Kirwan Dentist / Dental Implants Clinic', visibilityScore: 18, citationShare: 12, rank: 7, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Dental Precinct',                         visibilityScore: 14, citationShare: 15, rank: 8, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: '1300SMILES Dentists Townsville City',     visibilityScore: 11, citationShare: 12, rank: 9, quadrant: 'lagging' },
]

// ── Perplexity Jun 2026 ───────────────────────────────────────────────────────

const BY_LOCATION_DOTS_PERPLEXITY: ByLocationDot[] = [
  // ── Bohle Plains ─────────────────────────────────────────────────────────
  { locationName: 'Bohle Plains', brand: 'you',                               visibilityScore: 87, citationShare: 71, rank: 1, quadrant: 'leading' },
  { locationName: 'Bohle Plains', brand: 'Deeragun Dental',                   visibilityScore: 33, citationShare: 24, rank: 2, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Aspire Dental',                     visibilityScore: 55, citationShare: 59, rank: 3, quadrant: 'leading' },
  { locationName: 'Bohle Plains', brand: 'National Dental Care Townsville',   visibilityScore: 29, citationShare: 13, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'NQ Surgical Dentistry',             visibilityScore: 24, citationShare: 26, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Dental Balance NQ',                 visibilityScore: 18, citationShare: 12, rank: 6, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Townsville Oral & Maxillofacial',   visibilityScore: 14, citationShare: 15, rank: 7, quadrant: 'lagging' },
  { locationName: 'Bohle Plains', brand: 'Dr. Eleri J Hunter',                visibilityScore: 11, citationShare: 12, rank: 8, quadrant: 'lagging' },

  // ── Ingham ───────────────────────────────────────────────────────────────
  { locationName: 'Ingham', brand: 'you',                           visibilityScore: 77, citationShare: 63, rank: 1, quadrant: 'leading' },
  { locationName: 'Ingham', brand: 'Hinchinbrook Dental Group',     visibilityScore: 11, citationShare:  9, rank: 2, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'The Hinchinbrook Dental Group', visibilityScore: 33, citationShare: 36, rank: 3, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'Ingham Health Services Dental', visibilityScore: 24, citationShare: 26, rank: 4, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: '1300 Smiles – Ingham',          visibilityScore: 19, citationShare:  8, rank: 5, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'SEAFORD DENTAL',                visibilityScore: 14, citationShare: 15, rank: 6, quadrant: 'lagging' },
  { locationName: 'Ingham', brand: 'Bella Dental',                  visibilityScore: 12, citationShare: 13, rank: 7, quadrant: 'lagging' },

  // ── Emerald ──────────────────────────────────────────────────────────────
  { locationName: 'Emerald', brand: 'you',                        visibilityScore: 50, citationShare: 61, rank: 1, quadrant: 'underperforming' },
  { locationName: 'Emerald', brand: 'Serenity Dental CQ',         visibilityScore: 17, citationShare: 12, rank: 3, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'CP Dental Emerald',          visibilityScore: 43, citationShare: 47, rank: 2, quadrant: 'underperforming' },
  { locationName: 'Emerald', brand: 'Central Highlands Dental',   visibilityScore: 26, citationShare: 28, rank: 4, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Hello My Dental',            visibilityScore: 19, citationShare: 21, rank: 5, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Meta Dental Haus',           visibilityScore: 14, citationShare:  6, rank: 6, quadrant: 'lagging' },
  { locationName: 'Emerald', brand: 'Serenity Dental CQ Emerald', visibilityScore: 11, citationShare: 12, rank: 7, quadrant: 'lagging' },

  // ── Bowen ────────────────────────────────────────────────────────────────
  { locationName: 'Bowen', brand: 'you',                   visibilityScore: 57, citationShare: 47, rank: 1, quadrant: 'leading' },
  { locationName: 'Bowen', brand: 'Bowen Dental',          visibilityScore: 56, citationShare: 25, rank: 2, quadrant: 'emerging' },
  { locationName: 'Bowen', brand: 'Dental On Bowen',       visibilityScore: 38, citationShare: 17, rank: 3, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Serenity Dental CQ',    visibilityScore: 12, citationShare:  9, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: "Kylie's Family Dental", visibilityScore: 18, citationShare: 14, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bowen', brand: 'Bowen Dental Pty Ltd',  visibilityScore: 13, citationShare: 11, rank: 6, quadrant: 'lagging' },

  // ── Innisfail ─────────────────────────────────────────────────────────────
  { locationName: 'Innisfail', brand: 'you',                               visibilityScore: 89, citationShare: 73, rank: 1, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Sundown Family Dental',             visibilityScore: 62, citationShare: 67, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail', brand: 'Innisfail Dentists',                visibilityScore: 47, citationShare: 51, rank: 3, quadrant: 'underperforming' },
  { locationName: 'Innisfail', brand: 'Riverside Family Dental Innisfail', visibilityScore: 38, citationShare: 41, rank: 4, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'Bowen Dental',                      visibilityScore: 19, citationShare:  8, rank: 5, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'Tropical Coast Dental',             visibilityScore: 24, citationShare: 26, rank: 6, quadrant: 'lagging' },
  { locationName: 'Innisfail', brand: 'All On 4 Plus Townsville',          visibilityScore: 15, citationShare: 16, rank: 7, quadrant: 'lagging' },

  // ── Kirwan ────────────────────────────────────────────────────────────────
  { locationName: 'Kirwan', brand: 'you',                                     visibilityScore: 48, citationShare: 39, rank: 2, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Absolutely Dental @ Kirwan Plaza',        visibilityScore: 79, citationShare: 88, rank: 1, quadrant: 'leading' },
  { locationName: 'Kirwan', brand: 'National Dental Care Townsville',         visibilityScore: 53, citationShare: 23, rank: 3, quadrant: 'emerging' },
  { locationName: 'Kirwan', brand: 'Aspire Dental',                           visibilityScore: 41, citationShare: 44, rank: 4, quadrant: 'underperforming' },
  { locationName: 'Kirwan', brand: 'Deeragun Dental',                         visibilityScore: 34, citationShare: 24, rank: 5, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Dental Balance NQ',                       visibilityScore: 26, citationShare: 28, rank: 6, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Kirwan Dentist / Dental Implants Clinic', visibilityScore: 19, citationShare: 13, rank: 7, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: '1300SMILES Dentists Townsville City',     visibilityScore: 15, citationShare: 16, rank: 8, quadrant: 'lagging' },
  { locationName: 'Kirwan', brand: 'Dental Precinct',                         visibilityScore: 12, citationShare: 13, rank: 9, quadrant: 'lagging' },
]

const BY_LOCATION_TABLE_CHATGPT: ByLocationTableRow[] = [
  { location: 'Bohle Plains', performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Dr. Eleri J Hunter' },             rank3: { name: 'NQ Surgical Dentistry' },          rank4: { name: 'Aspire Dental' },                  rank5: { name: 'The Townsville Dental Centre' } },
  { location: 'Ingham',       performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Hinchinbrook Dental Group' },       rank3: { name: 'The Hinchinbrook Dental Group' },  rank4: { name: 'SEAFORD DENTAL' },                 rank5: { name: 'Bella Dental' } },
  { location: 'Emerald',      performance: 'lagging',  rank1: { name: 'CP Dental Emerald' },                rank2: { name: 'My Family Dental', isYou: true },   rank3: { name: 'Serenity Dental CQ' },             rank4: { name: 'Serenity Dental CQ Emerald' },     rank5: { name: 'Central Highlands Dental' } },
  { location: 'Bowen',        performance: 'lagging',  rank1: { name: 'Bowen Dental' },                     rank2: { name: 'Dental On Bowen' },                 rank3: { name: 'My Family Dental', isYou: true },  rank4: { name: "Kylie's Family Dental" },           rank5: { name: 'Bowen Dental Pty Ltd' } },
  { location: 'Innisfail',    performance: 'leading',  rank1: { name: 'Riverside Family Dental Innisfail' }, rank2: { name: 'Innisfail Dentists' },             rank3: { name: 'My Family Dental', isYou: true },  rank4: { name: 'Sundown Family Dental' },           rank5: { name: 'All On 4 Plus Townsville' } },
  { location: 'Kirwan',       performance: 'lagging',  rank1: { name: 'Absolutely Dental @ Kirwan Plaza' }, rank2: { name: 'National Dental Care Townsville' }, rank3: { name: 'My Family Dental', isYou: true },  rank4: { name: 'Dental Balance NQ' },              rank5: { name: '1300SMILES Dentists Townsville City' } },
]

const BY_LOCATION_TABLE_GEMINI: ByLocationTableRow[] = [
  { location: 'Bohle Plains', performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Deeragun Dental' },                rank3: { name: 'Dental Precinct' },                rank4: { name: 'Dental Balance NQ' },              rank5: { name: 'Townsville Oral & Maxillofacial Surgery' } },
  { location: 'Ingham',       performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Hinchinbrook Dental Group' },       rank3: { name: 'Ingham Health Services Dental Clinic' }, rank4: { name: 'Ingham Hospital Dental Clinic' }, rank5: { name: '1300 Smiles - Ingham' } },
  { location: 'Emerald',      performance: 'lagging',  rank1: { name: 'Serenity Dental CQ' },               rank2: { name: 'My Family Dental', isYou: true },   rank3: { name: 'CP Dental Emerald' },              rank4: { name: 'Meta Dental Haus' },               rank5: { name: 'Central Highlands Dental' } },
  { location: 'Bowen',        performance: 'lagging',  rank1: { name: 'Bowen Dental' },                     rank2: { name: 'My Family Dental', isYou: true },   rank3: { name: 'Dental On Bowen' },                rank4: { name: "Kylie's Family Dental" },           rank5: { name: "Kylie's Family Dental Bowen" } },
  { location: 'Innisfail',    performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Riverside Family Dental' },         rank3: { name: 'Innisfail Dentists' },             rank4: { name: 'Sundown Family Dental' },           rank5: { name: 'Tropical Coast Dental' } },
  { location: 'Kirwan',       performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Dental Balance NQ' },               rank3: { name: 'Aspire Dental' },                  rank4: { name: 'Absolutely Dental @ Kirwan Plaza' }, rank5: { name: 'Absolutely Dental' } },
]

const BY_LOCATION_TABLE_PERPLEXITY: ByLocationTableRow[] = [
  { location: 'Bohle Plains', performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Deeragun Dental' },                rank3: { name: 'NQ Surgical Dentistry' },          rank4: { name: 'Aspire Dental' },                  rank5: { name: 'Townsville Oral & Maxillofacial Surgery' } },
  { location: 'Ingham',       performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'The Hinchinbrook Dental Group' },   rank3: { name: 'Ingham Health Services Dental Clinic' }, rank4: { name: '1300 Smiles – Ingham' },          rank5: { name: 'Bella Dental' } },
  { location: 'Emerald',      performance: 'lagging',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'CP Dental Emerald' },               rank3: { name: 'Serenity Dental CQ' },             rank4: { name: 'Central Highlands Dental' },        rank5: { name: 'Hello My Dental' } },
  { location: 'Bowen',        performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Bowen Dental' },                    rank3: { name: 'Dental On Bowen' },                rank4: { name: 'Bowen Dental Pty Ltd' },            rank5: { name: "Kylie's Family Dental" } },
  { location: 'Innisfail',    performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true },    rank2: { name: 'Sundown Family Dental' },            rank3: { name: 'Innisfail Dentists' },             rank4: { name: 'Riverside Family Dental' },         rank5: { name: 'Tropical Coast Dental (Innisfail)' } },
  { location: 'Kirwan',       performance: 'leading',  rank1: { name: 'Absolutely Dental @ Kirwan Plaza' }, rank2: { name: 'My Family Dental', isYou: true },   rank3: { name: 'Aspire Dental' },                  rank4: { name: 'Dental Balance NQ' },               rank5: { name: 'Kirwan Dentist' } },
]

export const BY_LOCATION_DATA: Record<RankingPlatform, { dots: ByLocationDot[]; tableRows: ByLocationTableRow[] }> = {
  ChatGPT:    { dots: BY_LOCATION_DOTS_CHATGPT,    tableRows: BY_LOCATION_TABLE_CHATGPT },
  Gemini:     { dots: BY_LOCATION_DOTS_GEMINI,     tableRows: BY_LOCATION_TABLE_GEMINI },
  Perplexity: { dots: BY_LOCATION_DOTS_PERPLEXITY, tableRows: BY_LOCATION_TABLE_PERPLEXITY },
}

// ── Scatter plot brand grouping ───────────────────────────────────────────────

export const LOCAL_COMPETITORS_LABEL = 'Local competitors'
export const MAX_BRANDED_SERIES = 4

export interface CompetitorSeries {
  name: string
  dots: ByLocationDot[]
  isLocal: boolean
}

function avgVis(dots: ByLocationDot[], brand: string): number {
  const bd = dots.filter((d) => d.brand === brand)
  return bd.reduce((s, d) => s + d.visibilityScore, 0) / (bd.length || 1)
}

// Splits competitor dots into up to MAX_BRANDED_SERIES named brand series
// (chains present in >1 location) plus one "Local competitors" catch-all.
// ALL competitors are plotted — branding only determines color/series.
// Branded competitors beyond top 4 fall into the local bucket alongside
// single-location competitors so no dot is ever dropped.
export function groupCompetitorSeries(dots: ByLocationDot[]): CompetitorSeries[] {
  const brandLocations = new Map<string, Set<string>>()
  for (const dot of dots) {
    if (dot.brand === 'you') continue
    if (!brandLocations.has(dot.brand)) brandLocations.set(dot.brand, new Set())
    brandLocations.get(dot.brand)!.add(dot.locationName)
  }

  const branded: string[] = []
  const local: string[] = []
  for (const [brand, locs] of brandLocations) {
    if (locs.size > 1) branded.push(brand)
    else local.push(brand)
  }

  branded.sort((a, b) => {
    const diff = brandLocations.get(b)!.size - brandLocations.get(a)!.size
    if (diff !== 0) return diff
    return avgVis(dots, b) - avgVis(dots, a)
  })
  const top4 = branded.slice(0, MAX_BRANDED_SERIES)
  const overflowBranded = branded.slice(MAX_BRANDED_SERIES)

  const series: CompetitorSeries[] = top4.map((name) => ({
    name,
    dots: dots.filter((d) => d.brand === name),
    isLocal: false,
  }))

  const allLocal = [...local, ...overflowBranded]
  const localDots = dots.filter((d) => allLocal.includes(d.brand))
  if (localDots.length > 0) {
    series.push({ name: LOCAL_COMPETITORS_LABEL, dots: localDots, isLocal: true })
  }

  return series
}
