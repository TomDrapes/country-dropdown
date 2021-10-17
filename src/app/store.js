import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from '../features/countrySlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
  },
});
