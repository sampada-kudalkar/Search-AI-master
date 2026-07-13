import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { Chip } from '../Chip/Chip'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { DataTable } from '../DataTable/DataTable'
import type { Column } from '../DataTable/DataTable.types'
import type { ThemeConfig, ThemePrompt, TrackingStatus } from '../../data/themesData'
import { ThemesPromptsTableProps, FlatThemeRow } from './ThemesPromptsTable.types'

export const AI_SITE_COLORS: Record<string, string> = {
  ChatGPT: '#10a37f',
  Gemini: '#4285f4',
  Perplexity: '#20808d',
  Claude: '#c96442',
  Copilot: '#0078d4',
}

export const ALL_AI_SITES = Object.keys(AI_SITE_COLORS)

const STATUS_VARIANT: Record<TrackingStatus, 'success' | 'neutral' | 'info'> = {
  Tracking: 'success',
  'Not tracking': 'neutral',
  'Starts next cycle': 'info',
}

function AiSitesCluster({ sites }: { sites: string[] }) {
  return (
    <div className="flex items-center gap-xs">
      {sites.map((site) => (
        <span
          key={site}
          title={site}
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
          style={{ backgroundColor: AI_SITE_COLORS[site] ?? '#8f8f8f' }}
        >
          {site.charAt(0)}
        </span>
      ))}
    </div>
  )
}

function unionAiSites(prompts: ThemePrompt[]): string[] {
  return Array.from(new Set(prompts.flatMap((p) => p.aiSites)))
}

function flattenThemes(themes: ThemeConfig[], expanded: Set<string>): FlatThemeRow[] {
  const rows: FlatThemeRow[] = []
  for (const theme of themes) {
    rows.push({
      _id: theme.name,
      _isHeader: true,
      _themeName: theme.name,
      name: theme.name,
      promptCount: theme.prompts.length,
      locationCount: theme.locationCount,
      monthlySearch: theme.aggregateMonthlySearch,
      aiSites: unionAiSites(theme.prompts),
    })
    if (expanded.has(theme.name)) {
      theme.prompts.forEach((prompt, i) => {
        rows.push({
          _id: `${theme.name}-${i}`,
          _isHeader: false,
          _themeName: theme.name,
          name: prompt.text,
          locationCount: prompt.locationCount,
          monthlySearch: prompt.monthlySearch,
          aiSites: prompt.aiSites,
          status: prompt.status,
          updatedOn: prompt.updatedOn,
          _prompt: prompt,
        })
      })
    }
  }
  return rows
}

export function ThemesPromptsTable({ themes, onEditPrompt, onLocationsClick, onAddPrompt }: ThemesPromptsTableProps) {
  const [data, setData] = useState(themes)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    setData(themes)
  }, [themes])

  function toggleExpand(themeName: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(themeName)) next.delete(themeName)
      else next.add(themeName)
      return next
    })
  }

  function updatePromptStatus(themeName: string, promptText: string, status: TrackingStatus) {
    setData((prev) =>
      prev.map((theme) =>
        theme.name !== themeName
          ? theme
          : { ...theme, prompts: theme.prompts.map((p) => (p.text === promptText ? { ...p, status } : p)) },
      ),
    )
  }

  function deletePrompt(themeName: string, promptText: string) {
    setData((prev) =>
      prev.map((theme) =>
        theme.name !== themeName ? theme : { ...theme, prompts: theme.prompts.filter((p) => p.text !== promptText) },
      ),
    )
  }

  const rows = flattenThemes(data, expanded)

  const columns: Column<FlatThemeRow>[] = [
    {
      key: 'name',
      label: 'Themes and prompts',
      width: 420,
      render: (_val, row) => {
        if (row._isHeader) {
          const isExpanded = expanded.has(row._themeName)
          return (
            <button
              type="button"
              onClick={() => toggleExpand(row._themeName)}
              className="flex w-full items-center gap-sm text-left"
            >
              <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-body text-text-primary">{row.name}</span>
                <span className="text-small text-text-tertiary">{row.promptCount} prompts</span>
              </div>
            </button>
          )
        }
        return <span className="block truncate pl-[24px] text-body text-text-primary">{row.name}</span>
      },
    },
    {
      key: 'locationCount',
      label: 'Locations',
      width: 120,
      sortable: true,
      render: (_val, row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (!row._isHeader && row._prompt) onLocationsClick?.(row._themeName, row._prompt)
          }}
          className={row._isHeader ? 'cursor-default text-body text-text-primary' : 'text-body text-text-primary hover:text-text-action'}
        >
          {row.locationCount}
        </button>
      ),
    },
    {
      key: 'monthlySearch',
      label: (
        <span className="flex items-center gap-xs">
          Monthly searches
          <InfoTooltip text="Estimated number of monthly searches for this theme or prompt" />
        </span>
      ),
      width: 180,
      sortable: true,
      render: (val) => <span>{Number(val).toLocaleString()}</span>,
    },
    {
      key: 'aiSites',
      label: 'AI sites',
      width: 140,
      resizable: false,
      render: (val) => <AiSitesCluster sites={val as string[]} />,
    },
    {
      key: 'status',
      label: 'Tracking status',
      width: 160,
      render: (_val, row) => (row._isHeader || !row.status ? null : <Chip label={row.status} variant={STATUS_VARIANT[row.status as TrackingStatus]} />),
    },
    {
      key: 'updatedOn',
      label: (
        <span className="flex items-center gap-xs">
          Updated on
          <InfoTooltip text="Date the last changes were made to the prompt" />
        </span>
      ),
      width: 140,
      sortable: true,
      render: (_val, row) => (row._isHeader ? null : row.updatedOn),
    },
  ]

  return (
    <DataTable<FlatThemeRow>
      columns={columns}
      data={rows}
      rowHeight={56}
      rowAction={{
        icon: 'edit',
        label: 'Edit',
        visible: (row) => !row._isHeader,
        onClick: (row) => {
          if (row._prompt) onEditPrompt?.(row._themeName, row._prompt)
        },
      }}
      rowActions={[
        {
          label: 'Add prompt',
          iconElement: <span className="whitespace-nowrap text-body text-text-action">+ Add prompt</span>,
          visible: (row) => row._isHeader,
          onClick: (row) => onAddPrompt?.(row._themeName),
        },
      ]}
      rowMenuItems={[
        {
          label: 'Stop tracking',
          visible: (row) => !row._isHeader && row.status !== 'Not tracking',
          onClick: (row) => updatePromptStatus(row._themeName, row.name, 'Not tracking'),
        },
        {
          label: 'Delete',
          variant: 'danger',
          visible: (row) => !row._isHeader,
          onClick: (row) => deletePrompt(row._themeName, row.name),
        },
      ]}
    />
  )
}
