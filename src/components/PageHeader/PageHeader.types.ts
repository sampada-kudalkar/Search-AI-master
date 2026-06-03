export type AppointmentView = 'table' | 'calendar'

export interface PageHeaderProps {
  date: string
  providerLabel?: string
  view?: AppointmentView
  onPrev?: () => void
  onNext?: () => void
  onToday?: () => void
  onProviderClick?: () => void
  onViewChange?: (view: AppointmentView) => void
  onCustomizeColumns?: () => void
  onFilter?: () => void
}
