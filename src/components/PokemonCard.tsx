import { useState } from 'react'
import { Card } from 'antd'
import type { Pokemon } from '../api/pokemon'
import { BadgeType } from './BadgeType'
import { Link } from 'react-router-dom'

export const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const [isHovered, setIsHovered] = useState(false)

  const staticSprite =
    pokemon.sprites.front_default ||
    pokemon.sprites?.other?.['official-artwork']?.front_default

  const animatedSprite =
    pokemon.sprites.versions['generation-v']['black-white'].animated
      .front_default || staticSprite

  return (
    <Link to={`pokemon/${pokemon.id}`}>
      <Card
        className="group"
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cover={
          staticSprite || animatedSprite ? (
            <img
              src={isHovered ? animatedSprite : staticSprite}
              alt={pokemon.name}
              className={`w-36 h-36 mx-auto my-4 object-contain transition-transform duration-300 card-container-hover:scale-105 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center">
              <p>not exist</p>
            </div>
          )
        }
      >
        <Card.Meta
          title={
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </p>
                <p className="opacity-80 font-normal text-sm">
                  #{pokemon.id.toString().padStart(4, '0')}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {pokemon.types.map((type) => (
                  <BadgeType
                    key={pokemon.id + type.type.name}
                    type={type.type.name}
                  />
                ))}
              </div>
            </div>
          }
        />
      </Card>
    </Link>
  )
}
