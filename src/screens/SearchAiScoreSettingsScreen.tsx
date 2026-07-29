import { useState } from 'react'
import { Icon, InfoTooltip, Slider } from '../components'
import { SEARCH_AI_SCORE_COMPONENTS } from '../data/searchAiScoreData'

function defaultWeights(): Record<string, number> {
  return Object.fromEntries(SEARCH_AI_SCORE_COMPONENTS.map((c) => [c.key, c.defaultWeight]))
}

export function SearchAiScoreSettingsScreen() {
  const [weights, setWeights] = useState<Record<string, number>>(defaultWeights)

  const initial = defaultWeights()
  const dirty = SEARCH_AI_SCORE_COMPONENTS.some((c) => weights[c.key] !== initial[c.key])

  const total = SEARCH_AI_SCORE_COMPONENTS.reduce((sum, c) => sum + weights[c.key], 0)
  const isBalanced = total === 100

  const previewScore =
    SEARCH_AI_SCORE_COMPONENTS.reduce((sum, c) => sum + (weights[c.key] / 100) * c.previewValue, 0)
  const initialPreviewScore =
    SEARCH_AI_SCORE_COMPONENTS.reduce((sum, c) => sum + (initial[c.key] / 100) * c.previewValue, 0)

  function handleSliderChange(key: string, value: number) {
    setWeights((prev) => ({ ...prev, [key]: Math.min(100, Math.max(0, value)) }))
  }

  function handleInputChange(key: string, raw: string) {
    const value = Number(raw)
    if (Number.isNaN(value)) return
    setWeights((prev) => ({ ...prev, [key]: Math.min(100, Math.max(0, value)) }))
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
            disabled={!isBalanced}
            title={
              isBalanced
                ? undefined
                : 'Your visibility, citation, average rank, and sentiment score combined weight should add up to 100%'
            }
            className={`flex h-9 items-center rounded-sm px-lg text-body transition-colors ${
              isBalanced ? 'bg-primary text-white hover:bg-primary-hover' : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-[5fr_1fr_4fr] px-2xl pb-2xl pt-lg">
        {/* Left — weight rows */}
        <div className="flex min-w-0 flex-col gap-xl">
          {isBalanced ? (
            <div className="flex items-start gap-sm rounded-sm bg-surface-l2 px-lg py-md">
              <Icon name="info" size={18} className="mt-[1px] shrink-0 text-text-icon" />
              <p className="text-body text-text-secondary">
                Visibility score, citation share, average rank and sentiment score combined weight must add up to 100%
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-sm rounded-sm bg-chip-danger-bg px-lg py-md">
              <Icon name="error" size={18} className="mt-[1px] shrink-0 text-text-primary" />
              <p className="text-body text-text-primary">
                The values currently add up to {total}%. Please adjust the values so that the total adds up to 100%
              </p>
            </div>
          )}

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
                    className={`h-9 w-[56px] rounded-sm border bg-surface px-sm text-center text-body text-text-primary outline-none ${
                      isBalanced ? 'border-border-selected' : 'border-chip-danger-text'
                    }`}
                  />
                  <span className="text-body text-text-secondary">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle — spacer column (20%) */}
        <div aria-hidden />

        {/* Right — live preview */}
        <div className="min-w-0">
          <div className="sticky top-[92px] flex flex-col gap-md">
            <div>
              <h3 className="text-body text-text-primary">Preview</h3>
              <p className="text-small text-text-secondary">Showing data for last 90 days</p>
            </div>
            <div className="rounded-sm border border-border shadow-card">
              <div className="flex items-center justify-between rounded-t-sm bg-surface-l2 px-lg py-md">
                <span className="text-h3 text-text-primary">Search AI score</span>
                {dirty ? (
                  <span className="flex items-center gap-xs text-h3 text-accent-positive">
                    {initialPreviewScore.toFixed(1)}
                    <Icon name="arrow_forward" size={16} className="text-text-tertiary" />
                    {previewScore.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-h3 text-accent-positive">{previewScore.toFixed(1)}</span>
                )}
              </div>
              <div className="flex flex-col">
                {SEARCH_AI_SCORE_COMPONENTS.map((c) => (
                  <div
                    key={c.key}
                    className={`flex items-center justify-between border-t border-border px-lg py-md ${
                      weights[c.key] === 0 ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-sm">
                      <span className="size-[10px] shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-body text-text-primary">{c.label}</span>
                    </div>
                    {dirty ? (
                      <span className="flex items-center gap-xs text-body text-text-primary">
                        {c.previewValue}
                        <Icon name="arrow_forward" size={16} className="text-text-tertiary" />
                        {c.previewValue}
                      </span>
                    ) : (
                      <span className="text-body text-text-primary">{c.previewValue}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
