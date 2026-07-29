// Domain Health report data — ported from the "Domain health" flow at
// SearchAI/search_ai_overview.html#searchai/reports/domain-health

import type { SeriesConfig, TrendPoint } from '../components/charts/TrendLineChart'
import { chartColors } from '../components/charts/chartColors'

export interface DomainHealthRow extends Record<string, unknown> {
  domain: string
  pageCount: number
  health: number
  aiReadiness: number
  discoverability: number
  freshness: number
  aiAccessibility: number
  recommendations: number
}

export const DOMAIN_HEALTH_ROWS: DomainHealthRow[] = [
  { domain: 'aspendentalcare.com', pageCount: 3, health: 84, aiReadiness: 94, discoverability: 92, freshness: 61, aiAccessibility: 90, recommendations: 9 },
  { domain: 'aspendental.com', pageCount: 4, health: 58, aiReadiness: 58, discoverability: 55, freshness: 60, aiAccessibility: 59, recommendations: 12 },
  { domain: 'aspendentalimplants.com', pageCount: 6, health: 75, aiReadiness: 91, discoverability: 28, freshness: 93, aiAccessibility: 88, recommendations: 18 },
  { domain: 'myaspendentalplan.com', pageCount: 2, health: 23, aiReadiness: 18, discoverability: 25, freshness: 30, aiAccessibility: 20, recommendations: 6 },
  { domain: 'dentalcarebyaspen.com', pageCount: 8, health: 74, aiReadiness: 92, discoverability: 58, freshness: 60, aiAccessibility: 85, recommendations: 24 },
  { domain: 'aspensmilecenter.com', pageCount: 5, health: 79, aiReadiness: 63, discoverability: 90, freshness: 96, aiAccessibility: 68, recommendations: 15 },
  { domain: 'aspendentalonline.com', pageCount: 22, health: 37, aiReadiness: 32, discoverability: 57, freshness: 24, aiAccessibility: 35, recommendations: 66 },
  { domain: 'aspendentalreviews.com', pageCount: 3, health: 30, aiReadiness: 15, discoverability: 27, freshness: 62, aiAccessibility: 18, recommendations: 9 },
  { domain: 'aspendentalblog.com', pageCount: 9, health: 95, aiReadiness: 95, discoverability: 93, freshness: 98, aiAccessibility: 94, recommendations: 27 },
  { domain: 'aspendentallocations.com', pageCount: 7, health: 67, aiReadiness: 92, discoverability: 29, freshness: 59, aiAccessibility: 87, recommendations: 21 },
]

export interface DomainScores {
  health: number
  ai: number
  disc: number
  fresh: number
}

export function getDomainScores(domain: string): DomainScores | null {
  const row = DOMAIN_HEALTH_ROWS.find((r) => r.domain === domain)
  if (!row) return null
  return { health: row.health, ai: row.aiReadiness, disc: row.discoverability, fresh: row.freshness }
}

export interface DomainTechDetails {
  sitemap: string
  coverage: string
  robots: number
  crawler: number
  conflicts: 'Yes' | 'No'
  blocked: string[]
  canon: number
  redir: number
  dup: number
}

