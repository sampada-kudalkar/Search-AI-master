import { Icon } from '../Icon/Icon'

export interface IntegrationListCardProps {
  name: string
  description: string
  iconBg: string
  iconLabel: string
  selected?: boolean
  connected?: boolean
  onSelect?: () => void
  onConnect?: () => void
  onOpenSettings?: () => void
}

export function IntegrationListCard({
  name,
  description,
  iconBg,
  iconLabel,
  selected = false,
  connected = false,
  onSelect,
  onConnect,
  onOpenSettings,
}: IntegrationListCardProps) {
  const handleCardClick = () => {
    if (connected) onSelect?.()
    else (onOpenSettings ?? onConnect)?.()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick() }
      }}
      className={`group relative flex cursor-pointer flex-col rounded-md border bg-surface p-lg transition-colors hover:bg-surface-hover ${
        selected
          ? 'border-primary ring-1 ring-primary'
          : 'border-border'
      }`}
    >
      {/* Top row: logo + status badge */}
      <div className="mb-md flex items-start justify-between">
        {/* Logo tile */}
        <div
          className="flex size-[48px] shrink-0 items-center justify-center rounded-md text-[15px] leading-none text-white"
          style={{ backgroundColor: iconBg }}
        >
          {iconLabel}
        </div>

        {/* Status badge / select indicator */}
        {connected ? (
          <div
            className={`flex items-center gap-xs rounded-full px-sm py-[3px] text-small transition-colors ${
              selected
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-subtle text-text-secondary'
            }`}
          >
            <span
              className={`size-[6px] shrink-0 rounded-full ${selected ? 'bg-primary' : 'bg-accent-positive'}`}
            />
            {selected ? 'Active' : 'Connected'}
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); (onOpenSettings ?? onConnect)?.() }}
            className="flex items-center gap-xs rounded-sm px-sm py-[3px] text-small text-text-action transition-colors hover:text-primary"
          >
            Connect
            <Icon name="open_in_new" size={13} />
          </button>
        )}
      </div>

      {/* Name */}
      <p className="truncate text-[14px] leading-5 tracking-[-0.28px] text-text-primary">
        {name}
      </p>

      {/* Description */}
      <p className="mt-xs line-clamp-2 text-small leading-[18px] text-text-secondary">
        {description}
      </p>
    </div>
  )
}
