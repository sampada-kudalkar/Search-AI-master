import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from 'recharts'
import { ChartCard } from '../charts/ChartCard'
import { CardTabs } from '../CardTabs/CardTabs'
import { chartColors } from '../charts/chartColors'
import { AiIcon } from '../AiIcon/AiIcon'
import { getInitials } from '../../utils/competitorAvatar'
import { RANKING_PLATFORMS, BRAND_NAME } from '../../data/competitorData'
import type { BrandDot, RankingPlatform } from '../../data/competitorData'
import type { BrandScatterplotCardProps } from './BrandScatterplotCard.types'

const PLATFORM_TABS = RANKING_PLATFORMS.map((p) => ({ id: p, label: p }))

const VIS_MID = 50
const CIT_MID = 50
// Index 0 = you (teal brand color), 1–5 = competitor colors from shared palette
const DOT_COLORS = ['#0F7195', ...chartColors.byLocation.slice(1)]
const DOT_R = 16  // radius for 32×32 circle
const AXIS_COLOR = '#555555'

// ── Custom axis labels (reused from ScatterplotCard) ─────────────────────────

function InfoIconSVG({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="16" height="16" fill="none" />
      <path
        d="M7.99672 11.0336C8.11856 11.0336 8.22179 10.992 8.3064 10.909C8.39101 10.8259 8.43332 10.723 8.43332 10.6002V7.63356C8.43332 7.51079 8.39211 7.40788 8.30968 7.32483C8.22726 7.24177 8.12513 7.20024 8.00328 7.20024C7.88144 7.20024 7.77821 7.24177 7.6936 7.32483C7.60899 7.40788 7.56668 7.51079 7.56668 7.63356L7.56668 10.6002C7.56668 10.723 7.60789 10.8259 7.69032 10.909C7.77274 10.992 7.87487 11.0336 7.99672 11.0336ZM7.99648 6.19256C8.12917 6.19256 8.24156 6.14769 8.33365 6.05794C8.42574 5.96819 8.47178 5.85697 8.47178 5.72429C8.47178 5.59162 8.42691 5.47923 8.33715 5.38713C8.24741 5.29504 8.13619 5.24899 8.00352 5.24899C7.87083 5.24899 7.75844 5.29387 7.66635 5.38363C7.57426 5.47338 7.52822 5.5846 7.52822 5.71728C7.52822 5.84995 7.57309 5.96234 7.66285 6.05443C7.75259 6.14652 7.86381 6.19256 7.99648 6.19256ZM8.00572 14.0669C7.17114 14.0669 6.38514 13.909 5.64772 13.5932C4.91028 13.2774 4.26483 12.843 3.71135 12.2897C3.15786 11.7365 2.72316 11.0916 2.40723 10.3549C2.09131 9.61832 1.93335 8.83125 1.93335 7.99373C1.93335 7.15619 2.09124 6.37149 2.40702 5.63963C2.72279 4.90775 3.15729 4.26507 3.71052 3.71159C4.26375 3.15811 4.90868 2.7234 5.6453 2.40748C6.38192 2.09156 7.16899 1.93359 8.00652 1.93359C8.84405 1.93359 9.62875 2.09148 10.3606 2.40726C11.0925 2.72304 11.7352 3.15754 12.2886 3.71076C12.8421 4.26399 13.2768 4.90762 13.5928 5.64164C13.9087 6.37567 14.0667 7.15996 14.0667 7.99453C14.0667 8.82911 13.9088 9.61511 13.593 10.3525C13.2772 11.09 12.8427 11.7354 12.2895 12.2889C11.7363 12.8424 11.0926 13.2771 10.3586 13.593C9.62458 13.9089 8.84028 14.0669 8.00572 14.0669ZM8 13.2002C9.44444 13.2002 10.6722 12.6947 11.6833 11.6836C12.6944 10.6725 13.2 9.44469 13.2 8.00024C13.2 6.5558 12.6944 5.32802 11.6833 4.31691C10.6722 3.3058 9.44444 2.80024 8 2.80024C6.55556 2.80024 5.32778 3.3058 4.31667 4.31691C3.30556 5.32802 2.8 6.5558 2.8 8.00024C2.8 9.44469 3.30556 10.6725 4.31667 11.6836C5.32778 12.6947 6.55556 13.2002 8 13.2002Z"
        fill={AXIS_COLOR}
      />
    </g>
  )
}

function XAxisLabel({ viewBox }: { viewBox?: { x: number; y: number; width: number; height: number } }) {
  if (!viewBox) return null
  const label = 'Visibility score'
  const fontSize = 11
  const charW = fontSize * 0.44
  const textW = label.length * charW
  const cx = viewBox.x + viewBox.width / 2
  const cy = viewBox.y + viewBox.height + 22
  const gap = 4
  const iconW = 16
  const textX = cx - (gap + iconW) / 2
  const iconX = textX + textW / 2 + gap
  return (
    <g>
      <text x={textX} y={cy} textAnchor="middle" fontSize={fontSize} fill={AXIS_COLOR} fontFamily="inherit">
        {label}
      </text>
      <InfoIconSVG x={iconX} y={cy - 13} />
    </g>
  )
}