export const DOMAIN_TECH_DETAILS: Record<string, DomainTechDetails> = {
  'aspendentalcare.com': { sitemap: '3 / 3', coverage: '100%', robots: 98, crawler: 82, conflicts: 'No', blocked: ['/admin/', '/api/', '/staging/'], canon: 100, redir: 100, dup: 100 },
  'aspendental.com': { sitemap: '4 / 6', coverage: '67%', robots: 74, crawler: 65, conflicts: 'Yes', blocked: ['/admin/', '/api/', '/blog/wp-admin/', '/blog/wp-content/plugins/', '/index.php/', '/landing/', '/reservation/'], canon: 72, redir: 85, dup: 68 },
  'aspendentalimplants.com': { sitemap: '6 / 6', coverage: '100%', robots: 91, crawler: 88, conflicts: 'No', blocked: ['/admin/', '/api/'], canon: 95, redir: 100, dup: 90 },
  'myaspendentalplan.com': { sitemap: '1 / 2', coverage: '50%', robots: 40, crawler: 32, conflicts: 'Yes', blocked: ['/admin/', '/api/', '/blog/wp-admin/', '/blog/wp-content/plugins/', '/index.php/', '/landing/', '/lease/', '/reservation-confirmation/', '/reservation/', '/reservenow/', '/search-results?*'], canon: 40, redir: 55, dup: 38 },
  'dentalcarebyaspen.com': { sitemap: '8 / 8', coverage: '100%', robots: 85, crawler: 79, conflicts: 'No', blocked: ['/admin/', '/api/', '/staging/'], canon: 88, redir: 92, dup: 80 },
  'aspensmilecenter.com': { sitemap: '5 / 5', coverage: '100%', robots: 95, crawler: 90, conflicts: 'No', blocked: ['/admin/'], canon: 100, redir: 97, dup: 100 },
  'aspendentalonline.com': { sitemap: '7 / 11', coverage: '64%', robots: 55, crawler: 48, conflicts: 'Yes', blocked: ['/admin/', '/api/', '/blog/wp-admin/', '/index.php/', '/landing/', '/reservation/'], canon: 60, redir: 70, dup: 55 },
  'aspendentalreviews.com': { sitemap: '2 / 3', coverage: '67%', robots: 38, crawler: 29, conflicts: 'Yes', blocked: ['/admin/', '/api/', '/blog/wp-admin/', '/blog/wp-content/plugins/', '/index.php/', '/landing/', '/lease/', '/reservation-confirmation/', '/reservation/', '/reservenow/', '/search-results?*', '/private/'], canon: 35, redir: 42, dup: 30 },
  'aspendentalblog.com': { sitemap: '9 / 9', coverage: '100%', robots: 97, crawler: 93, conflicts: 'No', blocked: ['/admin/', '/api/'], canon: 100, redir: 100, dup: 100 },
  'aspendentallocations.com': { sitemap: '7 / 7', coverage: '100%', robots: 80, crawler: 71, conflicts: 'No', blocked: ['/admin/', '/api/', '/staging/', '/internal/'], canon: 85, redir: 90, dup: 78 },
}

export const DOMAIN_PAGES: Record<string, string[]> = {
  'aspendentalcare.com': ['/', '/about', '/blog/dental-implants-guide'],
  'aspendental.com': ['/', '/services/teeth-whitening', '/faq', '/blog/invisalign-vs-braces'],
  'aspendentalimplants.com': ['/', '/implants', '/about', '/pricing', '/contact', '/blog'],
  'myaspendentalplan.com': ['/', '/plan'],
  'dentalcarebyaspen.com': ['/', '/services', '/about', '/locations', '/contact', '/blog', '/faq', '/team'],
  'aspensmilecenter.com': ['/', '/smile', '/about', '/contact', '/gallery'],
  'aspendentalonline.com': ['/', '/services', '/about', '/contact', '/blog', '/faq', '/locations', '/pricing', '/team', '/careers', '/legal', '/services/teeth-whitening', '/services/invisalign', '/services/implants', '/services/root-canal', '/blog/dental-hygiene-tips', '/blog/choosing-a-dentist', '/reviews', '/insurance', '/new-patients', '/emergency-care', '/sitemap'],
  'aspendentalreviews.com': ['/', '/reviews', '/about'],
  'aspendentalblog.com': ['/', '/posts', '/about', '/archive', '/category/implants', '/category/whitening', '/category/orthodontics', '/contact', '/newsletter'],
  'aspendentallocations.com': ['/', '/locations', '/map', '/about', '/contact', '/blog', '/faq'],
}

