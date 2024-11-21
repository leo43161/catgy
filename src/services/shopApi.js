// src/services/shopApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Aplica este encabezado por defecto si es necesario para todas las solicitudes
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ limit, offset, search }) => ({
        url: `/categories`,
        params: { limit, offset, search },
      }),
    }),
    getCategoriesAll: builder.query({
      query: () => 'categories?type=all',
    }),
    getProducts: builder.query({
      query: ({ limit, offset, search }) => ({
        url: `/products`,
        params: { limit, offset, search },
      }),
    }),
    // Endpoint para productos
    createProduct: builder.mutation({
      query: (productData) => ({
        url: 'products',
        method: 'POST',
        body: productData,
      }),
    }),
    updateProduct: builder.mutation({
      query: (productData) => ({
        url: 'products',
        method: 'PUT',
        body: productData,
      }),
    }),
    updateProductState: builder.mutation({
      query: (params) => ({
        url: 'products',
        method: 'PUT',
        params
      }),
    }),
    // Endpoint para categories
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: 'categories',
        method: 'POST',
        body: categoryData,
      }),
    }),
    updateCategory: builder.mutation({
      query: (categoryData) => ({
        url: 'categories',
        method: 'PUT',
        body: categoryData,
      }),
    }),
    updateCategoryState: builder.mutation({
      query: (params) => ({
        url: 'categories',
        method: 'PUT',
        params
      }),
    }),
    //Endpoint Upload
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  //PRODUCTS
  useGetProductsQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useUpdateProductStateMutation,
  //CATEGORIES
  useGetCategoriesQuery,
  useGetCategoriesAllQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStateMutation,
  //UPLOADS
  useUploadImageMutation,
} = shopApi;
