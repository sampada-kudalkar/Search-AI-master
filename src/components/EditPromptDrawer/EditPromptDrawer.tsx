import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { SelectMenu } from '../SelectMenu/SelectMenu'
import { AI_SITE_COLORS, ALL_AI_SITES } from '../ThemesPromptsTable/ThemesPromptsTable'
import { THEME_NAMES } from '../../data/themesData'
import { THEME_LOCATIONS, THEME_TAGS } from '../../data/themeDrawerData'
import { EditPromptDrawerProps, PromptTrackBy } from './EditPromptDrawer.types'

const THEME_OPTIONS = THEME_NAMES.filter((name) => name !== 'All themes')
const TRACK_BY_OPTIONS: { value: PromptTrackBy; label: string }[] = [
  { value: 'location', label: 'By location' },
  { value: 'brand', label: 'By brand' },
  { value: 'both', label: 'By location & brand' },
]

type MenuKey = 'theme' | 'locations' | 'tags'

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
        checked ? 'border-primary bg-primary' : 'border-control-border bg-surface'
      }`}
    >
      {checked && <Icon name="check" size={14} weight={500} className="text-white" />}
    </span>
  )
}

export function EditPromptDrawer({ open, themeName, prompt, onClose, onSave }: EditPromptDrawerProps) {
  const [text, setText] = useState('')
  const [theme, setTheme] = useState('')
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [aiSites, setAiSites] = useState<string[]>([])
  const [tagIds, setTagIds] = useState<string[]>([])
  const [trackBy, setTrackBy] = useState<PromptTrackBy>('location')
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    if (open) {
      setText(prompt?.text ?? '')
      setTheme(themeName)
      setLocationIds(THEME_LOCATIONS.map((l) => l.id))
      setAiSites(prompt?.aiSites ?? [])
      setTagIds([])
      setTrackBy('location')
      setOpenMenu(null)
    }
  }, [open, themeName, prompt])

  function toggleMenu(key: MenuKey, e: React.MouseEvent<HTMLButtonElement>) {
    if (openMenu === key) {
      setOpenMenu(null)
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, left: r.left, width: r.width })
    setOpenMenu(key)
  }

  function toggleAiSite(site: string) {
    setAiSites((prev) => (prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site]))
  }

  const canSubmit = !!text.trim() && !!theme && aiSites.length > 0

  function handleSave() {
    if (!canSubmit) return
    onSave(themeName, { text: text.trim(), theme, locationIds, aiSites, tagIds, trackBy })
  }

  const locationTriggerLabel =
    locationIds.length === 0
      ? 'Select'
      : locationIds.length === THEME_LOCATIONS.length
        ? 'All selected'
        : `${locationIds.length} selected`

  const tagTriggerLabel = tagIds.length === 0 ? 'Select' : `${tagIds.length} selected`

  return (
    <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[650px] max-w-[92vw] flex-col bg-surface shadow-dropdown transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-2xl pb-lg pt-2xl">
          <div className="flex items-center gap-sm">
            <button
              type="button"
              aria-label="Back"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
            >
              <BackArrowIcon />
            </button>
            <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Edit prompt</h2>
          </div>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSave}
              className={`rounded-sm px-lg py-[7px] text-body transition-colors ${
                canSubmit
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
              }`}
            >
              Save
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-lg overflow-y-auto px-2xl pb-2xl pt-md">
          {/* Prompt text */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">
              Prompt <span className="text-danger">*</span>
            </label>
            <textarea
              value={text}
              rows={3}
              placeholder="Enter prompt"
              onChange={(e) => setText(e.target.value)}
              className="w-full resize-none rounded-sm border border-border-input px-md py-sm text-body text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary"
            />
          </div>

          {/* Theme */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">
              Theme <span className="text-danger">*</span>
            </label>
            <button
              type="button"
              onClick={(e) => toggleMenu('theme', e)}
              className={`flex h-9 w-full items-center gap-sm rounded-sm border bg-surface pl-md pr-sm hover:bg-surface-l2 ${
                openMenu === 'theme' ? 'border-primary' : 'border-border-input'
              }`}
            >
              <span className={`min-w-0 flex-1 truncate text-left text-body ${theme ? 'text-text-primary' : 'text-text-tertiary'}`}>
                {theme || 'Select theme'}
              </span>
              <Icon name={openMenu === 'theme' ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
            </button>
          </div>

          {/* Locations */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">Locations</label>
            <button
              type="button"
              onClick={(e) => toggleMenu('locations', e)}
              className={`flex h-9 w-full items-center gap-sm rounded-sm border bg-surface pl-md pr-sm hover:bg-surface-l2 ${
                openMenu === 'locations' ? 'border-primary' : 'border-border-input'
              }`}
            >
              <span className="min-w-0 flex-1 truncate text-left text-body text-text-primary">{locationTriggerLabel}</span>
              <Icon name={openMenu === 'locations' ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
            </button>
          </div>

          {/* AI sites */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">
              AI sites <span className="text-danger">*</span>
            </label>
            <div className="flex flex-wrap gap-md">
              {ALL_AI_SITES.map((site) => (
                <button
                  key={site}
                  type="button"
                  onClick={() => toggleAiSite(site)}
                  className="flex items-center gap-sm rounded-sm py-xs"
                >
                  <CheckBox checked={aiSites.includes(site)} />
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                    style={{ backgroundColor: AI_SITE_COLORS[site] ?? '#8f8f8f' }}
                  >
                    {site.charAt(0)}
                  </span>
                  <span className="text-body text-text-primary">{site}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">Tags</label>
            <button
              type="button"
              onClick={(e) => toggleMenu('tags', e)}
              className={`flex h-9 w-full items-center gap-sm rounded-sm border bg-surface pl-md pr-sm hover:bg-surface-l2 ${
                openMenu === 'tags' ? 'border-primary' : 'border-border-input'
              }`}
            >
              <span className="min-w-0 flex-1 truncate text-left text-body text-text-primary">{tagTriggerLabel}</span>
              <Icon name={openMenu === 'tags' ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
            </button>
          </div>

          {/* Track by */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">Track by</label>
            <div className="flex items-center gap-xl">
              {TRACK_BY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTrackBy(option.value)}
                  className="flex items-center gap-sm"
                >
                  <span
                    className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                      trackBy === option.value ? 'border-primary' : 'border-control-border'
                    }`}
                  >
                    {trackBy === option.value && <span className="size-[10px] rounded-full bg-primary" />}
                  </span>
                  <span className="text-body text-text-primary">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Dropdown menus */}
      {openMenu && anchor && (
        <>
          <div className="fixed inset-0 z-[105]" onClick={() => setOpenMenu(null)} />
          <div className="fixed z-[110]" style={{ top: anchor.top, left: anchor.left, width: anchor.width }}>
            {openMenu === 'theme' && (
              <SelectMenu
                options={THEME_OPTIONS.map((name) => ({ value: name, label: name }))}
                value={theme ? [theme] : []}
                searchable={THEME_OPTIONS.length > 6}
                onChange={(val) => {
                  setTheme(val[0] ?? '')
                  setOpenMenu(null)
                }}
              />
            )}
            {openMenu === 'locations' && (
              <SelectMenu
                options={THEME_LOCATIONS.map((l) => ({ value: l.id, label: l.label }))}
                value={locationIds}
                multi
                searchable
                onChange={setLocationIds}
              />
            )}
            {openMenu === 'tags' && (
              <SelectMenu
                options={THEME_TAGS.map((t) => ({ value: t.id, label: t.label }))}
                value={tagIds}
                multi
                searchable
                onChange={setTagIds}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
