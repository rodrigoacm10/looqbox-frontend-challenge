import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPokemon, type Pokemon } from '../api/pokemon'
import { LoadingIcon } from '../components/icons/LoadingIcon'
import { BadgeType } from '../components/BadgeType'
import { Button, Card, Row, Col } from 'antd'
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
    <div className="flex flex-col flex-1 px-4">
      <Link to="/" className="mb-4">
        <Button icon={<ArrowLeftOutlined />}>Voltar</Button>
      </Link>

      <Row gutter={16}>
        <Col xs={24} md={7}>
          <Card className="text-center">
            <img
              src={
                pokemon.sprites?.other?.['official-artwork']?.front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              className="w-40 h-40 mx-auto object-contain mb-4"
            />
            <div className="flex justify-center gap-2 mt-2">
              {pokemon.types.map((t) => (
                <BadgeType key={t.type.name} type={t.type.name} />
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={17}>
          <Card>
            <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
            <p className="text-gray-500 mb-4">
              #{pokemon.id.toString().padStart(4, '0')}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Altura:</p>
                <p>{pokemon.height / 10} m</p>
              </div>
              <div>
                <p className="font-semibold">Peso:</p>
                <p>{pokemon.weight / 10} kg</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold">Mais informações em breve...</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PokemonDetail
