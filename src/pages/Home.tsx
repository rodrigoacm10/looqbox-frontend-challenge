import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Pagination } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { getPokemonPagination, type PokemonResponse } from '../api/pokemon'
import { setCurrentPage, setItemsPerPage } from '../store/pokemonSlice'
import { PokemonGrid } from '../components/PokemonGrid'
import { LoadingIcon } from '../components/icons/LoadingIcon'
import { PokemonSearch } from '../components/PokemonSearch'

function Home() {
  const dispatch = useAppDispatch()
  const { currentPage, itemsPerPage, searchTerm } = useAppSelector(
    (state) => state.pokemon,
  )

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

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setItemsPerPage(size))
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex justify-center items-center mt-4">
        <img src="../../public/logo-looqdex.png" className="max-h-24" />
      </div>

      <div className="w-full flex justify-center items-center my-6">
        <PokemonSearch redirectToHome={false} />
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
