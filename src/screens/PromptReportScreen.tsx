import { useRef, useState } from 'react'
import {
  Icon,
  InfoTooltip,
  DateRangeSelector,
  ChartCard,
  CardTabs,
  FilterPanel,
  type FilterField,
} from '../components'
import {
  PROMPT_REPORT_DATA,
  type PromptReportPlatform,
  type PromptThemeRow,
} from '../data/promptReportData'
import { BY_LOCATION_DATA, RANKING_PLATFORMS } from '../data/competitorData'

const PROMPT_MONTHS = [
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
]

const BRANDS = ['All brands', 'Aspendental', 'Fleur Choice', 'WellYesNow']

const ALL_LOCATIONS = Array.from(
  new Set(
    RANKING_PLATFORMS.flatMap((p) =>
      BY_LOCATION_DATA[p].tableRows.map((r) => r.location)
    )
  )
).sort()

const FILTER_FIELDS: FilterField[] = [
  { id: 'location', label: 'Location', multi: true, options: ALL_LOCATIONS.map((l) => ({ value: l, label: l })) },
]

const PLATFORM_TABS: { id: PromptReportPlatform; label: string }[] = [
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Perplexity', label: 'Perplexity' },
  { id: 'All', label: 'All' },
]

interface BrandDropdownProps {
  brands: string[]
  selected: string
  onChange: (b: string) => void
}

