import { Icon } from '../Icon/Icon'

export interface ChartCardButtonProps {
  icon: string
  label: string
  onClick?: () => void
  iconClassName?: string
}

export function ChartCardButton({ icon, label, onClick, iconClassName = 'text-text-icon' }: ChartCardButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-l2 transition-colors"
    >
      <Icon name={icon} size={16} className={iconClassName} />
    </button>
  )
}
