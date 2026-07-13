import { BrandKitOption } from '../../data/brandsData'

export interface BrandDrawerValues {
  name: string
  domainUrl: string
  brandKitIds: string[]
}

export interface BrandDrawerProps {
  open: boolean
  mode: 'add' | 'edit'
  initialValues?: BrandDrawerValues
  brandKitOptions: BrandKitOption[]
  onClose: () => void
  onSave: (values: BrandDrawerValues) => void
}
