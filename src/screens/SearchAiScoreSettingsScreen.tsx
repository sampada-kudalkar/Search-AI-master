import { useState } from 'react'
import { Icon, InfoTooltip, Slider } from '../components'
import { SEARCH_AI_SCORE_COMPONENTS } from '../data/searchAiScoreData'

function defaultWeights(): Record<string, number> {
  return Object.fromEntries(SEARCH_AI_SCORE_COMPONENTS.map((c) => [c.key, c.defaultWeight]))
}

function redistribute(weights: Record<string, number>, changedKey: string, nextValue: number): Record<string, number> {
  const otherKeys = SEARCH_AI_SCORE_COMPONENTS.map((c) => c.key).filter((k) => k !== changedKey)
  const clamped = Math.min(100, Math.max(0, nextValue))
  const remainder = 100 - clamped
  const otherTotal = otherKeys.reduce((sum, k) => sum + weights[k], 0)

  const next: Record<string, number> = { ...weights, [changedKey]: clamped }
  if (otherTotal === 0) {
    const share = Math.floor(remainder / otherKeys.length)
    otherKeys.forEach((k, i) => {
      next[k] = i === otherKeys.length - 1 ? remainder - share * (otherKeys.length - 1) : share
    })
  } else {
    let assigned = 0
    otherKeys.forEach((k, i) => {
      if (i === otherKeys.length - 1) {
        next[k] = remainder - assigned
      } else {
        const share = Math.round((weights[k] / otherTotal) * remainder)
        next[k] = share
        assigned += share
      }
    })
  }
  return next
}

export function SearchAiScoreSettingsScreen() {
  const [weights, setWeights] = useState<Record<string, number>>(defaultWeights)
  const [actionsOpen, setActionsOpen] = useState(false)

  const initial = defaultWeights()
  const dirty = SEARCH_AI_SCORE_COMPONENTS.some((c) => weights[c.key] !== initial[c.key])

  const previewScore =
    SEARCH_AI_SCORE_COMPONENTS.reduce((sum, c) => sum + (weights[c.key] / 100) * c.previewValue, 0)

  function handleSliderChange(key: string, value: number) {
    setWeights((prev) => redistribute(prev, key, value))
  }

  function handleInputChange(key: string, raw: string) {
    const value = Number(raw)
    if (Number.isNaN(value)) return
    setWeights((prev) => redistribute(prev, key, value))
  }

  function handleRestoreDefault() {
    setWeights(defaultWeights())
  }

  return (
    <div className="flex-1 overflow-auto bg-surface">
      {/* Header — sticky while the form body scrolls */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-surface px-2xl py-xl">
        <div className="flex min-w-0 items-center gap-sm">
          <h1 className="truncate text-h3 text-text-primary">Search AI score</h1>
          <InfoTooltip text="Search AI score is a weighted combination of your visibility score, citation share, average rank, and sentiment score. Adjust the weights below to reflect what matters most to your business." />
        </div>

        <div className="flex items-center gap-sm">
          <button
            type="button"
            disabled={!dirty}
            onClick={dirty ? handleRestoreDefault : undefined}
            className={`rounded-sm px-md py-xs text-body transition-colors ${
              dirty ? 'text-text-action hover:bg-surface-hover' : 'cursor-not-allowed text-text-tertiary'
            }`}
          >
            Restore to default
          </button>
          <button
            type="button"
            disabled={!dirty}
            className={`flex h-9 items-center rounded-sm px-lg text-body transition-colors ${
              dirty ? 'bg-primary text-white hover:bg-primary-hover' : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
            }`}
          >
            Save
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="More actions"
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen((o) => !o)}
              className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon transition-colors hover:bg-surface-l2"
            >
              <Icon name="more_vert" size={20} />
            </button>
            {actionsOpen && (
              <>
                <div className="fixed inset-0 z-[105]" onClick={() => setActionsOpen(false)} aria-hidden />
                <div className="absolute right-0 top-full z-[110] mt-xs min-w-[168px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
                  <button
                    type="button"
                    className="block w-full px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover"
                    onClick={() => setActionsOpen(false)}
                  >
                    Learn more
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-2xl px-2xl pb-2xl pt-md">
        {/* Left — weight rows */}
        <div className="flex min-w-0 flex-col gap-xl">
          <div className="flex items-start gap-sm rounded-sm bg-surface-l2 px-lg py-md">
            <Icon name="info" size={18} className="mt-[1px] shrink-0 text-text-icon" />
            <p className="text-body text-text-secondary">
              Visibility score, citation share, average rank and sentiment score combined weight must add up to 100%
            </p>
          </div>

          {SEARCH_AI_SCORE_COMPONENTS.map((c) => (
            <div key={c.key} className="flex flex-col gap-sm">
              <h3 className="text-body text-text-primary">{c.label}</h3>
              <p className="text-small text-text-secondary">{c.description}</p>
              <div className="flex items-center gap-lg">
                <Slider
                  value={weights[c.key]}
                  onChange={(v) => handleSliderChange(c.key, v)}
                  defaultValue={c.defaultWeight}
                  color={c.color}
                  className="flex-1"
                />
                <div className="flex shrink-0 items-center gap-xs">
                  <input
                    type="text"
                    value={weights[c.key]}
                    onChange={(e) => handleInputChange(c.key, e.target.value)}
                    className="h-9 w-[56px] rounded-sm border border-border-selected bg-surface px-sm text-center text-body text-text-primary outline-none"
                  />
                  <span className="text-body text-text-secondary">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — live preview */}
        <div className="min-w-0">
          <div className="sticky top-[92px] rounded-sm border border-border shadow-card">
            <div className="px-lg pt-lg pb-md">
              <h3 className="text-body text-text-primary">Preview</h3>
              <p className="text-small text-text-secondary">Showing data for last 90 days</p>
            </div>
            <div className="flex items-center justify-between border-t border-border bg-surface-l2 px-lg py-md">
              <span className="text-h3 text-text-primary">Search AI score</span>
              <span className="text-h3 text-accent-positive">{previewScore.toFixed(1)}</span>
            </div>
            <div className="flex flex-col">
              {SEARCH_AI_SCORE_COMPONENTS.map((c) => (
                <div key={c.key} className="flex items-center justify-between border-t border-border px-lg py-md">
                  <div className="flex items-center gap-sm">
                    <span className="size-[10px] shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-body text-text-primary">{c.label}</span>
                  </div>
                  <span className="text-body text-text-primary">{c.previewValue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
