export type RankingReportPlatform = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'All'

export const RANKING_SUMMARY = {
  overall:    { value: 4,  label: 'Avg rank' },
  chatgpt:    { value: 3,  label: 'ChatGPT' },
  gemini:     { value: 4,  label: 'Gemini' },
  perplexity: { value: 4,  label: 'Perplexity' },
}

export interface BrandRankingTrendPoint extends Record<string, number | string | undefined> {
  label: string
  aspendentalRank: number
  fleurChoiceRank: number
  wellYesNowRank:  number
}

export const BRAND_RANKING_TREND: Record<RankingReportPlatform, BrandRankingTrendPoint[]> = {
  ChatGPT: [
    { label: 'Apr', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'May', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'Jun', aspendentalRank: 2, fleurChoiceRank: 3, wellYesNowRank: 4 },
  ],
  Gemini: [
    { label: 'Apr', aspendentalRank: 4, fleurChoiceRank: 5, wellYesNowRank: 6 },
    { label: 'May', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'Jun', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 5 },
  ],
  Perplexity: [
    { label: 'Apr', aspendentalRank: 4, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'May', aspendentalRank: 4, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'Jun', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 4 },
  ],
  All: [
    { label: 'Apr', aspendentalRank: 4, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'May', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 5 },
    { label: 'Jun', aspendentalRank: 3, fleurChoiceRank: 4, wellYesNowRank: 4 },
  ],
}
