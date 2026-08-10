export type OverviewPlatform = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'All'

export interface OverviewStat {
  value: number
  delta: number
}

export interface OverviewKpiData {
  searchAiScore: OverviewStat
  visibilityScore: OverviewStat
  citationShare: OverviewStat
  avgRank: OverviewStat
  sentimentScore: OverviewStat
}

export const OVERVIEW_KPI_BRAND: OverviewKpiData = {
  searchAiScore: { value: 58, delta: 36.6 },
  visibilityScore: { value: 79, delta: 20 },
  citationShare: { value: 79, delta: 20 },
  avgRank: { value: 2, delta: 2 },
  sentimentScore: { value: 22, delta: -40 },
}

export const OVERVIEW_KPI_LOCATIONS: OverviewKpiData = {
  searchAiScore: { value: 64, delta: 12.4 },
  visibilityScore: { value: 74, delta: 9 },
  citationShare: { value: 71, delta: 6 },
  avgRank: { value: 1, delta: 1 },
  sentimentScore: { value: 31, delta: -18 },
}

export interface OverviewThemeRow {
  _id: string
  theme: string
  searchAiScore: number
  visibilityScore: number
  citationShare: number
  rank: number
  sentimentScore: number
  prompts?: OverviewThemeRow[]
}

function scale(rows: OverviewThemeRow[], factor: number, rankShift: number): OverviewThemeRow[] {
  return rows.map((row) => ({
    ...row,
    _id: `${row._id}-${factor}`,
    searchAiScore: Math.round(row.searchAiScore * factor * 10) / 10,
    visibilityScore: Math.round(row.visibilityScore * factor * 10) / 10,
    citationShare: Math.round(row.citationShare * factor * 10) / 10,
    rank: Math.max(1, row.rank + rankShift),
    sentimentScore: Math.round(row.sentimentScore * factor * 10) / 10,
    prompts: row.prompts?.map((p) => ({
      ...p,
      _id: `${p._id}-${factor}`,
      searchAiScore: Math.round(p.searchAiScore * factor * 10) / 10,
      visibilityScore: Math.round(p.visibilityScore * factor * 10) / 10,
      citationShare: Math.round(p.citationShare * factor * 10) / 10,
      rank: Math.max(1, p.rank + rankShift),
      sentimentScore: Math.round(p.sentimentScore * factor * 10) / 10,
    })),
  }))
}

const BRAND_CHATGPT_ROWS: OverviewThemeRow[] = [
  {
    _id: 'dental-clinics',
    theme: 'Dental clinics',
    searchAiScore: 64.3,
    visibilityScore: 81,
    citationShare: 100,
    rank: 1,
    sentimentScore: 0,
    prompts: [
      {
        _id: 'dental-clinics-p1',
        theme: 'Find family dental clinics with online appointments and c...',
        searchAiScore: 64.3,
        visibilityScore: 81,
        citationShare: 100,
        rank: 1,
        sentimentScore: 0,
      },
    ],
  },
  { _id: 'car-wash-services', theme: 'Car wash services', searchAiScore: 59.8, visibilityScore: 66, citationShare: 100, rank: 1, sentimentScore: 0 },
  { _id: 'coworking-spaces', theme: 'Coworking spaces', searchAiScore: 58.3, visibilityScore: 61, citationShare: 100, rank: 1, sentimentScore: 0 },
  { _id: 'late-night-dining', theme: 'Late night dining', searchAiScore: 45.2, visibilityScore: 84, citationShare: 33.3, rank: 1, sentimentScore: 0 },
  { _id: 'futuristic-dining', theme: 'Futuristic dining experiences', searchAiScore: 38.9, visibilityScore: 63, citationShare: 33.3, rank: 1, sentimentScore: 0 },
  { _id: 'ev-friendly-restaurants', theme: 'Electric vehicle friendly restaurants', searchAiScore: 36.5, visibilityScore: 55, citationShare: 33.3, rank: 1, sentimentScore: 0 },
  { _id: 'tax-return-amendments', theme: 'Tax return amendments', searchAiScore: 35, visibilityScore: 71, citationShare: 12.5, rank: 1, sentimentScore: 0 },
]

export const OVERVIEW_THEMES_PERFORMANCE_BRAND: Record<OverviewPlatform, OverviewThemeRow[]> = {
  ChatGPT: BRAND_CHATGPT_ROWS,
  Gemini: scale(BRAND_CHATGPT_ROWS, 0.92, 1),
  Perplexity: scale(BRAND_CHATGPT_ROWS, 0.85, 2),
  All: scale(BRAND_CHATGPT_ROWS, 0.9, 1),
}

export const OVERVIEW_THEMES_PERFORMANCE_LOCATIONS: Record<OverviewPlatform, OverviewThemeRow[]> = {
  ChatGPT: scale(BRAND_CHATGPT_ROWS, 1.08, 0),
  Gemini: scale(BRAND_CHATGPT_ROWS, 1.0, 1),
  Perplexity: scale(BRAND_CHATGPT_ROWS, 0.95, 1),
  All: scale(BRAND_CHATGPT_ROWS, 1.02, 0),
}
