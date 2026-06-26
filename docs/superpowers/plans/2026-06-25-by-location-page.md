# By Location Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "By location" competitor benchmarking page — a scatterplot (Visibility score × Citation share) with 6 colored dot series (you + 5 competitors) and a ranked location table with a Performance column, wired into the existing SearchAIScreen.

**Architecture:** New screen `CompetitorByLocationScreen` composes two new components — `ScatterplotCard` (Recharts ScatterChart with quadrant backgrounds, competitor chips, rich tooltip with CTA) and `ByLocationTable` (sortable table with Performance chip + Rank 1–5 competitor chips). Platform tabs (ChatGPT / Gemini / Perplexity) and a right-side FilterPanel drive shared state. The page header + tabs are sticky; the scatterplot scrolls away revealing the table.

**Tech Stack:** React 18, TypeScript, Tailwind CSS (config tokens only), Recharts 2.x (`ScatterChart`, `Scatter`, `ReferenceArea`, `XAxis`, `YAxis`, `ResponsiveContainer`, `Tooltip`), existing component registry.

## Global Constraints

- Tailwind config tokens only — never hardcode hex or px in className strings (exception: `chartColors.ts` which is the designated home for chart-specific hex values)
- Font weight: regular only — never `font-medium`, `font-semibold`, `font-bold`
- Copy: sentence case — first word capitalized only
- Platform tabs: ChatGPT, Gemini, Perplexity only (type `RankingPlatform` from `competitorData.ts`)
- All new components exported from `src/components/index.ts`
- Component registry in `CLAUDE.md` §5 updated after each new component
- `npm run build` must pass with zero TypeScript errors after every task

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/data/competitorData.ts` | Add `ByLocationDot`, `ByLocationTableRow`, `BY_LOCATION_DATA` |
| Modify | `src/components/charts/chartColors.ts` | Add `byLocation` competitor dot color palette |
| Create | `src/components/ScatterplotCard/ScatterplotCard.types.ts` | Props + data types for scatterplot |
| Create | `src/components/ScatterplotCard/ScatterplotCard.tsx` | Recharts scatter + quadrants + chips + tooltip |
| Create | `src/components/ByLocationTable/ByLocationTable.types.ts` | Props + row types |
| Create | `src/components/ByLocationTable/ByLocationTable.tsx` | Sortable table, Performance chip, rank chips |
| Create | `src/screens/CompetitorByLocationScreen.tsx` | Full page: sticky header, scatter, table, filter |
| Modify | `src/screens/SearchAIScreen.tsx` | Wire `by-location` nav branch to new screen |
| Modify | `src/components/index.ts` | Barrel-export new components |
| Modify | `CLAUDE.md` | Register `ScatterplotCard` and `ByLocationTable` |

---

## Task 1: Data layer — add `BY_LOCATION_DATA` and dot colors

**Files:**
- Modify: `src/data/competitorData.ts`
- Modify: `src/components/charts/chartColors.ts`

**Interfaces:**
- Produces:
  - `ByLocationDot` interface
  - `ByLocationTableRow` interface
  - `BY_LOCATION_DATA: Record<RankingPlatform, { dots: ByLocationDot[]; tableRows: ByLocationTableRow[] }>`
  - `chartColors.byLocation: string[]` — 6-element array (index 0 = you, 1–5 = competitors)

- [ ] **Step 1: Add dot colors to `chartColors.ts`**

Open `src/components/charts/chartColors.ts`. Append `byLocation` after the existing `categorical` line:

```typescript
// src/components/charts/chartColors.ts  (full file — replace entirely)
export const chartColors = {
  resolved: '#4cae3d',
  escalated: '#f5a623',
  unresolved: '#de1b0c',
  routed: '#8bc34a',
  unresponded: '#d4d4d4',
  channel: {
    sms: '#7c4dff',
    email: '#e056c7',
    call: '#f5b301',
  },
  positive: '#377e2c',
  negative: '#de1b0c',
  blue: '#1976d2',
  axis: '#8f8f8f',
  grid: '#eaeaea',
  categorical: ['#4cae3d', '#f5a623', '#de1b0c', '#7c4dff', '#1976d2', '#00bcd4', '#e056c7', '#8bc34a'],
  // By-location scatterplot: index 0 = you (dark navy), 1–5 = competitor series
  byLocation: ['#1a237e', '#e91e8c', '#7c3aed', '#f59e0b', '#06b6d4', '#f97316'],
}
```

- [ ] **Step 2: Add types and data to `competitorData.ts`**

At the very end of `src/data/competitorData.ts`, append:

```typescript
// ── By-location scatterplot ───────────────────────────────────────────────────

export type Quadrant = 'leading' | 'lagging' | 'emerging' | 'underperforming'

export interface ByLocationDot {
  locationName: string
  brand: string          // 'you' | competitor name — matches DEFAULT_SELECTED index
  visibilityScore: number // 0–100
  citationShare: number   // 0–100
  rank: number
  quadrant: Quadrant
}

export interface ByLocationTableRow extends Record<string, unknown> {
  location: string
  performance: Quadrant
  rank1: RankingCompetitor
  rank2: RankingCompetitor
  rank3: RankingCompetitor
  rank4: RankingCompetitor
  rank5: RankingCompetitor
}

// Top 5 competitors shown in the by-location view (subset of DEFAULT_SELECTED)
export const BY_LOCATION_COMPETITORS = [
  'Bowen Dental',
  'Deeragun Dental',
  'Innisfail Dentists',
  'Serenity Dental CQ',
  'Absolutely Dental @ Kirwan Plaza',
] as const

