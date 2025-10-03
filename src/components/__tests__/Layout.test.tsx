import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../Layout'

vi.mock('../PokemonSearch', () => ({
  PokemonSearch: ({ redirectToHome }: { redirectToHome?: boolean }) => (
    <div data-testid="pokemon-search">
      PokemonSearch (redirect={String(redirectToHome)})
    </div>
  ),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet content</div>,
  }
})

describe('Layout', () => {
  it('renders logo with link to home', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )
    const logoLink = screen.getByRole('link', { name: '' })
    expect(logoLink).toHaveAttribute('href', '/')
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      '../../public/logo-looqdex.png',
    )
  })

  it('does not render PokemonSearch on home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )
    expect(screen.queryByTestId('pokemon-search')).not.toBeInTheDocument()
  })

  it('renders PokemonSearch when not on home route', () => {
    render(
      <MemoryRouter initialEntries={['/pokemon/25']}>
        <Layout />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('pokemon-search')).toBeInTheDocument()
    expect(screen.getByText(/redirect=true/)).toBeInTheDocument()
  })

  it('renders Outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('outlet')).toHaveTextContent('Outlet content')
  })

  it('renders footer with current year', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )
    const year = new Date().getFullYear().toString()
    expect(
      screen.getByText(`© ${year} - Meu Projeto Pokémon`),
    ).toBeInTheDocument()
  })
})
