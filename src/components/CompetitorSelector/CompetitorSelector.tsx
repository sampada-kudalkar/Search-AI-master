import { useState, useRef, useEffect } from 'react'
import { Icon } from '../Icon/Icon'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { getInitials, getCompetitorColor } from '../../utils/competitorAvatar'
import type { Competitor } from '../../data/competitorData'
import type { CompetitorSelectorProps } from './CompetitorSelector.types'

export function CompetitorSelector({ competitors, selected, onChange }: CompetitorSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function removeChip(name: string) {
    onChange(selected.filter((s) => s !== name))
  }

  function toggleItem(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name))
    } else {
      onChange([...selected, name])
    }
  }

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Card */}
      <div className="bg-surface rounded-md border border-border p-xl w-full">
        <div className="flex items-center gap-xs mb-xs">
          <p className="text-small text-text-secondary">Competitor</p>
          <InfoTooltip text="Select up to 5 competitors to compare" />
        </div>

        {/* Chip input row */}
        <div className="flex items-center gap-sm rounded-sm border border-border min-h-9 px-sm py-xs">
          {/* Chips */}
          <div className="flex flex-1 flex-wrap gap-xs">
            {selected.map((name) => (
              <span
                key={name}
                className="flex items-center gap-xs rounded-sm bg-chip-neutral-bg px-sm py-xs text-small text-text-primary"
              >
                {name}
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => removeChip(name)}
                  className="flex items-center rounded-sm"
                >
                  <Icon name="close" size={16} className="text-text-icon" />
                </button>
              </span>
            ))}
          </div>

          {/* Toggle chevron */}
          <button
            type="button"
            aria-label={open ? 'Close competitor list' : 'Open competitor list'}
            onClick={() => {
              setOpen((o) => !o)
              setQuery('')
            }}
            className="flex shrink-0 items-center rounded-sm"
          >
            <Icon
              name={open ? 'expand_less' : 'expand_more'}
              size={20}
              className="text-text-icon"
            />
          </button>
        </div>
      </div>

      {/* Dropdown panel */}
      {open && (
        <CompetitorDropdown
          competitors={filtered}
          selected={selected}
          query={query}
          onQueryChange={setQuery}
          onToggle={toggleItem}
        />
      )}
    </div>
  )
}

function CompetitorDropdown({
  competitors,
  selected,
  query,
  onQueryChange,
  onToggle,
}: {
  competitors: Competitor[]
  selected: string[]
  query: string
  onQueryChange: (q: string) => void
  onToggle: (name: string) => void
}) {
  return (
    <div className="absolute left-0 top-full z-50 mt-xs w-[630px] rounded-sm bg-surface p-xl shadow-dropdown">
      {/* Search input */}
      <div className="flex h-9 items-center gap-sm rounded-sm border border-primary px-sm">
        <Icon name="search" size={16} className="text-text-tertiary shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for competitors"
          className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-tertiary outline-none"
        />
      </div>

      {/* Competitor rows — max 5 visible, rest scrollable */}
      <div className="mt-xl max-h-[280px] overflow-y-auto flex flex-col gap-xl pr-xs">
        {competitors.map((c) => {
          const isChecked = selected.includes(c.name)
          const atLimit = selected.length >= 5
          const isDisabled = !isChecked && atLimit
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => { if (!isDisabled) onToggle(c.name) }}
              className="flex items-center gap-sm w-full text-left rounded-sm px-xs hover:bg-surface-hover"
            >
              {/* Avatar */}
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${getCompetitorColor(c.name)} text-[11px] text-white`}>
                {getInitials(c.name)}
              </span>

              {/* Name + hint */}
              <span className="flex flex-1 flex-col">
                <span className="text-small text-text-primary">{c.name}</span>
                <span className="text-small text-text-tertiary">{c.hint}</span>
              </span>

              {/* Checkbox — only this is disabled when limit reached */}
              {isChecked ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary">
                  <Icon name="check" size={16} className="text-white" />
                </span>
              ) : (
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-sm border ${isDisabled ? 'border-control-disabled bg-surface opacity-50 cursor-not-allowed' : 'border-control-border'}`}
                  title={isDisabled ? 'Only 5 competitors can be added. Please remove one to add another.' : undefined}
                />
              )}
            </button>
          )
        })}

        {competitors.length === 0 && (
          <p className="text-body text-text-tertiary text-center py-sm">No competitors found</p>
        )}
      </div>
    </div>
  )
}
