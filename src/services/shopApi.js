// src/services/shopApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({

    getCategories: builder.query({
      query: () => 'categories.json',
    }),

    getProducts: builder.query({
      query: ({ limit, offset }) => `products?limit=${limit}&offset=${offset}`, // Agregamos limit y offset a la query string
    }),

    // Obtener productos por ID de categoría
    getProductsByCategory: builder.query({
      query: (categoryID) => `products.json?orderBy="categoryIDs"&equalTo="${categoryID}"`,
      transformResponse: (response) => {
        const productsTransformed = Object.values(response);
        return productsTransformed;
      },
    }),

    // Obtener producto por ID
    getProductById: builder.query({
      query: (productId) => `products.json?orderBy="productID"&equalTo="${productId}"`,
      transformResponse: (response) => {
        const productTransformed = Object.values(response).pop();
        return productTransformed;
      },
    }),

    // Obtener la configuración de vista según el userID
    getConfigView: builder.query({
      query: (userId) => `config_view.json?orderBy="idUser"&equalTo="${userId}"`,
      transformResponse: (response) => {
        const configTransformed = Object.values(response).pop();
        return configTransformed;
      },
    }),
  }),
});

// Exportar hooks para usar en los componentes
export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useGetConfigViewQuery,
  useGetProductsWithCategoriesQuery
} = shopApi;