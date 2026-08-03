import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { Chip } from '../Chip/Chip'
import type { CompetitorSentimentDrawerProps } from './CompetitorSentimentDrawer.types'

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

export function CompetitorSentimentDrawer({ open, onClose, row }: CompetitorSentimentDrawerProps) {
  if (!row) return null

  return (
    <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[650px] max-w-[92vw] flex-col bg-surface shadow-dropdown transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center gap-sm px-2xl pb-lg pt-2xl">
          <button
            type="button"
            aria-label="Back"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <BackArrowIcon />
          </button>
          <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Competitor sentiment details</h2>
        </div>

        <div className="flex flex-1 flex-col gap-lg overflow-y-auto px-2xl pb-2xl">
          <div className="flex flex-col items-center pb-xl pt-md">
            <span className="flex size-16 items-center justify-center rounded-full bg-chip-info-bg text-h3 text-chip-info-text">
              {getInitials(row.name)}
            </span>
            <h3 className="mt-md text-h3 text-text-primary">{row.name}</h3>
            {row.isYou && (
              <span className="mt-xs rounded-full bg-primary px-sm py-[2px] text-small text-white">You</span>
            )}
          </div>

          <div>
            <p className="text-small text-text-tertiary">Sentiment score</p>
            <p className="text-[32px] leading-10 tracking-[-0.64px] text-text-primary">{row.sentiment}%</p>
          </div>

          <div className="border-t border-border pt-lg">
            <p className="text-body text-text-primary">Strengths</p>
            <div className="mt-sm flex flex-wrap gap-xs">
              {row.strengths.length ? (
                row.strengths.map((s) => <Chip key={s} label={s} variant="success" />)
              ) : (
                <span className="text-small text-text-tertiary">None noted</span>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-lg">
            <p className="text-body text-text-primary">Weaknesses</p>
            <div className="mt-sm flex flex-wrap gap-xs">
              {row.weaknesses.length ? (
                row.weaknesses.map((w) => <Chip key={w} label={w} variant="danger" />)
              ) : (
                <span className="text-small text-text-tertiary">None noted</span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
