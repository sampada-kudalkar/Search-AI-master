import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
} from 'recharts'
import { ChartCard } from '../charts/ChartCard'
import { CardTabs } from '../CardTabs/CardTabs'
import { chartColors } from '../charts/chartColors'
import { Icon } from '../Icon/Icon'
import type { ScatterplotCardProps } from './ScatterplotCard.types'
import type { ByLocationDot, RankingPlatform } from '../../data/competitorData'
import { RANKING_PLATFORMS } from '../../data/competitorData'

const PLATFORM_TABS = RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))

// Quadrant split points
const VIS_MID = 50
const CIT_MID = 40

// Index 0 = you (dark navy), 1–5 = competitor series
const DOT_COLORS = chartColors.byLocation

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipPayload {
  payload: ByLocationDot & { x: number; y: number }
}

function ScatterTooltip({
  active,
  payload,
  onViewComparison,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  onViewComparison: (locationName: string) => void
}) {
  if (!active || !payload?.length) return null
  const dot = payload[0].payload
  return (
    <div className="rounded-md border border-border bg-surface p-md shadow-dropdown w-[220px]">
      <p className="text-body text-text-primary">{dot.locationName}</p>
      <p className="text-small text-text-secondary mt-xs">
        {dot.brand === 'you' ? 'My Family Dental' : dot.brand}
      </p>
      <div className="mt-sm flex flex-col gap-xs">
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Visibility score</span>
          <span className="text-text-primary">{dot.visibilityScore}%</span>
        </div>
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Citation share</span>
          <span className="text-text-primary">{dot.citationShare}%</span>
        </div>
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Rank</span>
          <span className="text-text-primary">#{dot.rank}</span>
        </div>
      </div>
      <button
        onClick={() => onViewComparison(dot.locationName)}
        className="mt-sm w-full text-left text-small text-text-action hover:underline"
      >
        View detailed comparison →
      </button>
    </div>
  )
}

// ── Quadrant chip label (custom SVG) ─────────────────────────────────────────

interface QuadrantLabelProps {
  viewBox?: { x: number; y: number; width: number; height: number }
  value?: string
  color?: string
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}

function QuadrantLabel({ viewBox, value = '', color = '#888', position = 'topLeft' }: QuadrantLabelProps) {
  if (!viewBox) return null
  const { x, y, width, height } = viewBox
  const PAD_X = 8, PAD_Y = 3, FONT = 11, R = 10
  const textW = value.length * 5.5
  const chipW = textW + PAD_X * 2
  const chipH = FONT + PAD_Y * 2

  const cx = position.includes('Right') ? x + width - chipW - 10 : x + 10
  const cy = position.includes('top')   ? y + 10                  : y + height - chipH - 10

  return (
    <g>
      <rect x={cx} y={cy} width={chipW} height={chipH} rx={R} ry={R} fill={color} stroke="none" />
      <text x={cx + PAD_X} y={cy + chipH / 2} dominantBaseline="middle" fontSize={FONT} fill="#ffffff" fontFamily="inherit">
        {value}
      </text>
    </g>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────

function ScatterLegend({ competitors }: { competitors: string[] }) {
  const allBrands = ['You', ...competitors]
  return (
    <div className="mt-lg flex flex-wrap gap-lg">
      {allBrands.map((name, i) => (
        <span key={name} className="inline-flex items-center gap-xs text-small text-text-secondary">
          <span
            className="size-[10px] rounded-full shrink-0"
            style={{ backgroundColor: DOT_COLORS[i] }}
          />
          {name}
        </span>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const aiToolbar = (
  <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface hover:bg-surface-hover">
    <Icon name="auto_awesome" size={16} className="text-[#6834b7]" />
  </button>
)

export function ScatterplotCard({
  dots,
  competitors,
  activePlatform,
  onPlatformChange,
  onViewComparison,
}: ScatterplotCardProps) {
  const toPoint = (d: ByLocationDot) => ({ x: d.visibilityScore, y: d.citationShare, ...d })

  const youDots = dots.filter((d) => d.brand === 'you').map(toPoint)
  const competitorSeries = competitors.map((name) =>
    dots.filter((d) => d.brand === name).map(toPoint)
  )

  return (
    <ChartCard
      title="How are your locations ranking compared to their competitors"
      subtitle="Shows how often your location citation share and visibility score are impacting your overall rank against your competitors"
      showActions
      toolbar={aiToolbar}
    >
      {/* Platform tabs — edge-to-edge inside the card */}
      <div className="-mx-2xl mb-xl px-2xl">
        <CardTabs
          tabs={PLATFORM_TABS}
          activeTab={activePlatform}
          onChange={(id) => onPlatformChange(id as RankingPlatform)}
        />
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 8, right: 24, bottom: 24, left: 8 }}>
          {/* Quadrant background tints */}
          <ReferenceArea x1={0}       x2={VIS_MID} y1={CIT_MID} y2={100} fill="#fff8e1" fillOpacity={0.7} />
          <ReferenceArea x1={VIS_MID} x2={100}     y1={CIT_MID} y2={100} fill="#e8f5e9" fillOpacity={0.7} />
          <ReferenceArea x1={0}       x2={VIS_MID} y1={0}       y2={CIT_MID} fill="#ffebee" fillOpacity={0.7} />
          <ReferenceArea x1={VIS_MID} x2={100}     y1={0}       y2={CIT_MID} fill="#f5f5f5" fillOpacity={0.7} />

          {/* Quadrant chip labels */}
          <ReferenceArea x1={2} x2={VIS_MID - 1} y1={CIT_MID + 1} y2={99} fill="transparent"
            label={<QuadrantLabel value="Underperforming" color="#f59e0b" position="topLeft" />} />
          <ReferenceArea x1={VIS_MID + 1} x2={98} y1={CIT_MID + 1} y2={99} fill="transparent"
            label={<QuadrantLabel value="Leading" color="#4cae3d" position="topRight" />} />
          <ReferenceArea x1={2} x2={VIS_MID - 1} y1={1} y2={CIT_MID - 1} fill="transparent"
            label={<QuadrantLabel value="Lagging" color="#de1b0c" position="bottomLeft" />} />
          <ReferenceArea x1={VIS_MID + 1} x2={98} y1={1} y2={CIT_MID - 1} fill="transparent"
            label={<QuadrantLabel value="Emerging" color="#8f8f8f" position="bottomRight" />} />

          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: chartColors.axis }}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
            label={{ value: 'Visibility score', position: 'insideBottom', offset: -12, fontSize: 11, fill: chartColors.axis }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: chartColors.axis }}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
            label={{ value: 'Citation share', angle: -90, position: 'insideLeft', offset: 16, fontSize: 11, fill: chartColors.axis }}
          />
          <Tooltip
            content={<ScatterTooltip onViewComparison={onViewComparison} />}
            cursor={{ strokeDasharray: '3 3' }}
          />

          {/* You series */}
          <Scatter name="You" data={youDots} fill={DOT_COLORS[0]} opacity={0.85} r={5} />

          {/* Competitor series */}
          {competitorSeries.map((series, i) => (
            <Scatter
              key={competitors[i]}
              name={competitors[i]}
              data={series}
              fill={DOT_COLORS[i + 1]}
              opacity={0.85}
              r={5}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      <ScatterLegend competitors={competitors} />
    </ChartCard>
  )
}
