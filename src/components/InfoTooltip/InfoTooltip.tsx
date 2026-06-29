import { useRef, useState } from 'react'
import infoIconUrl from '../../assets/icon-info.svg'

interface InfoTooltipProps {
  text: string
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  function show() {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ x: r.left + r.width / 2, y: r.bottom + 8 })
    setVisible(true)
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        className="flex items-center justify-center text-text-tertiary hover:text-text-secondary"
        aria-label="More info"
      >
        <img src={infoIconUrl} alt="" width={16} height={16} />
      </button>
      {visible && pos && (
        <div
          className="pointer-events-none fixed z-[120] max-w-[300px] whitespace-normal break-words rounded-sm bg-[#1c1c1c] px-sm py-xs text-small text-white text-left"
          style={{ left: pos.x, top: pos.y, transform: 'translateX(-50%)' }}
        >
          {text}
        </div>
      )}
    </>
  )
}
