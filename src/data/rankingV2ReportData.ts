export const RANKING_V2_PLATFORMS = ['ChatGPT', 'Gemini', 'Perplexity', 'All'] as const
export type RankingV2Platform = typeof RANKING_V2_PLATFORMS[number]

export const RANKING_V2_BRAND_NAME = 'Arthur Conias Real Estate'

export interface RankingV2Signal extends Record<string, unknown> {
  name: string
  category: string
  influence: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'VERIFIED' | 'UNVERIFIED'
}

export interface RankingV2Competitor {
  name: string
  rank: number
  signalCount: number
  topSignals: string[]
}

export interface RankingV2PlatformSummary extends Record<string, unknown> {
  platform: string
  rank: number
  summary: string
}

export interface RankingV2Data {
  perception: { score: number; label: string; confidence: number; summary: string }
  queryAlignment: { score: number; label: string; confidence: number; summary: string }
  rank: number
  representation: { type: string; displayName: string; status: string }
  recognizedSignals: RankingV2Signal[]
  competitors: RankingV2Competitor[]
  rankByPlatform: RankingV2PlatformSummary[]
}

const CHATGPT_DATA: RankingV2Data = {
  perception: {
    score: 72,
    label: 'Positive',
    confidence: 0.85,
    summary: 'AI presents your business favorably but without standout differentiation vs. peers.',
  },
  queryAlignment: {
    score: 65,
    label: 'Moderate',
    confidence: 0.85,
    summary: 'Your business aligns with the query but peers are described as more directly relevant.',
  },
  rank: 3,
  representation: {
    type: 'real estate agency',
    displayName: 'Arthur Conias Real Estate - Ashgrove',
    status: 'VERIFIED',
  },
  recognizedSignals: [
    { name: 'Experience since 1972', category: 'Experience', influence: 'HIGH', status: 'VERIFIED' },
    { name: 'Property management services', category: 'Service', influence: 'MEDIUM', status: 'VERIFIED' },
    { name: 'Sales services', category: 'Service', influence: 'MEDIUM', status: 'VERIFIED' },
    { name: 'Local expertise (Ashgrove)', category: 'Local', influence: 'LOW', status: 'VERIFIED' },
  ],
  competitors: [
    {
      name: 'Templeton Property',
      rank: 2,
      signalCount: 6,
      topSignals: ['Buyer services', 'Local expertise', 'Personalized service'],
    },
    {
      name: 'SPACE Property',
      rank: 3,
      signalCount: 5,
      topSignals: ['Personalized service', 'Boutique advice'],
    },
    {
      name: 'Sean Clift Buyers Agent',
      rank: 3,
      signalCount: 5,
      topSignals: ['Deep local expertise', '25 years in Ashgrove'],
    },
  ],
  rankByPlatform: [
    { platform: 'ChatGPT', rank: 3, summary: 'Described with strong service history; buyer services absent from AI description.' },
    { platform: 'Gemini', rank: 4, summary: 'Recognized for longevity; peers score higher on personalization.' },
    { platform: 'Perplexity', rank: 4, summary: 'Limited data surfaced; local expertise signals not prominently cited.' },
  ],
}

export const RANKING_V2_DATA: Record<RankingV2Platform, RankingV2Data | null> = {
  ChatGPT: CHATGPT_DATA,
  Gemini: null,
  Perplexity: null,
  All: null,
}

export const RANKING_V2_SUMMARY = { avgRank: 4, delta: '1' }

export interface RankingV2Prompt {
  text: string
  perception: number
  alignment: number
  confidence: number
}

export interface RankingV2ThemeRow {
  theme: string
  prompts: RankingV2Prompt[]
}

export const RANKING_V2_THEME_SCORES: RankingV2ThemeRow[] = [
  {
    theme: 'Buying/Selling a Home',
    prompts: [
      { text: 'Best real estate agent in Ashgrove', perception: 72, alignment: 66, confidence: 85 },
      { text: 'Top rated home sellers', perception: 68, alignment: 61, confidence: 80 },
      { text: 'Local property experts', perception: 71, alignment: 65, confidence: 84 },
    ],
  },
  {
    theme: 'Property Management',
    prompts: [
      { text: 'Best property management company', perception: 64, alignment: 57, confidence: 78 },
      { text: 'Rental property managers near me', perception: 66, alignment: 59, confidence: 80 },
    ],
  },
  {
    theme: 'Local Real Estate Agent',
    prompts: [
      { text: 'Local real estate agent Ashgrove', perception: 75, alignment: 70, confidence: 89 },
      { text: 'Real estate agent with local experience', perception: 73, alignment: 68, confidence: 87 },
    ],
  },
  {
    theme: 'Investment Properties',
    prompts: [
      { text: 'Investment property advice', perception: 60, alignment: 54, confidence: 75 },
      { text: 'Best agent for investment properties', perception: 60, alignment: 56, confidence: 77 },
    ],
  },
]

