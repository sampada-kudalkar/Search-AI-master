import { useState } from 'react'
import { Chip } from '../Chip/Chip'
import { DomainListCellProps } from './DomainListCell.types'

export function DomainListCell({ domains, maxVisible = 7 }: DomainListCellProps) {
  const [expanded, setExpanded] = useState(false)
  const hasOverflow = domains.length > maxVisible
  const visible = expanded ? domains : domains.slice(0, maxVisible)

  return (
    <div className="flex flex-wrap items-center gap-xs">
      {visible.map((domain) => (
        <Chip key={domain} label={domain} variant="neutral" />
      ))}
      {hasOverflow && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded((v) => !v)
          }}
          className="text-small text-text-action hover:underline"
        >
          {expanded ? 'Show less' : `+${domains.length - maxVisible} more`}
        </button>
      )}
    </div>
  )
}
