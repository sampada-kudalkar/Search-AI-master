export interface RailNavItem {
  id: string
  label: string
  /** A Material Symbols ligature name, or an imported SVG/image URL when kind === 'image'. */
  icon: string
  kind?: 'symbol' | 'image'
  /** Optional badge text (e.g. "New"). */
  badge?: string
}

export interface RailGroup {
  id: string
  /** Section label shown above the group when expanded. Groups are separated by dividers. */
  header?: string
  items: RailNavItem[]
}

export interface IconRailProps {
  /** Imported brand logo (SVG/PNG URL) shown in the header cell. */
  logoSrc: string
  /** Brand wordmark shown next to the logo when expanded. */
  brand: string
  groups: RailGroup[]
  activeId: string
  onSelect?: (id: string) => void
}
