// Domain Health v2 — reshaped data layer for the "Domain health v2" flow.
// Reuses v1's underlying signals (domainHealthData.ts) and re-buckets/aggregates
// them into the AI readiness / Discoverability / Freshness / Issues structure.

import {
  DOMAIN_HEALTH_ROWS,
  DOMAIN_TECH_DETAILS,
  PAGE_AI_BOT_ROWS,
  PAGE_CONTENT_ROWS,
  PAGE_SCORE_BREAKDOWN,
  formatLastCrawled,
  getDomainMeta,
  getDomainPagesPadded,
  getDomainScores,
  getPageMeta,
  seededScore,
  type DomainHealthRecommendation,
} from './domainHealthData'
import type {
  BreakdownColumn,
  BreakdownMetricKey,
  BreakdownSignal,
  DrawerSection,
  DrawerSignalRow,
  DrawerTopFix,
  HorizontalBarDatum,
  Metric,
} from '../components'

/** Month options for the report-month selector shown in the Domain health v2 headers. */
export const DOMAIN_HEALTH_MONTH_OPTIONS = ['Jul 2026', 'Jun 2026', 'May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026']

/** Canonical tooltip copy for the Health score / AI readiness / Discoverability / Freshness / Issues metrics — reused wherever these numbers appear (KPI tiles, score breakdown, table headers) across the Domain health v2 screens. */
export const HEALTH_METRIC_TOOLTIPS = {
  health:
    "Your domain's overall readiness for AI search. It's calculated using AI readiness, discoverability, and freshness. For example, a health score of 90/100 means your website is generally well prepared for AI assistants to crawl, understand, and cite.",
  aiReadiness:
    "Measures how well AI assistants can crawl and understand your website's content. For example, an AI readiness score of 85/100 means most of your pages are accessible and easy for AI assistants to interpret.",
  discoverability:
    'Measures how easily AI assistants and search crawlers can find and index your pages. For example, a discoverability score of 80/100 means most of your important pages can be found and indexed successfully.',
  freshness:
    "Measures how up to date your website's content is for AI search. For example, a freshness score of 75/100 means much of your content has been updated recently, but some pages may need refreshing.",
  issues:
    'Technical issues and warnings that can prevent AI assistants from crawling, understanding, or citing your website. Fixing these issues can improve your domain health.',
} as const

export interface DomainHealthRowV2 extends Record<string, unknown> {
  domain: string
  pageCount: number
  health: number
  aiReadiness: number
  discoverability: number
  freshness: number
  issuesFound: number
  recommendations: number
}

export interface IssueRecTemplate {
  issueLabel: string
  type: 'Issue' | 'Warning'
  recTitle: string
  recMetric: string
}

// Each entry pairs a plain-language issue/warning with the one specific fix that resolves it.
export const ISSUE_REC_TEMPLATES: IssueRecTemplate[] = [
  { issueLabel: 'Missing canonical tag', type: 'Issue', recTitle: 'Add a canonical tag', recMetric: 'Discoverability' },
  { issueLabel: 'Meta description missing', type: 'Warning', recTitle: 'Add a meta description', recMetric: 'Discoverability' },
  { issueLabel: 'Duplicate title tags detected', type: 'Warning', recTitle: 'Fix duplicate title tags', recMetric: 'Discoverability' },
  { issueLabel: 'Broken internal link detected', type: 'Issue', recTitle: 'Fix broken internal links', recMetric: 'Discoverability' },
  { issueLabel: 'Slow load time on mobile (>3s)', type: 'Warning', recTitle: 'Reduce page load time', recMetric: 'Discoverability' },
  { issueLabel: 'Missing alt text on images', type: 'Warning', recTitle: 'Add alt text to images', recMetric: 'AI readiness' },
  { issueLabel: 'No FAQ schema detected', type: 'Warning', recTitle: 'Add FAQ schema', recMetric: 'AI readiness' },
  { issueLabel: 'Missing LocalBusiness schema', type: 'Issue', recTitle: 'Add LocalBusiness schema', recMetric: 'AI readiness' },
  { issueLabel: 'Weak heading structure', type: 'Warning', recTitle: 'Improve heading structure', recMetric: 'AI readiness' },
  { issueLabel: 'Missing breadcrumb navigation', type: 'Warning', recTitle: 'Add breadcrumb navigation', recMetric: 'Discoverability' },
  { issueLabel: "Content hasn't been updated in 90+ days", type: 'Warning', recTitle: 'Update outdated content', recMetric: 'Freshness' },
  { issueLabel: 'Statistics referenced are out of date', type: 'Warning', recTitle: 'Refresh outdated statistics', recMetric: 'Freshness' },
]

