import { useRef } from 'react'
import { SliderProps } from './Slider.types'

export function Slider({ value, onChange, min = 0, max = 100, defaultValue, color = '#4F46E5', className }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pct = ((value - min) / (max - min)) * 100
  const defaultPct = defaultValue !== undefined ? ((defaultValue - min) / (max - min)) * 100 : undefined

  function commitFromClientX(clientX: number) {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    onChange(Math.round(min + ratio * (max - min)))
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    commitFromClientX(e.clientX)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons !== 1) return
    commitFromClientX(e.clientX)
  }

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative h-4 w-full cursor-pointer touch-none"
      >
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-surface-selected" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        {defaultPct !== undefined && (
          <div
            className="absolute top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-tertiary"
            style={{ left: `${defaultPct}%` }}
          />
        )}
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-surface shadow-card"
          style={{ left: `${pct}%`, borderColor: color }}
        />
      </div>
      <div className="relative mt-xs h-4">
        {defaultPct !== undefined && (
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap text-small text-text-tertiary"
            style={{ left: `${defaultPct}%` }}
          >
            Default
          </span>
        )}
      </div>
    </div>
  )
}
