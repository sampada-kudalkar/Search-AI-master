export interface Competitor {
  name: string
  hint: string
}

export const BRAND_NAME = 'My Family Dental'
export const REPORT_DATE = 'Jun 2026'

export const COMPETITORS: Competitor[] = [
  { name: 'Bowen Dental',                      hint: 'Consistent #2 across all platforms' },
  { name: 'Deeragun Dental',                   hint: 'Strong on Gemini & Perplexity' },
  { name: 'Innisfail Dentists',                hint: 'Strong ChatGPT presence' },
  { name: 'Serenity Dental CQ',                hint: 'Multi-platform competitor' },
  { name: 'Absolutely Dental @ Kirwan Plaza',  hint: 'Townsville-area competitor' },
  { name: 'Dental Balance NQ',                 hint: 'NQ-based competitor' },
  { name: 'National Dental Care Townsville',   hint: 'National chain, local presence' },
  { name: 'Riverside Family Dental Innisfail', hint: 'Innisfail local competitor' },
  { name: 'CP Dental Emerald',                 hint: 'Emerald region' },
  { name: 'Central Highlands Dental',          hint: 'Emerald/Highlands region' },
  { name: 'Sundown Family Dental',             hint: 'ChatGPT visible' },
  { name: 'Aspire Dental',                     hint: 'Gemini visible' },
  { name: 'Hinchinbrook Dental Group',         hint: 'Ingham area' },
  { name: 'Dental On Bowen',                   hint: 'Bowen area' },
  { name: 'Allon4plus',                        hint: 'Implant specialist' },
  { name: 'Kirwan Dentist / Dental Implants Clinic', hint: 'Kirwan implants focus' },
]

export const DEFAULT_SELECTED: string[] = [
  'Bowen Dental',
  'Deeragun Dental',
  'Innisfail Dentists',
  'Serenity Dental CQ',
  'Absolutely Dental @ Kirwan Plaza',
]
