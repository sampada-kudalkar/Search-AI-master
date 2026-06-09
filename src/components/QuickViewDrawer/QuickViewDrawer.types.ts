export interface QuickViewAppointment {
  patient: string
  provider: string
  apptType: string
  dateTime: string
  status: string
  bookedBy?: string
  internalNote?: string
}

export interface QuickViewWaitlist {
  patient: string
  provider: string
  location: string
  apptType: string
  slotPreference: string
  waitingSince: string
  status: string
  bookedBy?: string
}

export interface QuickViewDrawerProps {
  open: boolean
  appointment?: QuickViewAppointment | null
  waitlist?: QuickViewWaitlist | null
  onClose: () => void
  onViewDetails?: () => void
}
