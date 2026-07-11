# Themes and Prompts settings page

## Context

The Settings entry currently labeled "Prompts" is being renamed to "Themes and Prompts". The page lets a user see all the themes seeded for their account (each theme groups several related search prompts), and manage tracking on a per-prompt basis: which locations a prompt is scoped to, which AI engines it should be tracked on, and whether/when it is being tracked. Reports are generated once per monthly cycle, so a prompt whose tracking is turned on mid-cycle can't retroactively appear in already-generated reports — it needs a distinct status so users understand it will start showing up next cycle, not immediately.

Real theme/prompt data already exists in `src/data/themesData.ts` (`ThemeConfig` / `ThemePrompt`), which will be extended (not replaced) to support this page.

## Data model

Extend `src/data/themesData.ts`:

```ts
export interface ThemePrompt {
  text: string
  monthlySearch: number
  aiSites: string[]           // existing
  status: 'Tracking' | 'Not tracking' | 'Starts next cycle'   // was string; narrow the type
  updatedOn: string           // existing
  locationCount: number       // NEW — locations this specific prompt is scoped to
}

export interface ThemeConfig {
  name: string
  aggregateMonthlySearch: number
  locationCount: number        // existing — theme-level location scope
  prompts: ThemePrompt[]
}
```

No new file needed; this is an additive change to the existing interfaces plus one new field per prompt.

## Table structure

The existing `DataTable` (`src/components/DataTable/DataTable.tsx`) has no built-in row-grouping/expand concept — `data` is a flat `T[]`. Rather than add a "seed.txt" style ad-hoc component, follow the same pattern already established by `CompetitorRankingCard` (registered in CLAUDE.md §5) for its collapsible theme/prompt table:

- Maintain `expandedThemeNames: Set<string>` state in the new `ThemesAndPromptsScreen` (or a dedicated `ThemesPromptsTable` component if the screen file would exceed ~40 lines of table logic — see CLAUDE.md §6.1).
- Flatten `THEMES` into one array of `FlatThemeRow` (`_isHeader: boolean`, `_themeName` for children) before passing to `DataTable`, exactly as `CompetitorRankingCard.tsx:342-373` flattens rankings.
- Theme (header) rows: chevron toggle in the first column (click row to expand/collapse), theme name + "N prompts" subcount, aggregate monthly searches, theme location count, union of AI sites across its prompts, latest `updatedOn` among its prompts. **No tracking-status pill on header rows** — status only applies to individual prompts.
- Prompt (child) rows: indented prompt text (`pl-[24px]`, matches `CompetitorRankingCard` prompt-column pattern), that prompt's own `monthlySearch`, `locationCount`, `aiSites`, `updatedOn`, and its tracking-status pill.

## Columns (left to right)

1. **Themes / Prompts** — theme name + prompt count (header rows), indented prompt text (child rows)
2. **Monthly searches** — sortable, numeric
3. **Locations** — location count; clicking opens the existing location-scoping UI (reuse whatever location-picker pattern `FilterPanel`/`SelectMenu` already provides — to be confirmed at implementation time, not a new component)
4. **AI sites** — small icon cluster (ChatGPT/Gemini/Perplexity/Copilot/Claude) showing which engines this prompt/theme is tracked on
5. **Updated on** — last-edited date, with an info icon tooltip ("Shows date when the last changes were made to the prompt"), matching the reference HTML's `pt-col-info` tooltip behavior
6. **Tracking status** — prompt rows only; one of three pills:
   - 🟢 **Tracking** — actively tracked, included in report generation
   - ⚪ **Not tracking** — added but tracking not started, or previously tracked and stopped
   - 🟡 **Starts next cycle** — tracking was turned on mid-cycle; already-generated reports this cycle won't include it, but it will be included starting next monthly cycle

## Row interactions

- **Row hover, prompt rows only** (via `DataTable`'s `rowActions`/`rowMenuItems` props, `DataTable.types.ts:38-57`):
  - Edit icon button — opens the edit UI for that theme/prompt (location scope, AI sites, tracking toggle)
  - 3-dot menu:
    - If status = **Not tracking** → menu item "Start tracking"
    - If status = **Tracking** → menu item "Stop tracking"
    - If status = **Starts next cycle** → menu item "Stop tracking" (cancels the pending start, reverts to Not tracking) — always paired with **Delete**
- **Theme (header) rows**: clicking anywhere on the row toggles expand/collapse (no edit/3-dot actions at the theme level — matches the reference HTML's "Add prompt" button living in the last column of the theme row instead; keep that "Add prompt" CTA on theme rows)
- Header rows keep the reference HTML's **"Add prompt"** button in the last column, opening an add-prompt panel scoped to that theme.

## Status transition rules

- New prompt added → **Not tracking**
- User clicks "Start tracking":
  - If done at the start of/anytime during a cycle before that cycle's reports have already run for this prompt → **Starts next cycle** (since it wasn't part of this cycle's generation), OR if the account-level cycle hasn't generated any report yet at all → could go straight to **Tracking**. Exact cutoff logic (e.g. "before day X of the cycle" vs "any time this cycle") is a backend/business-logic detail to confirm with the team generating reports — the UI only needs to render whichever of the three statuses the data provides.
- User clicks "Stop tracking" (from Tracking) → **Not tracking**
- User clicks "Stop tracking" (from Starts next cycle) → **Not tracking** (cancels the pending start)

## Out of scope / assumptions

- The exact cycle-cutoff business rule (which day of the month flips a "Start tracking" click from immediate-Tracking to Starts-next-cycle) is a backend concern; this spec only defines the three UI states and their pill/menu treatment.
- Location-picker and AI-site-picker UI reuse existing components; no new picker component is being designed here.
- Real seed data already exists in `src/data/themesData.ts` — only the new `locationCount` per-prompt field and status narrowing are additive changes needed.
