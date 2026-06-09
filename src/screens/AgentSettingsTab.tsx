import { useState } from 'react'
import { Icon } from '../components'

interface AgentSettingsTabProps {
  product?: string
  agentName?: string
}

// ── Procedure book icon (shared with ProceduresScreen) ──────────
function ProcedureBookIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19.7996 6.30078H14.3996C13.9339 6.30078 13.4745 6.40922 13.058 6.6175C12.6414 6.82578 12.279 7.12819 11.9996 7.50078C11.7202 7.12819 11.3578 6.82578 10.9412 6.6175C10.5247 6.40922 10.0653 6.30078 9.59961 6.30078H4.19961C4.04048 6.30078 3.88787 6.364 3.77535 6.47652C3.66282 6.58904 3.59961 6.74165 3.59961 6.90078V17.7008C3.59961 17.8599 3.66282 18.0125 3.77535 18.125C3.88787 18.2376 4.04048 18.3008 4.19961 18.3008H9.59961C10.077 18.3008 10.5348 18.4904 10.8724 18.828C11.21 19.1656 11.3996 19.6234 11.3996 20.1008C11.3996 20.2599 11.4628 20.4125 11.5753 20.525C11.6879 20.6376 11.8405 20.7008 11.9996 20.7008C12.1587 20.7008 12.3114 20.6376 12.4239 20.525C12.5364 20.4125 12.5996 20.2599 12.5996 20.1008C12.5996 19.6234 12.7893 19.1656 13.1268 18.828C13.4644 18.4904 13.9222 18.3008 14.3996 18.3008H19.7996C19.9587 18.3008 20.1114 18.2376 20.2239 18.125C20.3364 18.0125 20.3996 17.8599 20.3996 17.7008V6.90078C20.3996 6.74165 20.3364 6.58904 20.2239 6.47652C20.1114 6.364 19.9587 6.30078 19.7996 6.30078ZM9.59961 17.1008H4.79961V7.50078H9.59961C10.077 7.50078 10.5348 7.69042 10.8724 8.02799C11.21 8.36555 11.3996 8.82339 11.3996 9.30078V17.7008C10.8808 17.3104 10.2489 17.0997 9.59961 17.1008ZM19.1996 17.1008H14.3996C13.7503 17.0997 13.1184 17.3104 12.5996 17.7008V9.30078C12.5996 8.82339 12.7893 8.36555 13.1268 8.02799C13.4644 7.69042 13.9222 7.50078 14.3996 7.50078H19.1996V17.1008Z" fill="currentColor"/>
    </svg>
  )
}

// ── Toggle ──────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
        checked ? 'bg-primary' : 'bg-border-strong'
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ── Variable chip (inline in message fields) ────────────────────
function VarChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-[3px] rounded border border-[#93C5FD] bg-[#EFF6FF] px-[6px] py-[1px] text-small align-middle leading-none">
      <span className="text-[#2563EB] font-mono text-[11px]">{'{x}'}</span>
      <span className="text-[#1D4ED8] text-[12px]">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-[2px] text-[#93C5FD] hover:text-[#2563EB] leading-none"
        >
          ×
        </button>
      )}
    </span>
  )
}

// ── Fallback message field (textarea + variable chip + toolbar) ──
interface FallbackFieldProps {
  prefix: string
  chipLabel: string
  suffix?: string
}

function FallbackField({ prefix, chipLabel, suffix }: FallbackFieldProps) {
  const [showChip, setShowChip] = useState(true)

  return (
    <div className="rounded-sm border border-border-selected bg-surface">
      {/* Text area body */}
      <div className="min-h-[72px] px-md py-sm text-body text-text-primary leading-relaxed">
        {prefix}
        {showChip && (
          <>
            {' '}
            <VarChip label={chipLabel} onRemove={() => setShowChip(false)} />
          </>
        )}
        {suffix && <span>{suffix}</span>}
      </div>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-t border-border px-sm py-xs">
        <div className="flex items-center gap-xs">
          {/* AI personalize icon */}
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
            title="AI"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <text x="10" y="14" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="sans-serif">Ai</text>
            </svg>
          </button>
          {/* Emoji */}
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
            title="Emoji"
          >
            <Icon name="sentiment_satisfied" size={18} />
          </button>
          {/* Personalize label */}
          <button
            type="button"
            className="flex items-center gap-xs text-body text-primary hover:underline"
          >
            Personalize
            <Icon name="expand_more" size={16} className="text-primary" />
          </button>
        </div>
        <button type="button" className="text-body text-primary hover:underline">
          Clear
        </button>
      </div>
    </div>
  )
}

