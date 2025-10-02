import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { Stats } from '../../api/pokemon'
import type { TickItemTextProps } from 'recharts/types/polar/PolarAngleAxis'

interface TooltipPayload {
  subject: string
  value: number
  fullMark: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: TooltipPayload }>
}

export const renderPolarAngleLabel = (props: TickItemTextProps) => {
  const { x, y, payload, textAnchor } = props
  const words = (payload?.value as string)?.split('-') || []

  return (
    <text x={x} y={y} textAnchor={textAnchor} fill="#666" fontSize={10}>
      {words.map((word: string, index: number) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : 12}>
          {word.toUpperCase()}
        </tspan>
      ))}
    </text>
  )
}

export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const stat = payload[0].payload
    return (
      <div className="bg-white rounded-md px-4 py-2 text-xs shadow">
        <p className="font-semibold opacity-60">{stat.subject}</p>
        <p className="font-bold text-lg">
          {stat.value} / {stat.fullMark}
        </p>
      </div>
    )
  }
  return null
}

export const StatsChart = ({ stats }: { stats: Stats[] }) => {
  const chartData = stats.map((stat) => ({
    subject: stat.stat.name.toUpperCase(),
    value: stat.base_stat,
    fullMark: 255,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
        <PolarGrid stroke="#ccc" />
        <PolarAngleAxis dataKey="subject" tick={renderPolarAngleLabel} />
        <PolarRadiusAxis angle={90} domain={[0, 255]} tick={false} />
        <Radar
          dataKey="value"
          stroke="#40da62"
          fill="#53d893"
          fillOpacity={0.6}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
