// src/services/shopApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ limit, offset }) => ({
        url: `/categories`,
        params: { limit, offset },
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
    // Endpoint para crear un nuevo producto
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
  useUploadImageMutation,
  useUpdateProductMutation,
  useUpdateProductStateMutation
} = shopApi;
