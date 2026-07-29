import { useState } from 'react'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import { HorizontalBarChart } from '../charts/HorizontalBarChart'
import { Icon } from '../Icon/Icon'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { DrawerSignalRow, KVRow, ScoreBreakdownDrawerProps } from './ScoreBreakdownDrawer.types'

function tierBarColorClass(score: number | null): string {
  if (score == null) return 'bg-surface-selected'
  if (score >= 80) return 'bg-chip-success-text'
  if (score >= 40) return 'bg-chip-warning-text'
  return 'bg-chip-danger-text'
}

function signalIcon(status: DrawerSignalRow['status']) {
  if (status === 'pass') return { name: 'check_circle', className: 'text-chip-success-text' }
  if (status === 'warning') return { name: 'warning', className: 'text-chip-warning-text' }
  if (status === 'neutral') return { name: 'schedule', className: 'text-text-secondary' }
  return { name: 'cancel', className: 'text-chip-danger-text' }
}

const kvColumnDefs: Column<KVRow>[] = [
  { key: 'label', label: '', resizable: false, render: (v) => <span className="text-body text-text-primary">{v as string}</span> },
  { key: 'value', label: '', resizable: false, render: (v) => <span className="text-body text-text-secondary">{v as string | number}</span> },
]

export function ScoreBreakdownDrawer({
  open,
  onClose,
  metricName,
  score,
  highlights,
  onRegenerate,
  sections,
  scope,
}: ScoreBreakdownDrawerProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(sections.filter((s) => s.defaultOpen).map((s) => s.key)),
  )

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const visibleSections = sections.filter((s) => !s.pageOnly || scope === 'page')

  return (
    <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[650px] max-w-[92vw] flex-col bg-surface shadow-dropdown transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center gap-sm px-2xl pb-lg pt-2xl">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <BackArrowIcon />
          </button>
          <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{metricName}</h2>
        </div>

        <div className="flex flex-1 flex-col gap-lg overflow-y-auto px-2xl pb-2xl">
          <div className="flex flex-col gap-xs">
            <div className="flex items-end gap-xs">
              <span className={`text-display ${score != null && score >= 80 ? 'text-chip-success-text' : score != null && score >= 40 ? 'text-chip-warning-text' : 'text-chip-danger-text'}`}>
                {score ?? '—'}
              </span>
              <span className="pb-[2px] text-small text-text-tertiary">/ 100</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="text-small text-text-secondary">{metricName} score</span>
              <InfoTooltip text={`How your ${metricName.toLowerCase()} score is calculated.`} />
            </div>
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className={`h-full rounded-full ${tierBarColorClass(score)}`} style={{ width: `${score ?? 0}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-md rounded-md border border-[#b090e0] bg-[#f9f7fd] p-lg">
            <div className="flex items-center gap-xs text-small text-ai-brand">
              <Icon name="auto_awesome" size={16} />
              Summary
            </div>
            <div className="flex flex-col gap-xs">
              <span className="text-body text-text-primary">Highlights</span>
              <ul className="flex flex-col gap-xs">
                {highlights.map((line) => (
                  <li key={line} className="flex items-start gap-xs text-body text-text-secondary">
                    <span className="mt-[9px] size-1 shrink-0 rounded-full bg-text-tertiary" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-xs self-end rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
            >
              <Icon name="refresh" size={16} />
              Regenerate
            </button>
          </div>

          <div className="flex flex-col">
            {visibleSections.map((section) => {
              const isOpen = openKeys.has(section.key)
              return (
                <div key={section.key} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggle(section.key)}
                    className="flex w-full items-center justify-between gap-md py-md text-left"
                  >
                    <span className="text-body text-text-primary">{section.title}</span>
                    <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={24} className="shrink-0 text-text-icon" />
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-sm pb-lg">
                      {section.kind === 'signals' && (
                        <>
                          {section.description && <p className="text-small text-text-secondary">{section.description}</p>}
                          {section.signals.map((signal) => {
                            const icon = signalIcon(signal.status)
                            return (
                              <div key={signal.label} className="flex items-start gap-xs">
                                <Icon name={icon.name} size={16} fill className={`mt-[2px] shrink-0 ${icon.className}`} />
                                <span className="text-body text-text-primary">
                                  {signal.label}
                                  {signal.note && <span className="text-text-secondary"> • {signal.note}</span>}
                                </span>
                              </div>
                            )
                          })}
                        </>
                      )}

                      {section.kind === 'bots' && (
                        <>
                          {section.rows.map((bot) => (
                            <div key={bot.name} className="flex items-start gap-xs">
                              <Icon name="warning" size={16} fill className="mt-[2px] shrink-0 text-chip-warning-text" />
                              <span className="text-body text-text-primary">
                                {bot.name} <span className="text-text-secondary">— {bot.status}</span>
                              </span>
                            </div>
                          ))}
                          {section.note && (
                            <div className="mt-xs flex items-start gap-xs rounded-md bg-surface-subtle px-md py-sm">
                              <Icon name="info" size={16} className="mt-[2px] shrink-0 text-text-icon" />
                              <span className="text-small text-text-secondary">{section.note}</span>
                            </div>
                          )}
                        </>
                      )}

                      {section.kind === 'bar' && <HorizontalBarChart data={section.data} rowHeight={32} />}

                      {section.kind === 'kv' && (
                        <DataTable columns={kvColumnDefs} data={section.rows} showHeader={false} rowHeight={40} />
                      )}

                      {section.kind === 'fixes' &&
                        section.fixes.map((fix) => (
                          <div key={fix.rank} className="flex items-start justify-between gap-md">
                            <div className="flex items-start gap-xs">
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-selected text-small text-text-primary">
                                {fix.rank}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-body text-text-primary">{fix.title}</span>
                                {fix.affectedLabel && <span className="text-small text-text-secondary">{fix.affectedLabel}</span>}
                              </div>
                            </div>
                            <span className="shrink-0 text-body text-chip-success-text">+{fix.points} pts</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
