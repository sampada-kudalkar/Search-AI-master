export type ChipVariant = 'warning' | 'success' | 'danger' | 'neutral' | 'info' | 'swot-strength' | 'swot-weakness' | 'swot-neutral'

export interface ChipProps {
  label: string
  variant?: ChipVariant
}
