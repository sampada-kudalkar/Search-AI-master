import { useMemo, useState } from 'react'
import { Icon, IntegrationSelectCard, ProcedureSelectCard } from '../components'
import type { HealthcareProcedureCatalogItem } from '../data/healthcareProcedureCatalog'
import type { HealthcareIntegration } from '../data/healthcareIntegrations'
import PreviewPanel from '../workflow/Molecules/PreviewPanel/PreviewPanel'
import '../workflow/Molecules/PreviewPanel/PreviewPanel.css'
import {
  TEXT_FALLBACK_AFTER,
  TEXT_FALLBACK_BEFORE,
  WEBCHAT_FALLBACK_AFTER,
  WEBCHAT_FALLBACK_DURING,
  type TextChannelSettings,
  type WebChatChannelSettings,
} from './channelSetupSettings.types'

type ChannelId = 'voice' | 'webchat' | 'text'
type RecordingMode = 'off' | 'announced' | 'silent'

const READONLY_FIELD_CLASS =
  'w-full rounded-sm border border-border-input bg-surface px-md py-sm text-body text-text-primary'


function ReviewSectionHeader({
  title,
  editAriaLabel,
  onEdit,
}: {
  title: string
  editAriaLabel: string
  onEdit: () => void
}) {
  return (
    <div className="mb-md flex items-center gap-xs">
      <h3 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        aria-label={editAriaLabel}
        className="flex items-center justify-center text-text-tertiary transition-colors hover:text-primary"
      >
        <Icon name="edit" size={16} />
      </button>
    </div>
  )
}

function ReviewField({
  label,
  value,
  multiline = false,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div>
      <label className="mb-xs block text-small text-text-secondary">{label}</label>
      {multiline ? (
        <div className={`${READONLY_FIELD_CLASS} min-h-[80px] whitespace-pre-wrap`}>{value}</div>
      ) : (
        <div className={`${READONLY_FIELD_CLASS} h-9 flex items-center`}>{value}</div>
      )}
    </div>
  )
}


export interface ReviewSummaryStepProps {
  agentName: string
  selectedChannels: Set<ChannelId>
  voice: string
  greeting: string
  recording: RecordingMode
  consent: string
  webchatSettings: WebChatChannelSettings
  textSettings: TextChannelSettings
  procedures: HealthcareProcedureCatalogItem[]
  selectedProcedureIds: string[]
  integration: HealthcareIntegration | null
  onEditStep: (step: number) => void
}

