export interface ProcedurePickerItem {
  id: string
  title: string
  description: string
}

export type ProceduresPickerInitialView = 'list' | 'create'

export interface ProceduresPickerDrawerProps {
  open: boolean
  procedures: ProcedurePickerItem[]
  selectedIds: string[]
  /** When set, the drawer opens directly to this procedure's detail view. */
  initialDetailId?: string | null
  /** When set without initialDetailId, opens list or create sub-view. */
  initialView?: ProceduresPickerInitialView
  onClose: () => void
  onSave: (selectedIds: string[]) => void
  onCreateProcedure?: (procedure: ProcedurePickerItem) => void
  /** When true, cancelling a new-procedure form closes the whole drawer instead of returning to the list. */
  closeOnCreateCancel?: boolean
}
