export interface DomainHealthScoreBreakdown {
  ai: number | null
  disc: number | null
  fresh: number | null
}

export interface DomainHealthScoreHeaderProps {
  healthAvg: number | null
  breakdown: DomainHealthScoreBreakdown
}