// ── Toggle row (label + optional description + toggle) ──────────
interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-lg">
      <div className="flex-1">
        <p className="text-body text-text-primary">{label}</p>
        {description && <p className="mt-[2px] text-small text-text-secondary">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ── INPUT_CLASS ─────────────────────────────────────────────────
const INPUT_CLASS =
  'w-full rounded-sm border border-border-selected bg-surface px-md text-body text-text-primary focus:border-primary focus:outline-none'

// ── Web chat content ────────────────────────────────────────────
function WebChatSettings() {
  const [resolvedEnabled, setResolvedEnabled] = useState(true)
  const [resolvedName, setResolvedName] = useState('👍 That helped')
  const [escalationEnabled, setEscalationEnabled] = useState(true)
  const [escalationName, setEscalationName] = useState('Talk to human')
  const [beforeEnabled, setBeforeEnabled] = useState(true)
  const [afterEnabled, setAfterEnabled] = useState(true)

  return (
    <div className="flex flex-col gap-lg">
      {/* Resolved button */}
      <div className="flex flex-col gap-sm">
        <ToggleRow
          label="Resolved button"
          description="A quick reply button patients can tap when their question is answered"
          checked={resolvedEnabled}
          onChange={setResolvedEnabled}
        />
        {resolvedEnabled && (
          <div>
            <label className="mb-xs block text-small text-text-secondary">Button name</label>
            <input
              type="text"
              value={resolvedName}
              onChange={(e) => setResolvedName(e.target.value)}
              className={`${INPUT_CLASS} h-9`}
            />
          </div>
        )}
      </div>

      {/* Escalation button */}
      <div className="flex flex-col gap-sm">
        <ToggleRow
          label="Escalation button"
          description="A quick reply button patients can tap to reach a team member"
          checked={escalationEnabled}
          onChange={setEscalationEnabled}
        />
        {escalationEnabled && (
          <div>
            <label className="mb-xs block text-small text-text-secondary">Button name</label>
            <input
              type="text"
              value={escalationName}
              onChange={(e) => setEscalationName(e.target.value)}
              className={`${INPUT_CLASS} h-9`}
            />
          </div>
        )}
      </div>

      {/* Fallback message */}
      <div className="flex flex-col gap-md">
        <p className="text-body text-text-primary">Fallback message</p>

        {/* Before business hours */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-small text-text-secondary">Before business hours</span>
            <Toggle checked={beforeEnabled} onChange={setBeforeEnabled} />
          </div>
          {beforeEnabled && (
            <FallbackField
              prefix="We're not available right now. Our team is back during business hours. You can also reach us at"
              chipLabel="business.phone"
            />
          )}
        </div>

        {/* After business hours */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-small text-text-secondary">After business hours</span>
            <Toggle checked={afterEnabled} onChange={setAfterEnabled} />
          </div>
          {afterEnabled && (
            <FallbackField
              prefix="Our team is offline right now. Leave a message and we'll follow up during business hours. You can also call us at"
              chipLabel="business.phone"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Text settings content ────────────────────────────────────────
function TextSettings() {
  const [unsubscribeEnabled, setUnsubscribeEnabled] = useState(false)
  const [beforeEnabled, setBeforeEnabled] = useState(true)
  const [afterEnabled, setAfterEnabled] = useState(false)

  return (
    <div className="flex flex-col gap-lg">
      {/* Unsubscribe text */}
      <ToggleRow
        label="Unsubscribe text"
        description="Enabling this will allow customers to opt out of text communications"
        checked={unsubscribeEnabled}
        onChange={setUnsubscribeEnabled}
      />

      {/* Fallback message */}
      <div className="flex flex-col gap-md">
        <p className="text-body text-text-primary">Fallback message</p>

        {/* Before business hours */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-small text-text-secondary">Before business hours</span>
            <Toggle checked={beforeEnabled} onChange={setBeforeEnabled} />
          </div>
          {beforeEnabled && (
            <FallbackField
              prefix="We're not available right now. Our team is back during business hours. You can also reach us at"
              chipLabel="business.phone"
            />
          )}
        </div>

        {/* After business hours */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-small text-text-secondary">After business hours</span>
            <Toggle checked={afterEnabled} onChange={setAfterEnabled} />
          </div>
          {afterEnabled && (
            <FallbackField
              prefix="Our team is offline right now. Leave a message and we'll follow up during business hours."
              chipLabel="business.phone"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Channel accordion ────────────────────────────────────────────
interface ChannelAccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function ChannelAccordion({ title, children, defaultOpen = false }: ChannelAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-full items-center justify-between px-lg text-left hover:bg-surface-l2"
      >
        <span className="text-body text-text-primary">{title}</span>
        <Icon
          name={open ? 'expand_less' : 'expand_more'}
          size={20}
          className="text-text-icon"
        />
      </button>
      {open && (
        <div className="border-t border-border px-lg pb-lg pt-lg">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Procedure card (matches ProceduresScreen grid card style) ────
interface ProcedureCardProps {
  title: string
  description: string
  lastEdited: string
}

function ProcedureCard({ title, description, lastEdited }: ProcedureCardProps) {
  return (
    <div className="group flex min-h-[148px] cursor-pointer flex-col rounded-sm border border-border-selected bg-surface p-xl transition-colors hover:bg-surface-selected">
      <div className="mb-md">
        <ProcedureBookIcon size={22} className="text-text-secondary" />
      </div>
      <h3 className="mb-xs text-body text-text-primary">{title}</h3>
      <p className="line-clamp-2 text-body text-text-secondary">{description}</p>
      <div className="mt-auto flex items-center justify-end gap-xs pt-lg text-small text-text-tertiary">
        <Icon name="schedule" size={14} />
        {lastEdited}
      </div>
    </div>
  )
}

// ── Integration card (same style as procedure card) ──────────────
interface IntegrationCardProps {
  iconBg: string
  iconLabel: string
  name: string
  description: string
  connected?: boolean
  onClick?: () => void
}

function IntegrationCard({ iconBg, iconLabel, name, description, connected, onClick }: IntegrationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[148px] w-full cursor-pointer flex-col rounded-sm border border-border-selected bg-surface p-xl text-left transition-colors hover:bg-surface-selected"
    >
      {/* Icon */}
      <div className="mb-md">
        <div
          className="flex size-9 items-center justify-center rounded-sm text-white text-body"
          style={{ backgroundColor: iconBg }}
        >
          {iconLabel}
        </div>
      </div>
      <h3 className="mb-xs text-body text-text-primary">{name}</h3>
      <p className="line-clamp-2 text-body text-text-secondary">{description}</p>
      <div className="mt-auto flex items-center gap-xs pt-lg">
        {connected !== undefined && (
          <>
            <span className={`size-2 rounded-full ${connected ? 'bg-accent-positive' : 'bg-border-strong'}`} />
            <span className="text-small text-text-secondary">{connected ? 'Connected' : 'Not connected'}</span>
          </>
        )}
      </div>
    </button>
  )
}

// ── Healthcare-specific data ─────────────────────────────────────
const HEALTHCARE_PROCEDURES = [
  {
    id: 'greet',
    title: 'Greet and open conversation',
    description: 'Identifies the caller, screens for urgency, and routes them to the right procedure.',
    lastEdited: '2 days ago',
  },
  {
    id: 'general',
    title: 'Handle general inquiry',
    description: 'Answers informational questions like hours, location, insurance, and services.',
    lastEdited: '5 days ago',
  },
  {
    id: 'emergency',
    title: 'Handle emergency or urgent concern',
    description: 'Detects urgent symptoms or concerns and escalates for patient safety.',
    lastEdited: '1 week ago',
  },
  {
    id: 'unclear',
    title: 'Handle unclear message',
    description: "Clarifies vague or out-of-scope messages to recover the patient's intent.",
    lastEdited: '1 week ago',
  },
]

const INTEGRATIONS = [
  {
    id: 'epic',
    iconBg: '#C8102E',
    iconLabel: 'E',
    name: 'Epic',
    description: 'Connect to Epic EHR to sync patient records and appointments.',
  },
]

type RecordingMode = 'off' | 'announced' | 'silent'

export function AgentSettingsTab({ product }: AgentSettingsTabProps) {
  const [voice, setVoice] = useState('Andrea (warm, clear, reassuring)')
  const [greeting, setGreeting] = useState(
    'Thank you for calling Rock Dental Brands — my name is Myna, your virtual assistant. How can I help you today?'
  )
  const [recording, setRecording] = useState<RecordingMode>('announced')
  const [consent, setConsent] = useState(
    'This call may be recorded for quality and training purposes.'
  )
  const [connectedIntegrationId, setConnectedIntegrationId] = useState<string | null>('epic')

  const isHealthcare = product === 'healthcare'

  const handleIntegrationClick = (id: string) => {
    setConnectedIntegrationId((current) => (current === id ? null : id))
  }

  const VOICES = [
    'Andrea (warm, clear, reassuring)',
    'Jordan (professional, calm)',
    'Sam (friendly, upbeat)',
    'Morgan (neutral, clear)',
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-2xl pt-lg pb-2xl">
        {/* constrain settings content to ~700px */}
        <div className="w-full max-w-[700px] space-y-xl">

        {/* Channel settings */}
        <section>
          <h2 className="mb-md text-h3 text-text-primary">Channel settings</h2>
          <div className="space-y-md">

            {/* Voice call */}
            <ChannelAccordion title="Voice call" defaultOpen>
              <div className="flex flex-col gap-lg">
                <div>
                  <label className="mb-xs block text-small text-text-secondary">Voice</label>
                  <div className="relative">
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className={`${INPUT_CLASS} h-9 appearance-none pr-2xl`}
                    >
                      {VOICES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    <Icon
                      name="expand_more"
                      size={18}
                      className="pointer-events-none absolute right-sm top-1/2 -translate-y-1/2 text-text-icon"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-xs block text-small text-text-secondary">
                    Greeting message <span className="text-chip-danger-text">*</span>
                  </label>
                  <textarea
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    rows={4}
                    className={`${INPUT_CLASS} resize-none py-sm`}
                  />
                </div>

                <div>
                  <p className="mb-xs text-small text-text-secondary">Recording</p>
                  <p className="mb-sm text-small text-text-tertiary">
                    Configure consent wording in each channel settings below
                  </p>
                  <div className="flex flex-col gap-sm">
                    {(
                      [
                        { value: 'off', label: 'Off' },
                        { value: 'announced', label: 'Record with announced consent' },
                        { value: 'silent', label: 'Record silently' },
                      ] as { value: RecordingMode; label: string }[]
                    ).map(({ value, label }) => (
                      <label key={value} className="flex cursor-pointer items-center gap-sm">
                        <input
                          type="radio"
                          name="recording"
                          value={value}
                          checked={recording === value}
                          onChange={() => setRecording(value)}
                          className="accent-primary"
                        />
                        <span className="text-body text-text-primary">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {recording !== 'off' && (
                  <div>
                    <label className="mb-xs block text-small text-text-secondary">
                      Consent message
                    </label>
                    <textarea
                      value={consent}
                      onChange={(e) => setConsent(e.target.value)}
                      rows={3}
                      className={`${INPUT_CLASS} resize-none py-sm`}
                    />
                  </div>
                )}
              </div>
            </ChannelAccordion>

            {/* Web chat */}
            <ChannelAccordion title="Web chat">
              <WebChatSettings />
            </ChannelAccordion>

            {/* Text */}
            <ChannelAccordion title="Text">
              <TextSettings />
            </ChannelAccordion>

          </div>
        </section>

        {/* Procedures */}
        {isHealthcare && (
          <section>
            <h2 className="mb-md text-h3 text-text-primary">Procedures</h2>
            <div className="grid grid-cols-2 gap-lg">
              {HEALTHCARE_PROCEDURES.map((proc) => (
                <ProcedureCard
                  key={proc.id}
                  title={proc.title}
                  description={proc.description}
                  lastEdited={proc.lastEdited}
                />
              ))}
            </div>
          </section>
        )}

        {/* Integrations */}
        <section>
          <h2 className="mb-md text-h3 text-text-primary">Integrations</h2>
          <div className="grid grid-cols-2 gap-lg">
            {INTEGRATIONS.map((intg) => (
              <IntegrationCard
                key={intg.id}
                iconBg={intg.iconBg}
                iconLabel={intg.iconLabel}
                name={intg.name}
                description={intg.description}
                connected={connectedIntegrationId === intg.id}
                onClick={() => handleIntegrationClick(intg.id)}
              />
            ))}
          </div>
        </section>

        </div>
      </div>
    </div>
  )
}
