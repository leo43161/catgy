// src/features/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: null,
};

const productsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.value.items = action.payload; // Se accede correctamente a "items" dentro de "value"
    },
    deleteProduct(state) {
      state.value.items = {
        user: "",
        email: "",
        phoneNumber: "",
      };
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
