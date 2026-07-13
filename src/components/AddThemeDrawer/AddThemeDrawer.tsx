import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { SelectMenu } from '../SelectMenu/SelectMenu'
import { THEME_LOCATIONS, THEME_BRANDS, generatePrompts } from '../../data/themeDrawerData'
import { AddThemeDrawerProps, TrackByOption } from './AddThemeDrawer.types'

export function AddThemeDrawer({ open, onClose, onAdd }: AddThemeDrawerProps) {
  const [name, setName] = useState('')
  const [trackBy, setTrackBy] = useState<TrackByOption | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [prompts, setPrompts] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    if (open) {
      setName('')
      setTrackBy(null)
      setSelectedIds([])
      setPrompts([])
      setMenuOpen(false)
    }
  }, [open])

  useEffect(() => {
    if (name.trim()) {
      setPrompts(generatePrompts(name.trim()))
    } else {
      setPrompts([])
    }
  }, [name])

  const options = trackBy === 'brand' ? THEME_BRANDS : THEME_LOCATIONS

  function selectTrackBy(option: TrackByOption) {
    setTrackBy(option)
    const nextOptions = option === 'brand' ? THEME_BRANDS : THEME_LOCATIONS
    setSelectedIds(nextOptions.map((o) => o.id))
  }

  function openMenu(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, left: r.left, width: r.width })
    setMenuOpen((o) => !o)
  }

  function regenerate() {
    if (name.trim()) setPrompts(generatePrompts(name.trim()))
  }

  function removePrompt(index: number) {
    setPrompts((p) => p.filter((_, i) => i !== index))
  }

  function addPrompt() {
    setPrompts((p) => [...p, ''])
  }

  function updatePrompt(index: number, value: string) {
    setPrompts((p) => p.map((prompt, i) => (i === index ? value : prompt)))
  }

  const canSubmit = !!name.trim() && !!trackBy && selectedIds.length > 0

  function handleAdd() {
    if (!canSubmit || !trackBy) return
    onAdd({ name: name.trim(), trackBy, selectedIds, prompts: prompts.filter((p) => p.trim()) })
  }

  const triggerLabel =
    selectedIds.length === 0
      ? 'Select'
      : selectedIds.length === options.length
        ? 'All selected'
        : `${selectedIds.length} selected`

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
            <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Add theme</h2>
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
              onClick={handleAdd}
              className={`rounded-sm px-lg py-[7px] text-body transition-colors ${
                canSubmit
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
              }`}
            >
              Add
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-lg overflow-y-auto px-2xl pb-2xl pt-md">
          {/* Theme name */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">
              Theme name <span className="text-danger">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter theme name"
              className="h-9 w-full rounded-sm border border-border-input bg-surface px-md text-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
            />
          </div>

          {/* Track by */}
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">
              Track by <span className="text-danger">*</span>
            </label>
            <div className="flex items-center gap-xl">
              {(['location', 'brand'] as TrackByOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectTrackBy(option)}
                  className="flex items-center gap-sm"
                >
                  <span
                    className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                      trackBy === option ? 'border-primary' : 'border-control-border'
                    }`}
                  >
                    {trackBy === option && <span className="size-[10px] rounded-full bg-primary" />}
                  </span>
                  <span className="text-body text-text-primary">By {option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location/Brand select */}
          {trackBy && (
            <div className="flex flex-col gap-xs">
              <label className="text-small text-text-primary">
                {trackBy === 'brand' ? 'Brands' : 'Locations'} <span className="text-danger">*</span>
              </label>
              <button
                type="button"
                onClick={openMenu}
                className={`flex h-9 w-full items-center gap-sm rounded-sm border bg-surface pl-md pr-sm hover:bg-surface-l2 ${
                  menuOpen ? 'border-primary' : 'border-border-input'
                }`}
              >
                <span className="min-w-0 flex-1 truncate text-left text-body text-text-primary">
                  {triggerLabel}
                </span>
                <Icon name={menuOpen ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
              </button>
            </div>
          )}

          {/* Prompts */}
          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between">
              <span className="text-small text-text-primary">Prompts</span>
              {prompts.length > 0 && (
                <button
                  type="button"
                  onClick={regenerate}
                  className="flex items-center gap-xs text-small text-text-action hover:underline"
                >
                  <Icon name="refresh" size={16} />
                  Regenerate
                </button>
              )}
            </div>

            {!name.trim() ? (
              <p className="text-small text-text-tertiary">Add theme name to generate prompts</p>
            ) : (
              <div className="flex flex-col">
                {prompts.map((prompt, index) => (
                  <div key={index} className="flex items-center gap-sm border-b border-border py-sm last:border-0">
                    <Icon name="auto_awesome" size={16} className="shrink-0 text-primary" />
                    <input
                      value={prompt}
                      onChange={(e) => updatePrompt(index, e.target.value)}
                      placeholder="Enter prompt"
                      className="min-w-0 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-tertiary"
                    />
                    <button
                      type="button"
                      aria-label="Remove prompt"
                      onClick={() => removePrompt(index)}
                      className="flex shrink-0 items-center rounded-sm text-text-icon hover:bg-surface-hover"
                    >
                      <Icon name="delete" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addPrompt}
              disabled={!name.trim()}
              className="mt-xs flex w-fit items-center gap-xs text-small text-text-action disabled:cursor-not-allowed disabled:text-text-tertiary"
            >
              <Icon name="add" size={16} />
              Add prompt
            </button>
          </div>
        </div>
      </aside>

      {/* Select menu */}
      {menuOpen && anchor && trackBy && (
        <>
          <div className="fixed inset-0 z-[105]" onClick={() => setMenuOpen(false)} />
          <div className="fixed z-[110]" style={{ top: anchor.top, left: anchor.left, width: anchor.width }}>
            <SelectMenu
              options={options.map((o) => ({ value: o.id, label: o.label }))}
              value={selectedIds}
              multi
              searchable
              onChange={setSelectedIds}
            />
          </div>
        </>
      )}
    </div>
  )
}
