import type { ThemeConfig, ThemePrompt } from '../../data/themesData'

export interface FlatThemeRow {
  [key: string]: unknown
  _id: string
  _isHeader: boolean
  _themeName: string
  name: string
  promptCount?: number
  locationCount: number
  monthlySearch: number
  aiSites: string[]
  status?: string
  updatedOn?: string
  _prompt?: ThemePrompt
}

export interface ThemesPromptsTableProps {
  themes: ThemeConfig[]
  onEditPrompt?: (themeName: string, prompt: ThemePrompt) => void
  onLocationsClick?: (themeName: string, prompt: ThemePrompt) => void
  onAddPrompt?: (themeName: string) => void
  scope?: 'brand' | 'locations'
}
