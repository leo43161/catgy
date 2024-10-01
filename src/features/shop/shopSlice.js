/* import { createSlice } from "@reduxjs/toolkit";

export const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        value: {
            allProducts: [],
            categories: [],
            productSelected: {},
            categorySelected: "",
            productsSelected: []
        }
    },
    reducers: {
        setCategorySelected: (state, action) => {
            state.value.productsSelected = state.value.allProducts.filter(product => product.category === action.payload.name)
            state.value.categorySelected = action.payload
        },
        setProductSelected: (state, action) => {
            state.value.productSelected = action.payload
        }
    }
});

export const { setCategorySelected, setProductSelected } = shopSlice.actions;
export default shopSlice.reducer; */