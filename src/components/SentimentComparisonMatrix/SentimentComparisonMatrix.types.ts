export interface SentimentComparisonMatrixCompetitor {
  name: string
  isYou?: boolean
}

export interface SentimentComparisonMatrixProps {
  traits: readonly string[]
  competitors: SentimentComparisonMatrixCompetitor[]
  /** trait -> competitor name -> present */
  values: Record<string, Record<string, boolean>>
}

export interface SentimentMatrixRow extends Record<string, unknown> {
  _id: string
  trait: string
}
