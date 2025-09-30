import { api } from '../utils/api'

export type Pokemon = {
  id: number
  name: string
  types: {
    slot: number
    type: { name: string; url: string }
  }[]
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
    versions: {
      'generation-v': {
        'black-white': {
          animated: {
            front_default: string
          }
        }
      }
    }
  }
}

export type PokemonResponse = {
  pokemons: Pokemon[]
  totalCount: number
}

export const getPokemonPagination = async (
  offset: number = 0,
  limit: number = 20,
): Promise<{ pokemons: Pokemon[]; totalCount: number }> => {
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

  return {
    pokemons,
    totalCount: data.count,
  }
}

export const getPokemon = async (pokemon: string) => {
  const { data } = await api.get<Pokemon>(`pokemon/${pokemon}`)

  return { pokemon: data }
}
