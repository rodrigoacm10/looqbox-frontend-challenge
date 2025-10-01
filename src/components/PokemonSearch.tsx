import { Input } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux'
import { setSearchTerm } from '../store/pokemonSlice'

export const PokemonSearch = ({
  redirectToHome = false,
}: {
  redirectToHome?: boolean
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value.trim()))

    if (redirectToHome && location.pathname !== '/') {
      navigate('/')
    }
  }

  return (
    <Input.Search
      placeholder="Buscar Pokémon..."
      onSearch={handleSearch}
      enterButton
      allowClear
      className="max-w-md"
    />
  )
}
