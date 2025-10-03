import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../Home'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import type { PokemonResponse } from '../../api/pokemon'

vi.mock('../../hooks/redux', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  keepPreviousData: {},
}))

vi.mock('../../components/icons/LoadingIcon', () => ({
  LoadingIcon: () => <div data-testid="loading-icon">Loading...</div>,
}))

vi.mock('../../components/StateMessage', () => ({
  StateMessage: ({ text }: { text: string }) => (
    <div data-testid="state-message">{text}</div>
  ),
}))

vi.mock('../../components/PokemonGrid', () => ({
  PokemonGrid: ({ pokemons }: { pokemons: { id: number; name: string }[] }) => (
    <div data-testid="pokemon-grid">{`Pokemons: ${pokemons.length}`}</div>
  ),
}))

vi.mock('../../components/PokemonSearch', () => ({
  PokemonSearch: () => <input data-testid="pokemon-search" />,
}))

vi.mock('antd', async (importOriginal) => {
  const antd = await importOriginal<typeof import('antd')>()
  return {
    ...antd,
    Pagination: ({
      onShowSizeChange,
      onChange,
    }: {
      onShowSizeChange: (current: number, size: number) => void
      onChange: (page: number) => void
    }) => (
      <div>
        <button data-testid="page-2" onClick={() => onChange(2)}>
          Página 2
        </button>
        <button
          data-testid="page-size-50"
          onClick={() => onShowSizeChange(1, 50)}
        >
          PageSize 50
        </button>
      </div>
    ),
  }
})

describe('Home Page', () => {
  const mockDispatch = vi.fn()
  const mockUseQuery = useQuery as Mock
  const mockUseAppDispatch = useAppDispatch as unknown as Mock
  const mockUseAppSelector = useAppSelector as unknown as Mock

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAppDispatch.mockReturnValue(mockDispatch)
    mockUseAppSelector.mockReturnValue({
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: '',
    })
  })

  it('chama queryFn com searchTerm undefined quando string vazia', () => {
    mockUseQuery.mockImplementation(
      (opts: {
        queryFn: () => Promise<PokemonResponse>
        queryKey: unknown[]
      }): Partial<UseQueryResult<PokemonResponse, Error>> => {
        void opts.queryFn()
        return {
          isLoading: false,
          isFetching: false,
          error: null,
          data: { pokemons: [], totalCount: 0 },
        }
      },
    )

    mockUseAppSelector.mockReturnValue({
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: '',
    })

    render(<Home />)

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['pokemons', 1, 20, ''],
        queryFn: expect.any(Function),
      }),
    )
  })

  it('mostra loading quando isLoading é true', () => {
    mockUseQuery.mockReturnValue({
      isLoading: true,
      isFetching: false,
      error: null,
      data: undefined,
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument()
    expect(screen.getByText('Loading Pokémons...')).toBeInTheDocument()
  })

  it('mostra loading quando isFetching é true', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: true,
      error: null,
      data: undefined,
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument()
    expect(screen.getByText('Loading Pokémons...')).toBeInTheDocument()
  })

  it('mostra erro quando error existe', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: new Error('API error'),
      data: undefined,
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)
    expect(screen.getByTestId('state-message')).toHaveTextContent(
      'Error loading Pokémons',
    )
  })

  it('mostra mensagem de vazio quando não há pokemons', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [], totalCount: 0 },
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)
    expect(screen.getByTestId('state-message')).toHaveTextContent(
      'No Pokémon found',
    )
  })

  it('mostra grid quando há pokemons', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [{ id: 1, name: 'Pikachu' }], totalCount: 1 },
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)
    expect(screen.getByTestId('pokemon-grid')).toHaveTextContent('Pokemons: 1')
  })

  it('mostra erro inesperado quando data é undefined', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: undefined,
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)
    expect(screen.getByTestId('state-message')).toHaveTextContent(
      'Unexpected error',
    )
  })

  it('dispara dispatch correto ao trocar página', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [], totalCount: 100 },
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)

    fireEvent.click(screen.getByTestId('page-2'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pokemon/setCurrentPage', payload: 2 }),
    )
  })

  it('dispara dispatch correto ao trocar tamanho da página', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [], totalCount: 100 },
    } as Partial<UseQueryResult<PokemonResponse, Error>>)

    render(<Home />)

    fireEvent.click(screen.getByTestId('page-size-50'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pokemon/setItemsPerPage', payload: 50 }),
    )
  })
})
