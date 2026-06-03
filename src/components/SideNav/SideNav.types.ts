export interface NavLeaf {
  id: string
  label: string
  /** Renders an open_in_new icon (external link) after the label. */
  external?: boolean
}

export interface NavSection {
  id: string
  label: string
  items?: NavLeaf[]
  defaultExpanded?: boolean
}

export interface SideNavProps {
  title: string
  sections: NavSection[]
  activeId: string
  onSelect?: (id: string) => void
}
