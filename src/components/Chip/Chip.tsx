import { ChipProps } from './Chip.types'

const VARIANTS: Record<NonNullable<ChipProps['variant']>, string> = {
  warning: 'bg-chip-warning-bg text-chip-warning-text',
  success: 'bg-chip-success-bg text-chip-success-text',
  danger: 'bg-chip-danger-bg text-chip-danger-text',
  neutral: 'bg-chip-neutral-bg text-chip-neutral-text',
  info: 'bg-chip-info-bg text-chip-info-text',
  'swot-strength': 'bg-chip-swot-strength-bg text-chip-swot-strength-text',
  'swot-weakness': 'bg-chip-swot-weakness-bg text-chip-swot-weakness-text',
  'swot-neutral': 'bg-chip-swot-neutral-bg text-chip-swot-neutral-text',
}

export function Chip({ label, variant = 'warning' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-xs rounded-sm px-sm py-xs text-small text-center ${VARIANTS[variant]}`}
    >
      {label}
    </span>
  )
}
