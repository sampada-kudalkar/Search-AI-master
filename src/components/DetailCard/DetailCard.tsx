import { DetailCardProps } from './DetailCard.types'

export function DetailCard({ title, children, className = '' }: DetailCardProps) {
  return (
    <div className={`flex h-[400px] flex-col overflow-hidden rounded-md border border-border bg-surface ${className}`}>
      <div className="shrink-0 px-2xl pb-lg pt-2xl text-body text-text-primary">{title}</div>
      <div className="flex-1 overflow-y-auto pb-lg">
        <div className="px-2xl">{children}</div>
      </div>
    </div>
  )
}
