// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { shopApi } from '@/services/shopApi';
import { userApi } from '@/services/userApi';
import productsReducer from '@/features/user/productsSlice';  // Asegúrate de que el path sea correcto
import categoriesReducer from '@/features/user/categoriesSlice';  // Asegúrate de que el path sea correcto
import userReducer from '@/features/user/userSlice';  // Asegúrate de que el path sea correcto

const store = configureStore({
  reducer: {
    productsReducer,    // Agregamos el reducer de productos
    categoriesReducer, // Agregamos el reducer de categorías
    userReducer, // Agregamos el reducer de categorías
    [shopApi.reducerPath]: shopApi.reducer,
    [userApi.reducerPath]: userApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware, userApi.middleware),
});

export default store;