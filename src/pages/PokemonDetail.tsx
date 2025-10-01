import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPokemon, type Pokemon } from '../api/pokemon'
import { LoadingIcon } from '../components/icons/LoadingIcon'
import { BadgeType } from '../components/BadgeType'
import { Button, Card, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { PokemonSpecies } from '../api/species'
import { StatsChart } from '../components/graphs/StatsChart'

function PokemonDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery<
    { pokemon: Pokemon; species: PokemonSpecies },
    Error
  >({
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

  if (isError || !data?.pokemon || !data?.species) {
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
  const species = data.species

  // const description = data?.abilities[0]?.effect_entries.find(
  //   (e) => e.language.name === 'en',
  // )?.short_effect

  /* <p>
              <strong>Cor:</strong> {species?.color.name}
            </p> */
  return (
    <div className="flex flex-col flex-1 px-4">
      <Link to="/" className="mb-4">
        <Button icon={<ArrowLeftOutlined />}>Voltar</Button>
      </Link>

      <Row gutter={16}>
        <Col xs={24} md={7}>
          <Card className="">
            <div className="mb-2">
              <h2 className="font-bold text-2xl capitalize">{pokemon.name}</h2>
              <p className="text-lg font-semibold opacity-50">
                #{pokemon.id.toString().padStart(4, '0')}
              </p>
            </div>

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

            <p className="mt-4">
              {
                species?.flavor_text_entries.find(
                  (f) => f.language.name === 'en',
                )?.flavor_text
              }
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <div className="rounded-md shadow p-2 text-center flex-1">
                <p className="font-semibold opacity-60">Legendary</p>
                <p className="font-semibold text-lg">
                  {species?.is_legendary ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="rounded-md shadow p-2 text-center flex-1">
                <p className="font-semibold opacity-60">Heigth</p>
                <p className="font-semibold text-lg whitespace-nowrap">
                  {pokemon.height / 10} m
                </p>
              </div>

              <div className="rounded-md shadow p-2 text-center flex-1">
                <p className="font-semibold opacity-60">Weigth</p>
                <p className="font-semibold text-lg whitespace-nowrap">
                  {pokemon.weight / 10} kg
                </p>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={17}>
          <Card>
            <h2 className="text-2xl font-bold">Status and Caracteristcs</h2>

            <div className="flex flex-wrap gap-2">
              {pokemon.stats.map((stat) => (
                <div
                  key={stat.stat.name}
                  className="flex-1 min-w-[125px] text-center p-3 shadow rounded"
                >
                  <p className="font-semibold uppercase text-sm opacity-60 whitespace-nowrap">
                    {stat.stat.name}
                  </p>
                  <p className="font-bold text-lg">{stat.base_stat}</p>
                </div>
              ))}
            </div>

            <Row gutter={16} className="mt-4">
              <Col xs={24} md={12} className="p-2">
                <div className="w-full h-44">
                  <StatsChart stats={pokemon.stats} />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <h3>Habilities</h3>

                <p></p>
              </Col>
            </Row>

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
