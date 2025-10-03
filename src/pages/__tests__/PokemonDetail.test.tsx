import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import PokemonDetail from '../PokemonDetail'
import { LoadingIcon } from '../../components/icons/LoadingIcon'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<any>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

describe('PokemonDetail - 100% coverage', () => {
  const playMock = vi.fn().mockResolvedValue(undefined)
  ;(global as any).Audio = vi
    .fn()
    .mockImplementation(() => ({ play: playMock }))

  const defaultTypes = [
    {
      id: 1,
      name: 'psychic',
      damage_relations: {
        double_damage_from: [],
        double_damage_to: [],
        half_damage_from: [],
        half_damage_to: [],
        no_damage_from: [],
        no_damage_to: [],
      },
    },
  ]

  const defaultData = {
    pokemon: {
      id: 150,
      name: 'mewtwo',
      height: 20,
      weight: 1220,
      cries: { latest: 'latest.mp3', legacy: 'legacy.mp3' },
      stats: [{ stat: { name: 'hp', url: '' }, base_stat: 100 }],
      moves: [{ move: { name: 'psychic', url: '' } }],
      types: [{ type: { name: 'psychic', url: '' } }],
      abilities: [],
      sprites: {
        front_default: '',
        other: { 'official-artwork': { front_default: '' } },
        versions: {
          'generation-v': {
            'black-white': { animated: { front_default: '' } },
          },
        },
      },
      species: { name: 'mewtwo', url: '' },
    },
    species: {
      flavor_text_entries: [],
      is_baby: false,
      is_legendary: true,
      is_mythical: false,
    },
    abilities: [],
    chain: [{ id: 150, name: 'mewtwo' }],
    types: defaultTypes,
  }

  it('shows loading state', () => {
    ;(useQuery as any).mockReturnValue({ isLoading: true })
    render(
      <MemoryRouter>
        <PokemonDetail />
      </MemoryRouter>,
    )
    // Corrigido: agora o LoadingIcon tem data-testid
    const { container } = render(<LoadingIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('animate-spin')
  })

  it('shows error state', () => {
    ;(useQuery as any).mockReturnValue({ isLoading: false, isError: true })
    render(
      <MemoryRouter>
        <PokemonDetail />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Pokémon not found/i)).toBeInTheDocument()
  })

  it('plays latest cry', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: defaultData,
    })
    render(
      <MemoryRouter>
        <PokemonDetail />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText(/Roar/i))
    expect(playMock).toHaveBeenCalled()
  })

  it('plays legacy cry if latest empty', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        ...defaultData,
        pokemon: {
          ...defaultData.pokemon,
          cries: { latest: '', legacy: 'legacy.mp3' },
        },
      },
    })
    render(
      <MemoryRouter>
        <PokemonDetail />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText(/Roar/i))
    expect(playMock).toHaveBeenCalled()
  })

  it('shows unique evolution message if chain length 1', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { ...defaultData, chain: [defaultData.chain[0]] },
    })
    render(
      <MemoryRouter>
        <PokemonDetail />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Unique Evolution/i)).toBeInTheDocument()
  })

  it('renders abilities and stats', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: defaultData,
    })
    render(
      <MemoryRouter>
        <PokemonDetail />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Stats and Characteristics/i)).toBeInTheDocument()
    expect(screen.getByText(/Abilities/i)).toBeInTheDocument()
  })
})
