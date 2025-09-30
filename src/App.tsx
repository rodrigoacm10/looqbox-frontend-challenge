import { useAppDispatch, useAppSelector } from './hooks/redux'
import { setCurrentPage, setItemsPerPage } from './store/pokemonSlice'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPokemonPagination, type PokemonResponse } from './api/pokemon'
import { Input, Layout, Pagination } from 'antd'
import { PokemonGrid } from './component/PokemonGrid'
import { useState } from 'react'
import { LoadingIcon } from './component/icons/LoadingIcon'

const { Header, Content, Footer } = Layout

function App() {
  const dispatch = useAppDispatch()
  const { currentPage, itemsPerPage } = useAppSelector((state) => state.pokemon)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, error } = useQuery<PokemonResponse, Error>({
    queryKey: ['pokemons', currentPage, itemsPerPage, searchTerm],
    queryFn: () =>
      getPokemonPagination(
        (currentPage - 1) * itemsPerPage,
        itemsPerPage,
        searchTerm || undefined,
      ),
    placeholderData: keepPreviousData,
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value.trim())
    dispatch(setCurrentPage(1))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setItemsPerPage(size))
  }

  return (
    <>
      <Header>
        <div></div>
      </Header>
      <div className="min-w-screen !min-h-screen flex flex-col !bg-white">
        <Content className="px-10 py-6 flex flex-col max-w-[1144px] w-full mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            <span className="text-green-300">Looq</span>Dex
          </h1>

          <div className="w-full flex justify-center items-center my-6">
            <Input.Search
              placeholder="Buscar Pokémon..."
              onSearch={handleSearch}
              enterButton
              allowClear
              className="max-w-md"
            />
          </div>

          <HandleState loading={isLoading} data={data} error={error} />

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={data?.totalCount ?? 1}
              pageSize={itemsPerPage}
              showSizeChanger
              onChange={(page) => handlePageChange(page)}
              onShowSizeChange={(_, size) => handlePageSizeChange(size)}
            />
          </div>
        </Content>
      </div>
      <Footer></Footer>
    </>
  )
}

const HandleState = ({
  loading,
  data,
  error,
}: {
  loading: boolean
  data: PokemonResponse | undefined
  error: Error | null
}) => {
  if (data?.pokemons && !loading && !error) {
    return <PokemonGrid pokemons={data.pokemons} />
  } else if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingIcon />
      </div>
    )
  } else if (error) {
    return (
      <p className="text-red-500 text-center mt-8">Erro ao carregar pokémons</p>
    )
  }
}

export default App
