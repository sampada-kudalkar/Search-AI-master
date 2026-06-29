import { useState } from 'react'
import { Icon } from '../components/Icon/Icon'
import { CardTabs } from '../components/CardTabs/CardTabs'
import { DataTable } from '../components'
import type { Column } from '../components'
import { COMPETITORS } from '../data/competitorData'

const TABS = [
  { id: 'brand', label: 'Brand view' },
  { id: 'location', label: 'Location view' },
]

// Mock location counts per competitor
const LOCATION_COUNTS: Record<string, number> = {
  'Bowen Dental': 3,
  'Deeragun Dental': 2,
  'Innisfail Dentists': 4,
  'Serenity Dental CQ': 1,
  'Absolutely Dental @ Kirwan Plaza': 2,
  'Dental Balance NQ': 1,
  'National Dental Care Townsville': 6,
  'Riverside Family Dental Innisfail': 1,
  'CP Dental Emerald': 2,
  'Central Highlands Dental': 3,
  'Sundown Family Dental': 4,
  'Aspire Dental': 2,
  'Hinchinbrook Dental Group': 1,
  'Dental On Bowen': 2,
  'Allon4plus': 1,
  'Kirwan Dentist / Dental Implants Clinic': 3,
}

// Deterministic avatar color palette cycling by index
const AVATAR_COLORS = [
  'bg-primary',
  'bg-[#e91e63]',
  'bg-[#ff9800]',
  'bg-[#009688]',
  'bg-[#607d8b]',
  'bg-[#9c27b0]',
]

