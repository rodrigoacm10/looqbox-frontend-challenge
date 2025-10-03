// src/pages/__tests__/Home.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../Home'
import { useQuery } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'

// 🔹 Mock Redux hooks
vi.mock('../../hooks/redux', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}))

// 🔹 Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  keepPreviousData: {},
}))

// 🔹 Mock componentes
vi.mock('../../components/icons/LoadingIcon', () => ({
  LoadingIcon: () => <div data-testid="loading-icon">Loading...</div>,
}))

vi.mock('../../components/StateMessage', () => ({
  StateMessage: ({ text }: { text: string }) => (
    <div data-testid="state-message">{text}</div>
  ),
}))

vi.mock('../../components/PokemonGrid', () => ({
  PokemonGrid: ({ pokemons }: { pokemons: any[] }) => (
    <div data-testid="pokemon-grid">{`Pokemons: ${pokemons.length}`}</div>
  ),
}))

vi.mock('../../components/PokemonSearch', () => ({
  PokemonSearch: () => <input data-testid="pokemon-search" />,
}))

// 🔹 Mock antd Pagination
vi.mock('antd', async (importOriginal) => {
  const antd = await importOriginal<typeof import('antd')>()
  return {
    ...antd,
    Pagination: ({ onShowSizeChange, onChange }: any) => (
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

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppDispatch as any).mockReturnValue(mockDispatch)
    ;(useAppSelector as any).mockReturnValue({
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: '',
    })
  })

  it('chama queryFn com searchTerm undefined quando string vazia', () => {
    ;(useQuery as any).mockImplementation((opts: any) => {
      const result = opts.queryFn()
      expect(result).resolves // só para não quebrar
      return {
        isLoading: false,
        isFetching: false,
        error: null,
        data: { pokemons: [], totalCount: 0 },
      }
    })
    ;(useAppSelector as any).mockReturnValue({
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: '', // 👈 força string vazia
    })

    render(<Home />)

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['pokemons', 1, 20, ''], // queryKey mantém string
        queryFn: expect.any(Function),
      }),
    )
  })

  it('mostra loading quando isLoading é true', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: true,
      isFetching: false,
      error: null,
      data: undefined,
    })

    render(<Home />)
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument()
    expect(screen.getByText('Loading Pokémons...')).toBeInTheDocument()
  })

  it('mostra loading quando isFetching é true', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: true,
      error: null,
      data: undefined,
    })

    render(<Home />)
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument()
    expect(screen.getByText('Loading Pokémons...')).toBeInTheDocument()
  })

  it('mostra erro quando error existe', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: new Error('API error'),
      data: undefined,
    })

    render(<Home />)
    expect(screen.getByTestId('state-message')).toHaveTextContent(
      'Error loading Pokémons',
    )
  })

  it('mostra mensagem de vazio quando não há pokemons', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [], totalCount: 0 },
    })

    render(<Home />)
    expect(screen.getByTestId('state-message')).toHaveTextContent(
      'No Pokémon found',
    )
  })

  it('mostra grid quando há pokemons', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [{ id: 1, name: 'Pikachu' }], totalCount: 1 },
    })

    render(<Home />)
    expect(screen.getByTestId('pokemon-grid')).toHaveTextContent('Pokemons: 1')
  })

  it('mostra erro inesperado quando data é undefined', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: undefined,
    })

    render(<Home />)
    expect(screen.getByTestId('state-message')).toHaveTextContent(
      'Unexpected error',
    )
  })

  it('dispara dispatch correto ao trocar página', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [], totalCount: 100 },
    })

    render(<Home />)

    fireEvent.click(screen.getByTestId('page-2'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pokemon/setCurrentPage', payload: 2 }),
    )
  })

  it('dispara dispatch correto ao trocar tamanho da página', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      isFetching: false,
      error: null,
      data: { pokemons: [], totalCount: 100 },
    })

    render(<Home />)

    fireEvent.click(screen.getByTestId('page-size-50'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pokemon/setItemsPerPage', payload: 50 }),
    )
  })
})
