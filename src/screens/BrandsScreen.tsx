import { useState } from 'react'
import { BrandDrawer, Chip, DataTable, Icon, InfoTooltip, type Column, type RowAction, type RowMenuItem } from '../components'
import { BRANDS, Brand, BrandKitInstance, brandKitLabel, isZeroState, OTHER_BRANDS, OtherBrand } from '../data/brandsData'

export function BrandsScreen() {
  const [brands, setBrands] = useState<Brand[]>(BRANDS)
  const [otherBrands, setOtherBrands] = useState<OtherBrand[]>(OTHER_BRANDS)
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; brand: Brand | null; via?: 'row' | 'action' } | null>(
    null,
  )
  const [pendingDelete, setPendingDelete] = useState<Brand | null>(null)
  const [otherDrawer, setOtherDrawer] = useState<{ mode: 'add' | 'edit'; brand: OtherBrand | null } | null>(null)
  const [otherPendingDelete, setOtherPendingDelete] = useState<OtherBrand | null>(null)

  function handleSave(values: { name: string; domainUrl: string; variations: string[]; brandKits: BrandKitInstance[] }) {
    if (drawer?.mode === 'edit' && drawer.brand) {
      const id = drawer.brand.id
      setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...values } : b)))
    } else {
      setBrands((prev) => [...prev, { id: `brand-${Date.now()}`, status: 'Tracking', ...values }])
    }
    setDrawer(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setBrands((prev) => prev.filter((b) => b.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  function handleSaveOtherBrand(values: { name: string; domainUrl: string; variations: string[] }) {
    if (otherDrawer?.mode === 'edit' && otherDrawer.brand) {
      const id = otherDrawer.brand.id
      setOtherBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...values } : b)))
    } else {
      setOtherBrands((prev) => [...prev, { id: `other-${Date.now()}`, ...values }])
    }
    setOtherDrawer(null)
  }

  function confirmDeleteOtherBrand() {
    if (!otherPendingDelete) return
    setOtherBrands((prev) => prev.filter((b) => b.id !== otherPendingDelete.id))
    setOtherPendingDelete(null)
  }

  const columns: Column<Brand>[] = [
    {
      key: 'name',
      label: 'Brand',
      sortable: true,
      render: (_v, row) => (
        <div className="flex flex-col">
          <span className="text-body text-text-primary group-hover/row:text-text-action">{row.name}</span>
          <span className="text-small text-text-secondary">{row.domainUrl}</span>
        </div>
      ),
    },
    {
      key: 'variations',
      label: (
        <span className="flex items-center gap-xs">
          Brand variation
          <InfoTooltip text="Alternate names, abbreviations, or spellings tracked for this brand." />
        </span>
      ),
      render: (_v, row) =>
        isZeroState(row) ? (
          <span className="text-small text-text-tertiary group-hover/row:text-text-action">Add brand variations</span>
        ) : (
          <div className="flex flex-wrap gap-xs">
            {row.variations.map((variation) => (
              <Chip key={variation} label={variation} variant="neutral" />
            ))}
          </div>
        ),
    },
    {
      key: 'brandKits',
      label: (
        <span className="flex items-center gap-xs">
          Brand kit
          <InfoTooltip text="The brand kit whose visual assets and styling are applied to this brand." />
        </span>
      ),
      render: (_v, row) =>
        isZeroState(row) || row.brandKits.length === 0 ? (
          <span className="text-small text-text-tertiary group-hover/row:text-text-action">Add brand kit</span>
        ) : (
          brandKitLabel(row.brandKits)
        ),
    },
  ]

  const rowMenuItems: RowMenuItem<Brand>[] = [
    {
      label: (row) => (row.brandKits.length === 0 ? 'Add brand kit' : 'View brand kit'),
      onClick: (row) => setDrawer({ mode: 'edit', brand: row, via: 'action' }),
    },
    {
      label: 'Edit',
      onClick: (row) => setDrawer({ mode: 'edit', brand: row, via: 'action' }),
      visible: (row) => !isZeroState(row),
    },
    { label: 'Delete', onClick: (row) => setPendingDelete(row), variant: 'danger' },
  ]

  const otherBrandRowActions: RowAction<OtherBrand>[] = [
    { icon: 'edit', label: 'Edit', onClick: (row) => setOtherDrawer({ mode: 'edit', brand: row }) },
    { icon: 'delete', label: 'Delete', onClick: (row) => setOtherPendingDelete(row) },
  ]

  const otherBrandColumns: Column<OtherBrand>[] = [
    { key: 'name', label: 'Brand', sortable: true },
    {
      key: 'variations',
      label: 'Brand variations',
      render: (_v, row) => (
        <div className="flex flex-wrap gap-xs">
          {row.variations.map((variation) => (
            <Chip key={variation} label={variation} variant="neutral" />
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between bg-surface px-2xl py-xl">
        <h1 className="text-h3 text-text-primary">Brands</h1>
      </div>

      <div className="flex-1 overflow-auto px-2xl pt-lg pb-xl">
        <div className="rounded-lg border border-border shadow-card">
          <div className="flex items-center justify-between px-2xl pb-lg pt-xl">
            <div>
              <h2 className="text-h4 text-text-secondary">Your brands</h2>
              <p className="mt-0 text-small text-text-secondary">
                Manage the brands and child brands you want to track, run Search AI reports
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <button
                type="button"
                aria-label="Search"
                className="flex size-9 items-center justify-center rounded-sm text-text-icon hover:bg-surface-l2"
              >
                <Icon name="search" size={20} />
              </button>
              <button
                type="button"
                onClick={() => setDrawer({ mode: 'add', brand: null })}
                className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
              >
                + Add brand
              </button>
            </div>
          </div>
          <div className="px-2xl">
            <DataTable<Brand>
              columns={columns}
              data={brands}
              autoRowHeight
              onRowClick={(row) => setDrawer({ mode: 'edit', brand: row, via: 'row' })}
              rowAction={{
                icon: 'edit',
                label: 'Edit',
                onClick: (row) => setDrawer({ mode: 'edit', brand: row, via: 'action' }),
                visible: (row) => !isZeroState(row),
              }}
              rowMenuItems={rowMenuItems}
            />
          </div>
        </div>

        <div className="mt-lg rounded-lg border border-border shadow-card">
          <div className="flex items-center justify-between px-2xl pb-lg pt-xl">
            <div>
              <h2 className="text-h4 text-text-secondary">Competitor brands variations</h2>
              <p className="mt-0 text-small text-text-secondary">
                Manage competitor brand variations that AI may reference in responses to refer to these competitors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOtherDrawer({ mode: 'add', brand: null })}
              className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
            >
              + Add brand
            </button>
          </div>
          <div className="px-2xl">
            <DataTable<OtherBrand>
              columns={otherBrandColumns}
              data={otherBrands}
              autoRowHeight
              onRowClick={(row) => setOtherDrawer({ mode: 'edit', brand: row })}
              rowActions={otherBrandRowActions}
            />
          </div>
        </div>
      </div>

      <BrandDrawer
        open={!!drawer}
        mode={drawer?.mode ?? 'add'}
        heading={
          drawer?.mode === 'edit' && drawer.brand
            ? drawer.via === 'row'
              ? drawer.brand.name
              : `Edit ${drawer.brand.name}`
            : drawer?.mode === 'add'
              ? 'Add your brand'
              : undefined
        }
        initialValues={
          drawer?.brand
            ? {
                name: drawer.brand.name,
                domainUrl: drawer.brand.domainUrl,
                variations: drawer.brand.variations,
                brandKits: drawer.brand.brandKits,
              }
            : undefined
        }
        onClose={() => setDrawer(null)}
        onSave={handleSave}
      />

      <BrandDrawer
        open={!!otherDrawer}
        mode={otherDrawer?.mode ?? 'add'}
        heading={
          otherDrawer?.mode === 'edit' && otherDrawer.brand ? otherDrawer.brand.name : 'Add other brand'
        }
        hideBrandKit
        initialValues={
          otherDrawer?.brand
            ? {
                name: otherDrawer.brand.name,
                domainUrl: otherDrawer.brand.domainUrl,
                variations: otherDrawer.brand.variations,
                brandKits: [],
              }
            : undefined
        }
        onClose={() => setOtherDrawer(null)}
        onSave={handleSaveOtherBrand}
      />

      {pendingDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20">
          <div className="w-[400px] rounded-md bg-surface p-2xl shadow-modal">
            <h2 className="text-h4 text-text-primary">Delete this brand?</h2>
            <p className="mt-sm text-body text-text-secondary">
              Tracking will be stopped for this brand from next report run. This can't be undone.
            </p>
            <div className="mt-xl flex justify-end gap-sm">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-sm bg-danger px-lg py-[7px] text-body text-white transition-colors hover:opacity-90"
              >
                Delete brand
              </button>
            </div>
          </div>
        </div>
      )}

      {otherPendingDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20">
          <div className="w-[400px] rounded-md bg-surface p-2xl shadow-modal">
            <h2 className="text-h4 text-text-primary">Delete this brand?</h2>
            <p className="mt-sm text-body text-text-secondary">
              This brand will be removed from competitor brands. This can't be undone.
            </p>
            <div className="mt-xl flex justify-end gap-sm">
              <button
                type="button"
                onClick={() => setOtherPendingDelete(null)}
                className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteOtherBrand}
                className="rounded-sm bg-danger px-lg py-[7px] text-body text-white transition-colors hover:opacity-90"
              >
                Delete brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