function YAxisLabel({ viewBox }: { viewBox?: { x: number; y: number; width: number; height: number } }) {
  if (!viewBox) return null
  const label = 'Citation share'
  const fontSize = 11
  const charW = fontSize * 0.44
  const textW = label.length * charW
  const x = 15
  const cy = viewBox.y + viewBox.height / 2
  const iconScreenY = cy - textW / 2 - 8 - 16
  return (
    <g>
      <g transform={`rotate(-90, ${x}, ${cy})`}>
        <text x={x} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={AXIS_COLOR} fontFamily="inherit">
          {label}
        </text>
      </g>
      <InfoIconSVG x={x - 8} y={iconScreenY} />
    </g>
  )
}

// ── Quadrant chip label ───────────────────────────────────────────────────────

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

// ── Avatar dot shape ──────────────────────────────────────────────────────────

function AvatarDot(props: Record<string, unknown>) {
  const cx = props.cx as number | undefined
  const cy = props.cy as number | undefined
  const payload = props.payload as (BrandDot & { color: string }) | undefined
  if (cx == null || cy == null || !payload) return null
  const label = payload.brand === 'you' ? BRAND_NAME : payload.brand
  const initials = getInitials(label)
  return (
    <g>
      <circle cx={cx} cy={cy} r={DOT_R} fill={payload.color} />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fill="#ffffff"
        fontFamily="inherit"
      >
        {initials}
      </text>
    </g>
  )
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipPayload {
  payload: BrandDot & { x: number; y: number }
}

function BrandTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const dot = payload[0].payload
  const label = dot.brand === 'you' ? BRAND_NAME : dot.brand
  return (
    <div className="rounded-md border border-border bg-surface p-md shadow-dropdown w-[220px]">
      <p className="text-body text-text-primary">{label}</p>
      <div className="mt-sm flex flex-col gap-xs">
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Visibility score</span>
          <span className="text-text-primary">{dot.visibilityScore}%</span>
        </div>
        <div className="flex justify-between text-small">
          <span className="text-text-tertiary">Citation share</span>
          <span className="text-text-primary">{dot.citationShare}%</span>
        </div>
      </div>
    </div>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────

function BrandLegend({ dots }: { dots: BrandDot[] }) {
  return (
    <div className="mt-lg flex flex-wrap gap-lg">
      {dots.map((dot, i) => {
        const label = dot.brand === 'you' ? BRAND_NAME : dot.brand
        return (
          <span key={dot.brand} className="inline-flex items-center gap-xs text-small text-text-secondary">
            <span
              className="size-[10px] rounded-full shrink-0"
              style={{ backgroundColor: DOT_COLORS[i] }}
            />
            {label}
          </span>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const aiToolbar = (
  <button className="flex size-[36px] items-center justify-center rounded-sm border border-border-selected bg-surface hover:bg-surface-hover">
    <AiIcon size={16} />
  </button>
)

export function BrandScatterplotCard({
  dots,
  activePlatform,
  onPlatformChange,
}: BrandScatterplotCardProps) {
  const points = dots.map((d, i) => ({
    x: d.visibilityScore,
    y: d.citationShare,
    ...d,
    color: DOT_COLORS[i] ?? DOT_COLORS[0],
  }))

  return (
    <ChartCard
      title="How are you performing compared to competitors"
      subtitle="Shows your citation share and visibility score against your competitors"
      showActions
      toolbar={aiToolbar}
    >
      <div className="-mx-2xl mb-xl px-2xl">
        <CardTabs
          tabs={PLATFORM_TABS}
          activeTab={activePlatform}
          onChange={(id) => onPlatformChange(id as RankingPlatform)}
        />
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 8, right: 24, bottom: 40, left: 16 }}>
          <ReferenceLine x={VIS_MID} stroke="#e8e8ea" strokeWidth={1} />
          <ReferenceLine y={CIT_MID} stroke="#e8e8ea" strokeWidth={1} />

          <ReferenceArea x1={2} x2={VIS_MID - 1} y1={CIT_MID + 1} y2={99} fill="transparent"
            label={<QuadrantLabel value="Underperforming" color="#f59e0b" position="topLeft" />} />
          <ReferenceArea x1={VIS_MID + 1} x2={98} y1={CIT_MID + 1} y2={99} fill="transparent"
            label={<QuadrantLabel value="Leading" color="#377E2C" position="topRight" />} />
          <ReferenceArea x1={2} x2={VIS_MID - 1} y1={1} y2={CIT_MID - 1} fill="transparent"
            label={<QuadrantLabel value="Lagging" color="#de1b0c" position="bottomLeft" />} />
          <ReferenceArea x1={VIS_MID + 1} x2={98} y1={1} y2={CIT_MID - 1} fill="transparent"
            label={<QuadrantLabel value="Emerging" color="#4CAE3D" position="bottomRight" />} />

          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: AXIS_COLOR }}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
            label={<XAxisLabel />}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: AXIS_COLOR }}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
            width={44}
            label={<YAxisLabel />}
          />
          <Tooltip content={<BrandTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          <Scatter
            name="brands"
            data={points}
            fill={DOT_COLORS[0]}
            shape={<AvatarDot />}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <BrandLegend dots={dots} />
    </ChartCard>
  )
}
