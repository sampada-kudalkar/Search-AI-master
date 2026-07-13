import type { ThemePrompt } from '../../data/themesData'

export type PromptTrackBy = 'location' | 'brand' | 'both'

export interface EditPromptValues {
  text: string
  theme: string
  locationIds: string[]
  aiSites: string[]
  tagIds: string[]
  trackBy: PromptTrackBy
}

export interface EditPromptDrawerProps {
  open: boolean
  themeName: string
  prompt: ThemePrompt | null
  onClose: () => void
  onSave: (themeName: string, values: EditPromptValues) => void
}
