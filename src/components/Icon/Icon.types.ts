export interface IconProps {
  /** Material Symbols (Outlined) ligature name, e.g. "location_on". */
  name: string
  /** Rendered glyph size in px. */
  size?: number
  /** Whether to use the filled variant. */
  fill?: boolean
  /** Optical weight axis (100–700). */
  weight?: number
  className?: string
}