export interface PageIssue extends Record<string, unknown> {
  label: string
  type: 'Issue' | 'Warning'
  recommendation: DomainHealthRecommendation
}

/** Deterministically seeds 2-4 issues per page from ISSUE_REC_TEMPLATES, each carrying its own paired fix. */
export function getPageIssues(domain: string, path: string): PageIssue[] {
  const count = 2 + (seededScore(domain + path + 'n') % 3)
  const used = new Set<number>()
  const issues: PageIssue[] = []
  let i = 0
  while (issues.length < count && i < ISSUE_REC_TEMPLATES.length * 3) {
    const idx = seededScore(domain + path + 'i' + i) % ISSUE_REC_TEMPLATES.length
    i++
    if (used.has(idx)) continue
    used.add(idx)
    const t = ISSUE_REC_TEMPLATES[idx]
    const impact = 2 + (seededScore(domain + path + t.recTitle) % 9)
    issues.push({
      label: t.issueLabel,
      type: t.type,
      recommendation: { title: t.recTitle, metric: t.recMetric, affected: 1, impact, domain },
    })
  }
  return issues
}

export function getDomainIssuesCount(domain: string): number {
  const pages = getDomainPagesPadded(domain)
  return pages.reduce((sum, path) => sum + getPageIssues(domain, path).length, 0)
}

/** Distinct fix types needed across a domain's pages (deduped by recommendation title) — deliberately different from the raw issue count. */
export function getDistinctRecommendationCount(domain: string): number {
  const pages = getDomainPagesPadded(domain)
  const titles = new Set<string>()
  pages.forEach((path) => getPageIssues(domain, path).forEach((issue) => titles.add(issue.recommendation.title)))
  return titles.size
}

export const DOMAIN_HEALTH_ROWS_V2: DomainHealthRowV2[] = DOMAIN_HEALTH_ROWS.map((r) => ({
  domain: r.domain,
  pageCount: r.pageCount,
  health: r.health,
  aiReadiness: r.aiReadiness,
  discoverability: r.discoverability,
  freshness: r.freshness,
  issuesFound: getDomainIssuesCount(r.domain),
  recommendations: getDistinctRecommendationCount(r.domain),
}))

function average(nums: number[]): number {
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

export function getListSummary() {
  return {
    urls: DOMAIN_HEALTH_ROWS_V2.length,
    health: average(DOMAIN_HEALTH_ROWS_V2.map((r) => r.health)),
    aiReadiness: average(DOMAIN_HEALTH_ROWS_V2.map((r) => r.aiReadiness)),
    discoverability: average(DOMAIN_HEALTH_ROWS_V2.map((r) => r.discoverability)),
    freshness: average(DOMAIN_HEALTH_ROWS_V2.map((r) => r.freshness)),
    issuesFound: DOMAIN_HEALTH_ROWS_V2.reduce((sum, r) => sum + r.issuesFound, 0),
  }
}

export interface PageScores {
  health: number
  ai: number
  disc: number
  fresh: number
}

export function getPageScores(domain: string, path: string): PageScores {
  return {
    health: seededScore(domain + path + 'h'),
    ai: seededScore(domain + path + 'a'),
    disc: seededScore(domain + path + 'd'),
    fresh: seededScore(domain + path + 'f'),
  }
}

/** Deterministically seeds whether a page is listed in the domain's sitemap. */
export function isPageInSitemap(domain: string, path: string): boolean {
  return seededScore(domain + path + 'sitemap') % 5 !== 0
}

interface HealthSignal {
  key: string
  good: string
  bad: string
}

interface HealthMetricSignals {
  metric: string
  tooltip: string
  score: number
  opportunities: string[]
}

/** Resolves each signal against the score — lower score means a signal is more likely to resolve as an opportunity to fix. */
function resolveOpportunities(seedBase: string, score: number, signals: HealthSignal[]): string[] {
  return signals.filter((s) => seededScore(seedBase + s.key) >= score).map((s) => s.bad)
}

function aiReadinessSignals(seedBase: string, score: number): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    { key: 'faq', good: 'FAQ section covers common questions', bad: 'Expand your FAQ section to cover more questions' },
  ])
  return { metric: 'AI readiness', tooltip: 'Shows how likely AI is to recommend you in generated answers', score, opportunities }
}

function discoverabilitySignals(seedBase: string, score: number): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    { key: 'sitemap', good: 'Found in sitemap', bad: 'Add this page to your sitemap' },
    { key: 'canonical', good: 'Canonical URL set', bad: 'Add a canonical URL' },
  ])
  return { metric: 'Discoverability', tooltip: 'Shows how easily search engines and AI can find your content', score, opportunities }
}

