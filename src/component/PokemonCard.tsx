import { useState } from 'react'
import { Card } from 'antd'
import type { Pokemon } from '../api/pokemon'

export const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const staticSprite =
    pokemon.sprites.front_default ||
    pokemon.sprites?.other?.['official-artwork']?.front_default

  const animatedSprite =
    pokemon.sprites.versions['generation-v']['black-white'].animated
      .front_default || staticSprite

  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="group"
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cover={
        <img
          src={isHovered ? animatedSprite : staticSprite}
          alt={pokemon.name}
          className={`w-36 h-36 mx-auto my-4 object-contain transition-transform duration-300 card-container-hover:scale-110 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
      }
    >
      <Card.Meta
        title={
          <div className="flex items-center justify-between">
            <p>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </p>
            {/* <div className="flex items-center">
              <p>grama</p> <p>pedra</p>
            </div> */}
          </div>
        }
        description={`#${pokemon.id.toString().padStart(4, '0')}`}
      />
    </Card>
  )
}
