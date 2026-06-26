import type { ReactNode } from 'react'

export interface SegmentOption {
  value: string
  label: string | ReactNode
}

export interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={`flex items-center bg-[#f5f5f5] rounded-[4px] p-[4px] gap-0 ${className ?? ''}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-[8px] py-[2px] rounded-[4px] text-body leading-[20px] transition-all whitespace-nowrap ${
            value === opt.value
              ? 'bg-surface shadow-[0px_2px_2.5px_rgba(33,33,33,0.10)] text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
