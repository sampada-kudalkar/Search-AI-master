export const RANKING_V2_PLATFORMS = ['ChatGPT', 'Gemini', 'Perplexity', 'All'] as const
export type RankingV2Platform = typeof RANKING_V2_PLATFORMS[number]

export const RANKING_V2_BRAND_NAME = 'Arthur Conias Real Estate'

export interface RankingV2Signal extends Record<string, unknown> {
  name: string
  category: string
  influence: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'VERIFIED' | 'UNVERIFIED'
}

export interface RankingV2MissingSignal {
  name: string
  category: string
  influence: string
  recommendation: string
}

export interface RankingV2Competitor {
  name: string
  rank: number
  signalCount: number
  missingSignals: RankingV2MissingSignal[]
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
      missingSignals: [
        {
          name: 'Buyer services',
          category: 'Service',
          influence: 'MEDIUM',
          recommendation:
            "Add a dedicated buyer's agent services page to your website. Use language like 'expert guidance for property purchases' and 'tailored buyer support', these are the phrases AI is picking up from Templeton Property.",
        },
      ],
    },
    {
      name: 'SPACE Property',
      rank: 3,
      signalCount: 5,
      missingSignals: [
        {
          name: 'Personalized service',
          category: 'Service',
          influence: 'MEDIUM',
          recommendation:
            "Highlight your boutique and personalized approach across your homepage and listing descriptions. SPACE Property is being described as offering 'tailored property advice', add similar language to your website and Google Business Profile.",
        },
      ],
    },
    {
      name: 'Sean Clift Buyers Agent',
      rank: 3,
      signalCount: 5,
      missingSignals: [
        {
          name: 'Deep local expertise',
          category: 'Local',
          influence: 'LOW',
          recommendation:
            "Feature team members' local ties, years of residence, and neighborhood knowledge prominently. Sean Clift's profile mentions 25 years living in Ashgrove, this kind of specificity is what AI picks up.",
        },
      ],
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

export interface LocationThemeRankRow extends Record<string, unknown> {
  location: string
  rank1_3: number
  rank4_10: number
  rank10Plus: number
}

export const LOCATION_THEME_RANK: LocationThemeRankRow[] = [
  { location: 'Ashgrove, QLD', rank1_3: 1, rank4_10: 2, rank10Plus: 0 },
  { location: 'Paddington, QLD', rank1_3: 2, rank4_10: 1, rank10Plus: 0 },
  { location: 'Kelvin Grove, QLD', rank1_3: 0, rank4_10: 2, rank10Plus: 1 },
  { location: 'Bardon, QLD', rank1_3: 2, rank4_10: 0, rank10Plus: 0 },
]
