import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPokemon, type Pokemon } from '../api/pokemon'
import { LoadingIcon } from '../components/icons/LoadingIcon'
import { BadgeType } from '../components/BadgeType'
import { Button, Card } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

function PokemonDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery<{ pokemon: Pokemon }, Error>({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemon(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingIcon />
      </div>
    )
  }

  if (isError || !data?.pokemon) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">Pokémon não encontrado</p>
        <Link to="/">
          <Button type="primary">Voltar</Button>
        </Link>
      </div>
    )
  }

  const pokemon = data.pokemon

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-green-300">Looq</span>Dex
        </h1>
        <Link to="/">
          <Button icon={<ArrowLeftOutlined />}>Voltar</Button>
        </Link>
      </div>

      <Card className="w-full text-center">
        <img
          src={
            pokemon.sprites?.other?.['official-artwork']?.front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="w-40 h-40 mx-auto object-contain mb-4"
        />

        <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
        <p className="text-gray-500 mb-2">
          #{pokemon.id.toString().padStart(4, '0')}
        </p>

        <div className="flex justify-center gap-2 mt-2">
          {pokemon.types.map((t) => (
            <BadgeType key={t.type.name} type={t.type.name} />
          ))}
        </div>
      </Card>
    </div>
  )
}

export default PokemonDetail
