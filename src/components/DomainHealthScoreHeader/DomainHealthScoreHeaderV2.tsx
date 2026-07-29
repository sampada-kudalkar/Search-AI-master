import { HEALTH_METRIC_TOOLTIPS } from '../../data/domainHealthDataV2'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { DomainHealthScoreHeaderV2Props } from './DomainHealthScoreHeaderV2.types'

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
      <div className="mt-sm flex items-center gap-xs text-small text-text-secondary">
        {label}
        <InfoTooltip text={tooltip} />
      </div>
    </div>
  )
}

export function DomainHealthScoreHeaderV2({ healthAvg, breakdown }: DomainHealthScoreHeaderV2Props) {
  return (
    <div className="grid grid-cols-4 gap-lg">
      <div className="rounded-md border border-border bg-surface px-2xl py-xl">
        <div className="mb-md text-body text-text-primary">Health</div>
        <ScoreStat value={healthAvg} label="Health score" tooltip={HEALTH_METRIC_TOOLTIPS.health} />
      </div>
      <div className="col-span-3 rounded-md border border-border bg-surface px-2xl py-xl">
        <div className="mb-md text-body text-text-primary">Health consists of</div>
        <div className="flex gap-[80px]">
          <ScoreStat value={breakdown.ai} label="AI readiness" tooltip={HEALTH_METRIC_TOOLTIPS.aiReadiness} />
          <ScoreStat value={breakdown.disc} label="Discoverability" tooltip={HEALTH_METRIC_TOOLTIPS.discoverability} />
          <ScoreStat value={breakdown.fresh} label="Freshness" tooltip={HEALTH_METRIC_TOOLTIPS.freshness} />
        </div>
      </div>
    </div>
  )
}
