import { Icon } from '../Icon/Icon'
import { IconRailProps, RailNavItem } from './IconRail.types'

function NavTab({
  item,
  active,
  onSelect,
}: {
  item: RailNavItem
  active: boolean
  onSelect?: (id: string) => void
}) {
  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      onClick={() => onSelect?.(item.id)}
      className={`flex h-7 w-full items-center gap-lg rounded-sm px-xs transition-colors ${
        active ? 'bg-surface-selected-l1' : 'hover:bg-surface-hover'
      }`}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">
        {item.kind === 'image' ? (
          <img src={item.icon} alt="" className="size-5" />
        ) : (
          <Icon name={item.icon} size={20} className="text-text-icon" />
        )}
      </span>

      <span className="min-w-0 flex-1 truncate text-left text-body text-text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {item.label}
      </span>

      {item.badge && (
        <span className="flex h-5 shrink-0 items-center justify-center rounded-sm bg-accent-positive px-sm text-[10px] leading-[18px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {item.badge}
        </span>
      )}
    </button>
  )
}

export function IconRail({ logoSrc, brand, groups, activeId, onSelect }: IconRailProps) {
  return (
    // Reserve the collapsed width in layout; the nav itself overlays and grows on hover.
    <div className="relative h-full w-14 shrink-0">
      <nav className="group absolute inset-y-0 left-0 z-50 flex w-14 flex-col overflow-hidden border-r border-border bg-surface-selected transition-[width,box-shadow] duration-200 hover:w-[262px] hover:shadow-dropdown">
        {/* Logo + wordmark header */}
        <div className="flex h-[52px] shrink-0 items-center gap-md px-[14px]">
          <img src={logoSrc} alt="" className="size-7 shrink-0" />
          <span className="truncate text-h3 text-text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {brand}
          </span>
        </div>

        {/* Main nav */}
        <div className="flex flex-1 flex-col gap-sm overflow-y-auto overflow-x-hidden px-[14px] py-sm">
          {groups.map((group, gi) => (
            <div key={group.id} className="flex flex-col gap-sm">
              {gi > 0 && <span className="h-px w-full bg-surface-selected-l1" />}

              {group.header && (
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-200 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                  <p className="min-h-0 overflow-hidden truncate px-xs text-small text-text-tertiary">
                    {group.header}
                  </p>
                </div>
              )}

              {group.items.map((item) => (
                <NavTab
                  key={item.id}
                  item={item}
                  active={item.id === activeId}
                  onSelect={onSelect}
                />
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}
