export interface DomainHealthScoreBreakdownV2 {
  ai: number | null
  disc: number | null
  fresh: number | null
}

export interface DomainHealthScoreHeaderV2Props {
  healthAvg: number | null
  breakdown: DomainHealthScoreBreakdownV2
}
