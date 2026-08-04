import type { SentimentCitationRow, SentimentNegativeDriverRow } from '../../data/sentimentReportData'

export interface CitationSentimentDrawerProps {
  open: boolean
  onClose: () => void
  row: SentimentCitationRow | SentimentNegativeDriverRow | null
}
