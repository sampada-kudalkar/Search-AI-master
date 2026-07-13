import { useState } from 'react'
import { AddThemeDrawer, EditPromptDrawer, Icon, SegmentedControl, ThemesInsightBanner, ThemesPromptsTable } from '../components'
import type { EditPromptValues, NewThemeData } from '../components'
import { THEMES, ThemeConfig, ThemePrompt } from '../data/themesData'

const AI_SITES = ['ChatGPT', 'Gemini', 'Perplexity']

export function ThemesAndPromptsScreen() {
  const [scope, setScope] = useState<'brand' | 'locations'>('locations')
  const [themes, setThemes] = useState<ThemeConfig[]>(THEMES)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<{ themeName: string; prompt: ThemePrompt } | null>(null)

  function handleEditPrompt(themeName: string, prompt: ThemePrompt) {
    setEditing({ themeName, prompt })
  }

  function handleSavePrompt(themeName: string, values: EditPromptValues) {
    setThemes((prev) =>
      prev.map((theme) =>
        theme.name !== themeName
          ? theme
          : {
              ...theme,
              prompts: theme.prompts.map((p) =>
                p.text === editing?.prompt.text ? { ...p, text: values.text, aiSites: values.aiSites } : p,
              ),
            },
      ),
    )
    setEditing(null)
  }

  function handleAddTheme(theme: NewThemeData) {
    const locationCount = theme.trackBy === 'location' ? theme.selectedIds.length : 0
    const newTheme: ThemeConfig = {
      name: theme.name,
      aggregateMonthlySearch: 0,
      locationCount,
      prompts: theme.prompts.map((text) => ({
        text,
        monthlySearch: 0,
        aiSites: AI_SITES,
        status: 'Tracking',
        updatedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        locationCount,
      })),
    }
    setThemes((prev) => [newTheme, ...prev])
    setDrawerOpen(false)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between bg-surface px-2xl py-xl">
        <h1 className="text-h3 text-text-primary">Themes and prompts</h1>
        <div className="flex items-center gap-sm">
          <button
            type="button"
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="search" size={20} />
          </button>
          <SegmentedControl
            options={[
              { value: 'brand', label: 'Brand' },
              { value: 'locations', label: 'Locations' },
            ]}
            value={scope}
            onChange={(value) => setScope(value as 'brand' | 'locations')}
            className="h-9"
          />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
          >
            + Add theme
          </button>
          <button
            type="button"
            aria-label="Customize columns"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="view_column" size={20} />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="more_vert" size={20} />
          </button>
          <button
            type="button"
            aria-label="Filters"
            className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
          >
            <Icon name="filter_list" size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden px-2xl">
        <div className="pt-lg">
          <ThemesInsightBanner text="Discover trending themes and prompts across AI platforms" linkLabel="Explore trends" />
        </div>

        <div className="flex-1 overflow-auto pt-lg">
          <ThemesPromptsTable themes={themes} onEditPrompt={handleEditPrompt} scope={scope} />
        </div>
      </div>

      <AddThemeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAddTheme} />
      <EditPromptDrawer
        open={!!editing}
        themeName={editing?.themeName ?? ''}
        prompt={editing?.prompt ?? null}
        onClose={() => setEditing(null)}
        onSave={handleSavePrompt}
      />
    </div>
  )
}
