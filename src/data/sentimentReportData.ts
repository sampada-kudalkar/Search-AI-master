// Seed data for the Sentiment report screen (Search AI → Reports → Sentiment).
// Brand/competitor/location/theme names reuse the same "My Family Dental" universe
// already established in competitorData.ts / themesData.ts for consistency across reports.

import {
  BRAND_NAME,
  TREND_PLATFORMS,
  type TrendPlatform,
  type PromptRankingRow,
  type RankingEntry,
  type ByLocationTableRow,
  type RankingPlatform,
} from './competitorData'
import { THEMES } from './themesData'
import type { Metric } from '../components/MetricTiles/MetricTiles.types'
import type { TrendPoint, SeriesConfig } from '../components/charts/TrendLineChart'

export const SENTIMENT_AI_SITES = ['ChatGPT', 'Gemini', 'Perplexity', 'Google AI Mode', 'Grok', 'Claude'] as const
export type SentimentAiSite = typeof SENTIMENT_AI_SITES[number]

export const SENTIMENT_SWOT_PLATFORMS = ['ChatGPT', 'Gemini', 'Perplexity', 'Claude'] as const
export type SentimentSwotPlatform = typeof SENTIMENT_SWOT_PLATFORMS[number]

// ── Summary ──────────────────────────────────────────────────────────────────

export interface SentimentSummaryStat {
  score: number
  delta: string
}

export const SENTIMENT_SUMMARY: {
  overall: SentimentSummaryStat
  brand: SentimentSummaryStat
  prompt: SentimentSummaryStat
  promptScore: SentimentSummaryStat
} = {
  overall: { score: 81.3, delta: '3.1%' },
  brand: { score: 82, delta: '2%' },
  prompt: { score: 80.5, delta: '1.5%' },
  promptScore: { score: 78.9, delta: '2.0%' },
}

// ── Trend ────────────────────────────────────────────────────────────────────

export const SENTIMENT_TREND: TrendPoint[] = [
  { label: 'Feb', overall: 76.2, brand: 77.1, prompt: 75.4 },
  { label: 'Mar', overall: 77.8, brand: 78.6, prompt: 76.9 },
  { label: 'Apr', overall: 78.4, brand: 79.0, prompt: 77.8 },
  { label: 'May', overall: 79.6, brand: 80.2, prompt: 79.0 },
  { label: 'Jun', overall: 80.1, brand: 81.0, prompt: 79.3 },
  { label: 'Jul', overall: 81.3, brand: 82.0, prompt: 80.5 },
]

export const SENTIMENT_TREND_SERIES: SeriesConfig[] = [
  { key: 'overall', label: 'Overall sentiment', color: '#1976d2' },
  { key: 'brand', label: 'Brand sentiment', color: '#4cae3d' },
  { key: 'prompt', label: 'Prompt sentiment', color: '#f5a623' },
]

// ── Sentiment breakdown by AI site (Overview + Brand tiles) ─────────────────

export const SENTIMENT_BY_AI_SITE: Metric[] = [
  { id: 'chatgpt', value: '84%', label: 'ChatGPT', delta: '2.4%', trend: 'up' },
  { id: 'gemini', value: '80%', label: 'Gemini', delta: '1.1%', trend: 'up' },
  { id: 'perplexity', value: '76%', label: 'Perplexity', delta: '0.8%', trend: 'down' },
  { id: 'google-ai-mode', value: '83%', label: 'Google AI Mode', delta: '3.0%', trend: 'up' },
  { id: 'grok', value: '79%', label: 'Grok', delta: '1.6%', trend: 'up' },
  { id: 'claude', value: '81%', label: 'Claude', delta: '0.5%', trend: 'down' },
]

export const BRAND_SENTIMENT_BY_AI_SITE: Metric[] = [
  { id: 'chatgpt', value: '85%', label: 'ChatGPT', delta: '1.8%', trend: 'up' },
  { id: 'gemini', value: '81%', label: 'Gemini', delta: '0.9%', trend: 'up' },
  { id: 'perplexity', value: '77%', label: 'Perplexity', delta: '0.4%', trend: 'down' },
  { id: 'google-ai-mode', value: '84%', label: 'Google AI Mode', delta: '2.2%', trend: 'up' },
  { id: 'grok', value: '80%', label: 'Grok', delta: '1.1%', trend: 'up' },
  { id: 'claude', value: '82%', label: 'Claude', delta: '0.3%', trend: 'up' },
]

