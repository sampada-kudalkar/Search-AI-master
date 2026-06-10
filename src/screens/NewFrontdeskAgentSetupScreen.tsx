import { useState, type MouseEvent } from 'react'
import { BackArrowIcon } from '../assets/BackArrowIcon'
import {
  Icon,
  IntegrationSelectCard,
  IntegrationsPickerDrawer,
  ProcedureSelectCard,
  ProceduresPickerDrawer,
  TopNav,
} from '../components'
import type { IntegrationsPickerSaveResult } from '../components/IntegrationsPickerDrawer/IntegrationsPickerDrawer.types'
import type { ProcedurePickerItem } from '../components/ProceduresPickerDrawer/ProceduresPickerDrawer.types'
import {
  DEFAULT_WIZARD_PROCEDURE_IDS,
  HEALTHCARE_PROCEDURE_CATALOG,
  type HealthcareProcedureCatalogItem,
} from '../data/healthcareProcedureCatalog'
import {
  DEFAULT_AGENT_SELECTED_INTEGRATION_ID,
  DEFAULT_WIZARD_CONNECTED_INTEGRATION_IDS,
  HEALTHCARE_INTEGRATION_CATALOG,
  type HealthcareIntegration,
} from '../data/healthcareIntegrations'
import {
  ChannelSettingsPanel,
  TextSetupSettings,
  WebChatSetupSettings,
} from './channelSetupSettings'

interface NewFrontdeskAgentSetupScreenProps {
  onBack: () => void
  onCancel: () => void
  onComplete?: (agentName: string) => void
  onOpenIntegrationSettings?: (integrationId: string) => void
}

const STEPS = [
  { id: 1, label: 'Configure channels' },
  { id: 2, label: 'Select procedures' },
  { id: 3, label: 'Select integrations' },
  { id: 4, label: 'Review summary' },
] as const

const PROGRESS_BY_STEP: Record<number, number> = {
  1: 17,
  2: 50,
  3: 75,
  4: 100,
}

const CHANNELS = [
  { id: 'voice', label: 'Voice call' },
  { id: 'webchat', label: 'Web chat' },
  { id: 'text', label: 'Text' },
] as const

type ChannelId = (typeof CHANNELS)[number]['id']
type RecordingMode = 'off' | 'announced' | 'silent'

const FIELD_BORDER_CLASS =
  'rounded-sm border border-border-input bg-surface transition-colors focus:border-primary focus:outline-none focus-visible:border-primary'

const INPUT_CLASS = `w-full px-md text-body text-text-primary ${FIELD_BORDER_CLASS}`

const VOICES = [
  { label: 'Andrea (warm, clear, reassuring)', preview: "Hi, I'm Andrea — warm, clear, and reassuring. How can I help you today?" },
  { label: 'Jordan (professional, calm)', preview: "Hello, this is Jordan. I'm here to assist you professionally and calmly." },
  { label: 'Sam (friendly, upbeat)', preview: "Hey there! Sam here — friendly and upbeat. What can I do for you?" },
  { label: 'Morgan (neutral, clear)', preview: "Hi, I'm Morgan. Clear and neutral, ready to assist you." },
]

function stepMarkerClass({
  isActive,
  isComplete,
  canNavigate,
}: {
  isActive: boolean
  isComplete: boolean
  canNavigate: boolean
}) {
  const hoverClass = canNavigate
    ? isComplete
      ? 'hover:bg-primary-hover'
      : isActive
        ? 'hover:bg-surface-hover'
        : 'hover:border-primary hover:text-primary'
    : ''

  if (isComplete) {
    return `flex size-7 shrink-0 items-center justify-center rounded-full bg-primary transition-colors ${hoverClass}`
  }

  if (isActive) {
    return `flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-small text-primary transition-colors ${hoverClass}`
  }

  return `flex size-7 shrink-0 items-center justify-center rounded-full border border-border-selected bg-surface text-small text-text-tertiary transition-colors ${hoverClass}`
}

