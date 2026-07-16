import { useEffect, useState } from 'react'
import { Icon, TopNav, type NavSection } from '../components'
import { CompetitorBenchmarkScreen } from './CompetitorBenchmarkScreen'
import { CompetitorDetailScreen } from './CompetitorDetailScreen'
import { CompetitorByLocationScreen } from './CompetitorByLocationScreen'
import { CompetitorByLocationDetailScreen } from './CompetitorByLocationDetailScreen'
import { ManageCompetitorsScreen } from './ManageCompetitorsScreen'
import { CitationsReportScreen } from './CitationsReportScreen'
import { ThemesAndPromptsScreen } from './ThemesAndPromptsScreen'
import { ReportSettingsScreen } from './ReportSettingsScreen'
import { BrandsScreen } from './BrandsScreen'
import { BrandV1Screen } from './BrandV1Screen'
import { SearchAiScoreSettingsScreen } from './SearchAiScoreSettingsScreen'
import {
  BY_LOCATION_DATA,
  COMPETITOR_BRAND_DATA,
  type CompetitorRowData,
  type ByLocationTableRow,
  type ByLocationDot,
} from '../data/competitorData'

const SEARCH_AI_NAV_SECTIONS: NavSection[] = [
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { id: 'recommendations', label: 'Recommendations' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    items: [
      { id: 'visibility',  label: 'Visibility'  },
      { id: 'citations',   label: 'Citations'   },
      { id: 'rankings',    label: 'Rankings'    },
      { id: 'accuracy',    label: 'Accuracy'    },
      { id: 'sentiment',   label: 'Sentiment'   },
      { id: 'prompt',      label: 'Prompt'      },
      { id: 'website',     label: 'Website'     },
    ],
  },
  {
    id: 'competitors',
    label: 'Competitors',
    items: [
      { id: 'by-brand',    label: 'Brand'    },
      { id: 'by-location', label: 'Location' },
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    items: [
      { id: 'optimization-agents', label: 'Optimization agents' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      { id: 'search-prompts', label: 'Themes and prompts'  },
      { id: 'search-brands',  label: 'Brands'   },
      { id: 'search-brands-v1', label: 'Brand V1' },
      { id: 'search-report',  label: 'Report'   },
      { id: 'search-website', label: 'Website'  },
      { id: 'search-score',   label: 'Search AI score' },
    ],
  },
]

const LABEL_MAP: Record<string, string> = {
  overview:             'Overview',
  recommendations:      'Recommendations',
  visibility:           'Visibility',
  citations:            'Citations',
  rankings:             'Rankings',
  accuracy:             'Accuracy',
  sentiment:            'Sentiment',
  prompt:               'Prompt',
  website:              'Website',
  'by-brand':           'Brand',
  'by-location':        'Location',
  'optimization-agents':'Optimization agents',
  'search-prompts':     'Themes and prompts',
  'search-brands':      'Brands',
  'search-brands-v1':   'Brand V1',
  'search-report':      'Report',
  'search-website':     'Website',
  'search-score':       'Search AI score',
}

function findSectionForItem(sections: NavSection[], itemId: string): string | null {
  return sections.find((s) => s.items?.some((i) => i.id === itemId))?.id ?? null
}

function SearchAISideNav({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  const initialExpanded = findSectionForItem(SEARCH_AI_NAV_SECTIONS, activeId) ?? ''
  const [expandedId, setExpandedId] = useState(initialExpanded)

  useEffect(() => {
    const sectionId = findSectionForItem(SEARCH_AI_NAV_SECTIONS, activeId)
    if (sectionId) setExpandedId(sectionId)
  }, [activeId])

  function handleSectionClick(section: NavSection) {
    if (expandedId === section.id) {
      setExpandedId('')
      return
    }
    setExpandedId(section.id)
    if (section.items?.[0]) {
      onSelect(section.items[0].id)
    }
  }

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-surface-l2">
      <div className="flex h-14 shrink-0 flex-col justify-center px-2xl">
        <h1 className="text-h3 text-text-primary">Search AI</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-xs overflow-y-auto px-lg py-sm">
        {/* Overview — flat link, no accordion */}
        <button
          type="button"
          aria-current={activeId === 'overview' ? 'page' : undefined}
          onClick={() => onSelect('overview')}
          className={`flex h-7 w-full items-center rounded-sm px-sm py-xs text-left transition-colors ${
            activeId === 'overview' ? 'bg-surface-selected' : 'hover:bg-surface-selected'
          }`}
        >
          <span className="min-w-0 flex-1 truncate text-body text-text-primary">Overview</span>
        </button>

        {/* Accordion sections */}
        {SEARCH_AI_NAV_SECTIONS.map((section) => {
          const isExpanded = expandedId === section.id
          return (
            <div key={section.id} className="flex flex-col gap-xs">
              <button
                type="button"
                onClick={() => handleSectionClick(section)}
                className="flex h-7 w-full items-center justify-between gap-sm rounded-sm px-sm py-xs hover:bg-surface-selected"
              >
                <span className="text-body text-text-primary">{section.label}</span>
                <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={20} className="text-text-icon" />
              </button>
              {isExpanded &&
                section.items?.map((leaf) => (
                  <button
                    key={leaf.id}
                    type="button"
                    aria-current={activeId === leaf.id ? 'page' : undefined}
                    onClick={() => onSelect(leaf.id)}
                    className={`flex h-7 w-full items-center rounded-sm px-sm py-xs text-left transition-colors ${
                      activeId === leaf.id ? 'bg-surface-selected' : 'hover:bg-surface-selected'
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                      {leaf.label}
                    </span>
                  </button>
                ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export function SearchAIScreen() {
  const [navActive, setNavActive] = useState('overview')
  const [competitorDetail, setCompetitorDetail] = useState<CompetitorRowData | null>(null)
  const [locationDetail, setLocationDetail] = useState<ByLocationTableRow | null>(null)
  const [manageCompetitors, setManageCompetitors] = useState(false)

  function handleNavSelect(id: string) {
    setNavActive(id)
    setCompetitorDetail(null)
    setLocationDetail(null)
    setManageCompetitors(false)
  }

  if (manageCompetitors) {
    return (
      <div className="flex h-full w-full min-h-0 flex-col">
        <TopNav initials="S" />
        <main className="flex flex-1 overflow-hidden">
          <ManageCompetitorsScreen onBack={() => setManageCompetitors(false)} />
        </main>
      </div>
    )
  }

  if (competitorDetail) {
    return (
      <div className="flex h-full w-full min-h-0">
        <SearchAISideNav activeId={navActive} onSelect={handleNavSelect} />
        <main className="flex flex-1 flex-col overflow-hidden">
          <CompetitorDetailScreen
            initialCompetitor={competitorDetail}
            onBack={() => setCompetitorDetail(null)}
          />
        </main>
      </div>
    )
  }

  if (locationDetail) {
    return (
      <div className="flex h-full w-full min-h-0">
        <SearchAISideNav activeId={navActive} onSelect={handleNavSelect} />
        <main className="flex flex-1 flex-col overflow-hidden">
          <CompetitorByLocationDetailScreen
            location={locationDetail}
            onBack={() => setLocationDetail(null)}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      <SearchAISideNav activeId={navActive} onSelect={handleNavSelect} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-full flex-col">
          <TopNav initials="S" />
          {navActive === 'by-brand' ? (
            <CompetitorBenchmarkScreen
              onCompetitorClick={setCompetitorDetail}
              onManageCompetitors={() => setManageCompetitors(true)}
            />
          ) : navActive === 'citations' ? (
            <CitationsReportScreen />
          ) : navActive === 'search-prompts' ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <ThemesAndPromptsScreen />
            </div>
          ) : navActive === 'search-brands' ? (
            <BrandsScreen />
          ) : navActive === 'search-brands-v1' ? (
            <BrandV1Screen />
          ) : navActive === 'search-report' ? (
            <ReportSettingsScreen />
          ) : navActive === 'search-score' ? (
            <SearchAiScoreSettingsScreen />
          ) : navActive === 'by-location' ? (
            <CompetitorByLocationScreen
              onLocationClick={setLocationDetail}
              onManageCompetitors={() => setManageCompetitors(true)}
              onDotClick={(dot: ByLocationDot) => {
                if (dot.brand === 'you') {
                  const row = BY_LOCATION_DATA['ChatGPT'].tableRows.find(
                    (r) => r.location === dot.locationName
                  )
                  if (row) setLocationDetail(row)
                } else {
                  const competitor = COMPETITOR_BRAND_DATA.find((c) => c.name === dot.brand)
                  if (competitor) setCompetitorDetail(competitor)
                }
              }}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-body text-text-secondary">
              {LABEL_MAP[navActive] ?? navActive}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
