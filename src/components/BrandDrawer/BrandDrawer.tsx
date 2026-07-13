import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { SelectMenu } from '../SelectMenu/SelectMenu'
import { BrandDrawerProps, BrandDrawerValues } from './BrandDrawer.types'

const EMPTY_VALUES: BrandDrawerValues = { name: '', domainUrl: '', brandKitIds: [] }

export function BrandDrawer({ open, mode, initialValues, brandKitOptions, onClose, onSave }: BrandDrawerProps) {
  const [values, setValues] = useState<BrandDrawerValues>(initialValues ?? EMPTY_VALUES)
  const [menuOpen, setMenuOpen] = useState(false)
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? EMPTY_VALUES)
      setMenuOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function openMenu(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, left: r.left, width: r.width })
    setMenuOpen((o) => !o)
  }

  const base = initialValues ?? EMPTY_VALUES
  const isDirty =
    values.name !== base.name ||
    values.domainUrl !== base.domainUrl ||
    values.brandKitIds.join(',') !== base.brandKitIds.join(',')

  function handleSave() {
    if (!isDirty) return
    onSave(values)
  }

  const title = mode === 'edit' ? 'Edit' : 'Add'
  const kitLabel =
    values.brandKitIds.length === 0
      ? 'Select or create brand kit'
      : brandKitOptions
          .filter((k) => values.brandKitIds.includes(k.id))
          .map((k) => k.label)
          .join(', ')

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
            <label className="text-small text-text-primary">Name</label>
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
            <label className="text-small text-text-primary">Brand kit</label>
            <button
              type="button"
              onClick={openMenu}
              className={`flex h-9 w-full items-center gap-sm rounded-sm border bg-surface pl-md pr-sm hover:bg-surface-l2 ${
                menuOpen ? 'border-primary' : 'border-border-input'
              }`}
            >
              <span className="min-w-0 flex-1 truncate text-left text-body text-text-primary">{kitLabel}</span>
              <Icon name={menuOpen ? 'expand_less' : 'expand_more'} size={20} className="shrink-0 text-text-icon" />
            </button>
          </div>
        </div>
      </aside>

      {menuOpen && anchor && (
        <>
          <div className="fixed inset-0 z-[105]" onClick={() => setMenuOpen(false)} />
          <div className="fixed z-[110]" style={{ top: anchor.top, left: anchor.left, width: anchor.width }}>
            <SelectMenu
              options={brandKitOptions.map((k) => ({ value: k.id, label: k.label }))}
              value={values.brandKitIds}
              multi
              searchable={false}
              onChange={(ids) => setValues((v) => ({ ...v, brandKitIds: ids }))}
            />
          </div>
        </>
      )}
    </div>
  )
}
