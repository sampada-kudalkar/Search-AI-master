import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { BrandKitInstance } from '../../data/brandsData'
import { BrandDrawerProps, BrandDrawerValues } from './BrandDrawer.types'

const EMPTY_VALUES: BrandDrawerValues = { name: '', domainUrl: '', variations: [], brandKits: [] }
const EMPTY_KIT_DRAFT = { name: '', locationScope: '' }

export function BrandDrawer({ open, mode, initialValues, heading, hideBrandKit, onClose, onSave }: BrandDrawerProps) {
  const [values, setValues] = useState<BrandDrawerValues>(initialValues ?? EMPTY_VALUES)
  const [variationDraft, setVariationDraft] = useState('')
  const [editingKitId, setEditingKitId] = useState<string | null>(null)
  const [addingKit, setAddingKit] = useState(false)
  const [kitDraft, setKitDraft] = useState(EMPTY_KIT_DRAFT)

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? EMPTY_VALUES)
      setVariationDraft('')
      setEditingKitId(null)
      setAddingKit(false)
      setKitDraft(EMPTY_KIT_DRAFT)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const base = initialValues ?? EMPTY_VALUES
  const isDirty =
    values.name !== base.name ||
    values.domainUrl !== base.domainUrl ||
    values.variations.join('|') !== base.variations.join('|') ||
    JSON.stringify(values.brandKits) !== JSON.stringify(base.brandKits)

  function handleSave() {
    if (!isDirty) return
    onSave(values)
  }

  function addVariation() {
    const trimmed = variationDraft.trim()
    if (!trimmed) return
    setValues((v) => ({ ...v, variations: [...v.variations, trimmed] }))
    setVariationDraft('')
  }

  function removeVariation(variation: string) {
    setValues((v) => ({ ...v, variations: v.variations.filter((x) => x !== variation) }))
  }

  function startEditKit(kit: BrandKitInstance) {
    setAddingKit(false)
    setEditingKitId(kit.id)
    setKitDraft({ name: kit.name, locationScope: kit.locationScope })
  }

  function saveEditKit() {
    if (!editingKitId) return
    setValues((v) => ({
      ...v,
      brandKits: v.brandKits.map((k) => (k.id === editingKitId ? { ...k, ...kitDraft } : k)),
    }))
    setEditingKitId(null)
    setKitDraft(EMPTY_KIT_DRAFT)
  }

  function removeKit(id: string) {
    setValues((v) => ({ ...v, brandKits: v.brandKits.filter((k) => k.id !== id) }))
    if (editingKitId === id) {
      setEditingKitId(null)
      setKitDraft(EMPTY_KIT_DRAFT)
    }
  }

  function saveNewKit() {
    if (!kitDraft.name.trim()) return
    setValues((v) => ({
      ...v,
      brandKits: [...v.brandKits, { id: `bk-${v.brandKits.length}-${kitDraft.name}`, ...kitDraft }],
    }))
    setAddingKit(false)
    setKitDraft(EMPTY_KIT_DRAFT)
  }

  const title = heading ?? (mode === 'edit' ? 'Edit' : 'Add')

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
            <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{title}</h2>
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
              disabled={!isDirty}
              onClick={handleSave}
              className={`rounded-sm px-lg py-[7px] text-body transition-colors ${
                isDirty
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
          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">Brand</label>
            <input
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              placeholder="Enter brand name"
              className="h-9 w-full rounded-sm border border-border-input bg-surface px-md text-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">Domain URL</label>
            <input
              value={values.domainUrl}
              onChange={(e) => setValues((v) => ({ ...v, domainUrl: e.target.value }))}
              placeholder="Enter URL"
              className="h-9 w-full rounded-sm border border-border-input bg-surface px-md text-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-small text-text-primary">Brand variations</label>
            <div className="flex min-h-[144px] flex-wrap content-start gap-xs rounded-sm border border-border-input p-md">
              {values.variations.map((variation) => (
                <span
                  key={variation}
                  className="flex items-center gap-xs rounded-sm bg-chip-neutral-bg px-sm py-xs text-small text-text-primary"
                >
                  {variation}
                  <button
                    type="button"
                    aria-label={`Remove ${variation}`}
                    onClick={() => removeVariation(variation)}
                    className="flex items-center"
                  >
                    <Icon name="close" size={16} className="text-text-icon" />
                  </button>
                </span>
              ))}
              <input
                value={variationDraft}
                onChange={(e) => setVariationDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addVariation()
                  }
                }}
                placeholder={values.variations.length === 0 ? 'Type a variation and press Enter' : ''}
                className="min-w-[120px] flex-1 bg-transparent text-small text-text-primary placeholder:text-text-tertiary outline-none"
              />
            </div>
          </div>

          {!hideBrandKit && (
            <div className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <h3 className="text-body text-text-primary">Brand kit</h3>
                <p className="text-small text-text-secondary">
                  Get AI prompt recommendations that align with your brand voice, audience, and business goals. You
                  can configure different brand kits specific to your locations
                </p>
              </div>

              <div className="flex flex-col gap-xs">
                {values.brandKits.map((kit) =>
                  editingKitId === kit.id ? (
                    <BrandKitDraftRow
                      key={kit.id}
                      draft={kitDraft}
                      onChange={setKitDraft}
                      onCancel={() => {
                        setEditingKitId(null)
                        setKitDraft(EMPTY_KIT_DRAFT)
                      }}
                      onSave={saveEditKit}
                    />
                  ) : (
                    <BrandKitRow
                      key={kit.id}
                      kit={kit}
                      onEdit={() => startEditKit(kit)}
                      onRemove={() => removeKit(kit.id)}
                    />
                  ),
                )}

                {addingKit && (
                  <BrandKitDraftRow
                    draft={kitDraft}
                    onChange={setKitDraft}
                    onCancel={() => {
                      setAddingKit(false)
                      setKitDraft(EMPTY_KIT_DRAFT)
                    }}
                    onSave={saveNewKit}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingKitId(null)
                  setKitDraft(EMPTY_KIT_DRAFT)
                  setAddingKit(true)
                }}
                className="flex w-fit items-center gap-xs text-body text-text-action hover:underline"
              >
                <Icon name="add_circle" size={16} className="text-text-action" />
                Add brand kit
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

function BrandKitRow({
  kit,
  onEdit,
  onRemove,
}: {
  kit: BrandKitInstance
  onEdit: () => void
  onRemove: () => void
}) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  function showTooltip(e: React.MouseEvent<HTMLButtonElement>, text: string) {
    const r = e.currentTarget.getBoundingClientRect()
    setTooltip({ text, x: r.left + r.width / 2, y: r.bottom + 6 })
  }

  return (
    <div className="group flex w-full items-center justify-between rounded-lg bg-surface-l2 px-md py-sm hover:bg-surface-hover">
      <div className="flex flex-col">
        <span className="text-body text-text-primary">{kit.name}</span>
        <span className="text-small text-text-secondary">{kit.locationScope}</span>
      </div>
      <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100">
        <button
          type="button"
          aria-label={`Edit ${kit.name}`}
          onClick={onEdit}
          onMouseEnter={(e) => showTooltip(e, 'Edit')}
          onMouseLeave={() => setTooltip(null)}
          className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
        >
          <Icon name="edit" size={16} />
        </button>
        <button
          type="button"
          aria-label={`Remove ${kit.name}`}
          onClick={onRemove}
          onMouseEnter={(e) => showTooltip(e, 'Remove')}
          onMouseLeave={() => setTooltip(null)}
          className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-[120] -translate-x-1/2 max-w-[300px] whitespace-normal break-words rounded-sm bg-[#1c1c1c] px-sm py-xs text-small text-white"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

function BrandKitDraftRow({
  draft,
  onChange,
  onCancel,
  onSave,
}: {
  draft: { name: string; locationScope: string }
  onChange: (draft: { name: string; locationScope: string }) => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="flex w-full flex-col gap-sm rounded-lg bg-surface-hover px-md py-sm">
      <input
        value={draft.name}
        onChange={(e) => onChange({ ...draft, name: e.target.value })}
        placeholder="Brand kit name"
        className="h-9 w-full rounded-sm border border-border-input bg-surface px-md text-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
      />
      <input
        value={draft.locationScope}
        onChange={(e) => onChange({ ...draft, locationScope: e.target.value })}
        placeholder="Location scope (e.g. All locations)"
        className="h-9 w-full rounded-sm border border-border-input bg-surface px-md text-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
      />
      <div className="flex items-center justify-end gap-sm">
        <button type="button" onClick={onCancel} className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover">
          Cancel
        </button>
        <button
          type="button"
          disabled={!draft.name.trim()}
          onClick={onSave}
          className={`rounded-sm px-lg py-[7px] text-body transition-colors ${
            draft.name.trim()
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  )
}
