import { useState } from 'react'
import { BrandDrawer, CardTabs, Chip, DataTable, Icon, InfoTooltip, type Column, type RowMenuItem, type Tab } from '../components'
import { BRANDS, Brand, BrandKitInstance, OTHER_BRANDS, OtherBrand } from '../data/brandsData'

type BrandVariationRow = OtherBrand & { isYourBrand?: boolean }

const TABS: Tab[] = [
  { id: 'your-brands', label: 'Your brands' },
  { id: 'brand-variations', label: 'Brand variations' },
]

const INITIAL_BRANDS: Brand[] = [BRANDS[0]]

export function BrandV1Screen() {
  const [activeTab, setActiveTab] = useState('your-brands')

  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS)
  const [otherBrands, setOtherBrands] = useState<OtherBrand[]>(OTHER_BRANDS)
  const [savedBrands, setSavedBrands] = useState<Brand[]>(INITIAL_BRANDS)
  const [savedOtherBrands, setSavedOtherBrands] = useState<OtherBrand[]>(OTHER_BRANDS)

  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; brand: Brand | null } | null>(null)
  const [otherDrawer, setOtherDrawer] = useState<{ mode: 'add' | 'edit'; brand: OtherBrand | null } | null>(null)
  const [otherPendingDelete, setOtherPendingDelete] = useState<OtherBrand | null>(null)

  const isDirty =
    JSON.stringify(brands) !== JSON.stringify(savedBrands) ||
    JSON.stringify(otherBrands) !== JSON.stringify(savedOtherBrands)

  function handleCancel() {
    setBrands(savedBrands)
    setOtherBrands(savedOtherBrands)
  }

  function handleSave() {
    setSavedBrands(brands)
    setSavedOtherBrands(otherBrands)
  }

  function handleSaveBrand(values: { name: string; domainUrl: string; variations: string[]; brandKits: BrandKitInstance[] }) {
    if (drawer?.mode === 'edit' && drawer.brand) {
      const id = drawer.brand.id
      setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...values } : b)))
    } else {
      setBrands((prev) => [...prev, { id: `brand-${Date.now()}`, status: 'Tracking', ...values }])
    }
    setDrawer(null)
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

  const brandColumns: Column<Brand>[] = [
    {
      key: 'name',
      label: 'Brand',
      sortable: true,
      render: (_v, row) => <span className="text-body text-text-primary group-hover/row:text-text-action">{row.name}</span>,
    },
    { key: 'domainUrl', label: 'Website', render: (_v, row) => row.domainUrl },
  ]

  const brandRowMenuItems: RowMenuItem<Brand>[] = [
    { label: 'Edit brand', onClick: (row) => setDrawer({ mode: 'edit', brand: row }) },
  ]

  const variationRows: BrandVariationRow[] = [
    ...brands.map((b) => ({ id: b.id, name: b.name, domainUrl: b.domainUrl, variations: b.variations, isYourBrand: true })),
    ...otherBrands.map((b) => ({ ...b, isYourBrand: false })),
  ]

  const variationColumns: Column<BrandVariationRow>[] = [
    {
      key: 'name',
      label: 'Brand',
      sortable: true,
      render: (_v, row) => (
        <div className="flex items-center gap-xs">
          <span className="text-body text-text-primary group-hover/row:text-text-action">{row.name}</span>
          {row.isYourBrand && (
            <span className="shrink-0 rounded-full border border-white bg-gradient-to-b from-[#0f7195] to-[#094459] px-[8px] py-[2px] text-small text-white">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'variations',
      label: 'Variations',
      render: (_v, row) =>
        row.variations.length === 0 ? (
          <span className="text-small text-text-tertiary group-hover/row:text-text-action">Add variations</span>
        ) : (
          <div className="flex flex-wrap gap-xs">
            {row.variations.map((variation) => (
              <Chip key={variation} label={variation} variant="neutral" />
            ))}
          </div>
        ),
    },
  ]

  const variationMenuItems: RowMenuItem<BrandVariationRow>[] = [
    { label: 'Edit', onClick: (row) => openVariationEdit(row) },
    {
      label: 'Delete',
      onClick: (row) => setOtherPendingDelete(otherBrands.find((o) => o.id === row.id) ?? null),
      variant: 'danger',
      visible: (row) => !row.isYourBrand,
    },
  ]

  function openVariationEdit(row: BrandVariationRow) {
    if (row.isYourBrand) {
      const brand = brands.find((b) => b.id === row.id)
      if (brand) setDrawer({ mode: 'edit', brand })
    } else {
      const brand = otherBrands.find((o) => o.id === row.id)
      if (brand) setOtherDrawer({ mode: 'edit', brand })
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between bg-surface px-2xl py-xl">
        <div>
          <h1 className="text-h3 text-text-primary">Brands</h1>
          <p className="mt-0 text-small text-text-secondary">
            Add brands to track in reports, and map name variations separately.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isDirty}
            onClick={handleSave}
            className={`flex h-9 items-center rounded-sm px-lg text-body transition-colors ${
              isDirty ? 'bg-primary text-white hover:bg-primary-hover' : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      <div className="border-b border-border px-2xl">
        <CardTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-auto px-2xl pt-lg pb-xl">
        {activeTab === 'your-brands' ? (
          <div className="rounded-lg border border-border shadow-card">
            <div className="flex items-center justify-between px-2xl pb-lg pt-xl">
              <div>
                <h2 className="text-h4 text-text-secondary">Your brands</h2>
                <p className="mt-0 text-small text-text-secondary">Add a brand to include it in your reports.</p>
              </div>
              <div className="flex items-center gap-sm">
                {brands.length >= 5 && (
                  <button
                    type="button"
                    aria-label="Search"
                    className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
                  >
                    <Icon name="search" size={20} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDrawer({ mode: 'add', brand: null })}
                  className="flex h-9 items-center rounded-sm border border-border-selected bg-surface px-lg text-body text-text-primary hover:bg-surface-l2"
                >
                  Add brand
                </button>
              </div>
            </div>
            <div className="px-2xl pb-lg">
              <DataTable<Brand>
                columns={brandColumns}
                data={brands}
                autoRowHeight
                onRowClick={(row) => setDrawer({ mode: 'edit', brand: row })}
                rowMenuItems={brandRowMenuItems}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border shadow-card">
            <div className="flex items-center justify-between px-2xl pb-lg pt-xl">
              <div>
                <h2 className="flex items-center gap-xs text-h4 text-text-secondary">
                  Brand variations
                  <InfoTooltip text="Doesn't add a brand or start tracking." />
                </h2>
                <p className="mt-0 text-small text-text-secondary">
                  Add a brand variation so mentions map to the right brand.
                </p>
              </div>
              <div className="flex items-center gap-sm">
                {variationRows.length >= 5 && (
                  <button
                    type="button"
                    aria-label="Search"
                    className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
                  >
                    <Icon name="search" size={20} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOtherDrawer({ mode: 'add', brand: null })}
                  className="flex h-9 items-center rounded-sm border border-border-selected bg-surface px-lg text-body text-text-primary hover:bg-surface-l2"
                >
                  Add variation
                </button>
              </div>
            </div>
            <div className="px-2xl pb-lg">
              <DataTable<BrandVariationRow>
                columns={variationColumns}
                data={variationRows}
                autoRowHeight
                onRowClick={openVariationEdit}
                rowMenuItems={variationMenuItems}
              />
            </div>
          </div>
        )}
      </div>

      <BrandDrawer
        open={!!drawer}
        mode={drawer?.mode ?? 'add'}
        heading={drawer?.mode === 'edit' && drawer.brand ? drawer.brand.name : 'Add brand'}
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
        hideBrandKit
        hideVariations
        onClose={() => setDrawer(null)}
        onSave={handleSaveBrand}
      />

      <BrandDrawer
        open={!!otherDrawer}
        mode={otherDrawer?.mode ?? 'add'}
        heading={otherDrawer?.mode === 'edit' && otherDrawer.brand ? otherDrawer.brand.name : 'Add variation'}
        hideBrandKit
        hideDomainUrl
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

      {otherPendingDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20">
          <div className="w-[400px] rounded-md bg-surface p-2xl shadow-modal">
            <h2 className="text-h4 text-text-primary">Delete this variation?</h2>
            <p className="mt-sm text-body text-text-secondary">
              This brand will be removed from Brand variations. This can&apos;t be undone.
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
                Delete variation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
