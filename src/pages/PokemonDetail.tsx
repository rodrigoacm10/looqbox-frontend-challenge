import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPokemon, type Pokemon } from '../api/pokemon'
import { LoadingIcon } from '../components/icons/LoadingIcon'
import { BadgeType } from '../components/BadgeType'
import { Button, Card, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { PokemonSpecies } from '../api/species'
import { StatsChart } from '../components/graphs/StatsChart'
import type { AbilityDetail } from '../api/abilities'
import { PokemonMoviments } from '../components/PokemonMoviments'
import { InfoBlock } from '../components/InfoBlock'
import { getSpriteUrl } from '../utils/getSpriteUrl'
import { PokemonChainList } from '../components/PokemonChainList'

function PokemonDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery<
    {
      pokemon: Pokemon
      species: PokemonSpecies
      abilities: AbilityDetail[]
      chain: Pokemon[]
    },
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

  if (
    isError ||
    !data?.pokemon ||
    !data?.species ||
    !data?.abilities ||
    !data.chain
  ) {
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
  const abilities = data.abilities
  const chain = data.chain

  const { staticSprite } = getSpriteUrl(pokemon)

  return (
    <div className="flex flex-col flex-1">
      <Link to="/" className="mb-4">
        <Button icon={<ArrowLeftOutlined />}>Go back</Button>
      </Link>

      <Row gutter={16}>
        <Col xs={24} md={7}>
          <Card className="shadow">
            <div className="mb-2">
              <h2 className="font-bold text-2xl capitalize">
                {pokemon.name.split('-').join(' ')}
              </h2>
              <p className="text-lg font-semibold opacity-50">
                #{pokemon.id.toString().padStart(4, '0')}
              </p>
            </div>

            <img
              src={staticSprite}
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
              <InfoBlock
                minW={75}
                upper={false}
                label="Heigth"
                value={`${pokemon.height / 10} m`}
              />
              <InfoBlock
                minW={75}
                upper={false}
                label="Weigth"
                value={`${pokemon.weight / 10} kg`}
              />
              <InfoBlock
                minW={75}
                upper={false}
                label="Legendary"
                value={species?.is_legendary ? 'Yes' : 'No'}
              />
            </div>
          </Card>

          <div className="my-4 w-full">
            <h3 className="font-bold text-center text-lg mb-3">
              Evolution chain
            </h3>
            <PokemonChainList chain={chain} />
          </div>
        </Col>

        <Col xs={24} md={17}>
          <Card className="shadow">
            <h2 className="text-2xl font-bold">Status and Caracteristcs</h2>

            <div className="flex flex-wrap gap-2">
              {pokemon.stats.map((stat) => (
                <InfoBlock
                  key={stat.stat.name}
                  minW={120}
                  label={stat.stat.name}
                  value={stat.base_stat}
                />
              ))}
            </div>

            <Row gutter={16} className="mt-4">
              <Col xs={24} md={12} className="p-2">
                <div className="w-full h-44">
                  <StatsChart stats={pokemon.stats} />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <h3 className="font-bold text-lg">Abilities</h3>

                <div className="flex flex-col gap-3 mt-2">
                  {abilities.map((ability) => {
                    const name =
                      ability.names.find((n) => n.language.name === 'en')
                        ?.name || ability.name
                    const effect =
                      ability.effect_entries.find(
                        (e) => e.language.name === 'en',
                      )?.short_effect || 'No description available'

                    return (
                      <div
                        key={ability.id}
                        className="p-2 rounded shadow bg-gray-50"
                      >
                        <p className="font-semibold capitalize">{name}</p>
                        <p className="text-sm opacity-80">{effect}</p>
                      </div>
                    )
                  })}
                </div>
              </Col>
            </Row>

            <div className="mt-6">
              <PokemonMoviments moves={data.pokemon.moves} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PokemonDetail
