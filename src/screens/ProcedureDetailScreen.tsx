import React, { useState } from 'react'
import { TopNav, Icon, RefChip } from '../components'
import { BackArrowIcon } from '../assets/BackArrowIcon'
// @ts-ignore
import UserPromptInputRaw from '../workflow/Molecules/Inputs/UserPromptInput/UserPromptInput'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserPromptInput = UserPromptInputRaw as React.ComponentType<any>
import { type Procedure, type ProcedureStep, type ContextItem } from '../data/procedureData'

interface ProcedureDetailScreenProps {
  /** null = create a new procedure. */
  procedure: Procedure | null
  onBack: () => void
}

const WHEN_PLACEHOLDER = `Describe the customer situation or trigger that should activate this procedure.

Examples:
• Customer wants to reschedule an appointment
• Caller reports a billing issue
• Customer asks about parts availability`

export function ProcedureDetailScreen({ procedure, onBack }: ProcedureDetailScreenProps) {
  const isNew = procedure === null

  const [title, setTitle] = useState(procedure?.name ?? '')
  const [whenToUse, setWhenToUse] = useState(procedure?.whenToUse ?? '')
  // Convert structured ProcedureStep[] → plain numbered text for UserPromptInput
  const stepsToText = (s: ProcedureStep[]): string =>
    s.map((step, i) => {
      const bullets = step.bullets
        .map((b) =>
          b.tokens.map((t) => (typeof t === 'string' ? t : t.label)).join('')
        )
        .filter(Boolean)
        .join('\n')
      return bullets ? `${i + 1}. ${step.title}\n${bullets}` : `${i + 1}. ${step.title}`
    }).join('\n')

  const [stepsText, setStepsText] = useState(() =>
    procedure?.steps?.length ? stepsToText(procedure.steps) : ''
  )
  const [tools, setTools] = useState<string[]>(procedure?.tools ?? [])
  const [context, setContext] = useState<ContextItem[]>(procedure?.context ?? [])
  const [actionsOpen, setActionsOpen] = useState(false)

  // For existing procedures, Save stays disabled until something changes.
  const dirty =
    isNew ||
    title !== procedure.name ||
    whenToUse !== procedure.whenToUse ||
    tools.length !== procedure.tools.length ||
    context.length !== procedure.context.length

  return (
    <div className="flex h-full flex-col">
      <TopNav initials="S" />

      <div className="flex-1 overflow-auto bg-surface">
        {/* Header — same bar treatment as the Human actions pages */}
        <div className="flex items-center justify-between bg-surface px-2xl py-xl">
          <div className="flex min-w-0 items-center gap-sm">
            <button
              type="button"
              aria-label="Back"
              onClick={onBack}
              className="flex size-8 items-center justify-center rounded-sm text-text-icon transition-colors hover:bg-surface-hover"
            >
              <BackArrowIcon color="#555" />
            </button>
            <h1 className="truncate text-h3 text-text-primary">
              {isNew ? 'New procedure' : procedure.name}
            </h1>
          </div>

          <div className="flex items-center gap-sm">
            {isNew ? (
              <button
                type="button"
                onClick={onBack}
                className="rounded-sm px-md py-xs text-body text-text-action transition-colors hover:bg-surface-hover"
              >
                Cancel
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActionsOpen((o) => !o)}
                  className="flex h-9 items-center rounded-sm border border-border-selected bg-surface px-lg text-body text-text-primary transition-colors hover:bg-surface-l2"
                >
                  Actions
                </button>
                {actionsOpen && (
                  <>
                    <div className="fixed inset-0 z-[105]" onClick={() => setActionsOpen(false)} />
                    <div className="absolute right-0 top-11 z-[110] min-w-[168px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
                      <button className="block w-full px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover" onClick={() => setActionsOpen(false)}>
                        Duplicate
                      </button>
                      <button className="block w-full px-md py-sm text-left text-body text-chip-danger-text hover:bg-surface-hover" onClick={() => setActionsOpen(false)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              type="button"
              disabled={!dirty}
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

        {/* Body — two columns */}
        <div className="flex gap-2xl px-2xl pb-2xl pt-md">
          {/* Left column */}
          <div className="min-w-0 flex-1 space-y-xl">
            {/* Title */}
            <Field label="Procedure title">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter"
                className="h-10 w-full rounded-sm border border-border-selected bg-surface px-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
            </Field>

            {/* When to use */}
            <Field label="When to use this procedure?">
              <textarea
                value={whenToUse}
                onChange={(e) => setWhenToUse(e.target.value)}
                placeholder={WHEN_PLACEHOLDER}
                rows={isNew ? 5 : 3}
                className="w-full resize-y rounded-sm border border-border-selected bg-surface p-md text-body leading-relaxed text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
            </Field>

            {/* Steps — always uses UserPromptInput (same as system/user prompt) */}
            <Field label="Steps" info>
              <UserPromptInput
                hideLabel
                value={stepsText}
                onChange={(val: string) => setStepsText(val)}
              />
            </Field>
          </div>

          {/* Right column */}
          <div className="w-[340px] shrink-0 space-y-xl">
            <Field label="Tools" info>
              <SidebarCard
                emptyLabel="No tools added"
                empty={tools.length === 0}
                onAdd={() => setTools((t) => [...t, 'New tool'])}
              >
                {tools.map((t, i) => (
                  <RefChip
                    key={`${t}-${i}`}
                    kind="tool"
                    label={t}
                    onRemove={() => setTools((arr) => arr.filter((_, idx) => idx !== i))}
                  />
                ))}
              </SidebarCard>
            </Field>

            <Field label="Context" info>
              <SidebarCard
                emptyLabel="No context added"
                empty={context.length === 0}
                onAdd={() => setContext((c) => [...c, { kind: 'context', label: 'New.variable' }])}
                footer={context.length > 4 ? `+ ${context.length - 4} more` : undefined}
              >
                {context.slice(0, 4).map((c, i) => (
                  <RefChip
                    key={`${c.label}-${i}`}
                    kind={c.kind}
                    label={c.label}
                    onRemove={() => setContext((arr) => arr.filter((_, idx) => idx !== i))}
                  />
                ))}
              </SidebarCard>
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Field label wrapper ─────────────────────────────────────────
function Field({ label, info = false, children }: { label: string; info?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-xs flex items-center gap-xs">
        <span className="text-body text-text-primary">{label}</span>
        {info && <Icon name="info" size={14} className="text-text-tertiary" />}
      </div>
      {children}
    </div>
  )
}

// ── Sidebar card (Tools / Context) ──────────────────────────────
function SidebarCard({
  empty,
  emptyLabel,
  onAdd,
  footer,
  children,
}: {
  empty: boolean
  emptyLabel: string
  onAdd: () => void
  footer?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-sm border border-border-selected bg-surface p-md">
      {empty ? (
        <p className="mb-sm text-body text-text-tertiary">{emptyLabel}</p>
      ) : (
        <div className="mb-sm flex flex-wrap gap-xs">{children}</div>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-xs text-body text-text-action transition-colors hover:text-primary-hover"
      >
        <Icon name="add_circle" size={16} />
        Add
      </button>
      {footer && (
        <button type="button" className="mt-sm block text-body text-text-action hover:text-primary-hover">
          {footer}
        </button>
      )}
    </div>
  )
}

// ── Steps rich view ─────────────────────────────────────────────
