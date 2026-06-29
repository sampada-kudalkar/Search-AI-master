export const AVATAR_COLORS = [
  'bg-primary',
  'bg-[#e91e63]',
  'bg-[#ff9800]',
  'bg-[#009688]',
  'bg-[#607d8b]',
  'bg-[#9c27b0]',
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function getCompetitorColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]!
}
