import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const response = await axios.get("https://restcountries.com/v3.1/all")
    .then((res) => res.data.map((c, idx) => ({
      label: c.name.common,
      flag: c.flag,
      id: idx
    })))
  return response;
})

export function sortAlphabetically (a, b) {
  return a.label < b.label ? -1 : 1;
}

const countriesAdapter = createEntityAdapter({
  sortComparer: sortAlphabetically
})

export const {
  selectAll: selectAllCountries,
} = countriesAdapter.getSelectors((state) => state.countries)

const countriesSlice = createSlice({
  name: 'countries',
  initialState: countriesAdapter.getInitialState({
    status: 'idle',
    error: null
  }),
  reducers: {},
  extraReducers: {
    [fetchCountries.pending]: (state, action) => {
      state.status = 'loading'
      state.error = null
    },
    [fetchCountries.fulfilled]: (state, action) => {
      if (state.status === 'loading') {
        countriesAdapter.upsertMany(state, action)
        state.status = 'succeeded'
      }
    },
    [fetchCountries.rejected]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed'
        state.error = action.payload
      }
    }
  }
})

export const {countriesLoaded} = countriesSlice.actions

export default countriesSlice.reducer
