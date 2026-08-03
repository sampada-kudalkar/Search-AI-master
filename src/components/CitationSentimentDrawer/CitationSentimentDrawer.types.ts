import type { SentimentCitationRow } from '../../data/sentimentReportData'

export interface CitationSentimentDrawerProps {
  open: boolean
  onClose: () => void
  row: SentimentCitationRow | null
}
