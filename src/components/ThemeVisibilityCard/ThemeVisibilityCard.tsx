import { useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { CardTabs } from '../CardTabs/CardTabs'
import { DataTable } from '../DataTable/DataTable'
import { Icon } from '../Icon/Icon'
import { AiIcon } from '../AiIcon/AiIcon'
import {
  THEME_VISIBILITY_DATA,
  THEME_VISIBILITY_PLATFORMS,
  type ThemeVisibilityPlatform,
} from '../../data/competitorData'
import type { Column } from '../DataTable/DataTable.types'
import type { ThemeVisibilityCardProps, ThemeVisibilityFlatRow } from './ThemeVisibilityCard.types'

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_TABS = THEME_VISIBILITY_PLATFORMS.map((p) => ({ id: p, label: p }))

// ── Pair cell (your value | competitor value) ─────────────────────────────────

function PairCell({ you, competitor }: { you: number; competitor: number }) {
  return (
    <span className="flex items-center gap-[6px] text-[13px]">
      <span className="text-text-primary">{you}%</span>
      <span className="w-px h-[14px] bg-border shrink-0" />
      <span className="text-text-secondary">{competitor}%</span>
    </span>
  )
}

// ── Column builder ────────────────────────────────────────────────────────────

function buildColumns(
  expandedIds: Set<string>,
  onToggle: (id: string) => void,
): Column<ThemeVisibilityFlatRow>[] {
  return [
    {
      key: 'theme',
      label: 'Themes',
      width: 317,
      render: (_val, row) => {
        if (row._isHeader) {
          const isExpanded = expandedIds.has(row._id as string)
          return (
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(row._id as string)
                }}
                className="flex items-center justify-center rounded-sm hover:bg-surface-hover"
              >
                <Icon
                  name={isExpanded ? 'expand_less' : 'expand_more'}
                  size={16}
                  className="text-text-icon"
                />
              </button>
              <span className="text-[13px] text-text-primary">{row.theme as string}</span>
            </div>
          )
        }
        return (
          <span className="pl-[32px] text-small text-text-tertiary italic">
            {row.theme as string}
          </span>
        )
      },
    },
    {
      key: 'avgVisibility',
      label: 'Average visibility',
      width: 148,
      render: (_val, row) => {
        const val = row.avgVisibility as { you: number; competitor: number }
        return <PairCell you={val.you} competitor={val.competitor} />
      },
    },
    {
      key: 'chatgpt',
      label: 'ChatGPT',
      width: 148,
      render: (_val, row) => {
        const val = row.chatgpt as { you: number; competitor: number }
        return <PairCell you={val.you} competitor={val.competitor} />
      },
    },
    {
      key: 'gemini',
      label: 'Gemini',
      width: 148,
      render: (_val, row) => {
        const val = row.gemini as { you: number; competitor: number }
        return <PairCell you={val.you} competitor={val.competitor} />
      },
    },
    {
      key: 'perplexity',
      label: 'Perplexity',
      width: 148,
      render: (_val, row) => {
        const val = row.perplexity as { you: number; competitor: number }
        return <PairCell you={val.you} competitor={val.competitor} />
      },
    },
    {
      key: 'claude',
      label: 'Claude',
      width: 148,
      render: (_val, row) => {
        const val = row.claude as { you: number; competitor: number }
        return <PairCell you={val.you} competitor={val.competitor} />
      },
    },
  ]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ThemeVisibilityCard({ rows = THEME_VISIBILITY_DATA }: ThemeVisibilityCardProps) {
  const [activePlatform, setActivePlatform] = useState<ThemeVisibilityPlatform>('ChatGPT')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const flatRows: ThemeVisibilityFlatRow[] = []
  for (const row of rows) {
    flatRows.push({
      _id: row._id as string,
      _isHeader: true,
      theme: row.theme as string,
      avgVisibility: row.avgVisibility as { you: number; competitor: number },
      chatgpt: row.chatgpt as { you: number; competitor: number },
      gemini: row.gemini as { you: number; competitor: number },
      perplexity: row.perplexity as { you: number; competitor: number },
      claude: row.claude as { you: number; competitor: number },
    })
    if (expandedIds.has(row._id as string)) {
      const prompts = row.prompts as { _id: string; prompt: string; avgVisibility: { you: number; competitor: number }; chatgpt: { you: number; competitor: number }; gemini: { you: number; competitor: number }; perplexity: { you: number; competitor: number }; claude: { you: number; competitor: number } }[]
      for (const p of prompts) {
        flatRows.push({
          _id: p._id,
          _isHeader: false,
          _parentId: row._id as string,
          theme: p.prompt,
          avgVisibility: p.avgVisibility,
          chatgpt: p.chatgpt,
          gemini: p.gemini,
          perplexity: p.perplexity,
          claude: p.claude,
        })
      }
    }
  }

  const columns = buildColumns(expandedIds, toggleExpand)

  const toolbar = (
    <>
      <button
        type="button"
        className="flex items-center justify-center rounded-sm border border-border-selected bg-surface p-[8px] hover:bg-surface-hover"
        title="Search"
      >
        <Icon name="search" size={20} className="text-text-icon" />
      </button>
      <button
        type="button"
        className="flex items-center justify-center rounded-sm border border-border-selected bg-surface p-[8px] hover:bg-surface-hover"
        title="Summarize"
      >
        <AiIcon size={16} />
      </button>
      <button
        type="button"
        className="flex items-center justify-center rounded-sm border border-border-selected bg-surface p-[8px] hover:bg-surface-hover"
        title="More options"
      >
        <Icon name="more_vert" size={20} className="text-text-icon" />
      </button>
    </>
  )

  return (
    <div className="flex flex-col bg-surface rounded-md shadow-[0px_2px_12px_1px_rgba(33,33,33,0.06)] overflow-hidden">
      {/* Header */}
      <div className="px-[20px] py-[16px]">
        <CardHeader
          title="Which themes have the strongest visibility at for You vs competitor"
          subtitle="Discover themes where you have the highest visibility across AI platforms"
          toolbar={toolbar}
        />
      </div>

      {/* Tabs */}
      <div className="px-[24px]">
        <CardTabs
          tabs={PLATFORM_TABS}
          activeTab={activePlatform}
          onChange={(id) => setActivePlatform(id as ThemeVisibilityPlatform)}
        />
      </div>

      {/* Table with 24px left/right padding */}
      <div className="px-[24px]">
        <DataTable<ThemeVisibilityFlatRow>
          columns={columns}
          data={flatRows}
          rowHeight={56}
          rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')}
        />
      </div>
    </div>
  )
}