const DOMAIN_HEALTH_EXTRA_SLUGS = [
  '/pricing-plans', '/testimonials', '/careers', '/privacy-policy', '/terms-of-service',
  '/blog/oral-health-tips', '/blog/patient-stories', '/services/cleanings', '/services/crowns', '/services/dentures',
  '/services/root-canal', '/services/sedation', '/gallery', '/insurance-accepted', '/new-patient-forms',
  '/accessibility', '/site-map', '/press', '/partners', '/financing',
]

/** Pads a domain's crawled page list up to 20 entries, matching the source app's synthetic data. */
export function getDomainPagesPadded(domain: string): string[] {
  const pages = (DOMAIN_PAGES[domain] || ['/']).slice()
  let extraIdx = 0
  while (pages.length < 20 && extraIdx < DOMAIN_HEALTH_EXTRA_SLUGS.length) {
    const slug = DOMAIN_HEALTH_EXTRA_SLUGS[extraIdx++]
    if (!pages.includes(slug)) pages.push(slug)
  }
  return pages
}

/** Deterministic pseudo-random score (20-99) from a string seed, so numbers stay stable across renders. */
export function seededScore(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return 20 + (h % 80)
}

export const REC_TEMPLATES: { title: string; metric: string }[] = [
  { title: 'Add a contact email address', metric: 'Discoverability' },
  { title: 'Add HTTP caching headers', metric: 'Performance' },
  { title: 'Add an ETag header', metric: 'Performance' },
  { title: 'Add a Last-Modified header', metric: 'Performance' },
  { title: 'Add LocalBusiness schema', metric: 'AI readiness' },
  { title: 'Set explicit dimensions on images', metric: 'Performance' },
  { title: 'Add a meta description', metric: 'Discoverability' },
  { title: 'Fix broken internal links', metric: 'Health' },
  { title: 'Add alt text to images', metric: 'AI readiness' },
  { title: 'Improve heading structure', metric: 'Content' },
  { title: 'Add a canonical tag', metric: 'Discoverability' },
  { title: 'Reduce page load time', metric: 'Performance' },
  { title: 'Add FAQ schema', metric: 'AI readiness' },
  { title: 'Fix duplicate title tags', metric: 'Health' },
  { title: 'Add breadcrumb navigation', metric: 'Discoverability' },
]

export const REC_LOCATIONS: Record<string, string> = {
  'aspendentalcare.com': 'Bowen QLD',
  'aspendental.com': 'Kirwan QLD',
  'aspendentalimplants.com': 'Bohle Plains QLD',
  'myaspendentalplan.com': 'Innisfail QLD',
  'dentalcarebyaspen.com': 'Ingham QLD',
  'aspensmilecenter.com': 'Kirwan QLD',
  'aspendentalonline.com': 'Bowen QLD',
  'aspendentalreviews.com': 'Bohle Plains QLD',
  'aspendentalblog.com': 'Innisfail QLD',
  'aspendentallocations.com': 'Ingham QLD',
}

export interface DomainHealthRecommendation extends Record<string, unknown> {
  title: string
  metric: string
  affected: number
  impact: number
  domain: string
}

function impactTier(impact: number): 'danger' | 'warning' | 'success' {
  if (impact >= 8) return 'danger'
  if (impact >= 5) return 'warning'
  return 'success'
}

export function getRecommendationsForDomain(domain: string, pageCount: number): DomainHealthRecommendation[] {
  const totalCount = pageCount * 3
  const rows: DomainHealthRecommendation[] = Array.from({ length: totalCount }, (_, i) => {
    const template = REC_TEMPLATES[i % REC_TEMPLATES.length]
    const seed = seededScore(domain + template.title + i)
    const affected = 1 + (seed % Math.max(pageCount, 1))
    const impact = 2 + (seed % 9)
    return { title: template.title, metric: template.metric, affected, impact, domain }
  })
  return rows.sort((a, b) => b.impact - a.impact)
}

export { impactTier }

