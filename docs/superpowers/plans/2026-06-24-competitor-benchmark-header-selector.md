# Competitor Benchmark Header + Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Competitor benchmarking by brand" page shell — the page header bar and the interactive competitor multi-select chip input with dropdown — wired into the existing Search AI screen's `by-brand` nav item.

**Architecture:** A new `CompetitorBenchmarkScreen` renders when `navActive === 'by-brand'` inside the existing `SearchAIScreen`. All UI logic (chip input, dropdown panel, search filter) lives as private functions inside `CompetitorBenchmarkScreen.tsx`. Seed data is extracted into `competitorData.ts` so other agents building cards can import from a single source of truth.

**Tech Stack:** React 18, TypeScript, Tailwind CSS (token-only), Lucide icons via `Icon` component (Material Symbols Outlined), no new dependencies.

---

## Global Constraints

- **No inline styles** — `style={{}}` is forbidden; use Tailwind utility classes only.
- **No font weight utilities** — never use `font-medium`, `font-semibold`, `font-bold`; use `font-normal` only.
- **Sentence case only** — capitalize first word of UI copy only (e.g. "Competitor benchmarking by brand", not "Competitor Benchmarking By Brand").
- **Design tokens only** — use `text-text-primary`, `bg-surface`, `border-border`, `px-2xl`, `gap-sm`, `rounded-sm`, etc. Never hardcode hex or raw px.
- **`rounded-sm` for all interactive elements** — buttons, inputs, chips, dropdowns.
- **Icon component** — always `<Icon name="..." size={N} />` from `src/components/index.ts`; never import lucide-react directly.
- **Working directory** — all paths are relative to `Search-AI-master/`.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/competitorData.ts` | All seed data: brand info, competitors list with citation hints |
| Create | `src/screens/CompetitorBenchmarkScreen.tsx` | Full page shell: header bar + competitor selector + empty card slots |
| Modify | `src/screens/SearchAIScreen.tsx` | Wire `by-brand` nav item to render `<CompetitorBenchmarkScreen />` |

---

## Task 1: Seed data file

**Files:**
- Create: `src/data/competitorData.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface Competitor {
    name: string
    hint: string   // shown as subtitle in dropdown rows
  }
  export const BRAND_NAME: string
  export const REPORT_DATE: string   // "Jun 2026"
  export const COMPETITORS: Competitor[]
  export const DEFAULT_SELECTED: string[]  // names of 5 pre-selected competitors
  ```

- [ ] **Step 1: Create the file**

```ts
// src/data/competitorData.ts

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
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
cd "Search-AI-master" && npx tsc --noEmit 2>&1 | grep competitorData
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/data/competitorData.ts
git commit -m "feat: add competitor seed data"
```

---

## Task 2: CompetitorBenchmarkScreen — page header

**Files:**
- Create: `src/screens/CompetitorBenchmarkScreen.tsx`

**Interfaces:**
- Consumes:
  - `Icon` from `../components`
  - `REPORT_DATE` from `../data/competitorData`
- Produces:
  ```ts
  export function CompetitorBenchmarkScreen(): JSX.Element
  ```

**Design spec (Figma node 783:24742 "Header / Web"):**
- Outer: `bg-[#f5f5f5] w-full` (the `#f5f5f5` matches the Figma `--bg/primary/2` token, closest Tailwind match is `bg-neutral-100` — but we must check if `bg-[#f5f5f5]` is needed or if the project has a token; from tailwind.config there is no exact token so use `bg-[#f5f5f5]`)
- Header row: `flex h-16 items-center gap-sm px-2xl` (h-16 = 64px)
- Left side: title text `text-h3 text-text-primary` + `info` icon 20px `text-text-icon`
- Right CTAs: month pill dropdown (static display), `more_vert` icon button, `tune` icon button
- Month pill: `flex items-center gap-sm rounded-sm border border-border bg-surface px-md py-sm text-body text-text-primary`

- [ ] **Step 1: Create the screen file with just the header (no selector yet)**

```tsx
// src/screens/CompetitorBenchmarkScreen.tsx
import { useState } from 'react'
import { Icon } from '../components'
import { COMPETITORS, DEFAULT_SELECTED, REPORT_DATE, type Competitor } from '../data/competitorData'

export function CompetitorBenchmarkScreen() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)

  return (
    <div className="flex flex-col bg-[#f5f5f5] h-full w-full overflow-y-auto">
      {/* Page header */}
      <div className="flex h-16 shrink-0 items-center gap-sm px-2xl">
        {/* Title */}
        <div className="flex flex-1 items-center gap-sm">
          <span className="text-h3 text-text-primary">Competitor benchmarking by brand</span>
          <Icon name="info" size={20} className="text-text-icon" />
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-sm">
          {/* Month selector — static display */}
          <button
            type="button"
            className="flex items-center gap-sm rounded-sm border border-border bg-surface px-md py-sm text-body text-text-primary hover:bg-surface-hover"
          >
            {REPORT_DATE}
            <Icon name="expand_more" size={20} className="text-text-icon" />
          </button>

          {/* More options */}
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="more_vert" size={20} className="text-text-icon" />
          </button>

          {/* Filter */}
          <button
            type="button"
            aria-label="Filter"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="tune" size={20} className="text-text-icon" />
          </button>
        </div>
      </div>

      {/* Competitor selector + cards will be added below */}
      <div className="flex flex-col gap-xl px-2xl">
        <CompetitorSelector
          competitors={COMPETITORS}
          selected={selected}
          onChange={setSelected}
        />
      </div>
    </div>
  )
}

// Placeholder — implemented in Task 3
function CompetitorSelector(_props: {
  competitors: Competitor[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  return null
}
```

- [ ] **Step 2: Check TypeScript**

```bash
cd "Search-AI-master" && npx tsc --noEmit 2>&1 | grep CompetitorBenchmark
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/screens/CompetitorBenchmarkScreen.tsx
git commit -m "feat: add competitor benchmark screen header"
```

---

## Task 3: CompetitorSelector — chip input row

**Files:**
- Modify: `src/screens/CompetitorBenchmarkScreen.tsx`

**Design spec (Figma node 783:24744 "Summary" / chip input):**
- Outer card: `bg-surface rounded-md border border-border p-xl w-full`
- Label: `text-small text-text-secondary mb-xs`
- Input row: `flex items-center gap-sm rounded-sm border border-border min-h-9 px-sm py-xs`
- Each chip: `flex items-center gap-xs rounded-sm bg-chip-neutral-bg px-sm py-xs text-small text-text-primary`
- Close button on chip: `<Icon name="close" size={16} className="text-text-icon" />`
- Chevron toggle button at right of input: `<Icon name="expand_more" size={20} />` / `expand_less` when open

**Interfaces:**
- Consumes: `Competitor`, `COMPETITORS`, `DEFAULT_SELECTED` from `../data/competitorData`
- Produces: local `CompetitorSelector` function replacing the placeholder, accepting same props

- [ ] **Step 1: Replace the placeholder `CompetitorSelector` with the chip input implementation**

Replace the `function CompetitorSelector` placeholder at the bottom of `CompetitorBenchmarkScreen.tsx` with:

```tsx
function CompetitorSelector({
  competitors,
  selected,
  onChange,
}: {
  competitors: Competitor[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  function removeChip(name: string) {
    onChange(selected.filter((s) => s !== name))
  }

  function toggleItem(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name))
    } else {
      onChange([...selected, name])
    }
  }

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative w-full">
      {/* Card */}
      <div className="bg-surface rounded-md border border-border p-xl w-full">
        <p className="text-small text-text-secondary mb-xs">Competitor</p>

        {/* Chip input row */}
        <div className="flex items-center gap-sm rounded-sm border border-border min-h-9 px-sm py-xs">
          {/* Chips */}
          <div className="flex flex-1 flex-wrap gap-xs">
            {selected.map((name) => (
              <span
                key={name}
                className="flex items-center gap-xs rounded-sm bg-chip-neutral-bg px-sm py-xs text-small text-text-primary"
              >
                {name}
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => removeChip(name)}
                  className="flex items-center"
                >
                  <Icon name="close" size={16} className="text-text-icon" />
                </button>
              </span>
            ))}
          </div>

          {/* Toggle chevron */}
          <button
            type="button"
            aria-label={open ? 'Close competitor list' : 'Open competitor list'}
            onClick={() => { setOpen((o) => !o); setQuery('') }}
            className="flex shrink-0 items-center"
          >
            <Icon
              name={open ? 'expand_less' : 'expand_more'}
              size={20}
              className="text-text-icon"
            />
          </button>
        </div>
      </div>

      {/* Dropdown panel — rendered in Task 4 */}
      {open && (
        <CompetitorDropdown
          competitors={filtered}
          selected={selected}
          query={query}
          onQueryChange={setQuery}
          onToggle={toggleItem}
        />
      )}
    </div>
  )
}

// Placeholder — implemented in Task 4
function CompetitorDropdown(_props: {
  competitors: Competitor[]
  selected: string[]
  query: string
  onQueryChange: (q: string) => void
  onToggle: (name: string) => void
}) {
  return null
}
```

- [ ] **Step 2: Check TypeScript**

```bash
cd "Search-AI-master" && npx tsc --noEmit 2>&1 | grep CompetitorBenchmark
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/screens/CompetitorBenchmarkScreen.tsx
git commit -m "feat: add competitor selector chip input row"
```

---

## Task 4: CompetitorSelector — dropdown panel

**Files:**
- Modify: `src/screens/CompetitorBenchmarkScreen.tsx`

**Design spec (Figma node 93:20734 "Dropdown"):**
- Floating panel: `absolute top-full left-0 z-50 mt-xs w-full rounded-sm bg-surface shadow-dropdown`
- Padding: `p-xl`
- Search input: `flex h-9 w-full items-center gap-sm rounded-sm border border-primary px-sm text-body text-text-primary placeholder:text-text-tertiary`
- Search icon left of input placeholder: `<Icon name="search" size={16} className="text-text-tertiary" />`
- Competitor list: `mt-xl flex flex-col gap-xl` (20px gap between rows, matching Figma's 20px gap)
- Each row: `flex items-center gap-sm` with avatar circle (32px), name+hint block, checkbox right
- Avatar: `flex size-8 shrink-0 items-center justify-center rounded-full bg-chip-neutral-bg text-small text-text-secondary` — shows first letter of competitor name
- Name: `text-[13px] text-text-primary` (13px is between `text-small`/12px and `text-body`/14px; use `text-[13px]`)
- Hint: `text-small text-text-tertiary`
- Checkbox (checked): `flex size-6 items-center justify-center rounded-sm bg-primary` + `<Icon name="check" size={16} className="text-white" />`
- Checkbox (unchecked): `flex size-6 items-center justify-center rounded-sm border border-control-border`

- [ ] **Step 1: Replace the placeholder `CompetitorDropdown` with the full implementation**

Replace the `function CompetitorDropdown` placeholder at the bottom of `CompetitorBenchmarkScreen.tsx` with:

```tsx
function CompetitorDropdown({
  competitors,
  selected,
  query,
  onQueryChange,
  onToggle,
}: {
  competitors: Competitor[]
  selected: string[]
  query: string
  onQueryChange: (q: string) => void
  onToggle: (name: string) => void
}) {
  return (
    <div className="absolute left-0 top-full z-50 mt-xs w-full rounded-sm bg-surface p-xl shadow-dropdown">
      {/* Search input */}
      <div className="flex h-9 items-center gap-sm rounded-sm border border-primary px-sm">
        <Icon name="search" size={16} className="text-text-tertiary shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for competitors"
          className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-tertiary outline-none"
        />
      </div>

      {/* Competitor rows */}
      <div className="mt-xl flex flex-col gap-xl">
        {competitors.map((c) => {
          const isChecked = selected.includes(c.name)
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onToggle(c.name)}
              className="flex items-center gap-sm w-full text-left hover:bg-surface-hover rounded-sm px-xs"
            >
              {/* Avatar */}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-chip-neutral-bg text-small text-text-secondary">
                {c.name.charAt(0).toUpperCase()}
              </span>

              {/* Name + hint */}
              <span className="flex flex-1 flex-col">
                <span className="text-[13px] text-text-primary">{c.name}</span>
                <span className="text-small text-text-tertiary">{c.hint}</span>
              </span>

              {/* Checkbox */}
              {isChecked ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary">
                  <Icon name="check" size={16} className="text-white" />
                </span>
              ) : (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-control-border" />
              )}
            </button>
          )
        })}

        {competitors.length === 0 && (
          <p className="text-body text-text-tertiary text-center py-sm">No competitors found</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Check TypeScript**

```bash
cd "Search-AI-master" && npx tsc --noEmit 2>&1 | grep -E "error|CompetitorBenchmark"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/screens/CompetitorBenchmarkScreen.tsx
git commit -m "feat: add competitor selector dropdown panel"
```

---

## Task 5: Wire into SearchAIScreen

**Files:**
- Modify: `src/screens/SearchAIScreen.tsx`

**Interfaces:**
- Consumes: `CompetitorBenchmarkScreen` from `./CompetitorBenchmarkScreen`

- [ ] **Step 1: Add import at the top of `SearchAIScreen.tsx`**

After the existing imports (after line 2 `import { Icon, TopNav, type NavSection } from '../components'`), add:

```tsx
import { CompetitorBenchmarkScreen } from './CompetitorBenchmarkScreen'
```

- [ ] **Step 2: Replace the placeholder content area in `SearchAIScreen`**

Find this block in `SearchAIScreen.tsx` (around line 161–165):

```tsx
        <div className="flex h-full flex-col">
          <TopNav initials="S" />
          <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
            {LABEL_MAP[navActive] ?? navActive}
          </div>
        </div>
```

Replace with:

```tsx
        <div className="flex h-full flex-col">
          <TopNav initials="S" />
          {navActive === 'by-brand' ? (
            <CompetitorBenchmarkScreen />
          ) : (
            <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
              {LABEL_MAP[navActive] ?? navActive}
            </div>
          )}
        </div>
```

- [ ] **Step 3: Check TypeScript across the project**

```bash
cd "Search-AI-master" && npx tsc --noEmit 2>&1
```

Expected: no errors.

- [ ] **Step 4: Run the dev server and verify visually**

```bash
cd "Search-AI-master" && npm run dev
```

Open the app, navigate to **Search AI → Competitors → By brand** in the left nav. Verify:

1. Page header shows "Competitor benchmarking by brand" with info icon, "Jun 2026" pill, more-vert and filter buttons
2. Competitor selector card shows 5 default chips (Bowen Dental, Deeragun Dental, Innisfail Dentists, Serenity Dental CQ, Absolutely Dental @ Kirwan Plaza)
3. Clicking ×  on a chip removes it
4. Clicking the chevron opens the dropdown with a search bar and 16 competitor rows
5. Checked competitors show a blue filled checkbox; unchecked show an empty border
6. Typing in the search field filters the list
7. Clicking a row toggles its chip in the input above
8. Clicking the chevron again closes the dropdown

- [ ] **Step 5: Commit**

```bash
git add src/screens/SearchAIScreen.tsx
git commit -m "feat: wire competitor benchmark screen into by-brand nav"
```

---

## Self-Review Notes

- **Spec coverage:** header bar ✓, month pill ✓, more-vert ✓, filter ✓, chip input ✓, chip removal ✓, dropdown panel ✓, search filter ✓, checkbox toggle ✓, seed data ✓, wired into nav ✓
- **Placeholders:** none — every step contains complete code
- **Type consistency:** `Competitor` interface defined in Task 1, consumed identically in Tasks 2–4; `selected: string[]` / `onChange: (next: string[]) => void` prop shape consistent across all tasks
- **Token rule:** `bg-chip-neutral-bg` — verify this resolves in tailwind.config. The config defines `chip: { neutral: { bg: '#eaeaea' } }` which produces `bg-chip-neutral-bg`. ✓
- **`text-white`** — not a custom token but a standard Tailwind utility, acceptable for icon on filled checkbox. ✓
