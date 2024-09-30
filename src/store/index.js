// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/productsSlice';
import categoriesReducer from '../features/categoriesSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
  },
});

export default store;