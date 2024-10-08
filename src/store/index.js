// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { shopApi } from '@/services/shopApi';
import productsReducer from '@/features/user/productsSlice';  // Asegúrate de que el path sea correcto
import categoriesReducer from '@/features/user/categoriesSlice';  // Asegúrate de que el path sea correcto

const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    products: productsReducer,    // Agregamos el reducer de productos
    categories: categoriesReducer, // Agregamos el reducer de categorías
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware),
});

export default store;