import { useState } from 'react'
import { Icon } from '../components'
import { COMPETITORS, DEFAULT_SELECTED, REPORT_DATE, type Competitor } from '../data/competitorData'

export function CompetitorBenchmarkScreen(): JSX.Element {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)

  return (
    <div className="flex flex-col bg-[#f5f5f5] h-full w-full overflow-y-auto">
      {/* Page header */}
      <div className="flex h-16 shrink-0 items-center gap-sm px-2xl">
        {/* Title */}
        <div className="flex flex-1 items-center gap-sm">
          <span className="text-h3 text-text-primary">Competitor benchmarking by brand</span>
          <Icon name="info" size={20} className="text-text-icon" />
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-sm">
          {/* Month selector — static display */}
          <button
            type="button"
            className="flex items-center gap-sm rounded-sm border border-border bg-surface px-md py-sm text-body text-text-primary hover:bg-surface-hover"
          >
            {REPORT_DATE}
            <Icon name="expand_more" size={20} className="text-text-icon" />
          </button>

          {/* More options */}
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="more_vert" size={20} className="text-text-icon" />
          </button>

          {/* Filter */}
          <button
            type="button"
            aria-label="Filter"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="tune" size={20} className="text-text-icon" />
          </button>
        </div>
      </div>

      {/* Competitor selector + cards will be added below */}
      <div className="flex flex-col gap-xl px-2xl">
        <CompetitorSelector
          competitors={COMPETITORS}
          selected={selected}
          onChange={setSelected}
        />
      </div>
    </div>
  )
}

function CompetitorSelector({
  competitors,
  selected,
  onChange,
}: {
  competitors: Competitor[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

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
    <div className="relative w-full">
      {/* Card */}
      <div className="bg-surface rounded-md border border-border p-xl w-full">
        <p className="text-small text-text-secondary mb-xs">Competitor</p>

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
                  className="flex items-center"
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
            className="flex shrink-0 items-center"
          >
            <Icon
              name={open ? 'expand_less' : 'expand_more'}
              size={20}
              className="text-text-icon"
            />
          </button>
        </div>
      </div>

      {/* Dropdown panel — rendered in Task 4 */}
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

// Placeholder — implemented in Task 4
function CompetitorDropdown(_props: {
  competitors: Competitor[]
  selected: string[]
  query: string
  onQueryChange: (q: string) => void
  onToggle: (name: string) => void
}) {
  return null
}
