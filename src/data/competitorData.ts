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
