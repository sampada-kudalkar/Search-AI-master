import { Sparkles } from 'lucide-react'
import { Icon } from '../Icon/Icon'
import { TopNavProps } from './TopNav.types'

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-sm transition-colors hover:bg-surface-hover"
    >
      {children}
    </button>
  )
}

export function TopNav({ title, avatarUrl, initials = 'S', onAdd, onHelp, onMenu, onAskBirdAI }: TopNavProps) {
  return (
    <header className="flex h-14 items-center gap-xs border-b border-border bg-surface px-2xl">
      {title && (
        <span className="flex-1 font-normal text-text-primary" style={{ fontSize: 18, fontFamily: 'Roboto, sans-serif' }}>{title}</span>
      )}
      {!title && <span className="flex-1" />}

      {/* Ask BirdAI button */}
      <button
        type="button"
        onClick={onAskBirdAI}
        className="group ml-1 flex h-[30px] items-center gap-1 rounded-lg border-0 bg-transparent px-2 py-0 text-[12px] hover:bg-surface-hover"
      >
        <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
          <defs>
            <linearGradient id="ask-birdai-cta-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9970D7" />
              <stop offset="55%" stopColor="#7f87e8" />
              <stop offset="100%" stopColor="#2552ED" />
              <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0;-1 0" dur="2.2s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
        </svg>
        <Sparkles
          className="h-3.5 w-3.5 shrink-0 group-hover:animate-[myna-cta-icon-tilt_360ms_ease-out_1]"
          style={{ stroke: 'url(#ask-birdai-cta-gradient)' }}
        />
        <span
          className="bg-clip-text text-transparent animate-[l2-nav-shimmer_2.2s_linear_infinite]"
          style={{ backgroundImage: 'linear-gradient(90deg, #9970D7 0%, #7f87e8 55%, #2552ED 100%)', backgroundSize: '200% auto' }}
        >
          Ask BirdAI
        </span>
      </button>

      <IconButton label="Create new" onClick={onAdd}>
        <Icon name="add_circle" size={20} fill className="text-text-action" />
      </IconButton>

      <IconButton label="Help" onClick={onHelp}>
        <Icon name="help" size={20} className="text-text-icon" />
      </IconButton>

      <span className="flex size-7 items-center justify-center">
        <span className="block size-5 overflow-hidden rounded-full">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center bg-surface-selected text-[10px] font-medium text-text-secondary">
              {initials}
            </span>
          )}
        </span>
      </span>

      <IconButton label="Menu" onClick={onMenu}>
        <Icon name="menu" size={20} className="text-text-icon" />
      </IconButton>
    </header>
  )
}
