import { Icon } from '../Icon/Icon'
import { DomainHealthScoreHeaderProps } from './DomainHealthScoreHeader.types'

function tierColor(value: number | null): string {
  if (value == null) return 'text-text-tertiary'
  if (value >= 80) return 'text-chip-success-text'
  if (value >= 50) return 'text-chip-warning-text'
  return 'text-chip-danger-text'
}

function ScoreStat({ value, label, tooltip }: { value: number | null; label: string; tooltip: string }) {
  return (
    <div>
      <div className={`text-[32px] leading-none ${tierColor(value)}`}>{value ?? '—'}</div>
      <div className="mt-sm flex items-center gap-xs text-small text-text-tertiary">
        {label}
        <span className="group relative flex items-center">
          <Icon name="info" size={16} className="cursor-default text-text-tertiary" />
          <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-xs w-max max-w-[220px] -translate-x-1/2 rounded-sm bg-[#212121] px-sm py-xs text-xs text-white opacity-0 shadow-dropdown transition-opacity group-hover:opacity-100">
            {tooltip}
          </span>
        </span>
      </div>
    </div>
  )
}

export function DomainHealthScoreHeader({ healthAvg, breakdown }: DomainHealthScoreHeaderProps) {
  return (
    <div className="grid grid-cols-4 gap-lg">
      <div className="rounded-md border border-border bg-surface px-2xl py-xl">
        <div className="mb-md text-body text-text-primary">Health</div>
        <ScoreStat value={healthAvg} label="Health score" tooltip="Overall score combining AI readiness, Discoverability, and Freshness for this page." />
      </div>
      <div className="col-span-3 rounded-md border border-border bg-surface px-2xl py-xl">
        <div className="mb-md text-body text-text-primary">Health consists of</div>
        <div className="flex gap-[100px]">
          <ScoreStat value={breakdown.ai} label="AI readiness" tooltip="How well AI assistants can read and understand this page's content." />
          <ScoreStat value={breakdown.disc} label="Discoverability" tooltip="How easily crawlers and AI assistants can find and index this page." />
          <ScoreStat value={breakdown.fresh} label="Freshness" tooltip="How recently this page was crawled and updated." />
        </div>
      </div>
    </div>
  )
}