function StepIndicator({
  currentStep,
  maxStepReached,
  onStepChange,
}: {
  currentStep: number
  maxStepReached: number
  onStepChange: (step: number) => void
}) {
  return (
    <nav aria-label="Setup progress">
      <ol className="flex flex-col">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isComplete = step.id < currentStep
          const isLast = index === STEPS.length - 1
          const canNavigate = step.id <= maxStepReached

          return (
            <li key={step.id} className="flex gap-md">
              <div className="flex w-7 shrink-0 flex-col items-center">
                <button
                  type="button"
                  disabled={!canNavigate}
                  aria-label={step.label}
                  onClick={() => onStepChange(step.id)}
                  className={`${stepMarkerClass({ isActive, isComplete, canNavigate })} ${
                    canNavigate ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {isComplete ? (
                    <Icon name="check" size={16} fill weight={600} className="text-white" />
                  ) : (
                    step.id
                  )}
                </button>
                {!isLast && <div className="h-[32px] w-px bg-border" aria-hidden />}
              </div>
              <button
                type="button"
                disabled={!canNavigate}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => onStepChange(step.id)}
                className={`flex h-7 min-w-0 flex-1 items-center text-left text-body ${
                  canNavigate ? 'cursor-pointer' : 'cursor-default'
                } ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}
              >
                {step.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function SettingsCheckboxBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
        checked ? 'border-primary bg-primary' : 'border-control-border bg-surface'
      }`}
    >
      {checked && <Icon name="check" size={11} fill weight={600} className="text-white" />}
    </span>
  )
}

function ChannelCard({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex min-h-[56px] flex-1 items-center gap-md rounded-md border-2 px-lg py-lg text-left transition-colors ${
        selected
          ? 'border-primary bg-surface-selected'
          : 'border-border-selected bg-surface hover:bg-surface-l2'
      }`}
    >
      <SettingsCheckboxBox checked={selected} />
      <span className="text-body text-text-primary">{label}</span>
    </button>
  )
}

function VoiceSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)

  const openMenu = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setAnchor({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    setOpen(true)
  }

  const stopPlaying = () => {
    window.speechSynthesis.cancel()
    setPlaying(null)
  }

  const togglePreview = (opt: (typeof VOICES)[number], e: MouseEvent) => {
    e.stopPropagation()
    if (playing === opt.label) {
      stopPlaying()
      return
    }
    stopPlaying()
    const utter = new SpeechSynthesisUtterance(opt.preview)
    utter.onend = () => setPlaying(null)
    setPlaying(opt.label)
    window.speechSynthesis.speak(utter)
  }

  const select = (label: string) => {
    stopPlaying()
    onChange(label)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        className={`flex h-9 w-full items-center gap-sm rounded-sm border bg-surface pl-md pr-sm transition-colors hover:bg-surface-l2 focus:border-primary focus:outline-none focus-visible:border-primary ${
          open ? 'border-primary' : 'border-border-input'
        }`}
      >
        <span className={`min-w-0 flex-1 truncate text-left text-body ${value ? 'text-text-primary' : 'text-text-tertiary'}`}>
          {value || 'Select a voice'}
        </span>
        <Icon name="expand_more" size={20} className="shrink-0 text-text-icon" />
      </button>
      {open && anchor && (
        <>
          <div className="fixed inset-0 z-[105]" onClick={() => { stopPlaying(); setOpen(false) }} aria-hidden />
          <div
            className="fixed z-[110] rounded-sm border border-border bg-surface py-xs shadow-dropdown"
            style={{ top: anchor.top, left: anchor.left, width: anchor.width }}
          >
            {VOICES.map((opt) => {
              const isSelected = opt.label === value
              const isPlaying = playing === opt.label
              return (
                <div
                  key={opt.label}
                  onClick={() => select(opt.label)}
                  className={`flex cursor-pointer items-center gap-sm px-md py-sm hover:bg-surface-hover ${isSelected ? 'bg-surface-hover' : ''}`}
                >
                  <span className="min-w-0 flex-1 truncate text-body text-text-primary">{opt.label}</span>
                  <button
                    type="button"
                    onClick={(e) => togglePreview(opt, e)}
                    title={isPlaying ? 'Stop preview' : 'Preview voice'}
                    className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2 hover:text-primary"
                  >
                    <Icon name={isPlaying ? 'stop' : 'volume_up'} size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

function VoiceChannelSettings({
  voice,
  onVoiceChange,
  greeting,
  onGreetingChange,
  recording,
  onRecordingChange,
  consent,
  onConsentChange,
}: {
  voice: string
  onVoiceChange: (value: string) => void
  greeting: string
  onGreetingChange: (value: string) => void
  recording: RecordingMode
  onRecordingChange: (value: RecordingMode) => void
  consent: string
  onConsentChange: (value: string) => void
}) {
  return (
    <ChannelSettingsPanel title="Voice call">
      <div className="flex flex-col gap-lg">
        <div>
          <label className="block text-small text-text-secondary">Voice</label>
          <VoiceSelect value={voice} onChange={onVoiceChange} />
        </div>

        <div>
          <label className="mb-xs block text-small text-text-secondary">
            Greeting message <span className="text-chip-danger-text">*</span>
          </label>
          <textarea
            value={greeting}
            onChange={(e) => onGreetingChange(e.target.value)}
            rows={4}
            placeholder="e.g. Thank you for calling — my name is Myna, your virtual assistant. How can I help you today?"
            className={`${INPUT_CLASS} resize-none py-sm placeholder:text-text-tertiary`}
          />
        </div>

        <div>
          <p className="text-small text-text-secondary">Recording</p>
          <p className="mt-[2px] text-small text-text-tertiary">
            Configure consent wording in each channel settings below
          </p>
          <div className="mt-sm flex flex-col gap-sm">
              <label className="flex cursor-pointer items-center gap-sm">
                <input
                  type="radio"
                  name="wizard-recording"
                  checked={recording === 'off'}
                  onChange={() => onRecordingChange('off')}
                  className="accent-primary"
                />
                <span className="text-body text-text-primary">Off</span>
              </label>
              <div>
                <label className="flex cursor-pointer items-center gap-sm">
                  <input
                    type="radio"
                    name="wizard-recording"
                    checked={recording === 'announced'}
                    onChange={() => onRecordingChange('announced')}
                    className="accent-primary"
                  />
                  <span className="text-body text-text-primary">Record with announced consent</span>
                </label>
                {recording === 'announced' && (
                  <div className="mt-sm pl-2xl">
                    <label className="mb-xs block text-small text-text-secondary">Consent message</label>
                    <textarea
                      value={consent}
                      onChange={(e) => onConsentChange(e.target.value)}
                      rows={3}
                      placeholder="e.g. This call may be recorded for quality and training purposes."
                      className={`${INPUT_CLASS} resize-none py-sm placeholder:text-text-tertiary`}
                    />
                  </div>
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-sm">
                <input
                  type="radio"
                  name="wizard-recording"
                  checked={recording === 'silent'}
                  onChange={() => onRecordingChange('silent')}
                  className="accent-primary"
                />
                <span className="text-body text-text-primary">Record silently</span>
              </label>
          </div>
        </div>
      </div>
    </ChannelSettingsPanel>
  )
}

function ConfigureChannelsStep({
  agentName,
  onAgentNameChange,
  selectedChannels,
  onToggleChannel,
  voice,
  onVoiceChange,
  greeting,
  onGreetingChange,
  recording,
  onRecordingChange,
  consent,
  onConsentChange,
}: {
  agentName: string
  onAgentNameChange: (value: string) => void
  selectedChannels: Set<ChannelId>
  onToggleChannel: (id: ChannelId) => void
  voice: string
  onVoiceChange: (value: string) => void
  greeting: string
  onGreetingChange: (value: string) => void
  recording: RecordingMode
  onRecordingChange: (value: RecordingMode) => void
  consent: string
  onConsentChange: (value: string) => void
}) {
  return (
    <div className="flex w-full max-w-[700px] flex-col gap-xl">
      <div>
        <h2 className="text-h3 text-text-primary">Getting started</h2>
        <p className="mt-xs text-body text-text-secondary">
          Name your agent and choose the channels it will serve
        </p>
      </div>

      <div className="flex flex-col gap-sm">
        <label className="text-body text-text-primary">
          Agent name <span className="text-chip-danger-text">*</span>
        </label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => onAgentNameChange(e.target.value)}
          placeholder="e.g. Myna, Front desk AI, Scheduling assistant"
          className={`${INPUT_CLASS} h-9 placeholder:text-text-tertiary`}
        />
        <p className="text-small text-text-secondary">
          This is the name your agent uses when greeting patients
        </p>
      </div>

      <div className="flex flex-col gap-md">
        <div>
          <p className="text-body text-text-primary">Channels</p>
          <p className="mt-xs text-body text-text-secondary">
            Choose the channels this agent should handle
          </p>
        </div>
        <div className="flex gap-md">
          {CHANNELS.map((channel) => (
            <ChannelCard
              key={channel.id}
              label={channel.label}
              selected={selectedChannels.has(channel.id)}
              onToggle={() => onToggleChannel(channel.id)}
            />
          ))}
        </div>
      </div>

      {selectedChannels.size === 0 && (
        <div className="flex items-center gap-md rounded-md border border-border bg-surface-subtle px-lg py-md">
          <Icon name="info" size={18} className="shrink-0 text-text-tertiary" />
          <p className="text-body text-text-secondary">
            Select one or more channels above to configure their settings.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-[32px]">
        {selectedChannels.has('voice') && (
          <VoiceChannelSettings
            voice={voice}
            onVoiceChange={onVoiceChange}
            greeting={greeting}
            onGreetingChange={onGreetingChange}
            recording={recording}
            onRecordingChange={onRecordingChange}
            consent={consent}
            onConsentChange={onConsentChange}
          />
        )}

        {selectedChannels.has('webchat') && (
          <ChannelSettingsPanel title="Web chat">
            <WebChatSetupSettings />
          </ChannelSettingsPanel>
        )}

        {selectedChannels.has('text') && (
          <ChannelSettingsPanel title="Text">
            <TextSetupSettings />
          </ChannelSettingsPanel>
        )}
      </div>
    </div>
  )
}

function SelectProceduresStep({
  procedures,
  selectedIds,
  onToggleProcedure,
  onCreate,
  onViewProcedure,
}: {
  procedures: HealthcareProcedureCatalogItem[]
  selectedIds: string[]
  onToggleProcedure: (id: string) => void
  onCreate: () => void
  onViewProcedure: (id: string) => void
}) {
  return (
    <div className="flex w-full max-w-[960px] flex-col">
      <div className="mb-xl flex items-start justify-between gap-md">
        <div>
          <h2 className="text-h3 text-text-primary">Select procedures</h2>
          <p className="mt-xs text-body text-text-secondary">
            Choose the procedures your agent will follow.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="shrink-0 rounded-sm px-md py-xs text-body text-text-action transition-colors hover:bg-surface-hover"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-3 gap-lg">
        {procedures.map((procedure) => (
          <ProcedureSelectCard
            key={procedure.id}
            title={procedure.title}
            description={procedure.description}
            selected={selectedIds.includes(procedure.id)}
            onToggle={() => onToggleProcedure(procedure.id)}
            onView={() => onViewProcedure(procedure.id)}
          />
        ))}
      </div>
    </div>
  )
}

function SelectIntegrationsStep({
  integrations,
  connectedIds,
  selectedId,
  onSelectIntegration,
  onViewIntegration,
  onConnectIntegration,
  onAddCustom,
}: {
  integrations: HealthcareIntegration[]
  connectedIds: string[]
  selectedId: string | null
  onSelectIntegration: (id: string) => void
  onViewIntegration: (id: string) => void
  onConnectIntegration: (id: string) => void
  onAddCustom: () => void
}) {
  return (
    <div className="flex w-full max-w-[960px] flex-col">
      <div className="mb-xl flex items-start justify-between gap-md">
        <div>
          <h2 className="text-h3 text-text-primary">Select integrations</h2>
          <p className="mt-xs text-body text-text-secondary">
            Connect the tools your agent needs to take action.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddCustom}
          className="flex shrink-0 items-center gap-xs rounded-sm px-md py-xs text-body text-text-action transition-colors hover:bg-surface-hover"
        >
          Add custom integration
          <Icon name="open_in_new" size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-lg">
        {integrations.map((integration) => {
          const connected = connectedIds.includes(integration.id)
          return (
            <IntegrationSelectCard
              key={integration.id}
              name={integration.name}
              description={integration.description}
              iconBg={integration.iconBg}
              iconLabel={integration.iconLabel}
              selected={connected && selectedId === integration.id}
              connected={connected}
              onSelect={() => onSelectIntegration(integration.id)}
              onView={() => onViewIntegration(integration.id)}
              onConnect={() => onConnectIntegration(integration.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function PlaceholderStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex max-w-[700px] flex-col gap-sm">
      <h2 className="text-h3 text-text-primary">{title}</h2>
      <p className="text-body text-text-secondary">{description}</p>
    </div>
  )
}

export function NewFrontdeskAgentSetupScreen({
  onBack,
  onCancel,
  onComplete,
  onOpenIntegrationSettings,
}: NewFrontdeskAgentSetupScreenProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [maxStepReached, setMaxStepReached] = useState(1)
  const [agentName, setAgentName] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<Set<ChannelId>>(
    () => new Set(),
  )
  const [voice, setVoice] = useState('')
  const [greeting, setGreeting] = useState('')
  const [recording, setRecording] = useState<RecordingMode>('off')
  const [consent, setConsent] = useState('')
  const [procedureCatalog, setProcedureCatalog] = useState<HealthcareProcedureCatalogItem[]>(
    () => [...HEALTHCARE_PROCEDURE_CATALOG],
  )
  const [selectedProcedureIds, setSelectedProcedureIds] = useState<string[]>(
    () => [...DEFAULT_WIZARD_PROCEDURE_IDS],
  )
  const [procedureDrawerOpen, setProcedureDrawerOpen] = useState(false)
  const [procedureDrawerDetailId, setProcedureDrawerDetailId] = useState<string | null>(null)
  const [procedureDrawerInitialView, setProcedureDrawerInitialView] = useState<'list' | 'create'>(
    'list',
  )
  const [connectedIntegrationIds, setConnectedIntegrationIds] = useState<string[]>(
    () => [...DEFAULT_WIZARD_CONNECTED_INTEGRATION_IDS],
  )
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(
    DEFAULT_AGENT_SELECTED_INTEGRATION_ID,
  )
  const [integrationDrawerOpen, setIntegrationDrawerOpen] = useState(false)

  const toggleChannel = (id: ChannelId) => {
    setSelectedChannels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleProcedure = (id: string) => {
    setSelectedProcedureIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const openProcedureCreate = () => {
    setProcedureDrawerDetailId(null)
    setProcedureDrawerInitialView('create')
    setProcedureDrawerOpen(true)
  }

  const openProcedureView = (id: string) => {
    setProcedureDrawerDetailId(id)
    setProcedureDrawerInitialView('list')
    setProcedureDrawerOpen(true)
  }

  const closeProcedureDrawer = () => {
    setProcedureDrawerOpen(false)
    setProcedureDrawerDetailId(null)
    setProcedureDrawerInitialView('list')
  }

  const handleCreateProcedure = (procedure: ProcedurePickerItem) => {
    setProcedureCatalog((current) => [
      ...current,
      { ...procedure, lastEdited: 'Just now' },
    ])
  }

  const selectIntegration = (id: string) => {
    if (connectedIntegrationIds.includes(id)) {
      setSelectedIntegrationId(id)
    }
  }

  const openIntegrationDrawer = () => {
    setIntegrationDrawerOpen(true)
  }

  const closeIntegrationDrawer = () => {
    setIntegrationDrawerOpen(false)
  }

  const saveIntegrations = ({ selectedId, connectedIds }: IntegrationsPickerSaveResult) => {
    setConnectedIntegrationIds(connectedIds)
    setSelectedIntegrationId(selectedId)
    setIntegrationDrawerOpen(false)
  }

  const goToStep = (step: number) => {
    if (step <= maxStepReached) {
      setCurrentStep(step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      const nextStep = currentStep + 1
      setMaxStepReached((max) => Math.max(max, nextStep))
      setCurrentStep(nextStep)
      return
    }
    onComplete?.(agentName.trim() || 'New frontdesk agent')
  }

  const progress = PROGRESS_BY_STEP[currentStep] ?? 0
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === STEPS.length

  return (
    <div className="flex h-full flex-col">
      <TopNav initials="S" />

      <div className="flex h-16 shrink-0 items-center justify-between bg-surface px-2xl">
        <div className="flex items-center gap-sm">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <BackArrowIcon />
          </button>
          <h1 className="text-h3 text-text-primary">New front desk agent</h1>
        </div>
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={isFirstStep ? onCancel : handleBack}
            className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
          >
            {isFirstStep ? 'Cancel' : 'Back'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
          >
            {isLastStep ? 'Create' : 'Next'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-2xl overflow-y-auto px-2xl pb-2xl pt-lg">
        <aside className="sticky top-0 flex w-[280px] shrink-0 flex-col self-start rounded-md border border-border bg-surface px-xl py-xl min-h-[calc(100vh-9rem)]">
          <div className="mb-xl">
            <h2 className="text-body text-text-primary">Agent setup</h2>
            <p className="mt-xs text-small text-text-secondary">
              Configure channels, procedures, and tools
            </p>
          </div>

          <StepIndicator
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepChange={goToStep}
          />

          <div className="mt-auto pt-xl">
            <div className="mb-sm flex items-center justify-between text-small text-text-secondary">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-surface-selected">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 pt-xl pb-[100px]">
          {currentStep === 1 && (
            <ConfigureChannelsStep
              agentName={agentName}
              onAgentNameChange={setAgentName}
              selectedChannels={selectedChannels}
              onToggleChannel={toggleChannel}
              voice={voice}
              onVoiceChange={setVoice}
              greeting={greeting}
              onGreetingChange={setGreeting}
              recording={recording}
              onRecordingChange={setRecording}
              consent={consent}
              onConsentChange={setConsent}
            />
          )}
          {currentStep === 2 && (
            <SelectProceduresStep
              procedures={procedureCatalog}
              selectedIds={selectedProcedureIds}
              onToggleProcedure={toggleProcedure}
              onCreate={openProcedureCreate}
              onViewProcedure={openProcedureView}
            />
          )}
          {currentStep === 3 && (
            <SelectIntegrationsStep
              integrations={HEALTHCARE_INTEGRATION_CATALOG}
              connectedIds={connectedIntegrationIds}
              selectedId={selectedIntegrationId}
              onSelectIntegration={selectIntegration}
              onViewIntegration={(id) => onOpenIntegrationSettings?.(id)}
              onConnectIntegration={openIntegrationDrawer}
              onAddCustom={openIntegrationDrawer}
            />
          )}
          {currentStep === 4 && (
            <PlaceholderStep
              title="Review summary"
              description="Review your agent configuration before creating it."
            />
          )}
        </div>
      </div>

      <ProceduresPickerDrawer
        open={procedureDrawerOpen}
        procedures={procedureCatalog}
        selectedIds={selectedProcedureIds}
        initialDetailId={procedureDrawerDetailId}
        initialView={procedureDrawerInitialView}
        onClose={closeProcedureDrawer}
        onSave={setSelectedProcedureIds}
        onCreateProcedure={handleCreateProcedure}
      />

      <IntegrationsPickerDrawer
        open={integrationDrawerOpen}
        integrations={HEALTHCARE_INTEGRATION_CATALOG}
        connectedIds={connectedIntegrationIds}
        selectedId={selectedIntegrationId}
        onClose={closeIntegrationDrawer}
        onSave={saveIntegrations}
      />
    </div>
  )
}
