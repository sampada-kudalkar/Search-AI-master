import type { Competitor } from '../../data/competitorData'

export interface CompetitorSelectorProps {
  competitors: Competitor[]
  selected: string[]
  onChange: (next: string[]) => void
}
