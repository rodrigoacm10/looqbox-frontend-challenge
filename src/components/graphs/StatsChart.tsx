import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  //   PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { Stats } from '../../api/pokemon'

export const StatsChart = ({ stats }: { stats: Stats[] }) => {
  const chartData = stats.map((stat) => ({
    subject: stat.stat.name.toUpperCase(),
    value: stat.base_stat,
    fullMark: 255,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid stroke="#ccc" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#666', fontSize: 12 }}
        />
        {/* <PolarRadiusAxis angle={90} domain={[0, 255]} tick={{ fill: '#999' }} /> */}
        {/* <PolarRadiusAxis angle={90} domain={[0, 255]} tick={{ fill: '#999' }} /> */}
        <Radar
          dataKey="value"
          stroke="#40da62"
          fill="#53d893"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// <ResponsiveContainer>
//   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
//     <PolarGrid />
//     <PolarAngleAxis dataKey="subject" />
//     <PolarRadiusAxis />
//     <Radar
//       name="Mike"
//       dataKey="A"
//       stroke="#8884d8"
//       fill="#8884d8"
//       fillOpacity={0.6}
//     />
//   </RadarChart>
// </ResponsiveContainer>