export interface ThemeRankDistributionRow extends Record<string, unknown> {
  theme: string
  rank1_3: number
  rank4_10: number
  rank10Plus: number
  notTracked: number
}

export const THEME_RANK_DISTRIBUTION: ThemeRankDistributionRow[] = [
  { theme: 'Buying/Selling a Home', rank1_3: 1, rank4_10: 0, rank10Plus: 0, notTracked: 0 },
  { theme: 'Property Management', rank1_3: 0, rank4_10: 1, rank10Plus: 0, notTracked: 0 },
  { theme: 'Local Real Estate Agent', rank1_3: 0, rank4_10: 1, rank10Plus: 0, notTracked: 0 },
  { theme: 'Investment Properties', rank1_3: 0, rank4_10: 0, rank10Plus: 0, notTracked: 1 },
]

export interface LocationThemeRow {
  name: string
  rankBucket: 'rank1_3' | 'rank4_10' | 'rank10Plus'
  ranks: Partial<Record<RankingV2Platform, number>>
}

export interface LocationThemeRankRow extends Record<string, unknown> {
  location: string
  rank1_3: number
  rank4_10: number
  rank10Plus: number
  themes: LocationThemeRow[]
}

export const LOCATION_THEME_RANK: LocationThemeRankRow[] = [
  {
    location: 'Ashgrove, QLD',
    rank1_3: 1,
    rank4_10: 2,
    rank10Plus: 0,
    themes: [
      { name: 'Local Real Estate Agent', rankBucket: 'rank1_3', ranks: { ChatGPT: 1, Gemini: 2, Perplexity: 1 } },
      { name: 'Buying/Selling a Home', rankBucket: 'rank4_10', ranks: { ChatGPT: 5, Gemini: 6, Perplexity: 4 } },
      { name: 'Property Management', rankBucket: 'rank4_10', ranks: { ChatGPT: 7, Gemini: 6, Perplexity: 8 } },
    ],
  },
  {
    location: 'Paddington, QLD',
    rank1_3: 2,
    rank4_10: 1,
    rank10Plus: 0,
    themes: [
      { name: 'Local Real Estate Agent', rankBucket: 'rank1_3', ranks: { ChatGPT: 2, Gemini: 1, Perplexity: 2 } },
      { name: 'Buying/Selling a Home', rankBucket: 'rank1_3', ranks: { ChatGPT: 3, Gemini: 2, Perplexity: 3 } },
      { name: 'Investment Properties', rankBucket: 'rank4_10', ranks: { ChatGPT: 6, Gemini: 5, Perplexity: 7 } },
    ],
  },
  {
    location: 'Kelvin Grove, QLD',
    rank1_3: 0,
    rank4_10: 2,
    rank10Plus: 1,
    themes: [
      { name: 'Buying/Selling a Home', rankBucket: 'rank4_10', ranks: { ChatGPT: 5, Gemini: 7, Perplexity: 6 } },
      { name: 'Property Management', rankBucket: 'rank4_10', ranks: { ChatGPT: 8, Gemini: 9, Perplexity: 7 } },
      { name: 'Investment Properties', rankBucket: 'rank10Plus', ranks: { ChatGPT: 12, Gemini: 14, Perplexity: 11 } },
    ],
  },
  {
    location: 'Bardon, QLD',
    rank1_3: 2,
    rank4_10: 0,
    rank10Plus: 0,
    themes: [
      { name: 'Local Real Estate Agent', rankBucket: 'rank1_3', ranks: { ChatGPT: 1, Gemini: 1, Perplexity: 2 } },
      { name: 'Buying/Selling a Home', rankBucket: 'rank1_3', ranks: { ChatGPT: 2, Gemini: 3, Perplexity: 3 } },
    ],
  },
]
