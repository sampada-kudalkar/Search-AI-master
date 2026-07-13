export interface SelectableOption {
  id: string
  label: string
}

export const THEME_LOCATIONS: SelectableOption[] = [
  { id: 'austin-tx', label: 'Austin, TX' },
  { id: 'denver-co', label: 'Denver, CO' },
  { id: 'chicago-il', label: 'Chicago, IL' },
  { id: 'new-york-ny', label: 'New York, NY' },
]

export const THEME_BRANDS: SelectableOption[] = [
  { id: 'brightsmile-dental', label: 'BrightSmile Dental' },
  { id: 'pearl-dental-group', label: 'Pearl Dental Group' },
  { id: 'modern-orthodontics', label: 'Modern Orthodontics' },
  { id: 'citywide-dental-care', label: 'Citywide Dental Care' },
]

export const THEME_TAGS: SelectableOption[] = [
  { id: 'high-intent', label: 'High intent' },
  { id: 'branded', label: 'Branded' },
  { id: 'competitor', label: 'Competitor' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'emergency', label: 'Emergency' },
]

const PROMPT_TEMPLATES = [
  (name: string) => `Top ${name} near me`,
  (name: string) => `Best ${name} specialists and experts`,
  (name: string) => `Expert ${name} services and providers`,
  (name: string) => `Affordable ${name} options in my area`,
  (name: string) => `How to choose the right ${name} provider`,
  (name: string) => `Highest rated ${name} near me`,
  (name: string) => `${name} providers with same-day availability`,
  (name: string) => `Trusted ${name} recommendations nearby`,
]

export function generatePrompts(themeName: string, count = 5): string[] {
  const shuffled = [...PROMPT_TEMPLATES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((tpl) => tpl(themeName))
}