// ── Improvement areas table ──────────────────────────────────────────────────

export interface SentimentImprovementRow extends Record<string, unknown> {
  id: string
  aiSite: SentimentAiSite
  sentiment: number
  summary: string
}

export const SENTIMENT_IMPROVEMENT_AREAS: SentimentImprovementRow[] = [
  { id: 'imp-chatgpt', aiSite: 'ChatGPT', sentiment: 84, summary: 'Consistently praised for friendly staff and fast appointment availability; occasional mentions of long hold times on the phone line.' },
  { id: 'imp-gemini', aiSite: 'Gemini', sentiment: 80, summary: 'Strong marks for transparent pricing and modern equipment; a few responses flag limited weekend availability.' },
  { id: 'imp-perplexity', aiSite: 'Perplexity', sentiment: 76, summary: 'Generally positive on gentle care for anxious patients; lowest of the sites due to a handful of billing-confusion mentions.' },
  { id: 'imp-google-ai-mode', aiSite: 'Google AI Mode', sentiment: 83, summary: 'Highlights emergency care availability and location coverage; minor notes on parking access at some clinics.' },
  { id: 'imp-grok', aiSite: 'Grok', sentiment: 79, summary: 'Balanced coverage of pros and cons; suggests improving online booking clarity.' },
  { id: 'imp-claude', aiSite: 'Claude', sentiment: 81, summary: 'Cites strong patient-first approach; recommends clearer post-treatment care instructions.' },
]

// ── SWOT by AI model ─────────────────────────────────────────────────────────

export interface SentimentSwotItem {
  title: string
  description: string
}

export interface SentimentSwot {
  strengths: SentimentSwotItem[]
  weaknesses: SentimentSwotItem[]
  opportunities: SentimentSwotItem[]
  threats: SentimentSwotItem[]
}

export const SENTIMENT_SWOT: Record<SentimentSwotPlatform, SentimentSwot> = {
  ChatGPT: {
    strengths: [
      { title: 'Friendly, approachable staff', description: 'Consistently praised across reviews for a warm, welcoming experience from check-in to checkout.' },
      { title: 'Short wait times', description: 'Patients frequently note being seen close to their scheduled appointment time.' },
      { title: 'Transparent pricing', description: 'Upfront cost estimates are called out as a differentiator versus nearby practices.' },
    ],
    weaknesses: [
      { title: 'Long hold times on phone line', description: 'A recurring complaint about reaching the front desk during peak hours.' },
      { title: 'Limited evening slots', description: 'Working patients mention difficulty booking after 5pm.' },
    ],
    opportunities: [
      { title: 'Promote same-day emergency slots', description: 'AI summaries rarely surface this existing capability — clearer messaging could lift sentiment.' },
      { title: 'Highlight sedation options', description: 'Anxious patients respond well when sedation availability is mentioned upfront.' },
    ],
    threats: [
      { title: 'Competitors adding weekend hours', description: 'Nearby practices are expanding availability, a gap AI sites are starting to note.' },
      { title: 'New low-cost clinics entering suburbs', description: 'Price-sensitive prompts increasingly surface newer, cheaper alternatives.' },
    ],
  },
  Gemini: {
    strengths: [
      { title: 'Modern equipment', description: 'Cited as a reason for confidence in diagnosis and treatment quality.' },
      { title: 'Comprehensive service range', description: 'Full-service offering under one roof reduces the need for referrals.' },
      { title: 'Experienced multi-dentist team', description: 'Depth of experience across the team comes up in several summaries.' },
    ],
    weaknesses: [
      { title: 'Limited weekend availability', description: 'A consistent gap versus practices offering Saturday hours.' },
      { title: 'Occasional scheduling conflicts', description: 'A handful of reviews mention double-booked appointment slots.' },
    ],
    opportunities: [
      { title: 'Expand tele-dentistry consults', description: 'Would address the weekend/evening access gap without added front-desk load.' },
      { title: 'Bundle preventive care packages', description: 'Could reinforce the "comprehensive services" strength already recognized.' },
    ],
    threats: [
      { title: 'Competitor practices expanding locations', description: 'Wider footprint from rivals is starting to surface in comparison prompts.' },
      { title: 'Rising patient price sensitivity', description: 'Cost is mentioned more often as a deciding factor than a year ago.' },
    ],
  },
  Perplexity: {
    strengths: [
      { title: 'Gentle approach for anxious patients', description: 'Repeatedly called out as a reason patients chose to stay despite past dental anxiety.' },
      { title: 'Sedation options', description: 'Availability of sedation is a differentiator versus practices without it.' },
      { title: 'Calm clinic environment', description: 'Ambience and pacing of visits described as notably less stressful.' },
    ],
    weaknesses: [
      { title: 'Billing confusion', description: 'A few reviews mention unclear itemization on final invoices.' },
      { title: 'Inconsistent post-visit follow-up', description: 'Follow-up communication after procedures varies by location.' },
    ],
    opportunities: [
      { title: 'Clarify itemized billing at checkout', description: 'Would directly resolve the most-cited weakness on this platform.' },
      { title: 'Automate follow-up reminders', description: 'Could standardize the post-visit experience across locations.' },
    ],
    threats: [
      { title: 'Negative billing sentiment spreading', description: 'Billing complaints are starting to appear in AI-generated summaries more often.' },
      { title: 'Competitor emphasis on cost transparency', description: 'Rivals are actively marketing transparent pricing as a selling point.' },
    ],
  },
  Claude: {
    strengths: [
      { title: 'Patient-first reputation', description: 'Described as prioritizing patient comfort over upselling additional procedures.' },
      { title: 'Flexible appointment availability', description: 'Scheduling flexibility is noted as easier than at larger chains.' },
      { title: 'Affordable care options', description: 'Payment plans and affordable options are seen as accessible.' },
    ],
    weaknesses: [
      { title: 'Unclear post-treatment instructions', description: 'Aftercare guidance is described as inconsistent between visits.' },
      { title: 'Sparse online booking guidance', description: 'The booking flow lacks clear next-step instructions online.' },
    ],
    opportunities: [
      { title: 'Publish aftercare guides per procedure', description: 'Would directly address the top-cited weakness on this platform.' },
      { title: 'Improve online booking UX copy', description: 'Clearer microcopy could reduce booking drop-off and confusion.' },
    ],
    threats: [
      { title: 'Competitors publishing detailed aftercare content', description: 'Rivals are filling this content gap first, which AI summaries then prefer to cite.' },
      { title: 'AI summaries favoring clearer instructions', description: 'Sources with clearer structure are increasingly ranked higher in AI answers.' },
    ],
  },
}