const BY_LOCATION_DOTS_CHATGPT: ByLocationDot[] = [
  // You
  { locationName: 'Townsville',  brand: 'you', visibilityScore: 72, citationShare: 58, rank: 1, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'you', visibilityScore: 48, citationShare: 52, rank: 2, quadrant: 'underperforming' },
  { locationName: 'Mackay',      brand: 'you', visibilityScore: 61, citationShare: 42, rank: 3, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'you', visibilityScore: 35, citationShare: 28, rank: 2, quadrant: 'lagging' },
  { locationName: 'Cairns',      brand: 'you', visibilityScore: 78, citationShare: 62, rank: 1, quadrant: 'leading' },
  // Bowen Dental
  { locationName: 'Townsville',  brand: 'Bowen Dental', visibilityScore: 55, citationShare: 44, rank: 2, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'Bowen Dental', visibilityScore: 82, citationShare: 68, rank: 1, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'Bowen Dental', visibilityScore: 47, citationShare: 36, rank: 2, quadrant: 'lagging' },
  { locationName: 'Innisfail',   brand: 'Bowen Dental', visibilityScore: 40, citationShare: 30, rank: 3, quadrant: 'lagging' },
  { locationName: 'Cairns',      brand: 'Bowen Dental', visibilityScore: 63, citationShare: 51, rank: 4, quadrant: 'leading' },
  // Deeragun Dental
  { locationName: 'Townsville',  brand: 'Deeragun Dental', visibilityScore: 38, citationShare: 29, rank: 3, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Deeragun Dental', visibilityScore: 52, citationShare: 38, rank: 4, quadrant: 'emerging' },
  { locationName: 'Mackay',      brand: 'Deeragun Dental', visibilityScore: 76, citationShare: 60, rank: 1, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Deeragun Dental', visibilityScore: 44, citationShare: 55, rank: 5, quadrant: 'underperforming' },
  { locationName: 'Cairns',      brand: 'Deeragun Dental', visibilityScore: 58, citationShare: 47, rank: 2, quadrant: 'leading' },
  // Innisfail Dentists
  { locationName: 'Townsville',  brand: 'Innisfail Dentists', visibilityScore: 29, citationShare: 22, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Innisfail Dentists', visibilityScore: 43, citationShare: 35, rank: 3, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Innisfail Dentists', visibilityScore: 33, citationShare: 48, rank: 5, quadrant: 'underperforming' },
  { locationName: 'Innisfail',   brand: 'Innisfail Dentists', visibilityScore: 88, citationShare: 71, rank: 1, quadrant: 'leading' },
  { locationName: 'Cairns',      brand: 'Innisfail Dentists', visibilityScore: 41, citationShare: 32, rank: 5, quadrant: 'lagging' },
  // Serenity Dental CQ
  { locationName: 'Townsville',  brand: 'Serenity Dental CQ', visibilityScore: 25, citationShare: 18, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Serenity Dental CQ', visibilityScore: 37, citationShare: 27, rank: 5, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Serenity Dental CQ', visibilityScore: 54, citationShare: 41, rank: 4, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Serenity Dental CQ', visibilityScore: 46, citationShare: 43, rank: 4, quadrant: 'underperforming' },
  { locationName: 'Cairns',      brand: 'Serenity Dental CQ', visibilityScore: 69, citationShare: 54, rank: 3, quadrant: 'leading' },
  // Absolutely Dental @ Kirwan Plaza
  { locationName: 'Townsville',  brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 66, citationShare: 50, rank: 2, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 31, citationShare: 24, rank: 4, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 57, citationShare: 44, rank: 3, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 49, citationShare: 37, rank: 3, quadrant: 'emerging' },
  { locationName: 'Cairns',      brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 74, citationShare: 59, rank: 2, quadrant: 'leading' },
]

const BY_LOCATION_TABLE_CHATGPT: ByLocationTableRow[] = [
  { location: 'Townsville', performance: 'leading',          rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Bowen Dental' },     rank3: { name: 'Deeragun Dental' },                        rank4: { name: 'Innisfail Dentists' },                     rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Bowen',      performance: 'underperforming',  rank1: { name: 'Bowen Dental' },                   rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Innisfail Dentists' },                     rank4: { name: 'Deeragun Dental' },                        rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Mackay',     performance: 'leading',          rank1: { name: 'Deeragun Dental' },                rank2: { name: 'Bowen Dental' },     rank3: { name: 'My Family Dental', isYou: true },          rank4: { name: 'Serenity Dental CQ' },                     rank5: { name: 'Innisfail Dentists' } },
  { location: 'Innisfail',  performance: 'lagging',          rank1: { name: 'Innisfail Dentists' },             rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Bowen Dental' },                           rank4: { name: 'Serenity Dental CQ' },                     rank5: { name: 'Deeragun Dental' } },
  { location: 'Cairns',     performance: 'leading',          rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Deeragun Dental' },  rank3: { name: 'Serenity Dental CQ' },                     rank4: { name: 'Bowen Dental' },                           rank5: { name: 'Innisfail Dentists' } },
]

const BY_LOCATION_DOTS_GEMINI: ByLocationDot[] = [
  { locationName: 'Townsville',  brand: 'you', visibilityScore: 55, citationShare: 62, rank: 2, quadrant: 'underperforming' },
  { locationName: 'Bowen',       brand: 'you', visibilityScore: 73, citationShare: 56, rank: 1, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'you', visibilityScore: 44, citationShare: 39, rank: 3, quadrant: 'lagging' },
  { locationName: 'Innisfail',   brand: 'you', visibilityScore: 60, citationShare: 48, rank: 3, quadrant: 'leading' },
  { locationName: 'Cairns',      brand: 'you', visibilityScore: 38, citationShare: 45, rank: 2, quadrant: 'underperforming' },
  { locationName: 'Townsville',  brand: 'Bowen Dental', visibilityScore: 49, citationShare: 40, rank: 3, quadrant: 'emerging' },
  { locationName: 'Bowen',       brand: 'Bowen Dental', visibilityScore: 68, citationShare: 53, rank: 2, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'Bowen Dental', visibilityScore: 30, citationShare: 24, rank: 5, quadrant: 'lagging' },
  { locationName: 'Innisfail',   brand: 'Bowen Dental', visibilityScore: 77, citationShare: 63, rank: 1, quadrant: 'leading' },
  { locationName: 'Cairns',      brand: 'Bowen Dental', visibilityScore: 52, citationShare: 43, rank: 4, quadrant: 'leading' },
  { locationName: 'Townsville',  brand: 'Deeragun Dental', visibilityScore: 81, citationShare: 65, rank: 1, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'Deeragun Dental', visibilityScore: 36, citationShare: 28, rank: 4, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Deeragun Dental', visibilityScore: 58, citationShare: 46, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Deeragun Dental', visibilityScore: 45, citationShare: 34, rank: 2, quadrant: 'lagging' },
  { locationName: 'Cairns',      brand: 'Deeragun Dental', visibilityScore: 29, citationShare: 21, rank: 5, quadrant: 'lagging' },
  { locationName: 'Townsville',  brand: 'Innisfail Dentists', visibilityScore: 42, citationShare: 33, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Innisfail Dentists', visibilityScore: 27, citationShare: 20, rank: 5, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Innisfail Dentists', visibilityScore: 84, citationShare: 67, rank: 1, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Innisfail Dentists', visibilityScore: 51, citationShare: 57, rank: 4, quadrant: 'underperforming' },
  { locationName: 'Cairns',      brand: 'Innisfail Dentists', visibilityScore: 65, citationShare: 52, rank: 1, quadrant: 'leading' },
  { locationName: 'Townsville',  brand: 'Serenity Dental CQ', visibilityScore: 33, citationShare: 48, rank: 5, quadrant: 'underperforming' },
  { locationName: 'Bowen',       brand: 'Serenity Dental CQ', visibilityScore: 57, citationShare: 43, rank: 3, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'Serenity Dental CQ', visibilityScore: 41, citationShare: 32, rank: 4, quadrant: 'lagging' },
  { locationName: 'Innisfail',   brand: 'Serenity Dental CQ', visibilityScore: 69, citationShare: 55, rank: 5, quadrant: 'leading' },
  { locationName: 'Cairns',      brand: 'Serenity Dental CQ', visibilityScore: 79, citationShare: 63, rank: 3, quadrant: 'leading' },
  { locationName: 'Townsville',  brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 62, citationShare: 49, rank: 2, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 46, citationShare: 38, rank: 3, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 71, citationShare: 57, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 35, citationShare: 27, rank: 3, quadrant: 'lagging' },
  { locationName: 'Cairns',      brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 54, citationShare: 44, rank: 2, quadrant: 'leading' },
]

const BY_LOCATION_TABLE_GEMINI: ByLocationTableRow[] = [
  { location: 'Townsville', performance: 'underperforming', rank1: { name: 'Deeragun Dental' },                rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Bowen Dental' },      rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Innisfail Dentists' } },
  { location: 'Bowen',      performance: 'leading',         rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Bowen Dental' },                   rank3: { name: 'Serenity Dental CQ' }, rank4: { name: 'Deeragun Dental' },    rank5: { name: 'Innisfail Dentists' } },
  { location: 'Mackay',     performance: 'lagging',         rank1: { name: 'Innisfail Dentists' },             rank2: { name: 'Deeragun Dental' },                rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Bowen Dental' } },
  { location: 'Innisfail',  performance: 'leading',         rank1: { name: 'Bowen Dental' },                   rank2: { name: 'Deeragun Dental' },                rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Innisfail Dentists' }, rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Cairns',     performance: 'underperforming', rank1: { name: 'Innisfail Dentists' },             rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Serenity Dental CQ' }, rank4: { name: 'Bowen Dental' },       rank5: { name: 'Deeragun Dental' } },
]

const BY_LOCATION_DOTS_PERPLEXITY: ByLocationDot[] = [
  { locationName: 'Townsville',  brand: 'you', visibilityScore: 80, citationShare: 64, rank: 1, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'you', visibilityScore: 42, citationShare: 33, rank: 3, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'you', visibilityScore: 57, citationShare: 46, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'you', visibilityScore: 76, citationShare: 60, rank: 1, quadrant: 'leading' },
  { locationName: 'Cairns',      brand: 'you', visibilityScore: 34, citationShare: 27, rank: 4, quadrant: 'lagging' },
  { locationName: 'Townsville',  brand: 'Bowen Dental', visibilityScore: 45, citationShare: 36, rank: 4, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Bowen Dental', visibilityScore: 75, citationShare: 60, rank: 1, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'Bowen Dental', visibilityScore: 31, citationShare: 23, rank: 5, quadrant: 'lagging' },
  { locationName: 'Innisfail',   brand: 'Bowen Dental', visibilityScore: 50, citationShare: 39, rank: 3, quadrant: 'emerging' },
  { locationName: 'Cairns',      brand: 'Bowen Dental', visibilityScore: 66, citationShare: 52, rank: 2, quadrant: 'leading' },
  { locationName: 'Townsville',  brand: 'Deeragun Dental', visibilityScore: 37, citationShare: 29, rank: 5, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Deeragun Dental', visibilityScore: 61, citationShare: 48, rank: 2, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'Deeragun Dental', visibilityScore: 79, citationShare: 63, rank: 1, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Deeragun Dental', visibilityScore: 44, citationShare: 54, rank: 4, quadrant: 'underperforming' },
  { locationName: 'Cairns',      brand: 'Deeragun Dental', visibilityScore: 28, citationShare: 21, rank: 5, quadrant: 'lagging' },
  { locationName: 'Townsville',  brand: 'Innisfail Dentists', visibilityScore: 58, citationShare: 45, rank: 2, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'Innisfail Dentists', visibilityScore: 27, citationShare: 20, rank: 5, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Innisfail Dentists', visibilityScore: 48, citationShare: 37, rank: 3, quadrant: 'lagging' },
  { locationName: 'Innisfail',   brand: 'Innisfail Dentists', visibilityScore: 33, citationShare: 43, rank: 5, quadrant: 'underperforming' },
  { locationName: 'Cairns',      brand: 'Innisfail Dentists', visibilityScore: 85, citationShare: 68, rank: 1, quadrant: 'leading' },
  { locationName: 'Townsville',  brand: 'Serenity Dental CQ', visibilityScore: 26, citationShare: 19, rank: 3, quadrant: 'lagging' },
  { locationName: 'Bowen',       brand: 'Serenity Dental CQ', visibilityScore: 53, citationShare: 41, rank: 4, quadrant: 'leading' },
  { locationName: 'Mackay',      brand: 'Serenity Dental CQ', visibilityScore: 67, citationShare: 53, rank: 4, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Serenity Dental CQ', visibilityScore: 40, citationShare: 31, rank: 2, quadrant: 'lagging' },
  { locationName: 'Cairns',      brand: 'Serenity Dental CQ', visibilityScore: 72, citationShare: 57, rank: 3, quadrant: 'leading' },
  { locationName: 'Townsville',  brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 69, citationShare: 55, rank: 1, quadrant: 'leading' },
  { locationName: 'Bowen',       brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 38, citationShare: 30, rank: 3, quadrant: 'lagging' },
  { locationName: 'Mackay',      brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 55, citationShare: 44, rank: 2, quadrant: 'leading' },
  { locationName: 'Innisfail',   brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 63, citationShare: 50, rank: 2, quadrant: 'leading' },
  { locationName: 'Cairns',      brand: 'Absolutely Dental @ Kirwan Plaza', visibilityScore: 47, citationShare: 38, rank: 3, quadrant: 'lagging' },
]

const BY_LOCATION_TABLE_PERPLEXITY: ByLocationTableRow[] = [
  { location: 'Townsville', performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Innisfail Dentists' }, rank3: { name: 'Deeragun Dental' },   rank4: { name: 'Bowen Dental' },       rank5: { name: 'Serenity Dental CQ' } },
  { location: 'Bowen',      performance: 'lagging',  rank1: { name: 'Bowen Dental' },                   rank2: { name: 'Deeragun Dental' },   rank3: { name: 'My Family Dental', isYou: true }, rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Innisfail Dentists' } },
  { location: 'Mackay',     performance: 'leading',  rank1: { name: 'Deeragun Dental' },                rank2: { name: 'My Family Dental', isYou: true }, rank3: { name: 'Innisfail Dentists' }, rank4: { name: 'Serenity Dental CQ' }, rank5: { name: 'Bowen Dental' } },
  { location: 'Innisfail',  performance: 'leading',  rank1: { name: 'My Family Dental', isYou: true }, rank2: { name: 'Bowen Dental' },      rank3: { name: 'Serenity Dental CQ' }, rank4: { name: 'Deeragun Dental' },    rank5: { name: 'Innisfail Dentists' } },
  { location: 'Cairns',     performance: 'lagging',  rank1: { name: 'Innisfail Dentists' },             rank2: { name: 'Bowen Dental' },      rank3: { name: 'Serenity Dental CQ' }, rank4: { name: 'My Family Dental', isYou: true }, rank5: { name: 'Deeragun Dental' } },
]

export const BY_LOCATION_DATA: Record<RankingPlatform, { dots: ByLocationDot[]; tableRows: ByLocationTableRow[] }> = {
  ChatGPT:    { dots: BY_LOCATION_DOTS_CHATGPT,    tableRows: BY_LOCATION_TABLE_CHATGPT },
  Gemini:     { dots: BY_LOCATION_DOTS_GEMINI,     tableRows: BY_LOCATION_TABLE_GEMINI },
  Perplexity: { dots: BY_LOCATION_DOTS_PERPLEXITY, tableRows: BY_LOCATION_TABLE_PERPLEXITY },
}
```

- [ ] **Step 3: Verify build**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: `✓ N modules transformed` with zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/competitorData.ts src/components/charts/chartColors.ts
git commit -m "feat: add by-location scatter data and dot color palette"
```

---

## Task 2: `ScatterplotCard` component

**Files:**
- Create: `src/components/ScatterplotCard/ScatterplotCard.types.ts`
- Create: `src/components/ScatterplotCard/ScatterplotCard.tsx`

**Interfaces:**
- Consumes:
  - `ByLocationDot` from `../../data/competitorData`
  - `chartColors.byLocation` from `../charts/chartColors`
  - `ChartCard` from `../charts/ChartCard`
- Produces: `ScatterplotCard` component, `ScatterplotCardProps`

- [ ] **Step 1: Create `ScatterplotCard.types.ts`**

```typescript
// src/components/ScatterplotCard/ScatterplotCard.types.ts
import type { ByLocationDot } from '../../data/competitorData'

export interface ScatterplotCardProps {
  /** All dots to render — filtered by caller for platform/geo */
  dots: ByLocationDot[]
  /** Ordered list of active competitor names (up to 5) */
  competitors: string[]
  /** Called when user clicks "View detailed comparison" in the tooltip */
  onViewComparison: (locationName: string) => void
  /** Called when user removes a competitor chip */
  onRemoveCompetitor: (brand: string) => void
}
```

- [ ] **Step 2: Create `ScatterplotCard.tsx`**

```typescript
// src/components/ScatterplotCard/ScatterplotCard.tsx
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts'
import { ChartCard } from '../charts/ChartCard'
import { chartColors } from '../charts/chartColors'
import { Icon } from '../Icon/Icon'
import type { ScatterplotCardProps } from './ScatterplotCard.types'
import type { ByLocationDot } from '../../data/competitorData'

// Quadrant midpoint — visibility 50, citation 40 (visual balance from Figma)
const VIS_MID = 50
const CIT_MID = 40

// Index 0 = you, 1–5 = competitors
const DOT_COLORS = chartColors.byLocation

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipPayload {
  payload: ByLocationDot
}

function ScatterTooltip({
  active,
  payload,
  onViewComparison,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  onViewComparison: (locationName: string) => void
}) {
  if (!active || !payload?.length) return null
  const dot = payload[0].payload
  return (
    <div className="rounded-md border border-border bg-surface p-md shadow-dropdown w-[220px]">
      <p className="text-body text-text-primary">{dot.locationName}</p>
      <p className="text-small text-text-secondary mt-xs">{dot.brand === 'you' ? 'My Family Dental' : dot.brand}</p>
      <div className="mt-sm flex flex-col gap-xs">
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Visibility score</span>
          <span className="text-text-primary">{dot.visibilityScore}%</span>
        </div>
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Citation share</span>
          <span className="text-text-primary">{dot.citationShare}%</span>
        </div>
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Rank</span>
          <span className="text-text-primary">#{dot.rank}</span>
        </div>
      </div>
      <button
        onClick={() => onViewComparison(dot.locationName)}
        className="mt-sm w-full text-left text-small text-text-action hover:underline"
      >
        View detailed comparison →
      </button>
    </div>
  )
}

// ── Competitor chips ──────────────────────────────────────────────────────────

function CompetitorChips({
  competitors,
  dotColors,
  onRemove,
}: {
  competitors: string[]
  dotColors: string[]
  onRemove: (brand: string) => void
}) {
  return (
    <div className="mb-lg flex flex-wrap items-center gap-sm">
      <span className="text-small text-text-secondary">Competitors</span>
      {/* You chip — not removable */}
      <span
        className="inline-flex items-center gap-xs rounded-full border border-border px-md py-xs text-small text-text-primary"
        style={{ borderLeftColor: dotColors[0], borderLeftWidth: 3 }}
      >
        <span
          className="size-[8px] rounded-full shrink-0"
          style={{ backgroundColor: dotColors[0] }}
        />
        You
      </span>
      {competitors.map((name, i) => (
        <span
          key={name}
          className="inline-flex items-center gap-xs rounded-full border border-border px-md py-xs text-small text-text-primary"
        >
          <span
            className="size-[8px] rounded-full shrink-0"
            style={{ backgroundColor: dotColors[i + 1] }}
          />
          {name}
          <button
            onClick={() => onRemove(name)}
            aria-label={`Remove ${name}`}
            className="ml-xs text-text-tertiary hover:text-text-primary"
          >
            <Icon name="close" size={12} />
          </button>
        </span>
      ))}
    </div>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────

function ScatterLegend({
  competitors,
  dotColors,
}: {
  competitors: string[]
  dotColors: string[]
}) {
  const allBrands = ['You', ...competitors]
  return (
    <div className="mt-lg flex flex-wrap gap-lg">
      {allBrands.map((name, i) => (
        <span key={name} className="inline-flex items-center gap-xs text-small text-text-secondary">
          <span
            className="size-[10px] rounded-full shrink-0"
            style={{ backgroundColor: dotColors[i] }}
          />
          {name}
        </span>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ScatterplotCard({
  dots,
  competitors,
  onViewComparison,
  onRemoveCompetitor,
}: ScatterplotCardProps) {
  // Split dots into per-brand series for Recharts
  const youDots = dots.filter((d) => d.brand === 'you')
  const competitorSeries = competitors.map((name) =>
    dots.filter((d) => d.brand === name)
  )

  // Map ByLocationDot to Recharts-friendly { x, y } shape
  const toPoint = (d: ByLocationDot) => ({
    x: d.visibilityScore,
    y: d.citationShare,
    ...d,
  })

  return (
    <ChartCard
      title="How are your locations ranking compared to their competitors"
      subtitle="Shows how often your location citation share and visibility score are impacting your overall rank against your competitors"
      showActions
    >
      <CompetitorChips
        competitors={competitors}
        dotColors={DOT_COLORS}
        onRemove={onRemoveCompetitor}
      />

      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
          {/* Quadrant backgrounds */}
          <ReferenceArea x1={0}       x2={VIS_MID} y1={CIT_MID} y2={100} fill="#fff8e1" fillOpacity={0.6} />
          <ReferenceArea x1={VIS_MID} x2={100}     y1={CIT_MID} y2={100} fill="#e8f5e9" fillOpacity={0.6} />
          <ReferenceArea x1={0}       x2={VIS_MID} y1={0}       y2={CIT_MID} fill="#ffebee" fillOpacity={0.6} />
          <ReferenceArea x1={VIS_MID} x2={100}     y1={0}       y2={CIT_MID} fill="#f5f5f5" fillOpacity={0.6} />

          {/* Quadrant labels via reference areas (label prop) */}
          <ReferenceArea x1={2}  x2={VIS_MID - 2} y1={CIT_MID + 2} y2={100} fill="transparent" label={{ value: 'Underperforming', position: 'insideTopLeft', fontSize: 11, fill: '#f59e0b' }} />
          <ReferenceArea x1={VIS_MID + 2} x2={98} y1={CIT_MID + 2} y2={100} fill="transparent" label={{ value: 'Leading',          position: 'insideTopRight', fontSize: 11, fill: '#4cae3d' }} />
          <ReferenceArea x1={2}  x2={VIS_MID - 2} y1={0}           y2={CIT_MID - 2} fill="transparent" label={{ value: 'Lagging',    position: 'insideBottomLeft', fontSize: 11, fill: '#de1b0c' }} />
          <ReferenceArea x1={VIS_MID + 2} x2={98} y1={0}           y2={CIT_MID - 2} fill="transparent" label={{ value: 'Emerging',   position: 'insideBottomRight', fontSize: 11, fill: '#8f8f8f' }} />

          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: chartColors.axis }}
            label={{ value: 'Visibility score', position: 'insideBottom', offset: -4, fontSize: 12, fill: chartColors.axis }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: chartColors.axis }}
            label={{ value: 'Citation share', angle: -90, position: 'insideLeft', offset: 12, fontSize: 12, fill: chartColors.axis }}
          />
          <Tooltip
            content={<ScatterTooltip onViewComparison={onViewComparison} />}
            cursor={{ strokeDasharray: '3 3' }}
          />

          {/* You series */}
          <Scatter
            name="You"
            data={youDots.map(toPoint)}
            fill={DOT_COLORS[0]}
            opacity={0.85}
            r={5}
          />

          {/* Competitor series */}
          {competitorSeries.map((series, i) => (
            <Scatter
              key={competitors[i]}
              name={competitors[i]}
              data={series.map(toPoint)}
              fill={DOT_COLORS[i + 1]}
              opacity={0.85}
              r={5}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      <ScatterLegend competitors={competitors} dotColors={DOT_COLORS} />
    </ChartCard>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ScatterplotCard/
git commit -m "feat: add ScatterplotCard with quadrant scatter and rich tooltip"
```

---

## Task 3: `ByLocationTable` component

**Files:**
- Create: `src/components/ByLocationTable/ByLocationTable.types.ts`
- Create: `src/components/ByLocationTable/ByLocationTable.tsx`

**Interfaces:**
- Consumes: `ByLocationTableRow`, `RankingCompetitor`, `Quadrant` from `../../data/competitorData`
- Produces: `ByLocationTable` component, `ByLocationTableProps`

- [ ] **Step 1: Create `ByLocationTable.types.ts`**

```typescript
// src/components/ByLocationTable/ByLocationTable.types.ts
import type { ByLocationTableRow } from '../../data/competitorData'

export interface ByLocationTableProps {
  rows: ByLocationTableRow[]
}
```

- [ ] **Step 2: Create `ByLocationTable.tsx`**

```typescript
// src/components/ByLocationTable/ByLocationTable.tsx
import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import { CardHeader } from '../CardHeader/CardHeader'
import type { ByLocationTableProps } from './ByLocationTable.types'
import type { ByLocationTableRow, Quadrant, RankingCompetitor } from '../../data/competitorData'

// ── Performance chip ──────────────────────────────────────────────────────────

const PERFORMANCE_STYLES: Record<Quadrant, string> = {
  leading:          'text-chip-success-text',
  lagging:          'text-chip-danger-text',
  emerging:         'text-text-tertiary',
  underperforming:  'text-chip-warning-text',
}

const PERFORMANCE_LABELS: Record<Quadrant, string> = {
  leading:         'Leading',
  lagging:         'Lagging',
  emerging:        'Emerging',
  underperforming: 'Underperforming',
}

function PerformanceChip({ value }: { value: Quadrant }) {
  return (
    <span className={`text-small ${PERFORMANCE_STYLES[value]}`}>
      {PERFORMANCE_LABELS[value]}
    </span>
  )
}

// ── Competitor name chip (same pattern as VisibilityRankingCard) ──────────────

function RankChip({ competitor }: { competitor: RankingCompetitor }) {
  if (competitor.isYou) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#0f7195] px-[8px] py-[3px] text-[12px] leading-[16px] text-white whitespace-nowrap">
        {competitor.name}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-sm bg-[#eaeaea] px-[8px] py-[3px] text-[12px] leading-[16px] text-[#555] whitespace-nowrap">
      {competitor.name}
    </span>
  )
}

// ── Sort helpers ──────────────────────────────────────────────────────────────

type SortKey = 'location' | 'performance'
type SortDir = 'asc' | 'desc'

const PERFORMANCE_ORDER: Record<Quadrant, number> = {
  leading: 0, underperforming: 1, emerging: 2, lagging: 3,
}

function sortRows(rows: ByLocationTableRow[], key: SortKey, dir: SortDir) {
  return [...rows].sort((a, b) => {
    let cmp = 0
    if (key === 'location') {
      cmp = a.location.localeCompare(b.location)
    } else {
      cmp = PERFORMANCE_ORDER[a.performance] - PERFORMANCE_ORDER[b.performance]
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ByLocationTable({ rows }: ByLocationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('location')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = sortRows(rows, sortKey, sortDir)

  const toolbar = (
    <>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="search" size={20} />
      </button>
      <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
        <Icon name="download" size={20} />
      </button>
    </>
  )

  return (
    <div className="flex flex-col bg-surface rounded-md shadow-[0px_2px_12px_1px_rgba(33,33,33,0.06)] overflow-hidden">
      <div className="px-xl py-lg">
        <CardHeader
          title={
            <span className="text-[18px] leading-[26px] text-text-secondary">
              How are you ranking vs competitors for visibility score
            </span>
          }
          subtitle="Discover locations where your visibility has the highest impact across AI platforms"
          toolbar={toolbar}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-surface-l1 z-10 border-b border-border">
            <tr>
              {/* Locations — sortable */}
              <th className="px-xl py-sm w-[200px]">
                <button
                  onClick={() => handleSort('location')}
                  className="inline-flex items-center gap-xs text-small text-text-secondary hover:text-text-primary"
                >
                  Locations
                  <Icon
                    name={sortKey === 'location' && sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                    size={14}
                    className={sortKey === 'location' ? 'text-text-primary' : 'text-text-tertiary'}
                  />
                </button>
              </th>
              {/* Performance — sortable */}
              <th className="px-xl py-sm w-[160px]">
                <button
                  onClick={() => handleSort('performance')}
                  className="inline-flex items-center gap-xs text-small text-text-secondary hover:text-text-primary"
                >
                  Performance
                  <Icon
                    name={sortKey === 'performance' && sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                    size={14}
                    className={sortKey === 'performance' ? 'text-text-primary' : 'text-text-tertiary'}
                  />
                </button>
              </th>
              {[1, 2, 3, 4, 5].map((n) => (
                <th key={n} className="px-xl py-sm text-small text-text-secondary w-[180px]">
                  Rank {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.location} className="border-b border-border hover:bg-surface-hover">
                <td className="px-xl py-[14px] text-body text-text-primary">{row.location}</td>
                <td className="px-xl py-[14px]"><PerformanceChip value={row.performance} /></td>
                <td className="px-xl py-[14px]"><RankChip competitor={row.rank1} /></td>
                <td className="px-xl py-[14px]"><RankChip competitor={row.rank2} /></td>
                <td className="px-xl py-[14px]"><RankChip competitor={row.rank3} /></td>
                <td className="px-xl py-[14px]"><RankChip competitor={row.rank4} /></td>
                <td className="px-xl py-[14px]"><RankChip competitor={row.rank5} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ByLocationTable/
git commit -m "feat: add ByLocationTable with Performance column and sortable headers"
```

---

## Task 4: Barrel-export new components

**Files:**
- Modify: `src/components/index.ts`

**Interfaces:**
- Consumes: `ScatterplotCard`, `ByLocationTable` (just created)
- Produces: both available via `import { ... } from '../components'`

- [ ] **Step 1: Add exports to `src/components/index.ts`**

Open `src/components/index.ts` and append these two lines at the end:

```typescript
export { ScatterplotCard } from './ScatterplotCard/ScatterplotCard'
export { ByLocationTable } from './ByLocationTable/ByLocationTable'
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/index.ts
git commit -m "chore: export ScatterplotCard and ByLocationTable from component index"
```

---

## Task 5: `CompetitorByLocationScreen` — compose the full page

**Files:**
- Create: `src/screens/CompetitorByLocationScreen.tsx`

**Interfaces:**
- Consumes:
  - `ScatterplotCard` from `../components`
  - `ByLocationTable` from `../components`
  - `FilterPanel` from `../components/FilterPanel/FilterPanel`
  - `CardTabs` from `../components/CardTabs/CardTabs`
  - `Icon` from `../components`
  - `BY_LOCATION_DATA`, `BY_LOCATION_COMPETITORS`, `RANKING_PLATFORMS`, `RankingPlatform`, `ByLocationDot`, `ByLocationTableRow` from `../data/competitorData`

- [ ] **Step 1: Create `CompetitorByLocationScreen.tsx`**

```typescript
// src/screens/CompetitorByLocationScreen.tsx
import { useState, useMemo } from 'react'
import { ScatterplotCard, ByLocationTable } from '../components'
import { FilterPanel } from '../components/FilterPanel/FilterPanel'
import { CardTabs } from '../components/CardTabs/CardTabs'
import { Icon } from '../components/Icon/Icon'
import {
  BY_LOCATION_DATA,
  BY_LOCATION_COMPETITORS,
  RANKING_PLATFORMS,
  type RankingPlatform,
  type ByLocationDot,
  type ByLocationTableRow,
} from '../data/competitorData'

// All unique locations across all platforms (for filter options)
const ALL_LOCATIONS = Array.from(
  new Set(
    RANKING_PLATFORMS.flatMap((p) =>
      BY_LOCATION_DATA[p].tableRows.map((r) => r.location)
    )
  )
).sort()

const PLATFORM_TABS = RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))

const FILTER_FIELDS = [
  {
    id: 'location',
    label: 'Location',
    options: ALL_LOCATIONS.map((l) => ({ value: l, label: l })),
    multi: true,
  },
]

export function CompetitorByLocationScreen({
  onViewComparison,
}: {
  onViewComparison?: (locationName: string) => void
}) {
  const [platform, setPlatform] = useState<RankingPlatform>('ChatGPT')
  const [competitors, setCompetitors] = useState<string[]>([...BY_LOCATION_COMPETITORS])
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const { dots: allDots, tableRows: allTableRows } = BY_LOCATION_DATA[platform]

  // Apply geo filter
  const filteredDots: ByLocationDot[] = useMemo(() => {
    if (!selectedLocations.length) return allDots
    return allDots.filter((d) => selectedLocations.includes(d.locationName))
  }, [allDots, selectedLocations])

  const filteredTableRows: ByLocationTableRow[] = useMemo(() => {
    if (!selectedLocations.length) return allTableRows
    return allTableRows.filter((r) => selectedLocations.includes(r.location))
  }, [allTableRows, selectedLocations])

  // Only show dots for active competitors (+ you)
  const visibleDots = filteredDots.filter(
    (d) => d.brand === 'you' || competitors.includes(d.brand)
  )

  function handleRemoveCompetitor(brand: string) {
    setCompetitors((prev) => prev.filter((c) => c !== brand))
  }

  function handleFilterSave(values: Record<string, string[]>) {
    setSelectedLocations(values['location'] ?? [])
  }

  return (
    <div className="relative flex flex-col bg-[#f5f5f5] h-full w-full overflow-y-auto">
      {/* Sticky header: title + filter icon + platform tabs */}
      <div className="sticky top-0 z-20 bg-[#f5f5f5]">
        {/* Title row */}
        <div className="flex h-16 shrink-0 items-center gap-sm px-2xl border-b border-border bg-surface">
          <span className="flex-1 text-h3 text-text-primary">
            Competitor benchmarking by locations
          </span>
          <Icon name="info" size={20} className="text-text-icon" />
          <div className="flex items-center gap-sm ml-lg">
            <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover">
              <Icon name="more_vert" size={20} />
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-hover"
            >
              <Icon name="filter_list" size={20} />
            </button>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="px-2xl bg-surface border-b border-border">
          <CardTabs
            tabs={PLATFORM_TABS}
            activeTab={platform}
            onChange={(id) => setPlatform(id as RankingPlatform)}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col gap-xl px-2xl py-xl">
        <ScatterplotCard
          dots={visibleDots}
          competitors={competitors}
          onViewComparison={(loc) => onViewComparison?.(loc)}
          onRemoveCompetitor={handleRemoveCompetitor}
        />
        <ByLocationTable rows={filteredTableRows} />
      </div>

      {/* Filter panel */}
      <FilterPanel
        open={filterOpen}
        fields={FILTER_FIELDS}
        onClose={() => setFilterOpen(false)}
        onSaveView={handleFilterSave}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/CompetitorByLocationScreen.tsx
git commit -m "feat: add CompetitorByLocationScreen with sticky header, scatter, table, and filter"
```

---

## Task 6: Wire into `SearchAIScreen`

**Files:**
- Modify: `src/screens/SearchAIScreen.tsx`

**Interfaces:**
- Consumes: `CompetitorByLocationScreen` (just created), `CompetitorDetailScreen` (existing)

- [ ] **Step 1: Import and wire**

In `src/screens/SearchAIScreen.tsx`, add the import near the top (after existing screen imports):

```typescript
import { CompetitorByLocationScreen } from './CompetitorByLocationScreen'
```

Then replace the `by-location` placeholder branch. The current code at ~line 186:

```typescript
{navActive === 'by-brand' ? (
  <CompetitorBenchmarkScreen onCompetitorClick={setCompetitorDetail} />
) : (
  <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
    {LABEL_MAP[navActive] ?? navActive}
  </div>
)}
```

Change to:

```typescript
{navActive === 'by-brand' ? (
  <CompetitorBenchmarkScreen onCompetitorClick={setCompetitorDetail} />
) : navActive === 'by-location' ? (
  <CompetitorByLocationScreen onViewComparison={(loc) => console.log('view comparison for', loc)} />
) : (
  <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
    {LABEL_MAP[navActive] ?? navActive}
  </div>
)}
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/SearchAIScreen.tsx
git commit -m "feat: wire by-location nav to CompetitorByLocationScreen"
```

---

## Task 7: Update CLAUDE.md component registry

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add two rows to the Component Registry table in §5**

Find the last row of the table in `CLAUDE.md` §5 and append:

```markdown
| ScatterplotCard | components/ScatterplotCard/ScatterplotCard.tsx | dots: ByLocationDot[], competitors: string[], onViewComparison(locationName), onRemoveCompetitor(brand) — Recharts scatter with quadrant backgrounds, competitor chips, rich hover tooltip with CTA |
| ByLocationTable | components/ByLocationTable/ByLocationTable.tsx | rows: ByLocationTableRow[] — sortable table with Performance chip (Leading/Lagging/Emerging/Underperforming) and Rank 1–5 competitor chips |
```

- [ ] **Step 2: Final build check**

```bash
cd "/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master"
npm run build
```

Expected: zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: register ScatterplotCard and ByLocationTable in component registry"
```

---

## Verification Checklist

After all tasks complete, run `npm run dev` and verify:

- [ ] Navigate to Competitors → By location — page renders without errors
- [ ] Scatterplot shows 6 colored dot series (dark blue = you, pink/purple/yellow/aqua/orange = competitors)
- [ ] Quadrant background tints visible (yellow top-left, green top-right, red bottom-left, grey bottom-right)
- [ ] Hover a dot → rich tooltip shows location, brand, visibility score, citation share, rank, and "View detailed comparison →" CTA
- [ ] Removing a competitor chip hides that brand's dots from the chart
- [ ] Switch platform tab (ChatGPT → Perplexity → Gemini) → both chart and table update
- [ ] Open filter icon → FilterPanel opens with Location options
- [ ] Select a location → chart shows only that location's dots, table shows only that location's row
- [ ] Scroll past the scatterplot → title bar + platform tabs remain sticky at top
- [ ] Sort table by Locations column → rows sort A–Z / Z–A
- [ ] Sort table by Performance column → rows group by quadrant
- [ ] `npm run build` passes with zero TypeScript errors
