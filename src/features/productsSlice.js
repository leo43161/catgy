// src/features/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    items: []
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.value.items = action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