// ── Sentiment by citation ────────────────────────────────────────────────────

export interface SentimentCitationRow extends Record<string, unknown> {
  id: string
  webPage: string
  category: string
  positiveSentiment: number
  strengths: string[]
  weaknesses: string[]
  claimOccurrence: number
}

export const SENTIMENT_BY_CITATION: SentimentCitationRow[] = [
  { id: 'cit-1', webPage: 'myfamilydentalqld.com.au/reviews', category: 'Owned website', positiveSentiment: 92, strengths: ['Friendly staff', 'Short wait times'], weaknesses: ['Parking access'], claimOccurrence: 41 },
  { id: 'cit-2', webPage: 'google.com/maps/reviews', category: 'Review platform', positiveSentiment: 87, strengths: ['Transparent pricing', 'Gentle with anxious patients'], weaknesses: ['Phone hold times'], claimOccurrence: 68 },
  { id: 'cit-3', webPage: 'healthdirect.gov.au', category: 'Directory', positiveSentiment: 74, strengths: ['Comprehensive services'], weaknesses: ['Limited weekend hours'], claimOccurrence: 19 },
  { id: 'cit-4', webPage: 'ratemyclinic.com.au', category: 'Review platform', positiveSentiment: 69, strengths: ['Modern equipment'], weaknesses: ['Billing confusion', 'Scheduling conflicts'], claimOccurrence: 27 },
  { id: 'cit-5', webPage: 'reddit.com/r/townsville', category: 'Forum', positiveSentiment: 81, strengths: ['Emergency care availability'], weaknesses: ['Online booking unclear'], claimOccurrence: 12 },
  { id: 'cit-6', webPage: 'facebook.com/myfamilydentalqld', category: 'Social', positiveSentiment: 88, strengths: ['Patient-first approach', 'Affordable care'], weaknesses: [], claimOccurrence: 33 },
]

// ── Top negative sentiment drivers ───────────────────────────────────────────

