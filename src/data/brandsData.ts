export type BrandTrackingStatus = 'Tracking' | 'Not tracking'

export interface BrandKitOption {
  id: string
  label: string
}

export type Brand = {
  id: string
  name: string
  domainUrl: string
  status: BrandTrackingStatus
  brandKitIds: string[]
}

export const BRAND_KITS: BrandKitOption[] = [
  { id: 'kit-1', label: 'Primary brand kit' },
  { id: 'kit-2', label: 'Secondary brand kit' },
]

export const BRANDS: Brand[] = [
  {
    id: 'brand-1',
    name: 'My Family Dental',
    domainUrl: 'myfamilydental.com',
    status: 'Tracking',
    brandKitIds: ['kit-1'],
  },
]

export function brandKitLabel(brandKitIds: string[]): string {
  if (brandKitIds.length === 0) return 'No brand kit'
  if (brandKitIds.length === 1) return '1 brand kit'
  return `${brandKitIds.length} brand kits`
}
