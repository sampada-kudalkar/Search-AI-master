import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface HorizontalBarDatum {
  label: string
  value: number
  color: string
}

export interface HorizontalBarChartProps {
  data: HorizontalBarDatum[]
  /** Height per bar row, in px. Defaults to 36. */
  rowHeight?: number
  /** Max px height of the visible, scrollable area. Defaults to 280. */
  maxHeight?: number
  /** Max value for the (hidden) value axis. Defaults to 100. */
  max?: number
}

/** Single-series horizontal bar chart — labels on the y-axis, no x-axis, scrolls internally once content exceeds maxHeight. */
export function HorizontalBarChart({ data, rowHeight = 36, maxHeight = 280, max = 100 }: HorizontalBarChartProps) {
  const chartHeight = Math.max(data.length * rowHeight, rowHeight)

  return (
    <div style={{ maxHeight, overflowY: 'auto' }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap="30%">
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={140}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#212121', fontFamily: 'Roboto' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload as HorizontalBarDatum
              return <ChartTooltip label={d.label} items={[{ color: d.color, label: d.label, value: d.value }]} accentColor={d.color} />
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v: number | string) => `${v}%`}
              style={{ fontSize: 12, fill: '#212121', fontFamily: 'Roboto' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