export interface SentimentNegativeDriverRow extends Record<string, unknown> {
  id: string
  webPage: string
  negativeClaim: string
  claimDetail: string
  claimOccurrence: number
  citationShare: number
  sentiment: number
}

export const SENTIMENT_NEGATIVE_DRIVERS: SentimentNegativeDriverRow[] = [
  { id: 'neg-1', webPage: 'myfamilydentalqld.com.au/pricing', negativeClaim: 'Overkill for a routine checkup', claimDetail: '"recommended treatment beyond a standard cleaning"', claimOccurrence: 34, citationShare: 22, sentiment: 41 },
  { id: 'neg-2', webPage: 'ratemyclinic.com.au', negativeClaim: 'Long wait times for appointments', claimDetail: '"had to wait 3 weeks for a slot"', claimOccurrence: 27, citationShare: 18, sentiment: 38 },
  { id: 'neg-3', webPage: 'google.com/maps/reviews', negativeClaim: 'Pushy upsell on cosmetic services', claimDetail: '"kept pushing whitening add-ons"', claimOccurrence: 19, citationShare: 15, sentiment: 45 },
  { id: 'neg-4', webPage: 'reddit.com/r/townsville', negativeClaim: 'Billing confusion after visits', claimDetail: '"the quote didn\'t match the final bill"', claimOccurrence: 16, citationShare: 11, sentiment: 47 },
  { id: 'neg-5', webPage: 'facebook.com/myfamilydentalqld', negativeClaim: 'Difficult to reschedule online', claimDetail: '"had to call three times to move an appointment"', claimOccurrence: 12, citationShare: 9, sentiment: 52 },
]

// ── Sentiment by location ────────────────────────────────────────────────────

export interface SentimentLocationRow extends Record<string, unknown> {
  id: string
  location: string
  sentiment: number
  delta: number
  chatgpt: number
  gemini: number
  perplexity: number
  googleAiMode: number
  grok: number
  claude: number
}

export const SENTIMENT_BY_LOCATION: SentimentLocationRow[] = [
  { id: 'loc-townsville', location: 'Townsville', sentiment: 83, delta: 2.1, chatgpt: 85, gemini: 81, perplexity: 77, googleAiMode: 84, grok: 80, claude: 82 },
  { id: 'loc-bowen', location: 'Bowen', sentiment: 78, delta: -0.6, chatgpt: 80, gemini: 76, perplexity: 72, googleAiMode: 79, grok: 75, claude: 77 },
  { id: 'loc-innisfail', location: 'Innisfail', sentiment: 80, delta: 1.4, chatgpt: 82, gemini: 78, perplexity: 74, googleAiMode: 81, grok: 77, claude: 79 },
  { id: 'loc-cairns', location: 'Cairns', sentiment: 75, delta: 0.3, chatgpt: 77, gemini: 73, perplexity: 69, googleAiMode: 76, grok: 72, claude: 74 },
  { id: 'loc-deeragun', location: 'Deeragun', sentiment: 82, delta: 1.9, chatgpt: 84, gemini: 80, perplexity: 76, googleAiMode: 83, grok: 79, claude: 81 },
  { id: 'loc-kirwan-plaza', location: 'Kirwan Plaza', sentiment: 79, delta: 0.7, chatgpt: 81, gemini: 77, perplexity: 73, googleAiMode: 80, grok: 76, claude: 78 },
]

// ── Prompt tab ────────────────────────────────────────────────────────────────

export const PROMPT_SENTIMENT_BREAKDOWN = {
  positive: 68,
  neutral: 22,
  negative: 10,
}

export interface SentimentPromptSubRow extends Record<string, unknown> {
  _id: string
  prompt: string
  locations: number
  sentiment: number
  chatgpt: number
  gemini: number
  perplexity: number
}

export interface SentimentThemeRow extends Record<string, unknown> {
  _id: string
  theme: string
  locations: number
  sentiment: number
  chatgpt: number
  gemini: number
  perplexity: number
  prompts: SentimentPromptSubRow[]
}

function derive(seed: number, offset: number): number {
  return Math.round(((seed * 13 + offset * 7) % 30) + 65)
}

