import {
  CartesianGrid,
  Line,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { chartColors } from './chartColors'

export interface TrendPoint {
  label: string
  value?: number
  [key: string]: number | string | undefined
}

export interface SeriesConfig {
  key: string
  label: string
  color: string
}

export interface TrendLineChartProps {
  data: TrendPoint[]
  series?: SeriesConfig[]
  height?: number
  color?: string
  yDomain?: [number | string, number | string]
  yTickFormatter?: (value: number) => string
}

const axisTick = { fontSize: 12, fill: '#212121', fontFamily: 'Roboto' }

export function TrendLineChart({
  data,
  series,
  height = 300,
  color = chartColors.resolved,
  yDomain,
  yTickFormatter,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={{ stroke: chartColors.grid }} />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={44}
          domain={yDomain ?? ['auto', 'auto']}
          tickFormatter={yTickFormatter}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            if (series) {
              return (
                <ChartTooltip
                  label={String(label ?? '')}
                  items={payload.map((p) => ({
                    color: String(p.stroke ?? ''),
                    label: series.find((s) => s.key === p.dataKey)?.label ?? String(p.dataKey),
                    value: Number(p.value ?? 0),
                  }))}
                  accentColor={String(payload[0]?.stroke ?? '')}
                />
              )
            }
            return (
              <ChartTooltip
                label={String(label ?? '')}
                items={[{ color, label: 'Value', value: Number(payload[0]?.value ?? 0) }]}
                accentColor={color}
              />
            )
          }}
        />
        {series ? (
          series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        )}
      </RLineChart>
    </ResponsiveContainer>
  )
}
