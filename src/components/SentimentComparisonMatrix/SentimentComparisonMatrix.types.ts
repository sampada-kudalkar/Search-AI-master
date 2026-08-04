export interface SentimentComparisonMatrixCompetitor {
  name: string
  isYou?: boolean
}

export interface SentimentComparisonMatrixProps {
  traits: readonly string[]
  competitors: SentimentComparisonMatrixCompetitor[]
  /** trait -> competitor name -> positive sentiment score (0-100), or undefined if no data */
  values: Record<string, Record<string, number | undefined>>
}

export interface SentimentMatrixRow extends Record<string, unknown> {
  _id: string
  trait: string
}