function contentQualitySignals(seedBase: string, score: number): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    { key: 'faqAdded', good: 'FAQ section added', bad: 'Add an FAQ section' },
  ])
  if (score < 80) {
    opportunities.push('Add more FAQs to cover common questions', 'Add customer testimonials to build trust')
  }
  return { metric: 'AI readiness', tooltip: 'Shows how complete and helpful your on-page content is', score, opportunities }
}

function businessInformationSignals(seedBase: string, score: number): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    { key: 'phone', good: 'Phone number listed', bad: 'Add a phone number' },
    { key: 'address', good: 'Physical address listed', bad: 'Add a physical address' },
    { key: 'org', good: 'Organization name listed', bad: 'Add your organization name' },
    { key: 'email', good: 'Email address listed', bad: 'Add an email address' },
  ])
  return { metric: 'AI readiness', tooltip: 'Shows if your business details are complete and accurate', score, opportunities }
}

function websiteTrustSignals(seedBase: string, score: number): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    { key: 'localBusiness', good: 'Local business schema present', bad: 'Add local business schema' },
    { key: 'breadcrumb', good: 'Breadcrumb schema present', bad: 'Add breadcrumb schema' },
  ])
  return { metric: 'AI readiness', tooltip: 'Shows if trust signals like schema markup are set up correctly', score, opportunities }
}

function websiteFreshnessSignals(seedBase: string, score: number): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    { key: 'dateMeta', good: 'Date published and modified metadata found', bad: 'Add structured date metadata' },
    { key: 'lastModified', good: 'Last-Modified header present', bad: 'Add a Last-Modified header to support cache revalidation' },
    { key: 'etag', good: 'ETag header present', bad: 'Add an ETag header for precise cache validation' },
  ])
  return { metric: 'Freshness', tooltip: 'Shows how up to date your content and freshness signals are', score, opportunities }
}

function websiteSecuritySignals(seedBase: string, score: number, httpsSignal: HealthSignal): HealthMetricSignals {
  const opportunities = resolveOpportunities(seedBase, score, [
    httpsSignal,
    { key: 'ssr', good: 'Server-side rendering improves load speed', bad: 'Add server-side rendering to improve load speed' },
    { key: 'httpCache', good: 'HTTP caching configured', bad: 'Add HTTP caching' },
    { key: 'lazyLoad', good: 'Lazy loading used for deferred elements', bad: 'Add lazy loading for deferred elements' },
    { key: 'imgDims', good: 'Images use explicit width and height', bad: 'Add explicit width and height to images to prevent layout shift' },
    { key: 'etag', good: 'ETag header present', bad: 'Add an ETag header' },
    { key: 'cdnCache', good: 'CDN supports strong cache validation', bad: 'Enable strong cache validation on your CDN' },
  ])
  return { metric: 'Discoverability', tooltip: 'Shows how securely and quickly your website loads for visitors', score, opportunities }
}

/** A row in the flat "How to improve your health score" table — one row per recommendation. */
export interface HealthImprovementRow extends Record<string, unknown> {
  title: string
  metric: string
  score: number
  affected: number
  affectedLabel: string
  impact: number
  points: number
  priority: 'High' | 'Medium' | 'Low'
  recommendation: DomainHealthRecommendation
}

function priorityLabel(impact: number): 'High' | 'Medium' | 'Low' {
  if (impact >= 8) return 'High'
  if (impact >= 5) return 'Medium'
  return 'Low'
}

/** Flattens each metric's opportunities into one row per recommendation, sorted by affected pages descending. */
function flattenToImprovementRows(seedBase: string, domain: string, signals: HealthMetricSignals[], totalPages: number): HealthImprovementRow[] {
  const rows: HealthImprovementRow[] = []
  signals.forEach((m) => {
    m.opportunities.forEach((title) => {
      const impact = 2 + (seededScore(seedBase + title) % 9)
      const affected = totalPages > 1 ? 1 + (seededScore(seedBase + title + 'aff') % totalPages) : 1
      rows.push({
        title,
        metric: m.metric,
        score: m.score,
        affected,
        affectedLabel: totalPages > 1 ? `${affected} pages` : 'This page',
        impact,
        points: impact * 10,
        priority: priorityLabel(impact),
        recommendation: { title, metric: m.metric, affected, impact, domain },
      })
    })
  })
  return rows.sort((a, b) => b.affected - a.affected)
}

