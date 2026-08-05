import { useState } from 'react'
import { CardHeader } from '../CardHeader/CardHeader'
import { DataTable } from '../DataTable/DataTable'
import { Chip } from '../Chip/Chip'
import { Icon } from '../Icon/Icon'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip'
import { getInitials, getCompetitorColor } from '../../utils/competitorAvatar'
import { SENTIMENT_BY_LOCATION, type SentimentTraitClaimRow } from '../../data/sentimentReportData'
import type { Column } from '../DataTable/DataTable.types'
import type { MostMentionedTraitsCardProps } from './MostMentionedTraitsCard.types'

const TRAIT_LOCATIONS = ['all locations', ...SENTIMENT_BY_LOCATION.map((l) => l.location)]

function LocationDropdown({ selected, onChange }: { selected: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[4px] text-[#1976D2] text-[18px] leading-[26px]"
      >
        {selected}
        <Icon name="expand_more" size={16} className="text-[#1976D2]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-[4px] z-20 min-w-[180px] bg-surface rounded-sm border border-border shadow-dropdown py-xs">
            {TRAIT_LOCATIONS.map((l) => (
              <button
                key={l}
                onClick={() => { onChange(l); setOpen(false) }}
                className={`w-full text-left px-md py-sm text-body hover:bg-surface-hover flex items-center gap-sm ${
                  l === selected ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {l === selected && <Icon name="check" size={16} className="text-primary shrink-0" />}
                {l !== selected && <span className="w-[16px] shrink-0" />}
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function SentimentPercent({ value }: { value: number }) {
  return <span className={value >= 80 ? 'text-chip-success-text' : 'text-text-primary'}>{value}%</span>
}

function WebsiteAvatars({ sites }: { sites: string[] }) {
  return (
    <div className="flex items-center -space-x-[6px]">
      {sites.map((site) => (
        <span
          key={site}
          title={site}
          className={`flex size-6 shrink-0 items-center justify-center rounded-full border border-surface ${getCompetitorColor(site)} text-[10px]`}
        >
          {getInitials(site)}
        </span>
      ))}
    </div>
  )
}

interface TraitFlatRow extends Record<string, unknown> {
  _id: string
  _isHeader: boolean
  trait: string
  occurrences: number
  occurrencePercent: number
  citedWebsites: string[]
  sentimentPercent?: number
  sentiment?: SentimentTraitClaimRow['sentiment']
}

export function MostMentionedTraitsCard({ rows }: MostMentionedTraitsCardProps) {
  const [location, setLocation] = useState('all locations')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flatRows: TraitFlatRow[] = []
  for (const trait of rows) {
    flatRows.push({
      _id: trait._id,
      _isHeader: true,
      trait: trait.trait,
      occurrences: trait.occurrences,
      occurrencePercent: trait.occurrencePercent,
      citedWebsites: trait.citedWebsites,
      sentimentPercent: trait.sentimentPercent,
    })
    if (expandedIds.has(trait._id)) {
      for (const claim of trait.claims) {
        flatRows.push({
          _id: claim._id,
          _isHeader: false,
          trait: claim.claim,
          occurrences: claim.occurrences,
          occurrencePercent: claim.occurrencePercent,
          citedWebsites: claim.citedWebsites,
          sentiment: claim.sentiment,
        })
      }
    }
  }

  const columns: Column<TraitFlatRow>[] = [
    {
      key: 'trait',
      label: 'Traits',
      width: 280,
      render: (_v, row) =>
        row._isHeader ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggle(row._id)
            }}
            className="flex items-center gap-sm"
          >
            <Icon name={expandedIds.has(row._id) ? 'expand_less' : 'expand_more'} size={16} className="text-text-icon" />
            <span className="text-[13px] text-text-primary">{row.trait}</span>
          </button>
        ) : (
          <span className="pl-[32px] text-small text-[#555555]">{row.trait}</span>
        ),
    },
    {
      key: 'occurrences',
      label: (
        <span className="flex items-center gap-xs">
          Occurrences
          <InfoTooltip text="Frequency of this claim among responses that have sentiment for your brand." />
        </span>
      ),
      width: 180,
      render: (_v, row) => (
        <span className="text-[13px] text-text-primary">
          {row.occurrences} · {row.occurrencePercent}%
        </span>
      ),
    },
    {
      key: 'citedWebsites',
      label: 'Cited websites',
      width: 180,
      render: (v) => <WebsiteAvatars sites={v as string[]} />,
    },
    {
      key: 'sentimentPercent',
      label: 'Sentiment',
      width: 140,
      render: (_v, row) =>
        row._isHeader ? (
          <SentimentPercent value={row.sentimentPercent ?? 0} />
        ) : (
          <Chip label={row.sentiment === 'positive' ? 'Positive' : 'Negative'} variant={row.sentiment === 'positive' ? 'success' : 'danger'} />
        ),
    },
  ]

  return (
    <div className="flex flex-col gap-lg rounded-md border border-border bg-surface p-2xl">
      <CardHeader
        title={
          <span className="flex flex-wrap items-baseline gap-[4px] text-[18px] leading-[26px] text-text-secondary">
            What are your most mentioned traits across
            <LocationDropdown selected={location} onChange={setLocation} />
          </span>
        }
        subtitle="Key concepts that surfaced by AI while mentioning your brand and sentiment behind it."
      />
      <DataTable<TraitFlatRow>
        columns={columns}
        data={flatRows}
        rowHeight={48}
        rowClassName={(row) => (row._isHeader ? '' : 'bg-surface-hover')}
      />
    </div>
  )
}
