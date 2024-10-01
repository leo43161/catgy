// src/features/categoriesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        items: [] // Se usa "value" para anidar el estado de categorías
    },
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories(state, action) {
            state.value.items = action.payload; // Se accede correctamente a "items" dentro de "value"
        },
        addCategory(state, action) {
            state.value.items.push(action.payload); // Añade la nueva categoría
        },
        updateCategory(state, action) {
            const { id, name } = action.payload;
            const existingCategory = state.value.items.find(category => category.id === id);
            if (existingCategory) {
                existingCategory.name = name; // Actualiza el nombre de la categoría si la encuentra
            }
        },
        deleteCategory(state, action) {
            const { id } = action.payload;
            state.value.items = state.value.items.filter(category => category.id !== id); // Elimina la categoría por ID
        },
    },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
