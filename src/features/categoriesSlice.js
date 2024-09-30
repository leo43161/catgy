// src/features/categoriesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        items: []
    },
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories(state, action) {
            state.value.items = action.payload;
        },
        addCategory(state, action) {
            state.value.items.push(action.payload);
        },
        updateCategory(state, action) {
            const { id, name } = action.payload;
            const existingCategory = state.value.items.find(category => category.id === id);
            if (existingCategory) {
                existingCategory.name = name;
            }
        },
        deleteCategory(state, action) {
            const { id } = action.payload;
            state.value.items = state.value.items.filter(category => category.id !== id);
        },
    },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
