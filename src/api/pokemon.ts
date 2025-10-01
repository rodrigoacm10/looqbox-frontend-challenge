import { api } from '../utils/api'
import { getPokemonAbilities } from './abilities'
import { getPokemonSpecies } from './species'

export type Stats = {
  base_stat: number
  stat: { name: string; url: string }
}

export type Abilities = {
  ability: { name: string; url: string }
  is_hidden: boolean
  slot: number
}

export type Pokemon = {
  id: number
  name: string
  height: number
  weight: number
  abilities: Abilities[]
  types: {
    slot: number
    type: { name: string; url: string }
  }[]
  stats: Stats[]
  moves: {
    move: { name: string; url: string }
    version_group_details: {
      level_learned_at: number
      move_learn_method: { name: string }
    }[]
  }[]
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  species: {
    name: string
    url: string
  }
}

export type PokemonResponse = {
  pokemons: Pokemon[]
  totalCount: number
}

export const getPokemonPagination = async (
  offset: number = 0,
  limit: number = 20,
  name?: string,
): Promise<{ pokemons: Pokemon[]; totalCount: number }> => {
  if (name) {
    try {
      const { data } = await api.get<Pokemon>(`pokemon/${name.toLowerCase()}`)
      return { pokemons: [data], totalCount: 1 }
    } catch {
      return { pokemons: [], totalCount: 0 }
    }
  }

  const { data } = await api.get<{
    results: { name: string; url: string }[]
    count: number
  }>(`pokemon?offset=${offset}&limit=${limit}`)

  const pokemons = await Promise.all(
    data.results.map(async (p) => {
      const { data: details } = await api.get<Pokemon>(`pokemon/${p.name}`)
      return details
    }),
  )

  return { pokemons, totalCount: data.count }
}

export const getPokemon = async (pokemon: string) => {
  const { data } = await api.get<Pokemon>(`pokemon/${pokemon}`)
  const species = await getPokemonSpecies(data.species.url)
  const abilities = await getPokemonAbilities(data.abilities)

  console.log('RETORNADO ', { pokemon: data, species, abilities })

  return { pokemon: data, species, abilities }
}
