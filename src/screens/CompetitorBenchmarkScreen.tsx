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

// Placeholder — implemented in Task 3
function CompetitorSelector(_props: {
  competitors: Competitor[]
  selected: string[]
  onChange: (next: string[]) => void
}): null {
  return null
}
