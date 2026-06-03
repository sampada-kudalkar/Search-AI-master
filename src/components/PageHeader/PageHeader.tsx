import { Icon } from '../Icon/Icon'
import { AppointmentView, PageHeaderProps } from './PageHeader.types'

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
  providerLabel = 'All providers',
  view = 'table',
  onPrev,
  onNext,
  onToday,
  onProviderClick,
  onViewChange,
  onCustomizeColumns,
  onFilter,
}: PageHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between bg-surface px-2xl">
      {/* Date navigation */}
      <div className="flex items-center gap-sm">
        <button
          type="button"
          aria-label="Previous day"
          onClick={onPrev}
          className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-selected"
        >
          <Icon name="chevron_left" size={20} />
        </button>
        <span className="text-h3 text-text-primary">{date}</span>
        <button
          type="button"
          aria-label="Next day"
          onClick={onNext}
          className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-selected"
        >
          <Icon name="chevron_right" size={20} />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="ml-sm rounded-sm px-sm py-xs text-body font-medium text-text-action hover:bg-surface-selected"
        >
          Today
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-sm">
        <button
          type="button"
          onClick={onProviderClick}
          className="flex h-9 items-center gap-sm rounded-sm border border-border-selected bg-surface pl-md pr-sm text-body text-text-primary hover:bg-surface-l2"
        >
          {providerLabel}
          <Icon name="expand_more" size={20} className="text-text-icon" />
        </button>

        <ViewToggle view={view} onViewChange={onViewChange} />

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
