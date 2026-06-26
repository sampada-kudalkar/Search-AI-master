import type { ThemeVisibilityThemeRow } from '../../data/competitorData'

export interface ThemeVisibilityCardProps {
  rows?: ThemeVisibilityThemeRow[]
}

export interface ThemeVisibilityFlatRow extends Record<string, unknown> {
  _id: string
  _isHeader: boolean
  _parentId?: string
  theme: string
  avgVisibility: { you: number; competitor: number }
  chatgpt: { you: number; competitor: number }
  gemini: { you: number; competitor: number }
  perplexity: { you: number; competitor: number }
  claude: { you: number; competitor: number }
}
