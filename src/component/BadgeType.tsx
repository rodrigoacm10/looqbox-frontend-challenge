import { typeColorsToken } from '../tokens/typeColorsToken'

export const BadgeType = ({ type }: { type: string }) => {
  const color = typeColorsToken[type] || '#000000'

  return (
    <div
      style={{ borderColor: color }}
      className="border-2 rounded-lg px-2 text-sm"
    >
      <p style={{ color }}>{type}</p>
    </div>
  )
}
