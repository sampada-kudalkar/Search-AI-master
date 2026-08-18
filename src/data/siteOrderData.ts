import iconGemini from '../assets/icon-gemini.svg'

export interface SiteOrderItem {
  id: string
  label: string
  iconSrc?: string
}

export const DEFAULT_SITE_ORDER: SiteOrderItem[] = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Gemini', iconSrc: iconGemini },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'all', label: 'All' },
]
