export type TrackByOption = 'location' | 'brand'

export interface NewThemeData {
  name: string
  trackBy: TrackByOption
  selectedIds: string[]
  prompts: string[]
}

export interface AddThemeDrawerProps {
  open: boolean
  onClose: () => void
  onAdd: (theme: NewThemeData) => void
}
