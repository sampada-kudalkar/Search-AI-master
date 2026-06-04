export interface InfoCardProps {
  title: string
  description: string
  /** Optional primary action button (e.g. "Set up"). */
  actionLabel?: string
  onAction?: () => void
}

export function InfoCard({ title, description, actionLabel, onAction }: InfoCardProps) {
  return (
    <div className="flex flex-col rounded-md border border-border bg-surface p-lg">
      <h3 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{title}</h3>
      <p className="mt-sm flex-1 text-body text-text-secondary">{description}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-lg self-start rounded-sm bg-primary px-lg py-[7px] text-body font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
