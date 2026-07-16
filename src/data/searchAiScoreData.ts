import { chartColors } from '../components/charts/chartColors'

export interface SearchAiScoreComponent {
  key: string
  label: string
  description: string
  defaultWeight: number
  previewValue: number
  color: string
}

export const SEARCH_AI_SCORE_COMPONENTS: SearchAiScoreComponent[] = [
  {
    key: 'visibility',
    label: 'Visibility score',
    description: 'Measures how often your brand appears in AI-generated answers.',
    defaultWeight: 34,
    previewValue: 78,
    color: chartColors.categorical[0],
  },
  {
    key: 'citationShare',
    label: 'Citation share',
    description: 'Share of citations your brand receives compared to competitors.',
    defaultWeight: 22,
    previewValue: 69,
    color: chartColors.categorical[6],
  },
  {
    key: 'averageRank',
    label: 'Average rank',
    description: "Your brand's average position when it appears in AI answers.",
    defaultWeight: 24,
    previewValue: 81,
    color: chartColors.categorical[3],
  },
  {
    key: 'sentimentScore',
    label: 'Sentiment score',
    description: 'Reflects customer and AI sentiment associated with your brand.',
    defaultWeight: 20,
    previewValue: 71,
    color: chartColors.categorical[1],
  },
]