export function getDomainHealthImprovements(domain: string): HealthImprovementRow[] {
  const scores = getDomainScores(domain)
  if (!scores) return []
  const pages = getDomainPagesPadded(domain)
  const httpsPages = Math.max(1, Math.round((pages.length * scores.disc) / 100))

  const signals = [
    aiReadinessSignals(domain, scores.ai),
    discoverabilitySignals(domain, scores.disc),
    contentQualitySignals(domain, seededScore(domain + 'cq')),
    businessInformationSignals(domain, seededScore(domain + 'bi')),
    websiteTrustSignals(domain, seededScore(domain + 'wt')),
    websiteFreshnessSignals(domain, scores.fresh),
    websiteSecuritySignals(domain, seededScore(domain + 'ws'), {
      key: 'https',
      good: `${httpsPages} of ${pages.length} pages use HTTPS`,
      bad: 'Move remaining pages to HTTPS',
    }),
  ]

  return flattenToImprovementRows(domain, domain, signals, pages.length)
}

export function getPageHealthImprovements(domain: string, path: string): HealthImprovementRow[] {
  const scores = getPageScores(domain, path)
  const seedBase = domain + path

  const signals = [
    aiReadinessSignals(seedBase, scores.ai),
    discoverabilitySignals(seedBase, scores.disc),
    contentQualitySignals(seedBase, seededScore(seedBase + 'cq')),
    businessInformationSignals(seedBase, seededScore(seedBase + 'bi')),
    websiteTrustSignals(seedBase, seededScore(seedBase + 'wt')),
    websiteFreshnessSignals(seedBase, scores.fresh),
    websiteSecuritySignals(seedBase, seededScore(seedBase + 'ws'), {
      key: 'https',
      good: 'This page uses HTTPS',
      bad: 'Move this page to HTTPS',
    }),
  ]

  return flattenToImprovementRows(seedBase, domain, signals, 1)
}

function tierBarColor(pct: number): string {
  if (pct >= 80) return '#4cae3d'
  if (pct >= 50) return '#f5a623'
  return '#de1b0c'
}

/** The 7 score-breakdown metrics that belong under AI readiness, in a fixed (not value-sorted) order. */
const AI_SCORE_BREAKDOWN_LABELS = ['FAQ', 'Structure', 'Entities', 'Readability', 'Content', 'Internal links', 'AI accessibility']

function getAiReadinessScoreBreakdownBarData(): HorizontalBarDatum[] {
  return AI_SCORE_BREAKDOWN_LABELS.map((label) => {
    const m = PAGE_SCORE_BREAKDOWN.find((row) => row.label === label)
    const value = m?.value ?? 0
    return { label, value, color: tierBarColor(value) }
  })
}

export interface TechnicalCheckRow extends Record<string, unknown> {
  label: string
  tooltip: string
  checked: true
}

const TECHNICAL_CHECKLIST: { label: string; tooltip: string }[] = [
  { label: 'Title tag', tooltip: 'Whether this page has a unique, descriptive title tag.' },
  { label: 'Meta description', tooltip: 'Whether this page has a meta description for search results.' },
  { label: 'Canonical tag', tooltip: 'Whether this page specifies a canonical URL to avoid duplicate content.' },
  { label: 'Structured data', tooltip: 'Whether this page has schema markup so AI engines can understand its content.' },
  { label: 'In sitemap', tooltip: "Whether this page is listed in the domain's sitemap." },
  { label: 'HTTPS', tooltip: 'Whether this page is served securely over HTTPS.' },
]

export function getTechnicalChecklist(): TechnicalCheckRow[] {
  return TECHNICAL_CHECKLIST.map((t) => ({ label: t.label, tooltip: t.tooltip, checked: true as const }))
}

export const METRIC_KEY_LABELS: Record<BreakdownMetricKey, string> = {
  ai: 'AI readiness',
  disc: 'Discoverability',
  fresh: 'Freshness',
}

const DRAWER_SUMMARIES: Record<BreakdownMetricKey, { pass: string; fail: string }> = {
  ai: {
    pass: 'AI assistants can find and recommend your business. One gap found: no email address on most pages.',
    fail: 'AI assistants are having trouble recommending your business. Several key signals are missing.',
  },
  disc: {
    pass: 'Your pages are set up correctly for search engines. Minor content issues noted.',
    fail: 'Search engines are struggling to find your pages. Fix the issues below to improve visibility.',
  },
  fresh: {
    pass: 'Your content freshness signals are mostly in place.',
    fail: "Search engines can't tell how current your content is. No date signals found on your pages.",
  },
}

/** Pass/fail-state summary copy for the Score breakdown drawer, taken verbatim from the Copy Reference table. */
export function getDrawerSummary(key: BreakdownMetricKey, score: number | null): string {
  const passing = (score ?? 0) >= 60
  return passing ? DRAWER_SUMMARIES[key].pass : DRAWER_SUMMARIES[key].fail
}

/** Splits the drawer summary into bullet lines for the AI summary card's "Highlights" list. */
export function getDrawerHighlights(key: BreakdownMetricKey | null, score: number | null): string[] {
  if (!key) return []
  return getDrawerSummary(key, score)
    .split('. ')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith('.') ? s : `${s}.`))
}

