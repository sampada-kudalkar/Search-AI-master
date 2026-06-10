import { useState } from 'react'
import { Icon } from '../Icon/Icon'

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex size-4 items-center justify-center rounded-full border transition-colors ${
        checked ? 'border-primary' : 'border-control-border bg-surface'
      }`}
    >
      {checked && <span className="size-2 rounded-full bg-primary" />}
    </span>
  )
}

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
  const [hovered, setHovered] = useState(false)

  const logo = (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface p-[2px]">
      <div
        className="flex size-full items-center justify-center rounded-full text-[10px] leading-none text-white"
        style={{ backgroundColor: iconBg }}
      >
        {iconLabel}
      </div>
    </div>
  )

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-md rounded-sm border px-lg py-md transition-colors ${
        selected ? 'border-primary' : 'border-border-selected'
      } ${hovered ? 'bg-surface-hover' : 'bg-surface'}`}
    >
      <button
        type="button"
        aria-label={`Select ${name} for this agent`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
        className="-m-sm flex size-10 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-surface-selected"
      >
        <Radio checked={selected} />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-lg">
        <div className="flex min-w-0 flex-1 items-start gap-md">
          {onOpenSettings ? (
            <button
              type="button"
              aria-label={`Open ${name} settings`}
              onClick={(e) => {
                e.stopPropagation()
                onOpenSettings()
              }}
              className="-m-sm flex min-h-10 min-w-0 flex-1 items-start gap-md rounded-sm p-sm text-left transition-colors hover:bg-surface-selected"
            >
              {logo}
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-xs">
                  <span className="text-body leading-6 text-text-primary">{name}</span>
                  <span
                    className={`inline-flex size-7 shrink-0 items-center justify-center text-text-icon ${
                      hovered ? 'visible' : 'invisible'
                    }`}
                  >
                    <Icon name="open_in_new" size={14} />
                  </span>
                </div>
                <p className="line-clamp-2 text-small leading-5 text-text-secondary">{description}</p>
              </div>
            </button>
          ) : (
            <>
              {logo}
              <div className="min-w-0 flex-1">
                <span className="block text-body leading-6 text-text-primary">{name}</span>
                <p className="line-clamp-2 text-small leading-5 text-text-secondary">{description}</p>
              </div>
            </>
          )}
        </div>

        <div className="shrink-0 self-center">
          {connected ? (
            <div className="flex items-center gap-xs whitespace-nowrap">
              <span className="size-2 rounded-full bg-accent-positive" />
              <span className="text-small text-text-secondary">Connected</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onConnect?.()
              }}
              className="-m-sm whitespace-nowrap rounded-sm px-md py-sm text-body text-text-action hover:bg-surface-selected hover:text-primary-hover"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
