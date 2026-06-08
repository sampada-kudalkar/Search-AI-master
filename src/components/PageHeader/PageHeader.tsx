import { useEffect, useRef, useState } from 'react'
import { DateChange } from '../DateChange/DateChange'
import { Icon } from '../Icon/Icon'
import { AppointmentView, PageHeaderProps } from './PageHeader.types'

function CreateDropdown({
  onSaleProspect,
  onServiceRequest,
}: {
  onSaleProspect?: () => void
  onServiceRequest?: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-xs rounded-sm bg-primary px-md text-body font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Create
        <Icon name="expand_more" size={18} className="text-white" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-xs w-48 rounded-sm bg-surface p-md shadow-dropdown">
          {[
            { label: 'Sale prospect',   cb: onSaleProspect },
            { label: 'Service request', cb: onServiceRequest },
          ].map(({ label, cb }) => (
            <button
              key={label}
              type="button"
              onClick={() => { cb?.(); setOpen(false) }}
              className="flex w-full items-center rounded-sm px-sm py-sm text-left text-body text-text-primary transition-colors hover:bg-surface-hover"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ViewToggle({
  view,
  onViewChange,
}: {
  view: AppointmentView
  onViewChange?: (view: AppointmentView) => void
}) {
  const base = 'flex size-6 items-center justify-center rounded-sm transition-colors'
  return (
    <div className="flex h-9 items-center gap-xs rounded-sm border border-border-selected bg-surface px-sm">
      <button
        type="button"
        aria-label="Table view"
        onClick={() => onViewChange?.('table')}
        className={`${base} ${
          view === 'table' ? 'bg-surface-selected text-text-primary' : 'text-text-icon'
        }`}
      >
        <Icon name="table_rows" size={18} />
      </button>
      <button
        type="button"
        aria-label="Calendar view"
        onClick={() => onViewChange?.('calendar')}
        className={`${base} ${
          view === 'calendar' ? 'bg-surface-selected text-text-primary' : 'text-text-icon'
        }`}
      >
        <Icon name="calendar_month" size={18} />
      </button>
    </div>
  )
}

export function PageHeader({
  date,
  providerLabel: _providerLabel = 'All customer reps',
  view = 'table',
  isToday = true,
  onPrev,
  onNext,
  onToday,
  onProviderClick: _onProviderClick,
  onViewChange,
  onCustomizeColumns,
  onFilter,
  onCreateSaleProspect,
  onCreateServiceRequest,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-surface px-2xl py-xl">
      <DateChange date={date} isToday={isToday} onPrev={onPrev ?? (() => {})} onNext={onNext ?? (() => {})} onToday={onToday} />

      {/* Controls */}
      <div className="flex items-center gap-sm">
        {/* All customer reps dropdown — hidden, restore by uncommenting
        <button
          type="button"
          onClick={onProviderClick}
          className="flex h-9 items-center gap-sm rounded-sm border border-border-selected bg-surface pl-md pr-sm text-body text-text-primary hover:bg-surface-l2"
        >
          {providerLabel}
          <Icon name="expand_more" size={20} className="text-text-icon" />
        </button>
        */}

        <ViewToggle view={view} onViewChange={onViewChange} />

        <CreateDropdown onSaleProspect={onCreateSaleProspect} onServiceRequest={onCreateServiceRequest} />

        <button
          type="button"
          aria-label="Customize columns"
          onClick={onCustomizeColumns}
          className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
        >
          <Icon name="view_column" size={20} />
        </button>

        <button
          type="button"
          aria-label="Filters"
          onClick={onFilter}
          className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
        >
          <Icon name="filter_list" size={20} />
        </button>
      </div>
    </div>
  )
}