function BrandDropdown({ brands, selected, onChange }: BrandDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[4px] text-[#1976D2] text-[16px] leading-[24px]"
      >
        {selected}
        <Icon name="expand_more" size={16} className="text-[#1976D2]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-[4px] z-20 min-w-[180px] bg-surface rounded-sm border border-border shadow-dropdown py-xs">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => { onChange(b); setOpen(false) }}
                className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                  b === selected ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {b === selected && <Icon name="check" size={16} className="text-primary shrink-0" />}
                {b !== selected && <span className="w-[16px] shrink-0" />}
                {b}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function HeaderMoreMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="More options"
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
      >
        <Icon name="more_vert" size={20} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-[110] mt-xs min-w-[168px] rounded-sm border border-border bg-surface py-xs shadow-dropdown">
            {['Download', 'Email', 'Schedule'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full px-md py-sm text-left text-body text-text-primary hover:bg-surface-hover"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const COL_WIDTHS = {
  themes: 'w-[260px] min-w-[200px]',
  visibilityRank: 'w-[120px]',
  visibilityScore: 'w-[130px]',
  avgPosition: 'w-[120px]',
  citationShare: 'w-[120px]',
  citationRank: 'w-[110px]',
  executions: 'w-[100px]',
}

interface PromptTableProps {
  themes: PromptThemeRow[]
}

function PromptTable({ themes }: PromptTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body">
        <thead>
          <tr className="border-b border-border">
            <th className={`${COL_WIDTHS.themes} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Themes
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
            <th className={`${COL_WIDTHS.visibilityRank} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Visibility rank
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
            <th className={`${COL_WIDTHS.visibilityScore} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Visibility score
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
            <th className={`${COL_WIDTHS.avgPosition} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Avg position
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
            <th className={`${COL_WIDTHS.citationShare} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Citation share
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
            <th className={`${COL_WIDTHS.citationRank} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Citation rank
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
            <th className={`${COL_WIDTHS.executions} px-md py-sm text-text-secondary`}>
              <span className="flex items-center gap-xs">
                Executions
                <Icon name="keyboard_arrow_down" size={16} className="text-text-icon" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {themes.map((theme) => {
            const isOpen = expanded.has(theme.id)
            return (
              <>
                <tr
                  key={theme.id}
                  className="border-b border-border hover:bg-surface-hover cursor-pointer"
                  onClick={() => toggle(theme.id)}
                >
                  <td className={`${COL_WIDTHS.themes} px-md py-sm`}>
                    <span className="flex items-center gap-xs text-text-primary">
                      <Icon
                        name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        size={16}
                        className="text-text-icon shrink-0"
                      />
                      {theme.theme}
                    </span>
                  </td>
                  <td className={`${COL_WIDTHS.visibilityRank} px-md py-sm text-text-primary`}>{theme.visibilityRank}</td>
                  <td className={`${COL_WIDTHS.visibilityScore} px-md py-sm text-text-primary`}>{theme.visibilityScore}</td>
                  <td className={`${COL_WIDTHS.avgPosition} px-md py-sm text-text-primary`}>{theme.avgPosition}</td>
                  <td className={`${COL_WIDTHS.citationShare} px-md py-sm text-text-primary`}>{theme.citationShare}</td>
                  <td className={`${COL_WIDTHS.citationRank} px-md py-sm text-text-primary`}>{theme.citationRank}</td>
                  <td className={`${COL_WIDTHS.executions} px-md py-sm text-text-primary`}>{theme.executions}</td>
                </tr>
                {isOpen && theme.prompts.map((p) => (
                  <tr key={p.id} className="border-b border-border bg-[#FAFAFA]">
                    <td className={`${COL_WIDTHS.themes} px-md py-sm pl-[40px]`}>
                      <span className="text-[#1976D2] text-body line-clamp-2">{p.prompt}</span>
                    </td>
                    <td className={`${COL_WIDTHS.visibilityRank} px-md py-sm text-text-secondary text-small`}>{p.visibilityRank}</td>
                    <td className={`${COL_WIDTHS.visibilityScore} px-md py-sm text-text-secondary text-small`}>{p.visibilityScore}</td>
                    <td className={`${COL_WIDTHS.avgPosition} px-md py-sm text-text-secondary text-small`}>{p.avgPosition}</td>
                    <td className={`${COL_WIDTHS.citationShare} px-md py-sm text-text-secondary text-small`}>{p.citationShare}</td>
                    <td className={`${COL_WIDTHS.citationRank} px-md py-sm text-text-secondary text-small`}>{p.citationRank}</td>
                    <td className={`${COL_WIDTHS.executions} px-md py-sm text-text-secondary text-small`}>{p.executions}</td>
                  </tr>
                ))}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function PromptReportScreen() {
  const [selectedMonth, setSelectedMonth] = useState(PROMPT_MONTHS[0])
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0])
  const [activePlatform, setActivePlatform] = useState<PromptReportPlatform>('ChatGPT')
  const [filterOpen, setFilterOpen] = useState(false)

  const tableData = PROMPT_REPORT_DATA[activePlatform]

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Page header */}
        <div className="flex h-[64px] shrink-0 items-center gap-sm px-2xl py-sm bg-surface">
          <div className="flex flex-1 min-w-0 items-center gap-sm">
            <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary whitespace-nowrap">
              Prompt
            </p>
            <InfoTooltip text="Track how your themes and prompts are performing across AI sites." />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <DateRangeSelector
              value={selectedMonth}
              options={PROMPT_MONTHS}
              onChange={setSelectedMonth}
            />
            <HeaderMoreMenu />
            <button
              type="button"
              aria-label="Filter"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
            >
              <Icon name="filter_list" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
          <div className="flex flex-col gap-xl px-2xl py-xl">
            <ChartCard
              title={
                <span className="flex flex-wrap items-baseline gap-[4px] text-[16px] leading-[24px] text-text-secondary">
                  How are your themes &amp; prompts performing for
                  <BrandDropdown brands={BRANDS} selected={selectedBrand} onChange={setSelectedBrand} />
                </span>
              }
              subtitle="Discover themes and prompts appearing in answers across AI sites for your brands."
            >
              <div className="mb-lg">
                <CardTabs
                  tabs={PLATFORM_TABS}
                  activeTab={activePlatform}
                  onChange={(id) => setActivePlatform(id as PromptReportPlatform)}
                />
              </div>
              <PromptTable themes={tableData} />
            </ChartCard>
          </div>
        </div>
      </div>

      <FilterPanel
        open={filterOpen}
        fields={FILTER_FIELDS}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  )
}