/** Domain-level stat tiles: Total pages | HTTPS status | Load time | Last crawled. */
export function getStatTiles(domain: string): Metric[] {
  const meta = getDomainMeta(domain)
  return [
    { id: 'totalPages', value: meta.totalPages, label: 'Total pages' },
    { id: 'https', value: meta.httpsSecure ? 'Secure' : 'Not secure', label: 'HTTPS status' },
    { id: 'load', value: `${meta.loadTimeSec}s`, label: 'Load time' },
    { id: 'crawled', value: formatLastCrawled(meta.lastCrawledDays), label: 'Last crawled' },
  ]
}

/** Page-level stat tiles: HTTP status | Load time | Last crawled. */
export function getPageStatTiles(domain: string, path: string): Metric[] {
  const meta = getPageMeta(domain, path)
  return [
    { id: 'http', value: meta.httpStatus, label: 'HTTP status' },
    { id: 'load', value: `${meta.loadTimeSec}s`, label: 'Load time' },
    { id: 'crawled', value: formatLastCrawled(meta.lastCrawledDays), label: 'Last crawled' },
  ]
}

interface BreakdownSignalDef {
  key: string
  label: string
}

const AI_READINESS_SIGNAL_DEFS: BreakdownSignalDef[] = [
  { key: 'bizName', label: 'Business name' },
  { key: 'phone', label: 'Phone number' },
  { key: 'email', label: 'Email address' },
  { key: 'faq', label: 'FAQ section' },
  { key: 'reviews', label: 'Customer reviews' },
]

const DISCOVERABILITY_SIGNAL_DEFS: BreakdownSignalDef[] = [
  { key: 'sitemap', label: 'Found in sitemap' },
  { key: 'title', label: 'Title tag' },
  { key: 'metaDesc', label: 'Meta description' },
  { key: 'noDup', label: 'No duplicate pages' },
  { key: 'canonical', label: 'Canonical URL' },
]

const FRESHNESS_SIGNAL_DEFS: BreakdownSignalDef[] = [
  { key: 'pubDate', label: 'Publish date' },
  { key: 'modDate', label: 'Last modified date' },
  { key: 'etag', label: 'ETag header' },
  { key: 'loadsFast', label: 'Page loads fast' },
  { key: 'reachable', label: 'Page is reachable' },
]

/** Builds the 5 pass/fail signals for one breakdown column, seeded so failing signals stay stable and carry an "affects N pages" annotation at domain scope. */
function buildBreakdownSignals(seedBase: string, score: number, defs: BreakdownSignalDef[], totalPages: number): BreakdownSignal[] {
  return defs.map((d) => {
    const pass = seededScore(seedBase + d.key) < score
    const affected = totalPages > 1 ? 1 + (seededScore(seedBase + d.key + 'aff') % totalPages) : 0
    return {
      label: d.label,
      status: pass ? 'pass' : 'fail',
      affectedLabel: !pass && affected > 0 ? `affects ${affected} pages` : undefined,
    }
  })
}

function seededDelta(seedBase: string, key: string): number {
  const seed = seededScore(seedBase + key + 'delta')
  return Math.round((seed % 90) - 45) / 10
}

/** The 3-column health breakdown (AI readiness / Discoverability / Freshness), 5 signals each — feeds HealthBreakdownCard and ScoreBreakdownDrawer. */
export function getBreakdownColumns(domain: string, path?: string): BreakdownColumn[] {
  const scores = path ? getPageScores(domain, path) : getDomainScores(domain)
  if (!scores) return []
  const seedBase = path ? domain + path : domain
  const totalPages = path ? 1 : getDomainPagesPadded(domain).length

  return [
    {
      key: 'ai',
      title: 'AI Readiness',
      score: scores.ai,
      delta: seededDelta(seedBase, 'ai'),
      signals: buildBreakdownSignals(seedBase, scores.ai, AI_READINESS_SIGNAL_DEFS, totalPages),
    },
    {
      key: 'disc',
      title: 'Discoverability',
      score: scores.disc,
      delta: seededDelta(seedBase, 'disc'),
      signals: buildBreakdownSignals(seedBase, scores.disc, DISCOVERABILITY_SIGNAL_DEFS, totalPages),
    },
    {
      key: 'fresh',
      title: 'Freshness',
      score: scores.fresh,
      delta: seededDelta(seedBase, 'fresh'),
      signals: buildBreakdownSignals(seedBase, scores.fresh, FRESHNESS_SIGNAL_DEFS, totalPages),
    },
  ]
}

interface DrawerSignalDef {
  key: string
  label: string
  passNote?: string
  failNote?: string
}

