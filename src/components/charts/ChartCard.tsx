import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import { CardHeader } from '../CardHeader/CardHeader'

export interface ChartCardProps {
  title: string
  /** Visible text rendered directly below the title inside the header. */
  subtitle?: string
  /** When provided, renders an info icon next to the title that shows this text on hover. */
  tooltip?: string
  /** Renders inline immediately after the title text. */
  titleSuffix?: ReactNode
  /** Optional content shown between the title and the menu (e.g. mini KPIs). */
  toolbar?: ReactNode
  /** Show the trailing customize/menu icons (decorative on the prototype). */
  showActions?: boolean
  /** Override the left action icon (defaults to 'table_rows'). */
  leftActionIcon?: string
  className?: string
  children: ReactNode
}

function MoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-sm border border-border bg-surface p-[8px] hover:bg-surface-l2 transition-colors"
      >
        <Icon name="more_vert" size={16} className="text-text-icon" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-xs w-48 rounded-sm bg-surface p-md shadow-dropdown">
          {['Download', 'Email'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center rounded-sm px-sm py-sm text-left text-body text-text-primary transition-colors hover:bg-surface-hover"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChartCard({ title, subtitle, titleSuffix, toolbar, showActions = true, className = '', children }: ChartCardProps) {
  return (
    <section className={`flex min-h-[400px] flex-col rounded-md border border-border bg-surface p-2xl ${className}`}>
      <div className="mb-2xl">
        <CardHeader
          title={title}
          subtitle={subtitle}
          toolbar={
            (toolbar || showActions) ? (
              <>
                {toolbar}
                {showActions && <MoreMenu />}
              </>
            ) : undefined
          }
        />
        {titleSuffix && <div className="mt-xs">{titleSuffix}</div>}
      </div>
      {children}
    </section>
  )
}
