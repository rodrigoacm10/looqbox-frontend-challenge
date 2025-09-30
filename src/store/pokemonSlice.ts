import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PokemonState {
  currentPage: number
  itemsPerPage: number
}

const initialState: PokemonState = {
  currentPage: 1,
  itemsPerPage: 20,
}

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
      state.currentPage = 1
    },
  },
})

export const { setCurrentPage, setItemsPerPage } = pokemonSlice.actions
export default pokemonSlice.reducer
