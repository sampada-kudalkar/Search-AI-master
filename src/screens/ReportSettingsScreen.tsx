import { useEffect, useRef, useState } from 'react'
import { AiIcon, CardHeader, Chip, Icon, SelectMenu, Toggle } from '../components'
import { AI_SITE_COLORS } from '../components/ThemesPromptsTable/ThemesPromptsTable'
import iconGoogle from '../assets/icon-google.svg'
import iconGemini from '../assets/icon-gemini.svg'

type Frequency = 'weekly' | 'daily' | 'monthly'

interface ReportSettingsState {
  locationPrompts: { enabled: boolean; frequency: Frequency }
  brandPrompts: { enabled: boolean; frequency: Frequency }
  aiSites: Record<AiSiteId, boolean>
  defaultSite: AiSiteId | null
}

type AiSiteId = 'chatgpt' | 'gemini' | 'perplexity' | 'google-ai-overviews' | 'google-ai-mode' | 'claude' | 'all'

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
]

const AI_SITES: { id: AiSiteId; label: string; iconSrc?: string; caption?: string }[] = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Gemini', iconSrc: iconGemini },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'google-ai-overviews', label: 'Google AI Overviews', iconSrc: iconGoogle },
  { id: 'google-ai-mode', label: 'Google AI Mode', iconSrc: iconGoogle },
  { id: 'claude', label: 'Claude', caption: 'Uses 3x more prompts' },
  { id: 'all', label: 'All', caption: 'Aggregates data across all AI sites' },
]

const DEFAULT_STATE: ReportSettingsState = {
  locationPrompts: { enabled: true, frequency: 'weekly' },
  brandPrompts: { enabled: false, frequency: 'weekly' },
  aiSites: {
    chatgpt: true,
    gemini: true,
    perplexity: true,
    'google-ai-overviews': false,
    'google-ai-mode': false,
    claude: false,
    all: false,
  },
  defaultSite: 'chatgpt',
}

function isEqual(a: ReportSettingsState, b: ReportSettingsState) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function FrequencyDropdown({
  value,
  onChange,
  disabled,
}: {
  value: Frequency
  onChange: (value: Frequency) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const label = FREQUENCY_OPTIONS.find((o) => o.value === value)?.label ?? value

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-[180px] items-center justify-between rounded-sm border border-border bg-surface pl-md pr-sm text-body text-text-primary focus:outline-none ${
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-surface-hover'
        }`}
      >
        <span>{label}</span>
        <Icon name="expand_more" size={18} className="shrink-0 text-text-icon" />
      </button>
      {open && !disabled && (
        <div className="absolute top-full right-0 z-[60] mt-xs w-[180px]">
          <SelectMenu
            options={FREQUENCY_OPTIONS}
            value={[value]}
            searchable={false}
            onChange={(v) => {
              onChange(v[0] as Frequency)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function PromptTrackingRow({
  label,
  caption,
  enabled,
  frequency,
  onToggle,
  onFrequencyChange,
}: {
  label: string
  caption: string
  enabled: boolean
  frequency: Frequency
  onToggle: (enabled: boolean) => void
  onFrequencyChange: (frequency: Frequency) => void
}) {
  return (
    <div className="flex items-center justify-between gap-lg py-lg">
      <div className="flex items-center gap-md">
        <Toggle checked={enabled} onChange={onToggle} />
        <div className="flex flex-col">
          <span className="text-body text-text-primary">{label}</span>
          <span className="text-small text-text-secondary">{caption}</span>
        </div>
      </div>
      <FrequencyDropdown value={frequency} onChange={onFrequencyChange} disabled={!enabled} />
    </div>
  )
}

export function ReportSettingsScreen() {
  const [savedState, setSavedState] = useState<ReportSettingsState>(DEFAULT_STATE)
  const [state, setState] = useState<ReportSettingsState>(DEFAULT_STATE)

  const dirty = !isEqual(state, savedState)

  function handleCancel() {
    setState(savedState)
  }

  function handleSave() {
    setSavedState(state)
  }

  function handleSetDefault(id: AiSiteId) {
    setState((s) => ({ ...s, defaultSite: id }))
  }

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="flex shrink-0 items-center justify-between bg-surface px-2xl py-xl">
        <h1 className="text-h3 text-text-primary">Reports</h1>
        <div className="flex items-center gap-sm">
          {dirty && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={!dirty}
            onClick={handleSave}
            className={`flex h-9 items-center rounded-sm px-lg text-body transition-colors ${
              dirty
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2xl py-2xl">
        <div className="flex flex-col gap-md">
          <div className="rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title="Prompt tracking"
              subtitle="Choose which prompt types to include in reporting cycles"
            />
            <div className="mt-lg divide-y divide-border">
              <PromptTrackingRow
                label="Location prompts"
                caption="200 locations"
                enabled={state.locationPrompts.enabled}
                frequency={state.locationPrompts.frequency}
                onToggle={(enabled) =>
                  setState((s) => ({ ...s, locationPrompts: { ...s.locationPrompts, enabled } }))
                }
                onFrequencyChange={(frequency) =>
                  setState((s) => ({ ...s, locationPrompts: { ...s.locationPrompts, frequency } }))
                }
              />
              <PromptTrackingRow
                label="Brand prompts"
                caption="3 brands"
                enabled={state.brandPrompts.enabled}
                frequency={state.brandPrompts.frequency}
                onToggle={(enabled) =>
                  setState((s) => ({ ...s, brandPrompts: { ...s.brandPrompts, enabled } }))
                }
                onFrequencyChange={(frequency) =>
                  setState((s) => ({ ...s, brandPrompts: { ...s.brandPrompts, frequency } }))
                }
              />
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface p-2xl">
            <CardHeader
              title="AI site tracking"
              subtitle="Choose which AI sites to include in tracking reports. Mark one as default to show it first across reports."
            />
            <div className="mt-lg flex flex-col gap-lg">
              {AI_SITES.map((site) => (
                <label
                  key={site.id}
                  className="group flex cursor-pointer items-start justify-between gap-md"
                >
                  <div className="flex items-start gap-md">
                    <input
                      type="checkbox"
                      checked={state.aiSites[site.id]}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setState((s) => ({
                          ...s,
                          aiSites: { ...s.aiSites, [site.id]: checked },
                          defaultSite:
                            !checked && s.defaultSite === site.id ? null : s.defaultSite,
                        }))
                      }}
                      className="mt-[2px] size-[16px] rounded border-border"
                    />
                    {site.iconSrc ? (
                      <img src={site.iconSrc} alt="" className="mt-[1px] size-[18px] shrink-0" />
                    ) : AI_SITE_COLORS[site.label] ? (
                      <span
                        className="mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                        style={{ backgroundColor: AI_SITE_COLORS[site.label] }}
                      >
                        {site.label.charAt(0)}
                      </span>
                    ) : (
                      <AiIcon size={18} className="mt-[1px] shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-body text-text-primary">{site.label}</span>
                      {site.caption && (
                        <span className="text-small text-text-secondary">{site.caption}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex h-8 shrink-0 items-center">
                    {state.defaultSite === site.id ? (
                      <Chip label="Default" variant="info" />
                    ) : state.aiSites[site.id] ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          handleSetDefault(site.id)
                        }}
                        className="rounded-sm px-md py-xs text-body text-text-action opacity-0 transition-opacity hover:bg-surface-hover group-hover:opacity-100"
                      >
                        Mark as default
                      </button>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