export const SENTIMENT_BY_THEME_AND_PROMPT: SentimentThemeRow[] = THEMES.slice(0, 7).map((theme, i) => ({
  _id: `theme-${i}`,
  theme: theme.name,
  locations: theme.locationCount,
  sentiment: derive(i, 0),
  chatgpt: derive(i, 1),
  gemini: derive(i, 2),
  perplexity: derive(i, 3),
  prompts: theme.prompts.map((p, j) => ({
    _id: `theme-${i}-prompt-${j}`,
    prompt: p.text,
    locations: p.locationCount,
    sentiment: derive(i + j, 4),
    chatgpt: derive(i + j, 5),
    gemini: derive(i + j, 6),
    perplexity: derive(i + j, 7),
  })),
}))

// ── Competitors tab ──────────────────────────────────────────────────────────

export interface SentimentCompetitor {
  name: string
  isYou?: boolean
  sentiment: number
}

export const SENTIMENT_COMPETITORS: SentimentCompetitor[] = [
  { name: BRAND_NAME, isYou: true, sentiment: 82 },
  { name: 'Bowen Dental', sentiment: 74 },
  { name: 'Innisfail Dentists', sentiment: 71 },
  { name: 'Deeragun Dental', sentiment: 69 },
  { name: 'Absolutely Dental @ Kirwan Plaza', sentiment: 66 },
]

export interface SentimentCompetitorRow extends Record<string, unknown> {
  id: string
  name: string
  isYou?: boolean
  sentiment: number
  strengths: string[]
  weaknesses: string[]
}

export const SENTIMENT_BY_COMPETITOR: SentimentCompetitorRow[] = [
  { id: 'comp-you', name: BRAND_NAME, isYou: true, sentiment: 82, strengths: ['Friendly staff', 'Transparent pricing', 'Gentle with anxious patients'], weaknesses: ['Phone hold times'] },
  { id: 'comp-bowen', name: 'Bowen Dental', sentiment: 74, strengths: ['Modern equipment'], weaknesses: ['Limited weekend hours', 'Scheduling conflicts'] },
  { id: 'comp-innisfail', name: 'Innisfail Dentists', sentiment: 71, strengths: ['Comprehensive services'], weaknesses: ['Longer wait times'] },
  { id: 'comp-deeragun', name: 'Deeragun Dental', sentiment: 69, strengths: ['Flexible appointments'], weaknesses: ['Billing confusion'] },
  { id: 'comp-absolutely', name: 'Absolutely Dental @ Kirwan Plaza', sentiment: 66, strengths: ['Affordable care'], weaknesses: ['Unclear post-treatment instructions', 'Online booking unclear'] },
]

// ── Competitive strengths & weakness matrix ─────────────────────────────────

export const SENTIMENT_MATRIX_TRAITS = [
  'Friendly staff',
  'Fast appointment availability',
  'Transparent pricing',
  'Modern equipment',
  'Gentle with anxious patients',
  'Emergency care availability',
] as const

export const SENTIMENT_MATRIX_COMPETITORS: { name: string; isYou?: boolean }[] = [
  { name: BRAND_NAME, isYou: true },
  { name: 'Bowen Dental' },
  { name: 'Innisfail Dentists' },
  { name: 'Deeragun Dental' },
  { name: 'Absolutely Dental @ Kirwan Plaza' },
  { name: 'Serenity Dental CQ' },
  { name: 'National Dental Care' },
  { name: 'Riverside Family Dental' },
]

// trait -> competitor name -> positive sentiment score (0-100), or undefined if no data
export const SENTIMENT_COMPARISON_MATRIX: Record<string, Record<string, number | undefined>> = {
  'Friendly staff': { [BRAND_NAME]: 97, 'Bowen Dental': 86, 'Innisfail Dentists': 42, 'Deeragun Dental': 91, 'Absolutely Dental @ Kirwan Plaza': 38, 'Serenity Dental CQ': 84, 'National Dental Care': 61, 'Riverside Family Dental': 88 },
  'Fast appointment availability': { [BRAND_NAME]: 92, 'Bowen Dental': 47, 'Innisfail Dentists': 79, 'Deeragun Dental': 90, 'Absolutely Dental @ Kirwan Plaza': 33, 'Serenity Dental CQ': 55, 'National Dental Care': 81, 'Riverside Family Dental': 44 },
  'Transparent pricing': { [BRAND_NAME]: 88, 'Bowen Dental': 41, 'Innisfail Dentists': undefined, 'Deeragun Dental': 39, 'Absolutely Dental @ Kirwan Plaza': 83, 'Serenity Dental CQ': 45, 'National Dental Care': 29, 'Riverside Family Dental': 90 },
  'Modern equipment': { [BRAND_NAME]: 62, 'Bowen Dental': 81, 'Innisfail Dentists': 85, 'Deeragun Dental': 48, 'Absolutely Dental @ Kirwan Plaza': undefined, 'Serenity Dental CQ': 79, 'National Dental Care': 87, 'Riverside Family Dental': 51 },
  'Gentle with anxious patients': { [BRAND_NAME]: 94, 'Bowen Dental': 36, 'Innisfail Dentists': 44, 'Deeragun Dental': 40, 'Absolutely Dental @ Kirwan Plaza': 27, 'Serenity Dental CQ': 82, 'National Dental Care': 35, 'Riverside Family Dental': 46 },
  'Emergency care availability': { [BRAND_NAME]: 91, 'Bowen Dental': 85, 'Innisfail Dentists': 41, 'Deeragun Dental': 89, 'Absolutely Dental @ Kirwan Plaza': 78, 'Serenity Dental CQ': undefined, 'National Dental Care': 32, 'Riverside Family Dental': 37 },
}

