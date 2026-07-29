// Domain Health v2 — reshaped data layer for the "Domain health v2" flow.
// Reuses v1's underlying signals (domainHealthData.ts) and re-buckets/aggregates
// them into the AI readiness / Discoverability / Freshness / Issues structure.

import {
  DOMAIN_HEALTH_ROWS,
  PAGE_SCORE_BREAKDOWN,
  getDomainPagesPadded,
  getDomainScores,
  seededScore,
  type DomainHealthRecommendation,
} from './domainHealthData'
import type { HorizontalBarDatum } from '../components'

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
    { key: 'phone', good: 'Phone number listed', bad: 'Add a phone number' },
    { key: 'address', good: 'Physical address listed', bad: 'Add a physical address' },
    { key: 'email', good: 'Email address listed', bad: 'Add an email address' },
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
  return { metric: 'Discoverability', tooltip: 'Shows if your business details are complete and accurate', score, opportunities }
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

/** All score-breakdown metrics, lowest first (worst first) — the ones most worth fixing. */
export function getScoreBreakdownItems(): HorizontalBarDatum[] {
  return [...PAGE_SCORE_BREAKDOWN]
    .sort((a, b) => a.value - b.value)
    .map((m) => ({ label: m.label, value: m.value, color: tierBarColor(m.value) }))
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

