// src/services/shopApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ limit, offset }) => `categories?limit=${limit}&offset=${offset}`,
    }),
    getCategoriesAll: builder.query({
      query: () => 'categories?type=all',
    }),
    getProducts: builder.query({
      query: ({ limit, offset }) => `products?limit=${limit}&offset=${offset}`,
    }),
    // Endpoint para crear un nuevo producto
    createProduct: builder.mutation({
      query: (productData) => ({
        url: 'products',
        method: 'POST',
        body: productData,
      }),
    }),
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
  useGetCategoriesQuery,
  useGetCategoriesAllQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUploadImageMutation
} = shopApi;
