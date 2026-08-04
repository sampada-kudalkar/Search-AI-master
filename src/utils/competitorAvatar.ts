export const AVATAR_COLORS = [
  'bg-[#DAEAFB] text-[#1C78D3]',
  'bg-[#DCF1D9] text-[#52B143]',
  'bg-[#FDE3E1] text-[#F65D51]',
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
