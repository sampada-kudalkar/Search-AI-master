export type BrandTrackingStatus = 'Tracking' | 'Not tracking' | 'Starts next cycle'

export interface BrandKitOption {
  id: string
  label: string
}

export interface BrandKitInstance {
  id: string
  name: string
  locationScope: string
}

export type Brand = {
  id: string
  name: string
  domainUrl: string
  status: BrandTrackingStatus
  brandKits: BrandKitInstance[]
  variations: string[]
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
    variations: ['My Family Dentist', 'MFD', 'My Family Dental Care', 'Family Dental Care'],
    brandKits: [
      { id: 'bk-1', name: 'My Family Dental', locationScope: 'All locations' },
      { id: 'bk-2', name: 'My Family Dental NYC', locationScope: '5 locations' },
      { id: 'bk-3', name: 'My Family Dental Northern', locationScope: '20 locations' },
    ],
  },
  {
    id: 'brand-2',
    name: 'Aspen Dental',
    domainUrl: 'www.aspendental.com',
    status: 'Tracking',
    variations: [],
    brandKits: [],
  },
]

export type OtherBrand = {
  id: string
  name: string
  domainUrl: string
  variations: string[]
}

export const OTHER_BRANDS: OtherBrand[] = [
  {
    id: 'other-1',
    name: 'Heartland Dental',
    domainUrl: 'www.heartlanddental.com',
    variations: ['Heartland Dental Care', 'HD Dental'],
  },
  {
    id: 'other-2',
    name: 'Bright Now Dental',
    domainUrl: 'www.brightnowdental.com',
    variations: ['Right Now Dental', 'Right Now Dentist'],
  },
  {
    id: 'other-3',
    name: 'Western Dental',
    domainUrl: 'www.westerndental.com',
    variations: ['Western Dental Services', 'Western Dental Clinics', 'Western Dental Orthodontist'],
  },
]

export function isZeroState(brand: Brand): boolean {
  return brand.variations.length === 0 && brand.brandKits.length === 0
}

export function brandKitLabel(brandKits: BrandKitInstance[]): string {
  if (brandKits.length === 0) return 'No brand kit'
  if (brandKits.length === 1) return '1 brand kit'
  return `${brandKits.length} brand kits`
}
