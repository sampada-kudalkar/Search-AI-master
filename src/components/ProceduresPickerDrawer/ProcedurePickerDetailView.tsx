import { useCallback, useState } from 'react'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import ProcedureDetailBody from '../../workflow/Organisms/Panels/RHS/ProcedureDetailBody.jsx'
import type { ProcedureDetailDraft } from './procedurePickerDetailData'
import styles from './ProceduresPickerDrawer.module.css'

interface ProcedurePickerDetailViewProps {
  draft: ProcedureDetailDraft
  onBack: () => void
  onSave: (draft: ProcedureDetailDraft) => void
  isNew?: boolean
}

export function ProcedurePickerDetailView({
  draft,
  onBack,
  onSave,
  isNew = false,
}: ProcedurePickerDetailViewProps) {
  const [local, setLocal] = useState(draft)

  const handleFieldChange = useCallback((field: string, value: unknown) => {
    setLocal((current) => ({ ...current, [field]: value }))
  }, [])

  const canSave = isNew
    ? Boolean(local.name.trim() && local.whenToUse.trim())
    : true

  const headerTitle = isNew ? 'New procedure' : local.name

  return (
    <>
      <div className="flex shrink-0 items-center justify-between px-2xl pb-lg pt-2xl">
        <div className="flex min-w-0 items-center gap-sm">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <BackArrowIcon />
          </button>
          <h2 className="truncate text-[16px] leading-6 tracking-[-0.32px] text-text-primary">
            {headerTitle}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-sm">
          <button
            type="button"
            onClick={onBack}
            className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => canSave && onSave(local)}
            className={`flex h-9 items-center rounded-sm px-lg text-body transition-colors ${
              canSave
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      <div className={`${styles.detailBody} flex-1 overflow-y-auto px-2xl pb-2xl`}>
        <div className="w-full max-w-[700px]">
          <ProcedureDetailBody
          initialValues={{
            id: local.id,
            name: local.name,
            whenToUse: local.whenToUse,
            contextChips: local.contextChips,
            moreContextCount: local.moreContextCount,
            stepsText: local.stepsText,
          }}
          onFieldChange={handleFieldChange}
          viewOnly={false}
          showTitle={isNew}
          contextEditable={isNew}
        />
        </div>
      </div>
    </>
  )
}