/** Builds one drawer signal group from seeded pass/fail defs — richer per-drawer detail than the card's 5-signal summary. */
function buildDrawerSignals(seedBase: string, score: number, defs: DrawerSignalDef[], totalPages: number): DrawerSignalRow[] {
  return defs.map((d) => {
    const pass = seededScore(seedBase + d.key) < score
    const affected = totalPages > 1 ? 1 + (seededScore(seedBase + d.key + 'aff') % totalPages) : 0
    const note = pass ? d.passNote : d.failNote ?? (affected > 0 ? `affects ${affected} pages` : undefined)
    return { label: d.label, status: pass ? 'pass' as const : 'fail' as const, note }
  })
}

const AI_BUSINESS_INFO_DEFS: DrawerSignalDef[] = [
  { key: 'bizName', label: 'Business name present' },
  { key: 'phone', label: 'Phone number present' },
  { key: 'email', label: 'Email address missing' },
  { key: 'address', label: 'Physical address present' },
  { key: 'orgSchema', label: 'Organization schema in place' },
]

const AI_CONTENT_STRUCTURE_DEFS: DrawerSignalDef[] = [
  { key: 'faqPresent', label: 'FAQ section present' },
  { key: 'faqCoverage', label: 'FAQ coverage is partial' },
  { key: 'reviewsPresent', label: 'Customer reviews present' },
  { key: 'reviewSchema', label: 'No review schema markup' },
  { key: 'localBizSchema', label: 'LocalBusiness schema in place' },
]

export const AI_BOT_ACCESS_NOTE = 'Blocked folders like /admin/ are normal. Confirm no service pages are accidentally blocked.'

const AI_CONTENT_FIELDS = ['Words', 'Reading score', 'Images', 'Internal links']

/** Top 3 recommendations for one metric's drawer, ranked by point value. */
export function getTopFixesForMetric(rows: HealthImprovementRow[], key: BreakdownMetricKey, limit = 3): DrawerTopFix[] {
  return rows
    .filter((r) => r.metric === METRIC_KEY_LABELS[key])
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((r, i) => ({
      rank: i + 1,
      title: r.title,
      points: r.points,
      affectedLabel: r.affectedLabel === 'This page' ? undefined : `Affects ${r.affectedLabel}`,
    }))
}

/** AI readiness drawer: business info, domain structure, content structure, AI bot access, score breakdown, blocked folders, top fixes, and page-only content. */
function getAiReadinessDrawerSections(domain: string, path: string | undefined, improvements: HealthImprovementRow[]): DrawerSection[] {
  const scores = path ? getPageScores(domain, path) : getDomainScores(domain)
  const score = scores?.ai ?? 50
  const seedBase = path ? domain + path : domain
  const totalPages = path ? 1 : getDomainPagesPadded(domain).length
  const tech = DOMAIN_TECH_DETAILS[domain]

  const contentStructure = buildDrawerSignals(seedBase + 'content', score, AI_CONTENT_STRUCTURE_DEFS, totalPages).map((s) =>
    s.label === 'FAQ coverage is partial' ? { ...s, status: 'warning' as const, note: undefined } : s,
  )

  return [
    {
      key: 'business-info',
      title: 'Business information',
      kind: 'signals',
      defaultOpen: true,
      description: 'Does your site give AI the basic facts about you?',
      signals: buildDrawerSignals(seedBase + 'biz', score, AI_BUSINESS_INFO_DEFS, totalPages),
    },
    {
      key: 'domain-structure',
      title: 'Domain structure',
      kind: 'kv',
      rows: [
        { label: 'Robots.txt health score', value: tech.robots },
        { label: 'Crawler-friendly score', value: tech.crawler },
        { label: 'Conflicting directives', value: tech.conflicts },
      ],
    },
    {
      key: 'content-structure',
      title: 'Content structure',
      kind: 'signals',
      description: 'Does your content help AI answer questions about you?',
      signals: contentStructure,
    },
    {
      key: 'ai-bot-access',
      title: 'AI bot access',
      kind: 'bots',
      rows: PAGE_AI_BOT_ROWS.map((row) => ({ name: row.name, status: row.status })),
      note: AI_BOT_ACCESS_NOTE,
    },
    { key: 'score-breakdown', title: 'Score breakdown', kind: 'bar', data: getAiReadinessScoreBreakdownBarData() },
    {
      key: 'blocked-folders',
      title: 'Blocked folders',
      kind: 'kv',
      rows: tech.blocked.length
        ? tech.blocked.map((folder) => ({ label: folder, value: 'Disallowed' }))
        : [{ label: 'No blocked folders found', value: '' }],
    },
    { key: 'top-fixes', title: 'Top fixes', kind: 'fixes', fixes: getTopFixesForMetric(improvements, 'ai') },
    {
      key: 'content',
      title: 'Content',
      kind: 'kv',
      pageOnly: true,
      rows: PAGE_CONTENT_ROWS.filter((row) => AI_CONTENT_FIELDS.includes(row.label)).map((row) => ({ label: row.label, value: row.value })),
    },
  ]
}

