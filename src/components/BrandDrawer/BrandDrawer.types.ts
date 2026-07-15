import { BrandKitInstance } from '../../data/brandsData'

export interface BrandDrawerValues {
  name: string
  domainUrl: string
  variations: string[]
  brandKits: BrandKitInstance[]
}

export interface BrandDrawerProps {
  open: boolean
  mode: 'add' | 'edit'
  initialValues?: BrandDrawerValues
  heading?: string
  hideBrandKit?: boolean
  hideVariations?: boolean
  hideDomainUrl?: boolean
  onClose: () => void
  onSave: (values: BrandDrawerValues) => void
}