export function ReviewSummaryStep({
  agentName,
  selectedChannels,
  voice,
  greeting,
  recording,
  consent,
  webchatSettings,
  textSettings,
  procedures,
  selectedProcedureIds,
  integration,
  onEditStep,
}: ReviewSummaryStepProps) {
  const channelTabs = useMemo(() => {
    const tabs: { id: ChannelId; label: string }[] = []
    if (selectedChannels.has('voice')) tabs.push({ id: 'voice', label: 'Voice' })
    if (selectedChannels.has('webchat')) tabs.push({ id: 'webchat', label: 'Web chat' })
    if (selectedChannels.has('text')) tabs.push({ id: 'text', label: 'Text' })
    return tabs
  }, [selectedChannels])

  const [activeChannelTab, setActiveChannelTab] = useState<ChannelId>(
    channelTabs[0]?.id ?? 'voice',
  )

  const selectedProcedures = procedures.filter((p) => selectedProcedureIds.includes(p.id))

  const activeTab = channelTabs.some((t) => t.id === activeChannelTab)
    ? activeChannelTab
    : channelTabs[0]?.id ?? 'voice'

  return (
    <div className="flex w-full gap-2xl">
      <div className="min-w-0 flex-1 space-y-xl">
        <div>
          <h2 className="text-h3 text-text-primary">Review summary</h2>
          <p className="mt-xs text-body text-text-secondary">
            Review your setup before creating the agent.
          </p>
        </div>

        <section>
          <ReviewSectionHeader
            title="Channel settings"
            editAriaLabel="Edit channel settings"
            onEdit={() => onEditStep(1)}
          />

          <div className="space-y-lg">
            <div>
              <label className="mb-xs block text-body text-text-primary">Agent name</label>
              <div className={`${READONLY_FIELD_CLASS} h-9 flex items-center`}>
                {agentName || '—'}
              </div>
              <p className="mt-xs text-small text-text-secondary">
                This is the name your agent uses when greeting patients
              </p>
            </div>

            {channelTabs.length > 0 && (
              <>
                <div className="flex items-end gap-xs">
                  {channelTabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveChannelTab(tab.id)}
                      className="flex flex-col items-stretch"
                    >
                      <span
                        className={`flex h-9 items-center rounded-sm text-body transition-colors ${i === 0 ? 'pr-sm' : 'px-sm'} ${
                          activeTab === tab.id
                            ? 'text-text-primary'
                            : 'text-text-secondary hover:bg-surface-hover'
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span className={`h-[2px] w-full ${activeTab === tab.id ? 'bg-primary' : 'bg-transparent'}`} />
                    </button>
                  ))}
                </div>

                {activeTab === 'voice' && selectedChannels.has('voice') && (
                  <div className="flex flex-col gap-lg pt-md">
                    <ReviewField label="Voice" value={voice || '—'} />
                    <ReviewField label="Greeting message" value={greeting || '—'} multiline />
                    {recording === 'announced' && (
                      <ReviewField
                        label="Voice recording consent"
                        value={consent || '—'}
                        multiline
                      />
                    )}
                    {recording === 'off' && (
                      <ReviewField label="Recording" value="Off" />
                    )}
                    {recording === 'silent' && (
                      <ReviewField label="Recording" value="Record silently" />
                    )}
                  </div>
                )}

                {activeTab === 'webchat' && selectedChannels.has('webchat') && (
                  <div className="flex flex-col gap-lg pt-md">
                    {webchatSettings.resolvedEnabled && (
                      <ReviewField
                        label="Resolve button"
                        value={webchatSettings.resolvedName}
                      />
                    )}
                    {webchatSettings.escalationEnabled && (
                      <ReviewField
                        label="Escalation button"
                        value={webchatSettings.escalationName}
                      />
                    )}
                    {webchatSettings.duringEnabled && (
                      <ReviewField
                        label="Fallback message (during business hours)"
                        value={WEBCHAT_FALLBACK_DURING}
                        multiline
                      />
                    )}
                    {webchatSettings.afterEnabled && (
                      <ReviewField
                        label="Fallback message (after business hours)"
                        value={WEBCHAT_FALLBACK_AFTER}
                        multiline
                      />
                    )}
                  </div>
                )}

                {activeTab === 'text' && selectedChannels.has('text') && (
                  <div className="flex flex-col gap-lg pt-md">
                    <ReviewField
                      label="Unsubscribe text"
                      value={textSettings.unsubscribeEnabled ? 'Enabled' : 'Disabled'}
                    />
                    {textSettings.beforeEnabled && (
                      <ReviewField
                        label="Fallback message (before business hours)"
                        value={TEXT_FALLBACK_BEFORE}
                        multiline
                      />
                    )}
                    {textSettings.afterEnabled && (
                      <ReviewField
                        label="Fallback message (after business hours)"
                        value={TEXT_FALLBACK_AFTER}
                        multiline
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section>
          <ReviewSectionHeader
            title="Procedures"
            editAriaLabel="Edit procedures"
            onEdit={() => onEditStep(2)}
          />
          {selectedProcedures.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-md border border-border-selected bg-surface text-body text-text-tertiary">
              No procedures selected.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-lg">
              {selectedProcedures.map((procedure) => (
                <ProcedureSelectCard
                  key={procedure.id}
                  title={procedure.title}
                  description={procedure.description}
                  selected
                  onToggle={() => {}}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <ReviewSectionHeader
            title="Integrations"
            editAriaLabel="Edit integrations"
            onEdit={() => onEditStep(3)}
          />
          {integration ? (
            <div className="grid grid-cols-3 gap-lg">
              <IntegrationSelectCard
                name={integration.name}
                description={integration.description}
                iconBg={integration.iconBg}
                iconLabel={integration.iconLabel}
                selected
                connected
              />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md border border-border-selected bg-surface text-body text-text-tertiary">
              No integration selected.
            </div>
          )}
        </section>
      </div>

      <div className="sticky top-0 w-[375px] shrink-0 self-start">
        <div className="preview-panel preview-panel--embedded h-[calc(100vh-9rem)] min-h-[600px]">
          <PreviewPanel
            onClose={() => {}}
            onPreviewActiveChange={() => {}}
            showClose={false}
            showViewDetails={false}
          />
        </div>
      </div>
    </div>
  )
}
