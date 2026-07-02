export interface ThemePrompt {
  text: string
  monthlySearch: number
  aiSites: string[]
  status: string
  updatedOn: string
}

export interface ThemeConfig {
  name: string
  aggregateMonthlySearch: number
  locationCount: number
  prompts: ThemePrompt[]
}

const AI_SITES = ['ChatGPT', 'Gemini', 'Perplexity']

export const THEMES: ThemeConfig[] = [
  {
    name: 'Wisdom teeth removal',
    aggregateMonthlySearch: 24300,
    locationCount: 7,
    prompts: [
      { text: 'Find wisdom teeth removal specialists near me', monthlySearch: 8100, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Best clinics for wisdom teeth removal in my area', monthlySearch: 8100, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Top rated oral surgeons for wisdom teeth extraction nearby', monthlySearch: 8100, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
    ],
  },
  {
    name: 'Teeth whitening',
    aggregateMonthlySearch: 22000,
    locationCount: 7,
    prompts: [
      { text: 'Find professional teeth whitening services near me', monthlySearch: 1300, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Best teeth whitening clinics in my area', monthlySearch: 19400, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Top rated laser teeth whitening providers nearby', monthlySearch: 1300, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
    ],
  },
  {
    name: 'Dental implants',
    aggregateMonthlySearch: 13500,
    locationCount: 7,
    prompts: [
      { text: 'Find dental implant specialists near me', monthlySearch: 6600, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Best clinics for all on 4 dental implants in my area', monthlySearch: 2900, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Locate affordable dental implant services nearby', monthlySearch: 4000, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
    ],
  },
  {
    name: 'Tooth extraction',
    aggregateMonthlySearch: 7600,
    locationCount: 7,
    prompts: [
      { text: 'Find affordable wisdom tooth extraction specialists near me', monthlySearch: 3800, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Top rated tooth extraction clinics in my area', monthlySearch: 1900, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Search for local dental offices offering tooth extraction services', monthlySearch: 1900, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
    ],
  },
  {
    name: 'Teeth cleaning',
    aggregateMonthlySearch: 4510,
    locationCount: 7,
    prompts: [
      { text: 'Find teeth cleaning services near me', monthlySearch: 1900, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Best dental clinics for ultrasound teeth cleaning in my area', monthlySearch: 390, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
      { text: 'Top rated dentists for plaque removal and teeth cleaning nearby', monthlySearch: 2220, aiSites: AI_SITES, status: 'Tracking', updatedOn: 'Jun 17, 2026' },
    ],
  },
]

export const THEME_NAMES: string[] = ['All themes', ...THEMES.map((t) => t.name)]
