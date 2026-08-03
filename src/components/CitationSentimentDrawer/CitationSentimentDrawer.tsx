import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { Chip } from '../Chip/Chip'
import type { CitationSentimentDrawerProps } from './CitationSentimentDrawer.types'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-small text-text-tertiary">{label}</p>
      <p className="text-body text-text-primary">{value}</p>
    </div>
  )
}

export function CitationSentimentDrawer({ open, onClose, row }: CitationSentimentDrawerProps) {
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
          <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Citation sentiment details</h2>
        </div>

        <div className="flex flex-1 flex-col gap-lg overflow-y-auto px-2xl pb-2xl">
          <div>
            <p className="text-small text-text-tertiary">Web page</p>
            <p className="text-body text-text-primary">{row.webPage}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-lg gap-y-lg">
            <DetailField label="Category" value={row.category} />
            <DetailField label="Positive sentiment" value={`${row.positiveSentiment}%`} />
            <DetailField label="Claim occurrence" value={String(row.claimOccurrence)} />
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
