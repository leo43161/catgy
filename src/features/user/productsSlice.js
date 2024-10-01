// src/features/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    items: [] // Se usa "value" para anidar el estado de productos
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.value.items = action.payload; // Se accede correctamente a "items" dentro de "value"
    },
    addProduct(state, action) {
      state.value.items.push({
        id: Date.now().toString(), // Genera un ID único temporal
        name: action.payload.name,
        description: action.payload.description,
        price: action.payload.price,
        stock: action.payload.stock,
        image: action.payload.image, // Puede ser un enlace o archivo
        categories: action.payload.categories, // Un array con las categorías
      });
    },
    updateProduct(state, action) {
      const { id, name, description, price, stock, image, categories } = action.payload;
      const existingProduct = state.value.items.find(product => product.id === id);
      if (existingProduct) {
        existingProduct.name = name;
        existingProduct.description = description;
        existingProduct.price = price;
        existingProduct.stock = stock;
        existingProduct.image = image;
        existingProduct.categories = categories;
      }
    },
    deleteProduct(state, action) {
      const { id } = action.payload;
      state.value.items = state.value.items.filter(product => product.id !== id);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