const DISCOVERABILITY_PAGE_BASICS_DEFS: DrawerSignalDef[] = [
  { key: 'titleTag', label: 'Title tag present' },
  { key: 'metaDesc', label: 'Meta description present' },
  { key: 'canonical', label: 'Canonical URL set' },
  { key: 'https', label: 'HTTPS turned on' },
  { key: 'sitemap', label: 'Found in sitemap' },
  { key: 'structuredData', label: 'Structured data present' },
]

/** Discoverability drawer: page basics, content signals, site-wide health, crawlability, blocked folders, top fixes, and page-only content detail. */
function getDiscoverabilityDrawerSections(domain: string, path: string | undefined, improvements: HealthImprovementRow[]): DrawerSection[] {
  const scores = path ? getPageScores(domain, path) : getDomainScores(domain)
  const score = scores?.disc ?? 50
  const seedBase = path ? domain + path : domain
  const tech = DOMAIN_TECH_DETAILS[domain]
  const httpsSecure = path ? getPageMeta(domain, path).httpStatus === 200 : getDomainMeta(domain).httpsSecure

  const pageBasics = buildDrawerSignals(seedBase + 'basics', score, DISCOVERABILITY_PAGE_BASICS_DEFS, 0).map((s) =>
    s.label === 'HTTPS turned on' ? { ...s, status: httpsSecure ? ('pass' as const) : ('fail' as const), note: undefined } : s,
  )

  const h1Count = 1 + (seededScore(seedBase + 'h1') % 3)
  const h1Signal: DrawerSignalRow = {
    label: h1Count > 1 ? `${h1Count} H1 tags found` : '1 H1 tag found',
    status: h1Count > 1 ? 'warning' : 'pass',
    note: h1Count > 1 ? 'use 1 per page' : undefined,
  }

  const contentDetailRows = PAGE_CONTENT_ROWS.filter((row) => AI_CONTENT_FIELDS.includes(row.label)).map((row) => ({
    label: row.label,
    value: row.label === 'Words' ? `${row.value} — good depth` : row.value,
  }))

  const siteWideHealth: DrawerSignalRow[] = [
    { label: 'No duplicate pages', status: tech.dup >= 80 ? 'pass' : 'fail' },
    { label: 'No broken redirects', status: tech.redir >= 80 ? 'pass' : 'fail' },
    { label: 'Canonical tags consistent', status: tech.canon >= 80 ? 'pass' : 'fail' },
    { label: `All pages in sitemap (${tech.sitemap})`, status: tech.coverage === '100%' ? 'pass' : 'warning' },
  ]

  return [
    { key: 'page-basics', title: 'Page basics', kind: 'signals', defaultOpen: true, description: 'The signals every page needs to be found', signals: pageBasics },
    { key: 'content-signals', title: 'Content signals', kind: 'signals', description: 'What search engines read about your content', signals: [h1Signal] },
    { key: 'content-detail', title: 'Content detail', kind: 'kv', pageOnly: true, rows: contentDetailRows },
    { key: 'site-wide-health', title: 'Site-wide health', kind: 'signals', description: 'Checks that run across your whole domain', signals: siteWideHealth },
    {
      key: 'crawlability',
      title: 'Crawlability',
      kind: 'kv',
      rows: [
        { label: 'Pages in sitemap', value: tech.sitemap },
        { label: 'Sitemap coverage', value: tech.coverage },
        { label: 'Robots.txt health score', value: tech.robots },
        { label: 'Crawler-friendly score', value: tech.crawler },
        { label: 'Conflicting directives', value: tech.conflicts },
      ],
    },
    {
      key: 'blocked-folders',
      title: 'Blocked folders',
      kind: 'kv',
      rows: tech.blocked.length
        ? tech.blocked.map((folder) => ({ label: folder, value: 'Disallowed' }))
        : [{ label: 'No blocked folders found', value: '' }],
    },
    { key: 'top-fixes', title: 'Top fixes', kind: 'fixes', fixes: getTopFixesForMetric(improvements, 'disc') },
  ]
}

const FRESHNESS_DATE_SIGNAL_DEFS: DrawerSignalDef[] = [
  { key: 'pubDate', label: 'No publish date on pages' },
  { key: 'updatedDate', label: 'No last updated date on pages' },
  { key: 'dateSchema', label: 'No date metadata in schema' },
]

