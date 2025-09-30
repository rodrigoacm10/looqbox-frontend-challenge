import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Input, Pagination } from 'antd'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { getPokemonPagination, type PokemonResponse } from '../api/pokemon'
import { setCurrentPage, setItemsPerPage } from '../store/pokemonSlice'
import { PokemonGrid } from '../components/PokemonGrid'
import { LoadingIcon } from '../components/icons/LoadingIcon'

function Home() {
  const dispatch = useAppDispatch()
  const { currentPage, itemsPerPage } = useAppSelector((state) => state.pokemon)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isFetching, error } = useQuery<
    PokemonResponse,
    Error
  >({
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
    <div className="flex flex-col flex-1">
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

      <HandleState
        loading={isLoading}
        data={data}
        error={error}
        fetching={isFetching}
      />

      <div className="mt-8 flex justify-center">
        <Pagination
          responsive
          current={currentPage}
          total={data?.totalCount ?? 1}
          pageSize={itemsPerPage}
          showSizeChanger
          onChange={(page) => handlePageChange(page)}
          onShowSizeChange={(_, size) => handlePageSizeChange(size)}
        />
      </div>
    </div>
  )
}

const HandleState = ({
  loading,
  fetching,
  data,
  error,
}: {
  loading: boolean
  fetching: boolean
  data: PokemonResponse | undefined
  error: Error | null
}) => {
  if (data?.pokemons && !loading && !error && !fetching) {
    return <PokemonGrid pokemons={data.pokemons} />
  } else if (loading || fetching) {
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

export default Home
