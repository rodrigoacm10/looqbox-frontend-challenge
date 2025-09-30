import { useAppDispatch, useAppSelector } from './hooks/redux'
import { setCurrentPage } from './store/pokemonSlice'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPokemon, type PokemonResponse } from './api/pokemon'
import { Pagination } from './component/Pagination'

function App() {
  const dispatch = useAppDispatch()
  const { currentPage, itemsPerPage } = useAppSelector((state) => state.pokemon)

  const { data, isLoading, error } = useQuery<PokemonResponse, Error>({
    queryKey: ['pokemons', currentPage, itemsPerPage],
    queryFn: () => getPokemon((currentPage - 1) * itemsPerPage, itemsPerPage),
    placeholderData: keepPreviousData,
  })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  if (isLoading)
    return <p className="text-white text-center mt-8">Carregando...</p>
  if (error)
    return (
      <p className="text-red-500 text-center mt-8">Erro ao carregar pokémons</p>
    )

  return (
    <div className="bg-black min-h-screen min-w-screen text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-6 text-center">Pokédex</h1>

        <div className="mb-4 text-center text-gray-400">
          Mostrando {data?.pokemons.length ?? 0} de {data?.totalCount ?? 0}{' '}
          pokémons (Página {currentPage} de{' '}
          {Math.ceil((data?.totalCount ?? 1) / itemsPerPage)})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {data?.pokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {pokemon.name}
                </h3>
                <p className="text-gray-400">
                  #{pokemon.id.toString().padStart(3, '0')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((data?.totalCount ?? 1) / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default App