/** Freshness drawer: date signals, cache signals, crawl status, freshness breakdown, page-only HTTP/schema/performance detail, and top fixes. */
function getFreshnessDrawerSections(domain: string, path: string | undefined, improvements: HealthImprovementRow[]): DrawerSection[] {
  const scores = path ? getPageScores(domain, path) : getDomainScores(domain)
  const score = scores?.fresh ?? 50
  const seedBase = path ? domain + path : domain

  const dateSignals = buildDrawerSignals(seedBase + 'date', score, FRESHNESS_DATE_SIGNAL_DEFS, 0).map((s) => ({
    ...s,
    status: s.status === 'pass' ? ('pass' as const) : ('fail' as const),
  }))

  const lastModifiedPass = seededScore(seedBase + 'lastModified') < score
  const etagPass = seededScore(seedBase + 'etag') < score
  const cacheSignals: DrawerSignalRow[] = [
    {
      label: lastModifiedPass ? 'Last-Modified header present' : 'Last-Modified header missing',
      status: lastModifiedPass ? 'pass' : 'fail',
      note: lastModifiedPass ? undefined : "Search engines can't detect when you updated",
    },
    {
      label: etagPass ? 'ETag header present' : 'ETag header missing',
      status: etagPass ? 'pass' : 'fail',
      note: etagPass ? undefined : "Precise cache control isn't set",
    },
  ]

  const meta = path ? getPageMeta(domain, path) : getDomainMeta(domain)
  const loadTimeSec = Number(meta.loadTimeSec)
  const crawlStatus: DrawerSignalRow[] = [
    { label: `Last crawled: ${formatLastCrawled(meta.lastCrawledDays)}`, status: 'neutral' },
    {
      label: `HTTP status: ${meta.httpStatus}`,
      status: meta.httpStatus === 200 ? 'pass' : 'fail',
      note: meta.httpStatus === 200 ? 'page is reachable' : 'page is unreachable',
    },
    {
      label: `Load time: ${meta.loadTimeSec}s`,
      status: loadTimeSec < 2 ? 'pass' : 'warning',
      note: loadTimeSec < 2 ? 'acceptable' : 'slow',
    },
  ]

  const breakdownByLabel = new Map(PAGE_SCORE_BREAKDOWN.map((m) => [m.label, m.value]))
  const freshnessBreakdownRows = [
    { label: 'Freshness score', value: `${breakdownByLabel.get('Freshness') ?? 0}%` },
    { label: 'Performance score', value: `${breakdownByLabel.get('Performance') ?? 0}%` },
    { label: 'Citation readiness', value: `${breakdownByLabel.get('Citation readiness') ?? 0}%` },
  ]

  return [
    { key: 'date-signals', title: 'Date signals', kind: 'signals', defaultOpen: true, description: 'How search engines know your content is up to date', signals: dateSignals },
    { key: 'cache-signals', title: 'Cache signals', kind: 'signals', description: 'How servers tell crawlers when something changed', signals: cacheSignals },
    { key: 'crawl-status', title: 'Crawl status', kind: 'signals', description: 'When did we last check your site?', signals: crawlStatus },
    { key: 'freshness-breakdown', title: 'Freshness breakdown', kind: 'kv', rows: freshnessBreakdownRows },
    {
      key: 'http-headers',
      title: 'HTTP headers',
      kind: 'kv',
      pageOnly: true,
      rows: [
        { label: 'Last-Modified', value: 'Missing' },
        { label: 'ETag', value: 'Missing' },
        { label: 'HTTP caching headers', value: 'Missing' },
      ],
    },
    {
      key: 'schema-metadata',
      title: 'Schema metadata',
      kind: 'kv',
      pageOnly: true,
      rows: [
        { label: 'datePublished', value: 'Not found' },
        { label: 'dateModified', value: 'Not found' },
      ],
    },
    {
      key: 'performance',
      title: 'Performance',
      kind: 'kv',
      pageOnly: true,
      rows: path ? [{ label: 'Load time', value: `${meta.loadTimeSec}s` }, { label: 'HTTP status', value: meta.httpStatus }] : [],
    },
    { key: 'top-fixes', title: 'Top fixes', kind: 'fixes', fixes: getTopFixesForMetric(improvements, 'fresh') },
  ]
}

/** Dispatches to the right per-metric drawer section builder — used by both screens when a breakdown drawer opens. */
export function getDrawerSections(
  key: BreakdownMetricKey | null,
  domain: string,
  path: string | undefined,
  improvements: HealthImprovementRow[],
): DrawerSection[] {
  if (key === 'ai') return getAiReadinessDrawerSections(domain, path, improvements)
  if (key === 'disc') return getDiscoverabilityDrawerSections(domain, path, improvements)
  if (key === 'fresh') return getFreshnessDrawerSections(domain, path, improvements)
  return []
}

