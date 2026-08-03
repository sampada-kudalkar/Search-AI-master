import type { SentimentCompetitorRow } from '../../data/sentimentReportData'

export interface CompetitorSentimentDrawerProps {
  open: boolean
  onClose: () => void
  row: SentimentCompetitorRow | null
}