// Map marker positions as [top%, left%] — overlaid on the iframe
const MAP_MARKERS: Array<{ top: number; left: number; isYou?: boolean }> = [
  { top: 30, left: 52, isYou: true },
  { top: 18, left: 62, isYou: true },
  { top: 54, left: 65, isYou: true },
  { top: 44, left: 43, isYou: true },
  { top: 22, left: 30, isYou: true },
  { top: 38, left: 35 },
  { top: 28, left: 40 },
  { top: 42, left: 58 },
  { top: 50, left: 37 },
  { top: 60, left: 72 },
  { top: 14, left: 74 },
  { top: 68, left: 48 },
  { top: 22, left: 78 },
  { top: 36, left: 68 },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

type LocationRow = {
  name: string
  initials: string
  avatarColor: string
  competitorLocations: number
  competingLocations: number
  status: 'active'
}

const LOCATION_COLUMNS: Column<LocationRow>[] = [
  {
    key: 'name',
    label: 'Competitor name',
    width: 300,
    sortable: true,
    render: (_v, row) => (
      <div className="flex items-center gap-sm">
        <div className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${row.avatarColor} text-white text-xs`}>
          {row.initials}
        </div>
        <span className="text-body text-text-action">{row.name}</span>
      </div>
    ),
  },
  {
    key: 'competitorLocations',
    label: 'Competitor locations',
    width: 220,
    sortable: true,
    render: (v) => (
      <div className="flex items-center gap-xs text-body text-text-primary">
        {v as number} {(v as number) === 1 ? 'location' : 'locations'}
        <Icon name="expand_more" size={16} className="text-text-icon" />
      </div>
    ),
  },
  {
    key: 'competingLocations',
    label: 'Competing with my locations',
    width: 260,
    sortable: true,
    render: (v) => (
      <div className="flex items-center gap-xs text-body text-text-primary">
        {v as number} {(v as number) === 1 ? 'location' : 'locations'}
        <Icon name="expand_more" size={16} className="text-text-icon" />
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    sortable: false,
    render: () => <Icon name="check_circle" size={20} className="text-[#4cae3d]" fill />,
  },
]

const LOCATION_ROWS: LocationRow[] = COMPETITORS.map((c, i) => ({
  name: c.name,
  initials: getInitials(c.name),
  avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
  competitorLocations: LOCATION_COUNTS[c.name] ?? 2,
  competingLocations: LOCATION_COUNTS[c.name] ?? 2,
  status: 'active',
}))

export function ManageCompetitorsScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('brand')

  return (
    <div className="flex h-full w-full flex-col bg-surface overflow-hidden">

      {/* Breadcrumb */}
      <div className="flex h-9 shrink-0 items-center gap-xs border-b border-border bg-surface px-2xl">
        <button
          type="button"
          onClick={onBack}
          className="text-body text-text-action hover:underline"
        >
          Settings
        </button>
        <span className="text-body text-text-secondary">/</span>
        <button
          type="button"
          onClick={onBack}
          className="text-body text-text-action hover:underline"
        >
          Competitors
        </button>
        <span className="text-body text-text-secondary">/</span>
        <span className="text-body text-text-primary">Manage competitors</span>
      </div>

      {/* Header bar */}
      <div className="flex h-[68px] shrink-0 items-center gap-sm border-b border-border bg-surface px-2xl">
        {/* Title */}
        <div className="flex flex-1 items-center gap-sm">
          <span className="text-h3 text-text-primary">{COMPETITORS.length} Competitors</span>
          <Icon name="auto_awesome" size={20} className="text-[#7c4dff]" />
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-sm">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
          >
            <Icon name="search" size={20} className="text-text-icon" />
          </button>

          {/* View toggle: map | table */}
          <div className="flex h-9 items-center rounded-sm border border-border bg-surface px-xs gap-xs">
            <button
              type="button"
              aria-label="Map view"
              className="flex size-6 items-center justify-center rounded-sm bg-surface-selected text-text-primary"
            >
              <Icon name="distance" size={18} />
            </button>
            <button
              type="button"
              aria-label="Table view"
              className="flex size-6 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
            >
              <Icon name="table_rows" size={18} />
            </button>
          </div>

          {/* Add competitor */}
          <button
            type="button"
            className="flex h-9 items-center gap-sm rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
          >
            Add competitor
            <Icon name="expand_more" size={20} />
          </button>

          {/* More vert */}
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
            <Icon name="filter_alt" size={20} className="text-text-icon" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-2xl">
        <CardTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Body */}
      {activeTab === 'brand' ? (
        <div className="flex flex-1 min-h-0">

          {/* Left panel — competitor list */}
          <div className="w-[396px] shrink-0 overflow-y-auto border-r border-border">
            <div className="flex flex-col gap-xs p-lg">
            {COMPETITORS.map((competitor, index) => {
              const initials = getInitials(competitor.name)
              const locationCount = LOCATION_COUNTS[competitor.name] ?? 2
              const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
              return (
                <div
                  key={competitor.name}
                  className="flex items-center gap-sm rounded-sm px-md py-[11px] hover:bg-surface-hover cursor-pointer"
                >
                  <div className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${avatarColor} text-white text-xs`}>
                    {initials}
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-center gap-xs">
                      <span className="text-body text-text-action truncate">{competitor.name}</span>
                      <Icon name="check_circle" size={16} className="text-[#4cae3d] shrink-0" fill />
                    </div>
                    <span className="text-small text-text-secondary">
                      {locationCount} {locationCount === 1 ? 'location' : 'locations'}
                    </span>
                  </div>
                </div>
              )
            })}
            </div>
          </div>

          {/* Right panel — map */}
          <div className="relative flex-1 overflow-hidden bg-[#e8eaed]">
            <iframe
              title="Competitor map"
              className="absolute inset-0 size-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=146.758%2C-19.332%2C146.877%2C-19.245&layer=mapnik"
              style={{ border: 0, pointerEvents: 'none' }}
            />
            {MAP_MARKERS.map((marker, i) => (
              <div
                key={i}
                className="absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{ top: `${marker.top}%`, left: `${marker.left}%` }}
              >
                <Icon
                  name="location_on"
                  size={30}
                  className={marker.isYou ? 'text-primary drop-shadow' : 'text-[#607d8b] drop-shadow'}
                  fill
                />
              </div>
            ))}
            <div className="absolute right-xl top-[56px] z-10 flex flex-col gap-xs">
              <button
                type="button"
                aria-label="Expand map"
                className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-hover"
              >
                <Icon name="expand_content" size={20} className="text-text-icon" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Location view — DataTable */
        <div className="flex flex-1 min-h-0 overflow-hidden p-lg">
          <DataTable
            columns={LOCATION_COLUMNS}
            data={LOCATION_ROWS}
            rowMenuItems={[
              { label: 'Edit', onClick: () => {} },
              { label: 'Remove', onClick: () => {} },
            ]}
          />
        </div>
      )}
    </div>
  )
}
