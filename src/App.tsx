import { useAppDispatch, useAppSelector } from './hooks/redux'
import { setCurrentPage } from './store/pokemonSlice'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPokemonPagination, type PokemonResponse } from './api/pokemon'
import { Pagination } from './component/Pagination'
import { Input, Layout } from 'antd'
import { PokemonGrid } from './component/PokemonGrid'

const { Header, Content } = Layout

function App() {
  const dispatch = useAppDispatch()
  const { currentPage, itemsPerPage } = useAppSelector((state) => state.pokemon)

  const { data, isLoading, error } = useQuery<PokemonResponse, Error>({
    queryKey: ['pokemons', currentPage, itemsPerPage],
    queryFn: () =>
      getPokemonPagination((currentPage - 1) * itemsPerPage, itemsPerPage),
    placeholderData: keepPreviousData,
  })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  if (isLoading) return <p className="text-center mt-8">Carregando...</p>
  if (error)
    return (
      <p className="text-red-500 text-center mt-8">Erro ao carregar pokémons</p>
    )

  return (
    <div className="min-w-screen !min-h-screen flex flex-col">
      <Header className="bg-white shadow px-6 py-3 flex justify-center">
        <Input.Search
          placeholder="Buscar Pokémon..."
          onSearch={(value) => console.log('Pesquisar:', value)}
          enterButton
          className="max-w-md"
        />
      </Header>

      <Content className="px-10 py-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-green-300">Looq</span>Dex
        </h1>

        {data?.pokemons && <PokemonGrid pokemons={data.pokemons} />}

        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((data?.totalCount ?? 1) / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </Content>
    </div>
  )
}

export default App
