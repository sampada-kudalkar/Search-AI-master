import { Fragment } from 'react'

export interface HeatmapProps {
  rowLabels: string[]
  colLabels: string[]
  /** values[row][col]; intensity is scaled against the max value. */
  values: number[][]
}

export function Heatmap({ rowLabels, colLabels, values }: HeatmapProps) {
  const max = Math.max(1, ...values.flat())
  const cols = colLabels.length

  return (
    <div className="overflow-x-auto">
      <div
        className="grid items-center gap-[3px]"
        style={{ gridTemplateColumns: `44px repeat(${cols}, minmax(24px, 1fr))` }}
      >
        {rowLabels.map((rl, r) => (
          <Fragment key={rl}>
            <div className="pr-sm text-small text-text-secondary">{rl}</div>
            {colLabels.map((cl, c) => {
              const alpha = (values[r]?.[c] ?? 0) / max
              return (
                <div
                  key={cl}
                  title={`${rl} ${cl}: ${values[r]?.[c] ?? 0}`}
                  className="h-7 rounded-[3px]"
                  style={{ backgroundColor: `rgba(25, 118, 210, ${0.06 + 0.94 * alpha})` }}
                />
              )
            })}
          </Fragment>
        ))}

        {/* Bottom axis labels (rotated to fit) */}
        <div />
        {colLabels.map((cl) => (
          <div key={cl} className="relative h-16">
            <span className="absolute left-1/2 top-1 origin-top -translate-x-1/2 -rotate-[60deg] whitespace-nowrap text-[10px] text-text-secondary">
              {cl}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