// ── Sentiment rank across themes/prompts and locations ──────────────────────
// Reuses the same PromptRankingRow / ByLocationTableRow shapes CompetitorRankingCard
// already renders, so the existing card can be reused as-is with sentiment-ranked data.

const YOU_ENTRY: RankingEntry = { name: BRAND_NAME, isYou: true }
const RANK_ENTRIES = {
  bowen: { name: 'Bowen Dental' } as RankingEntry,
  innisfail: { name: 'Innisfail Dentists' } as RankingEntry,
  deeragun: { name: 'Deeragun Dental' } as RankingEntry,
  absolutely: { name: 'Absolutely Dental @ Kirwan Plaza' } as RankingEntry,
}

function sameForAllPlatforms(order: RankingEntry[]): Record<TrendPlatform, RankingEntry[]> {
  const result = {} as Record<TrendPlatform, RankingEntry[]>
  for (const platform of TREND_PLATFORMS) result[platform] = order
  return result
}

export const SENTIMENT_RANK_BY_THEME: PromptRankingRow[] = SENTIMENT_BY_THEME_AND_PROMPT.map((theme, i) => ({
  id: theme._id,
  prompt: theme.theme,
  rankings: sameForAllPlatforms(
    i % 2 === 0
      ? [YOU_ENTRY, RANK_ENTRIES.bowen, RANK_ENTRIES.innisfail, RANK_ENTRIES.deeragun, RANK_ENTRIES.absolutely]
      : [RANK_ENTRIES.bowen, YOU_ENTRY, RANK_ENTRIES.deeragun, RANK_ENTRIES.innisfail, RANK_ENTRIES.absolutely],
  ),
}))

export const SENTIMENT_RANK_BY_LOCATION: Record<RankingPlatform, ByLocationTableRow[]> = {
  ChatGPT: SENTIMENT_BY_LOCATION.map((loc, i) => ({
    location: loc.location,
    performance: 'leading' as const,
    rank1: i % 2 === 0 ? { name: BRAND_NAME, isYou: true } : { name: 'Bowen Dental' },
    rank2: i % 2 === 0 ? { name: 'Bowen Dental' } : { name: BRAND_NAME, isYou: true },
    rank3: { name: 'Innisfail Dentists' },
    rank4: { name: 'Deeragun Dental' },
    rank5: { name: 'Absolutely Dental @ Kirwan Plaza' },
  })),
  Gemini: SENTIMENT_BY_LOCATION.map((loc) => ({
    location: loc.location,
    performance: 'leading' as const,
    rank1: { name: BRAND_NAME, isYou: true },
    rank2: { name: 'Deeragun Dental' },
    rank3: { name: 'Bowen Dental' },
    rank4: { name: 'Innisfail Dentists' },
    rank5: { name: 'Absolutely Dental @ Kirwan Plaza' },
  })),
  Perplexity: SENTIMENT_BY_LOCATION.map((loc) => ({
    location: loc.location,
    performance: 'leading' as const,
    rank1: { name: 'Bowen Dental' },
    rank2: { name: BRAND_NAME, isYou: true },
    rank3: { name: 'Absolutely Dental @ Kirwan Plaza' },
    rank4: { name: 'Innisfail Dentists' },
    rank5: { name: 'Deeragun Dental' },
  })),
}
