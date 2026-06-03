export interface TopNavProps {
  /** Avatar image URL; falls back to an initials circle when omitted. */
  avatarUrl?: string
  initials?: string
  onAdd?: () => void
  onHelp?: () => void
  onMenu?: () => void
}
