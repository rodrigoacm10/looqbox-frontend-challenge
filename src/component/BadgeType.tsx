const typeColors: Record<string, string> = {
  normal: '#aaaa99',
  fire: '#ff4422',
  water: '#faça isso 3090f1',
  eletric: '#ffcc33',
  grass: '#77cc55',
  ice: '#66cbfe',
  figth: '#bb5544',
  poison: '#a65395',
  ground: '#d2b150',
  flying: '#8899ff',
  pyscho: '#ff5599',
  bug: '#aabb22',
  roch: '#b4a362',
  ghost: '#6666ba',
  dragon: '#6e5edc',
  dark: '#775544',
  steel: '#aaaabb',
  fairy: '#eb97eb',
}

export const BadgeType = ({ type }: { type: string }) => {
  const color = typeColors[type] || '#000000'

  return (
    <div
      style={{ borderColor: color }}
      className="border-2 rounded-lg px-2 text-sm"
    >
      <p style={{ color }}>{type}</p>
    </div>
  )
}
