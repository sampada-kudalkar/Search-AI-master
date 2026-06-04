import { ResponsiveContainer, Sankey, Tooltip } from 'recharts'
import { chartColors } from './chartColors'

export interface SankeyNode {
  name: string
}
export interface SankeyLink {
  source: number
  target: number
  value: number
}
export interface SankeyChartProps {
  nodes: SankeyNode[]
  links: SankeyLink[]
  height?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Node({ x, y, width, height, index, payload, containerWidth }: any) {
  const color = chartColors.categorical[index % chartColors.categorical.length]
  const onLeftEdge = x < containerWidth * 0.2
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={2} fill={color} />
      <text
        x={onLeftEdge ? x - 6 : x + width + 6}
        y={y + height / 2}
        textAnchor={onLeftEdge ? 'end' : 'start'}
        dominantBaseline="middle"
        fontFamily="Roboto"
        fontSize={12}
        fill="#212121"
      >
        {payload.name}
      </text>
    </g>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Link({ sourceX, sourceY, targetX, targetY, sourceControlX, targetControlX, linkWidth }: any) {
  return (
    <path
      d={`M${sourceX},${sourceY}C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
      fill="none"
      stroke={chartColors.blue}
      strokeOpacity={0.16}
      strokeWidth={linkWidth}
    />
  )
}

export function SankeyChart({ nodes, links, height = 360 }: SankeyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Sankey
        data={{ nodes, links }}
        nodePadding={26}
        nodeWidth={12}
        margin={{ top: 8, right: 90, bottom: 8, left: 60 }}
        node={<Node />}
        link={<Link />}
      >
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eaeaea', fontSize: 12, fontFamily: 'Roboto' }} />
      </Sankey>
    </ResponsiveContainer>
  )
}
