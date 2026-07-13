import { useState } from 'react'
import { BrandDrawer, Chip, DataTable, Icon, type Column, type RowMenuItem } from '../components'
import { BRAND_KITS, BRANDS, Brand, brandKitLabel } from '../data/brandsData'

export function BrandsScreen() {
  const [brands, setBrands] = useState<Brand[]>(BRANDS)
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; brand: Brand | null } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Brand | null>(null)

  function handleSave(values: { name: string; domainUrl: string; brandKitIds: string[] }) {
    if (drawer?.mode === 'edit' && drawer.brand) {
      const id = drawer.brand.id
      setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...values } : b)))
    } else {
      setBrands((prev) => [
        ...prev,
        { id: `brand-${Date.now()}`, status: 'Not tracking', ...values },
      ])
    }
    setDrawer(null)
  }

  function toggleTracking(brand: Brand) {
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, status: b.status === 'Tracking' ? 'Not tracking' : 'Tracking' } : b)),
    )
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setBrands((prev) => prev.filter((b) => b.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  const columns: Column<Brand>[] = [
    { key: 'name', label: 'Brand', sortable: true },
    { key: 'domainUrl', label: 'Website URL' },
    {
      key: 'status',
      label: 'Status',
      render: (_v, row) => <Chip label={row.status} variant={row.status === 'Tracking' ? 'success' : 'neutral'} />,
    },
    {
      key: 'brandKitIds',
      label: 'Brand kit',
      render: (_v, row) => brandKitLabel(row.brandKitIds),
    },
  ]

  const rowMenuItems: RowMenuItem<Brand>[] = [
    { label: 'Stop tracking', onClick: toggleTracking, visible: (row) => row.status === 'Tracking' },
    { label: 'Start tracking', onClick: toggleTracking, visible: (row) => row.status === 'Not tracking' },
    { label: 'Edit', onClick: (row) => setDrawer({ mode: 'edit', brand: row }) },
    { label: 'Delete', onClick: (row) => setPendingDelete(row), variant: 'danger' },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between bg-surface px-2xl py-xl">
        <h1 className="text-h3 text-text-primary">Brands</h1>
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => setDrawer({ mode: 'add', brand: null })}
            className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
          >
            + Add brand
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

      <div className="flex-1 overflow-auto px-2xl pt-lg">
        <div className="rounded-lg border border-border shadow-card">
          <div className="px-2xl pb-lg pt-xl">
            <h2 className="text-h4 text-text-secondary">Brands</h2>
            <p className="mt-xs text-small text-text-secondary">
              Manage the brands and child brands you want to track, run Search AI reports
            </p>
          </div>
          <DataTable<Brand>
            columns={columns}
            data={brands}
            rowAction={{ icon: 'edit', label: 'Edit', onClick: (row) => setDrawer({ mode: 'edit', brand: row }) }}
            rowMenuItems={rowMenuItems}
          />
        </div>
      </div>

      <BrandDrawer
        open={!!drawer}
        mode={drawer?.mode ?? 'add'}
        initialValues={
          drawer?.brand
            ? { name: drawer.brand.name, domainUrl: drawer.brand.domainUrl, brandKitIds: drawer.brand.brandKitIds }
            : undefined
        }
        brandKitOptions={BRAND_KITS}
        onClose={() => setDrawer(null)}
        onSave={handleSave}
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
    </div>
  )
}
