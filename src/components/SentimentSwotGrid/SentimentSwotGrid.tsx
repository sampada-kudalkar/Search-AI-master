import { SummarizeIcon } from '../SummarizeIcon/SummarizeIcon'
import { Chip } from '../Chip/Chip'
import type { ChipProps } from '../Chip/Chip.types'
import type { SentimentSwotGridProps, SentimentSwotItem } from './SentimentSwotGrid.types'

function ItemList({ items }: { items: SentimentSwotItem[] }) {
  return (
    <div className="flex flex-col gap-sm">
      {items.map((item) => (
        <p key={item.title} className="text-body">
          <span className="text-text-primary">{item.title}: </span>
          <span className="text-text-secondary">{item.description}</span>
        </p>
      ))}
    </div>
  )
}

function Pill({ label, variant, align }: { label: string; variant: ChipProps['variant']; align: 'start' | 'end' }) {
  return (
    <div className={`flex ${align === 'end' ? 'justify-end' : 'justify-start'}`}>
      <Chip label={label} variant={variant} />
    </div>
  )
}

export function SentimentSwotGrid({ strengths, weaknesses, opportunities, threats }: SentimentSwotGridProps) {
  return (
    <div className="relative grid grid-cols-2 rounded-md bg-ai-summary">
      <div className="flex flex-col gap-lg border-b border-r border-border p-xl">
        <Pill label="Strengths" variant="swot-strength" align="start" />
        <ItemList items={strengths} />
      </div>
      <div className="flex flex-col gap-lg border-b border-border p-xl">
        <Pill label="Weaknesses" variant="swot-weakness" align="end" />
        <ItemList items={weaknesses} />
      </div>
      <div className="flex flex-col gap-lg border-r border-border p-xl">
        <ItemList items={opportunities} />
        <Pill label="Opportunities" variant="swot-neutral" align="start" />
      </div>
      <div className="flex flex-col gap-lg p-xl">
        <ItemList items={threats} />
        <Pill label="Threats" variant="swot-neutral" align="end" />
      </div>

      <div className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface">
        <SummarizeIcon size={16} />
      </div>
    </div>
  )
}
