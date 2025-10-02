import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PokemonMoviments } from '../PokemonMoviments'

vi.mock('../PokemonMoveDetails', () => ({
  PokemonMoveDetails: ({ url }: any) => (
    <div data-testid="pokemon-move-details">MockedMoveDetails - {url}</div>
  ),
}))

describe('PokemonMoviments', () => {
  const mockMoves = [
    {
      move: { name: 'tackle', url: '/move/1' },
      version_group_details: [
        {
          level_learned_at: 1,
          move_learn_method: { name: 'level-up' },
          version_group: { name: 'red-blue' },
        },
      ],
    },
    {
      move: { name: 'vine-whip', url: '/move/2' },
      version_group_details: [
        {
          level_learned_at: 7,
          move_learn_method: { name: 'machine' },
          version_group: { name: 'yellow' },
        },
      ],
    },
  ]

  it('renderiza o título principal com a contagem', () => {
    render(<PokemonMoviments moves={mockMoves} />)
    expect(screen.getByText(/Moviments \(2\)/i)).toBeInTheDocument()
  })

  it('mostra os nomes dos moves após expandir o painel principal', () => {
    render(<PokemonMoviments moves={mockMoves} />)

    // expandir o painel principal primeiro
    fireEvent.click(screen.getByText(/Moviments \(2\)/i))

    expect(screen.getByText(/tackle/i)).toBeInTheDocument()
    expect(screen.getByText(/vine whip/i)).toBeInTheDocument()
  })

  it('expande um subpainel e mostra detalhes', () => {
    render(<PokemonMoviments moves={mockMoves} />)

    // abrir painel raiz
    fireEvent.click(screen.getByText(/Moviments \(2\)/i))

    // clicar no header do segundo move
    fireEvent.click(screen.getByText(/vine whip/i))

    expect(
      screen.getByText(/MockedMoveDetails - \/move\/2/i),
    ).toBeInTheDocument()
  })

  it('não quebra se moves estiver vazio', () => {
    render(<PokemonMoviments moves={[]} />)
    expect(screen.getByText(/Moviments \(0\)/i)).toBeInTheDocument()
  })
})
