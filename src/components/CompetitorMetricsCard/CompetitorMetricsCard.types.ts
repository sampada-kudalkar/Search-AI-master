import { CompetitorRowData } from '../../data/competitorData'

export interface CompetitorMetricsCardProps {
  rows: CompetitorRowData[]
  onRowClick?: (row: CompetitorRowData) => void
  selectedCompetitor?: CompetitorRowData
}
