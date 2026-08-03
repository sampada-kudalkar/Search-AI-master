export interface SentimentSwotItem {
  title: string
  description: string
}

export interface SentimentSwotGridProps {
  strengths: SentimentSwotItem[]
  weaknesses: SentimentSwotItem[]
  opportunities: SentimentSwotItem[]
  threats: SentimentSwotItem[]
}
