import type { ReactNode } from 'react'

export interface CardHeaderProps {
  title: string | ReactNode
  subtitle?: string
  toolbar?: ReactNode
}

export function CardHeader({ title, subtitle, toolbar }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-md">
      <div className="flex flex-col gap-[2px]">
        <div className="text-[16px] leading-[24px] tracking-[-0.32px] text-text-secondary">
          {title}
        </div>
        {subtitle && (
          <p className="text-small text-text-secondary leading-[18px]">{subtitle}</p>
        )}
      </div>
      {toolbar && (
        <div className="flex items-center gap-[8px] shrink-0 ml-md">{toolbar}</div>
      )}
    </div>
  )
}