// Page-details data — static across every page in the source (not seeded per page).
export const PAGE_SCORE_BREAKDOWN: { label: string; value: number }[] = [
  { label: 'FAQ', value: 33 }, { label: 'Structure', value: 100 }, { label: 'Entities', value: 75 },
  { label: 'Readability', value: 50 }, { label: 'Indexability', value: 100 }, { label: 'Technical', value: 100 },
  { label: 'Content', value: 70 }, { label: 'Internal links', value: 100 }, { label: 'AI accessibility', value: 50 },
  { label: 'Freshness', value: 49 }, { label: 'Citation readiness', value: 90 }, { label: 'Performance', value: 65 },
]

export const PAGE_AI_BOT_ROWS: { name: string; status: string }[] = [
  { name: 'GPTBot (OpenAI)', status: 'Partially restricted' },
  { name: 'ClaudeBot (Anthropic)', status: 'Partially restricted' },
  { name: 'Google-Extended', status: 'Partially restricted' },
  { name: 'PerplexityBot', status: 'Partially restricted' },
]

export const PAGE_CONTENT_ROWS: { label: string; value: string }[] = [
  { label: 'Words', value: '1,370' }, { label: 'Reading score', value: '50' }, { label: 'Lists', value: '15' },
  { label: 'Images', value: '20' }, { label: 'Internal links', value: '113' },
]

export const PAGE_TECH_CHECKLIST: string[] = [
  'Title tag', 'Meta description', 'Canonical tag', 'Structured data', 'In sitemap', 'HTTPS',
]

// Domain-audit "Issues & warnings" card — static across every domain in the source.
export const DOMAIN_ISSUES_WARNINGS: { label: string; type: 'Issue' | 'Warning' }[] = [
  { label: 'Page returns 404 for /old-promo', type: 'Issue' },
  { label: 'Missing canonical tag on 2 pages', type: 'Issue' },
  { label: 'Broken internal link to /services', type: 'Issue' },
  { label: 'Meta description missing on 3 pages', type: 'Warning' },
  { label: 'Slow load time on mobile (>3s)', type: 'Warning' },
  { label: 'Duplicate title tags detected', type: 'Warning' },
  { label: 'Low word count on 2 pages', type: 'Warning' },
]

// "Health score over time" trend card — 6-month seeded series per domain.
const HEALTH_TREND_MONTH_LABELS = ['Dec 2025', 'Jan', 'Feb', 'Mar', 'Apr', 'May 2026']

export const HEALTH_TREND_SERIES: SeriesConfig[] = [
  { key: 'health', label: 'Health', color: chartColors.blue },
  { key: 'ai', label: 'AI readiness', color: chartColors.resolved },
  { key: 'disc', label: 'Discoverability', color: chartColors.channel.sms },
  { key: 'fresh', label: 'Freshness', color: chartColors.channel.call },
]

export interface DomainHealthTrendEndValues {
  health: number
  ai: number
  disc: number
  fresh: number
}

export function getDomainHealthTrend(domain: string, endVals: DomainHealthTrendEndValues): TrendPoint[] {
  function seededSeries(seedKey: string, endVal: number): number[] {
    const points: number[] = []
    let v = endVal
    for (let i = 5; i >= 0; i--) {
      const seed = seededScore(domain + seedKey + i)
      const delta = (seed % 13) - 6
      points.unshift(Math.max(5, Math.min(99, Math.round(v))))
      v -= delta
    }
    points[points.length - 1] = endVal
    return points
  }

  const health = seededSeries('health', endVals.health)
  const ai = seededSeries('ai', endVals.ai)
  const disc = seededSeries('disc', endVals.disc)
  const fresh = seededSeries('fresh', endVals.fresh)

  return HEALTH_TREND_MONTH_LABELS.map((label, i) => ({
    label,
    health: health[i],
    ai: ai[i],
    disc: disc[i],
    fresh: fresh[i],
  }))
}
